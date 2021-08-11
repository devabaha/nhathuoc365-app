export const CART_TYPES = {
  NORMAL: 'cart',
  DROP_SHIP: 'dropship',
  BOOKING: 'appointment',
};

export const CART_PAYMENT_TYPES = {
  // Mua ngay
  BUY: 0,
  // Thanh toán
  PAY: 1,
};

export const CART_PAYMENT_STATUS = {
  // Đã huỷ
  CANCEL: -1,
  // Chưa thanh toán
  UNPAID: 0,
  // Đã thanh toán
  PAID: 5,
};

export const DELIVERY_STATUS_CODE = {
  // Đơn đã bị huỷ
  CANCEL: 0,
  // Đơn hàng đã được tiếp nhận trên hệ thống
  SYSTEM_RECEIVED_ORDER: 5,
  // Đơn hàng đã được tài xế tiếp nhận
  SHIPPER_RECEIVED_ORDER: 10,
  // Tài xế đang lấy hàng
  SHIPPER_GETTING_PACKAGES: 15,
  // Không lấy được hàng
  FAIL_TO_GETTING_PACKAGES: 20,
  // Đang giao hàng
  DELIVERING: 25,
  // Giao hàng thành công
  DELIVERY_SUCCESS: 30,
  // Giao hàng thất bại
  DELIVERY_FAIL: 35,
  // Đang hoàn hàng
  ORDER_RETURNING: 40,
  // Đã hoàn hàng
  ORDER_RETURNED: 45,
  // Đã đối soát
  FOR_CONTROL: 50,
};

