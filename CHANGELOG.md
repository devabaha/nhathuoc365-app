# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [r12.0.5] - 2021-07-13
### Added
- PersonalProfile and UserChat from skv.
### Changed
- Only use has_attr for checking product's attributes.
- Handle onclick of <a> tag and window.open event of react-native-auto-height-webview.
### Fixed
- Delay setState OrderCart data.

## [r12.0.4] - 2021-07-09
### Added
- Voucher number and barcode in MyVoucherDetail by [lamah.dev@gmail.com].
- Adding function pick up at the store by [lamah.dev@gmail.com] [nguyenanhtuan191298@gmail.com].
- StoreInfo section in Confirm.
- Cherry color to config by [nguyenanhtuan191298@gmail.com].
### Changed
- update openMap to take origin location to make direction.
### Fixed
- discount_percent in isDiscount of ItemAttribute screen is not convert to boolean.

## [r12.0.3] - 2021-07-06
### Added
- social_posts in Home.
- site_content_key in Account screen by [kienluu612@gmail.com].
- Add commission value for ProductItem and Item by [nguyenanhtuan191298@gmail.com].
### Changed
- Logic of dropShipPrice will be depended on fix_dropship_price_key.
### Fixed
- Fix UX for ProductItem: prevent multiple taps at a product by [kienluu612@gmail.com].
- Clip NotiBadge in ListService.
- Like icon is the same even status changed.

## [r12.0.2] - 2021-06-30
### Added
- Adding delivery code in order detail by [kienluu612@gmail.com].
### Changed
- Rating default five stars by [nguyenanhtuan191298@gmail.com].
- Change function open map to common function by [kienluu612@gmail.com].
- Update isWalletAddress regex.
### Fixed
- Fix phone card in android by [lamah.dev@gmail.com].
- PrimaryActions duplicate key.
- Invalid vouchers not reload data.

## [r12.0.1] - 2021-06-21
### Added
- Adding download image function by [kienluu612@gmail.com].
- @bam.tech/React-native-make for export Android icon API>=26.
- ProgressTracking list and detail.
### Fixed
- Themes, others UI bugs.
- Lost data of current cart after deleting address in Confirm.
- StatusBar after back from Item screen.

## [r11.6.6] - 2021-06-11
### Changed
- Publish FilterProduct.
- NewsCategory will be jumped in instead of being pushed in.
- GPSListStore will re-call api to update data by lat, lng.
### Fixed
- Fix UI, finish logic of FilterProduct.
- CartFooter is not avoid the bottom extra space.
- Share button social not include url.
- ListPrice of FilterProduct not scroll correctly to input when it's focused.

## [r11.6.5] - 2021-06-08
### Added
- Webview for servicesHandler.
- DISABLE_PACKAGE_OPTION_LOYALTY_BOX in package options by [lamah.dev@gmail.com].
### Changed
- Refactor Payment method in Confirm.
- Product has only 1 attr will be auto selected.
### Fixed
- Status bar light-content in Modal Comment being pushed from NotifyItem (temporary fixing, don't know the exactly cause).
- NotifyItem request wrong info when press total comments.

## [r11.6.4] - 2021-06-03
### Added
- Create Post, Group.
- qrBarCodeInputable in ProductStamps by [lamah.dev@gmail.com].
### Changed
- Update field get About us, Terms of use ID  by [kienluu612@gmail.com].
- Change default image of selected payment method in Confirm by [kienluu612@gmail.com].
### Fixed
- Wrong params for FilterProduct News-est and Best-selling mode.

## [r11.6.3] - 2021-05-24
### Added
- Update moment locale relative time when change language.
### Changed
- Unsubscribe all listener if unmounted in Account.
- Add site_id for change avatar api.
- Unpublished FilterProduct.
- Change 'About us' pressed from webview to Notify by [kienluu612@gmail.com].
### Fixed
- Not refresh comments when tap bolt.
- Not correct clip comment if too long in Android.
- Logic to clip comment if too long.
- Upload avatar.
- Disable zoom in webview (NotifyItem, Item) by [lamah.dev@gmail.com].

## [r11.6.2] - 2021-05-19
### Added
- Show month commission in Commission report by [duylinhdang1998@gmail.com].

## [r11.6.1] - 2021-05-18
### Added
- Image component with custom render if loading error.
- ScreenWrapper take sceneBackground as backgroundColor.
- Common component for social like Feeds, ActionBar.
- Like, comment, share for news.
### Changed
- Container can select reanimated or animated wrapper.
- UI/ UX, logic of News (Notify) screen.

## [r11.5.5] - 2021-05-08
### Fixed
- Fix resend otp calling.
- Fix crash app in wallet (WalletRow) by [lamah.dev@gmail.com].

## [r11.5.4] - 2021-04-27
### Added
- Enter voucher code in My Voucher screen.
### Changed
- News_categories instead of news (if available) in home.
- Width of bank account in PaymentMethodRow.
### Fixed
- Re-call api to check payment status when function unmounted in transaction.
- [Android] need WRITE_EXTERNAL_STORAGE permission to save QRPay image in transaction.

## [r11.5.3] - 2021-04-26
### Added
- QRPayFrame.
### Changed
- Only Mobile Banking payment method can open PaymentMethodDetailModal screen.
- Fix width of bank account in PaymentMethodRow.
### Fixed
- [Android] Crash while saving image (QRPay).

## [r11.5.2] - 2021-04-23
### Changed
- UI Confirm and OrderItemComponent (payment tag, button action).

## [r11.5.1] - 2021-04-22
### Added
- Select and show payment method detail in Payment Method and Confirm.
- Transaction for order with specific payment method.
- Disposer for noti auto update in RightButtonNavBar.
### Changed
- Revert function of pressing cart and next button (with status ordering) in Order.
### Fixed
- Cancel autorun when unmounted for RightButtonNavBar.
- Can't select payment method after ordering.
- [Android] Setup config for react-native-gesture-handler.

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

### Changed
- Open language selector by default.
### Fixed
- sendMessage while blurring in tickid-chat.
- UI navbar in ListChat, Search.
- Force close NetworkInfo when press OK.
- Crash app if paymentMethod all unchecked default_flag.
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
- [Android] Refresh control offset in Home.
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
- QRScan for package options key.
- SubActionButton for QRScan in primary actions.
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
- Fanpage option in section list in Account. (patch: 2020-01-22)

## [r11.2.1] - 2021-01-20
### Added
- GPS list store screen for chain stores.
- Commission report.
- Tsconfig.json to resolve alias path.
- YearMonthModal to pick year/month (on dev).
### Fixed
- Set default value for otherData.site from response of api user_login.
- UI LabelPrice paymentMethod.
- Payment method in cart will have priority by user selection (not by default_flag from server).

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