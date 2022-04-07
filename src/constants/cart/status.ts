export enum CartStatus {
  ORDERING = 1,
  READY = 5,
  ACCEPTED = 10,
  PROCESSING = 15,
  DELIVERY = 20,
  COMPLETED = 25,
  CANCEL = 0,
  CLOSED = 30,
  CANCEL_1 = -1,
}

export const CART_STATUS = {
  ORDERING: CartStatus.ORDERING,
  READY: CartStatus.READY,
  ACCEPTED: CartStatus.ACCEPTED,
  PROCESSING: CartStatus.PROCESSING,
  DELIVERY: CartStatus.DELIVERY,
  COMPLETED: CartStatus.COMPLETED,
  CANCEL: CartStatus.CANCEL,
  CLOSED: CartStatus.CLOSED,
  CANCEL_1: CartStatus.CANCEL_1,
};
