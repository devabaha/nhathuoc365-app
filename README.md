##### Tag Version

# r11.1.0

**r** presented for Retail app.

##### Tag Description

###### Old Features
- Firebase Analytics.
- Firebase Phone Authentication.
- Popup Homepage.
- Package Options.

###### New Features
- React native 0.63.4.
- Premium.
- New UI cart footer.
- Fix many bugs.
- Improve performance.

###### Patch
- Fix multi categories show 1 column on some android device.

---

Tạo nhánh mới tick/vn.tickid từ tick/tickid
Steps:

Tạo App và API Key: tạo bằng cơm
Tạo App trên Appstore và Google Play
Tạo Onesignal
Tạo Google Analytic: lấy key của tạo web
CodePush: Tạo Code Push và thay thế
FBAK: sử dụng tạm đang có của TickID. Sẽ thay thế bằng Firebase.
Chuẩn bị Icon và Splash: Tạo icon.png 1024x1024 và splash.png 4096x4096
Build App iOS
9.Build App Android

Chi tiết

Tạo App trong trang admin.tickid.vn, tạo API Key bằng tay trong DB
Vào Appstore và Google Play, khởi tạo ứng dụng. Tài khoản sẽ tùy theo từng dự án.
Tạo App trên Onesignal
3.1. Firebase: Đăng ký Cloud Message cho Android
3.2. Appstore Connect: Tạo Key theo hướng dẫn
Tạo Google Analytic: Tạo GA cho web
Code Push: chạy các lệnh sau, thay thế bằng
code-push app add tick-huongcang-ios ios react-native
┌────────────┬──────────────────────────────────────────────────────────────────┐
│ Name │ Deployment Key │
├────────────┼──────────────────────────────────────────────────────────────────┤
│ Production │ │U8m8H8iVkv6UUVelkFrUgIQxhApLREmpZEr9DY
├────────────┼──────────────────────────────────────────────────────────────────┤
│ Staging │ │TmwoHNrS7cd8FiguTU7fL6MmPR-U85Lf8keAJ
└────────────┴──────────────────────────────────────────────────────────────────┘

code-push app add tick-huongcang-android android react-native
┌────────────┬──────────────────────────────────────────────────────────────────┐
│ Name │ Deployment Key │
├────────────┼──────────────────────────────────────────────────────────────────┤
│ Production │ │5HFSX4XXEgoAgHaA6kHqntGoQz43C2FgCZR1Lr
├────────────┼──────────────────────────────────────────────────────────────────┤
│ Staging │ │Ekl91GWSUVXNB4brJzJxUNWNy7ZBnTrFIsQCn
└────────────┴──────────────────────────────────────────────────────────────────┘
code-push release-react tick-huongcang-ios ios -d "Production" -m --description "new app"
code-push release-react tick-huongcang-android android -d "Production" -m --description "new app"

FBAK: sử dụng key FBAK đang có của TickID. Sẽ thay thế bằng Firebase.

Chuẩn bị Icon và Splash: Tạo icon.png 1024x1024 và splash.png 4096x4096
Sử dụng các lệnh theo tài liệu: https://github.com/bamlab/generator-rn-toolbox/tree/master/generators/assets
yo rn-toolbox:assets --icon icon.png --splash splash.png --store
yo rn-toolbox:assets --icon icon-android.png --android
yo rn-toolbox:assets --android-notification-icon icon-android.png

Build App iOS
Chạy Xcode, sửa lại version và version code cho App và Onesignal
9.Build App Android

Chạy lệnh tạo keystore trong thư mục android/app:
keytool -genkey -v -keystore vn.tickid.keystore -alias vn.tickid -keyalg RSA -keysize 2048 -validity 10000
Sửa lại compile version
compileSdkVersion 28
buildToolsVersion "28.0.3"
Lỗi AndroidX: Chạy lệnh:
npx jetify
Sửa tên App

Các lệnh build trong Android
./gradlew clean
./gradlew assembleRelease -> tạo ra file Apk
./gradlew bundleRelease -> tạo file aab, nên dùng
Đăng ký App Signing để tạo file aab
Chạy lệnh tạo file pem
java -jar ../pepk.jar --keystore=android/app/vn.tickid.keystore --alias=vn.tickid --output=android/app/vn.tickid.pem --encryptionkey=xxx

Build file apk from aab
java -jar "/Users/thuclh/apps/bundletool-all-0.13.3.jar" build-apks --bundle="app/build/outputs/bundle/release/app.aab" --output="app/build/outputs/bundle/release/app01.apks" --ks="app/vn.cocosoul.keystore" --ks-pass="pass:123456" --ks-key-alias="vn.cocosoul" --key-pass="pass:123456"
java -jar "/Users/thuclh/apps/bundletool-all-0.13.3.jar" install-apks --apks=
Sửa cấu hình:
defaultConfig
resConfigs "en", "vi"
