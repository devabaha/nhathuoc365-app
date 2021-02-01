import AddPaymentInfoModel from './AddPaymentInfoModel';
import AddToCartModel from './AddToCartModel';
import AddToWishListModel from './AddToWishListModel';
import PurchaseModel from './PurchaseModel';
import RemoveFromCartModel from './RemoveFromCartModel';
import SearchModel from './SearchModel';
import SelectItemModel from './SelectItemModel';
import SelectPromotionModel from './SelectPromotionModel';
import ShareModel from './ShareModel';
import SignUpModel from './SignUpModel';
import ViewCartModel from './ViewCartModel';
import ViewItemModel from './ViewItemModel';
import ViewPromotionModel from './ViewPromotionModel';
import ViewItemListModel from './ViewItemListModel';
import LoginModel from './LoginModel';

export {
  AddPaymentInfoModel,
  AddToCartModel,
  AddToWishListModel,
  PurchaseModel,
  RemoveFromCartModel,
  SearchModel,
  SelectItemModel,
  SelectPromotionModel,
  ShareModel,
  SignUpModel,
  ViewCartModel,
  ViewItemModel,
  ViewPromotionModel,
  ViewItemListModel,
  LoginModel
};

export type UndefinedOrString = undefined | string;
export type UndefinedOrNumber = undefined | number;

// Purchase currency in 3 letter ISO_4217 format. E.g. USD.
export type Currency = UndefinedOrNumber;

// YYYY-MM-DD
export type Date = UndefinedOrString;

export type Item = {
  item_brand?: UndefinedOrString;
  item_category?: UndefinedOrString;
  item_category2?: UndefinedOrString;
  item_category3?: UndefinedOrString;
  item_category4?: UndefinedOrString;
  item_category5?: UndefinedOrString;
  item_id?: UndefinedOrString;
  item_list_id?: UndefinedOrString;
  item_list_name?: UndefinedOrString;
  item_location_id?: UndefinedOrString;
  item_name?: UndefinedOrString;
  item_variant?: UndefinedOrString;
  quantity?: UndefinedOrNumber;
};

export type AddPaymentInfo = {
  coupon?: UndefinedOrString;
  currency?: UndefinedOrString;
  items: Item[];
  payment_type?: UndefinedOrNumber;
  value?: UndefinedOrString;
};

export type AddToCart = {
  currency?: Currency;
  items: Item[];
  value?: UndefinedOrNumber;
};

export type AddToWishList = {
  currency?: Currency;
  items: Item[];
  value?: UndefinedOrNumber;
};

export type Purchase = {
  affiliation?: UndefinedOrString;
  coupon?: UndefinedOrString;
  currency?: Currency;
  items: Item[];
  shipping?: UndefinedOrNumber;
  tax?: UndefinedOrNumber;
  transaction_id?: UndefinedOrString;
  value?: UndefinedOrNumber;
};

export type RemoveFromCart = {
  currency?: Currency;
  items: Item[];
  value?: UndefinedOrNumber;
};

export type Search = {
  destination?: UndefinedOrString;
  end_date?: Date;
  number_of_nights?: UndefinedOrNumber;
  number_of_passengers?: UndefinedOrNumber;
  number_of_rooms?: UndefinedOrNumber;
  origin?: UndefinedOrString;
  search_term: string;
  start_date?: Date;
  travel_class?: UndefinedOrString;
};

export type SelectItem = {
  content_type: string;
  item_list_id: string;
  item_list_name: string;
  items: Item[];
};

export type SelectPromotion = {
  creative_name: string;
  creative_slot: string;
  items: Item[];
  location_id: string;
  promotion_id: string;
  promotion_name: string;
};

export type Share = {
  content_type: string;
  item_id: string;
  method: string;
};

export type SignUp = {
  method: string;
};

export type ViewCart = {
  currency?: Currency;
  items: Item[];
  value?: UndefinedOrNumber;
};

export type ViewItem = {
  currency?: Currency;
  items: Item[];
  value?: UndefinedOrNumber;
};

export type ViewItemList = {
  item_list_id?: UndefinedOrString;
  item_list_name?: UndefinedOrString;
  items: Item[];
};

export type ViewPromotion = {
  creative_name?: UndefinedOrString;
  creative_slot?: UndefinedOrString;
  items: Item[];
  location_id?: UndefinedOrString;
  promotion_id?: UndefinedOrString;
  promotion_name?: UndefinedOrString;
};
