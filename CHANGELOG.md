# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- Select and show payment method detail in Payment Method and Confirm.
- Transaction for order with specific payment method.
- Disposer for noti auto update in RightButtonNavBar.
### Fixed
- Cancel autorun when unmounted for RightButtonNavBar.
- Can't select payment method after ordering.

## [r11.4.7] - 2021-04-07
### Added
- base structure for themes (in-progress).
- Ask permission for modalGalleryOptionAndroid.
### Changed
- Use autorun to update noti in RightButtonNavBar instead of checking inside render function.
### Fixed
- Crashing when scan QRBarcode.
- PayAccount cant back.
- Not update data from server in Confirm (now it will get data from server if is_payment-ing).

## [r11.4.6] - 2021-03-30
### Added
- QRScanner.
### Fixed
- NetworkInfo error because SafeAreaView can't translate out of viewable screen.
- Remove setting store_id in NotifyItem.
- SelectProvince for non-dataKey data.

## [r11.4.5] - 2021-03-26
### Fixed
- sendMessage while blurring in tickid-chat.
- UI navbar in ListChat, Search.
- Force close NetworkInfo when press OK.
- [Android] Unselected default text color in ModalPicker.

## [r11.4.4] - 2021-03-24
### Added
- orderStatus color.
### Changed
- site_use_ship valid checking.
- hitSlop cartItem btn.
- ModalInput, ModalList, ModalPicker UI, logic.
- ON DEV SERVER checking, show domain name instead of an abstraction name.
- Must select at least 1 product to confirm delivery order.
- Hide unselected products in confirm delivery order.
- UI for swiper in detail product.
- Hide site in detail Voucher.
- Payment method selector position and visible logic.
### Fixed
- Dropship  checking.
- phoneNumber includes countryCode checking.
- Cart footer quick btn pressing UI.

## [r11.4.3] - 2021-03-13
### Added
- One more step for shipping fee calculating for delivery mode (config site_use_ship) in Confirm.
### Fixed
- TickidChat now use react-native-image-crop-picker instead of @react-native-community/cameraroll to get images because of crashing while getting photos from Shared Album on ios.
- Swiper error changing index in detail product.

## [r11.4.2] - 2021-03-12
### Added
- Refreshing in Address.
- Right button nav bar in Address for going to Create Address.
### Changed
- Disable cache product function.
- Enable and change a bit cache categories function.
- Hiding animation for ListStoreProductSkeleton.
- Cart with status is_paymenting will get latest data after mounted.
### Fixed
- Replace cart_data when access Confirm through Orders.

## [r11.4.1] - 2021-03-10
### Added
- Scanner animation for QRFrame in QRBarCode.
- INPUT_ADDRESS_CONFIG_KEY for addressing.
- ComboLocation module.
- ComboLocation view in Address, Confirm.
- Gamification type.
- API user_device to upload app versions info.
### Changed
- Banner image ratio in NotifyItem.
- Add game id for accessing gamification.
- UI Gameification changes by id.
### Fixed
- Scan area for QRFrame in QRBarCode doesn't correct dimension.
- Transparent default indicator loading IOS color on some ios version.
- Crashing when pressing like btn in detail product.
- Nothing showup when go to Confirm from Orders with a non-addressed cart order.
- Not synchronize cart noti for SHOPPING_CART type in RightButtonNavBar.
- Not autoFocus in PlaceAutoComplete.

## [r11.3.12] - 2021-03-04
### Added
- QRFrame for QRBarCode (not correctly, just for making color, because of rectOfInteract).
- Btn to go to Product Stamps if product scanned.
### Fixed
- Input props auto focus not work in modal input.
- Regex to validate link, cart code, account code, wallet address.

## [r11.3.11] - 2021-03-03
### Changed
- CartItem also using text input to enter quantity.
### Fixed
- UI QuickOpenBtnCart.

## [r11.3.10] - 2021-03-02
### Added
- Logic for config key allow site sale out inventory.
- List scanned product.
- Check product code by qrcode.
### Fixed
- Cart footer UI quantity.

## [r11.3.9] - 2021-02-23
### Add
- Warehouse btn in detail product.
### Changed
- Only update notify and user_info if changed in store mobx.

## [r11.3.8] - 2021-02-22
### Changed
- Disabled style in drop ship.
### Fixed
- Price for drop ship in item attributes.

## [r11.3.7] - 2021-02-19
### Changed
- Flow of checking cart type between normal, dropship and service product.
### Fixed
- Phone number including country code in log in screen.
- Allow submit `0` in lottery game.

## [r11.3.6] - 2021-02-17
### Added
- Cart type tag in order.
### Fixed
- Calculating total profit in drop ship mode.
- Color of drop ship btn.

## [r11.3.5] - 2021-02-05
### Added
- Call-to-action model for product.
- Prevent adding different item type to cart.
- Logout and refresh app flow if response status of api notify is 405.

## [r11.3.4] - 2021-02-02
### Changed
- Disable refer input in Op_Register if invite_user_id in user_info existed.
- Loading all screen while waiting register in Op_register.
### Fixed
- [ONLY] Product has 1 attribute group will auto detect remaining inventory (re-fix).

## [r11.3.3] - 2021-01-30
### Fixed
- Product has 1 attribute group will auto detect remaining inventory (re-fix).

## [r11.3.2] - 2021-01-29
### Added
- Show commissions in cart.
### Changed
- Press order item in order screen will replace store_data, cart_data of it's self.
- Color of addMoreItems in Confirm screen to marigold.

## [r11.3.1] - 2021-01-27
### Added
- Lottery game.
### Fixed
- Query list warehouse only if config activated.
- Only 1 time query in empty store.
- Self request in only type OPEN_SHOP.
- Only get warehouse if config activated.

## [r11.2.5] - 2021-01-27
### Fixed
- ModernList will not use VirtualizedList as renderer when `scrollEnabled` is false.
- Logic to generate name of `cart` event of EventTracker.

## [r11.2.4] - 2021-01-27
### Added
- DropShip in product detail.
### Fixed
- Get dimensions of categories nav bar in Store screen.

## [r11.2.3] - 2021-01-23
### Fixed
- Add key for item in section fake list.
- Fix key props for MyInputTouchable in AgencyInformationRegister.
- Fix .gitignore to commit *.keystore.

## [r11.2.2] - 2021-01-21
### Add
- Background color for empty image in GPS List Store.
### Fixed
- Product has 1 attribute group will auto detect remaining inventory.

## [r11.2.1] - 2021-01-20
### Added
- GPS list store screen for chain stores.
- Commission report.
- Tsconfig.json to resolve alias path.
- YearMonthModal to pick year/month (on dev).
### Fixed
- Set default value for otherData.site from response of api user_login.
- UI LabelPrice paymentMethod

## [r11.1.3] - 2021-01-15
### Added
- Specific key to hide premium.
- Inventory in product detail.
- Discount for product in cart footer.
- Select warehouse/ store for chain stores in .
### Changed
- Layout of product detail, list product in home.
### Fixed
- Increase hit slop of action button in CartFooter, Confirm.
- Layout of promotion in confirm order.

## [r11.1.2] - 2021-01-13
### Changed
- Default background for no images in product detail.
### Fixed
- Call to action button of product.
- Orders flow.
- `Gotostore` button in product detail now pressable.

## [r11.1.1] - 2021-01-12
### Added
- Group product.
- Skeleton loading for store screen.
- Remove cart item in cart.
### Changed
- UI cart footer.
- UI confirm screen.
- Correct logic updating status bar .

## [r11.1.0] - 2021-01-08
### Added
- Premium.
- Select city for B2B customer.
### Changed
- Upgrade React native to v0.63.4 by [@minhnguyenit14](https://github.com/minhnguyenit14).
- New UI cart footer.
- Improve performance.
- Fix many bugs.

## [r10.0.0] - 2020-11-27
### Added
- Firebase Analytics.
- Firebase Phone Authentication.
- Popup Homepage.
- Package Options.