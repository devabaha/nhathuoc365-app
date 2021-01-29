# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [r11.3.2] - 2020-01-29
### Added
- Show commissions in cart.

### Changed
- Press order item in order screen will replace store_data, cart_data of it's self.
- Color of addMoreItems in Confirm screen to marigold.

## [r11.3.1] - 2020-01-27
### Added
- Lottery game.
### Fixed
- Query list warehouse only if config activated.
- Only 1 time query in empty store.
- Only get warehouse if config activated.

## [r11.2.5] - 2020-01-27
### Fixed
- ModernList will not use VirtualizedList as renderer when `scrollEnabled` is false.
- Logic to generate name of `cart` event of EventTracker.

## [r11.2.4] - 2020-01-27
### Added
- DropShip in product detail.
### Fixed
- Get dimensions of categories nav bar in Store screen.

## [r11.2.3] - 2020-01-23
### Fixed
- Add key for item in section fake list.
- Fix key props for MyInputTouchable in AgencyInformationRegister.
<<<<<<< HEAD
- Fix .gitignore to commit *.keystore
=======
- Fix .gitignore to commit *.keystore.

>>>>>>> abaha/core
## [r11.2.2] - 2020-01-21
### Add
- Background color for empty image in GPS List Store.
### Fixed
- Product has 1 attribute group will auto detect remaining inventory.
- Fanpage option in section list in Account. (patch: 2020-01-22)

## [r11.2.1] - 2020-01-20
### Added
- GPS list store screen for chain stores.
- Commission report.
- Tsconfig.json to resolve alias path.
- YearMonthModal to pick year/month (on dev).
### Fixed
- Set default value for otherData.site from response of api user_login.
- UI LabelPrice paymentMethod.
- Payment method in cart will have priority by user selection (not by default_flag from server).

## [r11.1.3] - 2020-01-15
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

## [r11.1.2] - 2020-01-13
### Changed
- Default background for no images in product detail.
### Fixed
- Call to action button of product.
- Orders flow.
- `Gotostore` button in product detail now pressable.

## [r11.1.1] - 2020-01-12
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