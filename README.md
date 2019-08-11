# README #
TickID App: Ứng dụng CSKH và Tích điểm cho cửa hàng
yarn install
react-native run-ios

Run
adb reverse tcp:8081 tcp:8081



Android: 
Build Release
https://facebook.github.io/react-native/docs/signed-apk-android.html
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000

./gradlew clean
./gradlew assembleRelease

Build:
1. Onesignal
2. GA
3. Firebase

Các bước:
1. File local.properties: sdk.dir=/Users/thuclh/Library/Android/sdk
2. Vào sửa các file build.gradle trong các module: react-native-device-info, react-native-camera, react-native-image-picker
    compileSdkVersion 28
    buildToolsVersion "28.0.3"
3. Vào sửa các file build.gradle trong các module: react-native-device-info, react-native-camera, react-native-image-picker,
   Thay Configuration'compile' is obsolete and has been replaced with 'implementation' and 'api'.
và Configuration 'testCompile' is obsolete and has been replaced with 'testImplementation'.

4. Lỗi AndroidX: Chạy lệnh: npx jetify ở thư mục source
