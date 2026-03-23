import type { Item, ItemSortColumn, SortDirection } from './types.ts';
import { doesItemNeedRevision } from './utils.ts';

type ItemsQuery = {
  q: string;
  limit?: number;
  skip?: number;
  categories?: Item['category'][];
  needsRevision?: boolean;
  sortColumn?: ItemSortColumn;
  sortDirection?: SortDirection;
};

type PublicItem = {
  id: Item['id'];
  category: Item['category'];
  title: string;
  price: Item['price'];
  needsRevision: boolean;
};

type ItemsResponse = {
  items: PublicItem[];
  total: number;
};

const DEFAULT_SORT: { column: ItemSortColumn; direction: SortDirection } = {
  column: 'createdAt',
  direction: 'desc',
};

const compareByColumn = (left: Item, right: Item, column: ItemSortColumn): number => {
  if (column === 'title') {
    return left.title.localeCompare(right.title);
  }

  if (column === 'price') {
    return (left.price ?? 0) - (right.price ?? 0);
  }

  return new Date(left.createdAt).valueOf() - new Date(right.createdAt).valueOf();
};

export const getItemsResponse = (items: Item[], query: ItemsQuery): ItemsResponse => {
  const {
    q,
    limit = 10,
    skip = 0,
    needsRevision = false,
    categories,
    sortColumn,
    sortDirection,
  } = query;

  const normalizedQuery = q.toLowerCase();

  const filteredItems = items.filter(item => {
    return (
      item.title.toLowerCase().includes(normalizedQuery) &&
      (!needsRevision || doesItemNeedRevision(item)) &&
      (!categories?.length || categories.some(category => item.category === category))
    );
  });

  const activeSortColumn = sortColumn ?? DEFAULT_SORT.column;
  const activeSortDirection = sortDirection ?? DEFAULT_SORT.direction;

  const sortedItems = filteredItems.toSorted((left, right) => {
    if (activeSortColumn === 'price') {
      const leftHasNoPrice = left.price === null;
      const rightHasNoPrice = right.price === null;

      if (leftHasNoPrice !== rightHasNoPrice) {
        return leftHasNoPrice ? 1 : -1;
      }
    }

    const primaryComparison = compareByColumn(left, right, activeSortColumn);
    const orderedPrimary =
      activeSortDirection === 'desc' ? -primaryComparison : primaryComparison;

    if (orderedPrimary !== 0) {
      return orderedPrimary;
    }

    // Deterministic tie-breaker across pages.
    return right.id - left.id;
  });

  const pagedItems = sortedItems.slice(skip, skip + limit);

  return {
    items: pagedItems.map(item => ({
      id: item.id,
      category: item.category,
      title: item.title,
      price: item.price,
      needsRevision: doesItemNeedRevision(item),
    })),
    total: filteredItems.length,
  };
};
