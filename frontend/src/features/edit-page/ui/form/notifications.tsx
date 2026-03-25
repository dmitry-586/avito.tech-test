import { notifications } from '@mantine/notifications'
import { Check, CircleX } from 'lucide-react'

export function showEditSuccessNotification() {
  notifications.show({
    color: 'green',
    message: 'Изменения сохранены',
    icon: <Check className='size-3 text-white' />,
    classNames: {
      icon: 'size-4',
      root: 'border-green bg-light-green',
    },
    withCloseButton: false,
  })
}

export function showEditErrorNotification() {
  notifications.show({
    color: 'red',
    title: 'Ошибка сохранения',
    message:
      'При попытке сохранить изменения произошла ошибка. Попробуйте ещё раз или зайдите позже.',
    icon: <CircleX className='text-red size-5' />,
    classNames: {
      icon: 'size-5 bg-transparent',
      root: 'border-pink bg-light-red items-start',
    },
    withCloseButton: false,
  })
}
