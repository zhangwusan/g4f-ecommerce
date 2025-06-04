export const ORDER_STATUS = {
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  DELIVERY: 'Delivered'
} as const;


export type OrderStatusType = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];

// const statusName: OrderStatusType = ORDER_STATUS.PENDING;