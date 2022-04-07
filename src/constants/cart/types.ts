export enum CartType {
  NORMAL = 'cart',
  DROP_SHIP = 'dropship',
  BOOKING = 'appointment',
}

export enum DeliveryStatusCode {
  // Đơn đã bị huỷ
  CANCEL = 0,
  // Đơn hàng đã được tiếp nhận trên hệ thống
  SYSTEM_RECEIVED_ORDER = 5,
  // Đơn hàng đã được tài xế tiếp nhận
  SHIPPER_RECEIVED_ORDER = 10,
  // Tài xế đang lấy hàng
  SHIPPER_GETTING_PACKAGES = 15,
  // Không lấy được hàng
  FAIL_TO_GETTING_PACKAGES = 20,
  // Đang giao hàng
  DELIVERING = 25,
  // Giao hàng thành công
  DELIVERY_SUCCESS = 30,
  // Giao hàng thất bại
  DELIVERY_FAIL = 35,
  // Đang hoàn hàng
  ORDER_RETURNING = 40,
  // Đã hoàn hàng
  ORDER_RETURNED = 45,
  // Đã đối soát
  FOR_CONTROL = 50,
}

export enum CartPaymentStatus {
  // Đã huỷ
  CANCEL = -1,
  // Chưa thanh toán
  UNPAID = 0,
  // Đã thanh toán
  PAID = 5,
}

export const CART_TYPES = {
  NORMAL: CartType.NORMAL,
  DROP_SHIP: CartType.DROP_SHIP,
  BOOKING: CartType.BOOKING,
};

export const CART_PAYMENT_TYPES = {
  // Mua ngay
  BUY: 0,
  // Thanh toán
  PAY: 1,
};

export const CART_PAYMENT_STATUS = {
  // Đã huỷ
  CANCEL: CartPaymentStatus.CANCEL,
  // Chưa thanh toán
  UNPAID: CartPaymentStatus.UNPAID,
  // Đã thanh toán
  PAID: CartPaymentStatus.PAID,
};

export const DELIVERY_STATUS_CODE = {
  // Đơn đã bị huỷ
  CANCEL: DeliveryStatusCode.CANCEL,
  // Đơn hàng đã được tiếp nhận trên hệ thống
  SYSTEM_RECEIVED_ORDER: DeliveryStatusCode.SYSTEM_RECEIVED_ORDER,
  // Đơn hàng đã được tài xế tiếp nhận
  SHIPPER_RECEIVED_ORDER: DeliveryStatusCode.SHIPPER_RECEIVED_ORDER,
  // Tài xế đang lấy hàng
  SHIPPER_GETTING_PACKAGES: DeliveryStatusCode.SHIPPER_GETTING_PACKAGES,
  // Không lấy được hàng
  FAIL_TO_GETTING_PACKAGES: DeliveryStatusCode.FAIL_TO_GETTING_PACKAGES,
  // Đang giao hàng
  DELIVERING: DeliveryStatusCode.DELIVERING,
  // Giao hàng thành công
  DELIVERY_SUCCESS: DeliveryStatusCode.DELIVERY_SUCCESS,
  // Giao hàng thất bại
  DELIVERY_FAIL: DeliveryStatusCode.DELIVERY_FAIL,
  // Đang hoàn hàng
  ORDER_RETURNING: DeliveryStatusCode.ORDER_RETURNING,
  // Đã hoàn hàng
  ORDER_RETURNED: DeliveryStatusCode.ORDER_RETURNED,
  // Đã đối soát
  FOR_CONTROL: DeliveryStatusCode.FOR_CONTROL,
};
