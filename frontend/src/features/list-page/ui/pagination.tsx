import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '@/shared/lib'

interface SimplePaginationProps {
  className?: string
  currentPage: number
  onPageChange: (page: number) => void
  totalPages: number
}

interface PageButtonProps {
  isActive?: boolean
  onClick: () => void
  page: number
}

interface EdgeButtonProps {
  children: ReactNode
  disabled: boolean
  onClick: () => void
}

const BUTTON_BASE_CLASS =
  'size-8 rounded-xl border border-light-gray bg-white px-3 text-sm transition-colors'

function PageButton({ isActive = false, onClick, page }: PageButtonProps) {
  return (
    <button
      type='button'
      className={cn(BUTTON_BASE_CLASS, isActive ? 'border-blue text-blue' : '')}
      onClick={onClick}
    >
      {page}
    </button>
  )
}

function EdgeButton({ children, disabled, onClick }: EdgeButtonProps) {
  return (
    <button
      type='button'
      className={cn(
        BUTTON_BASE_CLASS,
        'flex items-center justify-center px-2 disabled:opacity-50',
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export function SimplePagination({
  className,
  currentPage,
  onPageChange,
  totalPages,
}: SimplePaginationProps) {
  if (totalPages <= 1) {
    return null
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <nav className={className}>
      <div className='flex items-center gap-2'>
        <EdgeButton
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft className='size-5' />
        </EdgeButton>

        {pages.map((page) => (
          <PageButton
            key={page}
            isActive={page === currentPage}
            onClick={() => onPageChange(page)}
            page={page}
          />
        ))}

        <EdgeButton
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronRight className='size-5' />
        </EdgeButton>
      </div>
    </nav>
  )
}
