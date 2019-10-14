# README #
FoodHub App: Ứng dụng CSKH và Tích điểm cho cửa hàng
yarn install
react-native run-ios
Cau hinh FBSDK: Account Kit va Analytics
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
4. CodePush
5. FBAK
6. API Key và tên
# README # Vlink
1. Chuẩn bị Logo
2. 
Build Release
https://facebook.github.io/react-native/docs/signed-apk-android.html
keytool -genkey -v -keystore id.tick.keystore -alias id.tick -keyalg RSA -keysize 2048 -validity 10000

file gradle.properties
MYAPP_RELEASE_STORE_FILE=vlink.keystore
MYAPP_RELEASE_KEY_ALIAS=vn.vlink
MYAPP_RELEASE_STORE_PASSWORD=123456
MYAPP_RELEASE_KEY_PASSWORD=123456

app/build.gradle
				storeFile file(MYAPP_RELEASE_STORE_FILE)
                storePassword MYAPP_RELEASE_STORE_PASSWORD
                keyAlias MYAPP_RELEASE_KEY_ALIAS
                keyPassword MYAPP_RELEASE_KEY_PASSWORD

Build: cần xóa trống trong thư mục app/build trước 
./gradlew clean
./gradlew assembleRelease


# README #
yarn install
react-native run-ios
Run
adb reverse tcp:8081 tcp:8081



Android: 
Build Release
https://facebook.github.io/react-native/docs/signed-apk-android.html
keytool -genkey -v -keystore com.phongvenhanvan.keystore -alias com.phongvenhanvan -keyalg RSA -keysize 2048 -validity 10000




./gradlew clean
./gradlew assembleRelease

Build:
1. Onesignal
2. GA
3. Firebase

Các bước cho Android:
yarn install
react-native run-android
1. File local.properties: sdk.dir=/Users/thuclh/Library/Android/sdk
2. Vào sửa các file build.gradle trong các module: react-native-device-info, react-native-camera, react-native-image-picker
    compileSdkVersion 28
    buildToolsVersion "28.0.3"
3. Vào sửa các file build.gradle trong các module: react-native-device-info, react-native-camera, react-native-image-picker,
   Thay Configuration'compile' is obsolete and has been replaced with 'implementation' and 'api'.
và Configuration 'testCompile' is obsolete and has been replaced with 'testImplementation'.

4. Lỗi AndroidX: Chạy lệnh: 
   npx jetify 
5. ở thư mục source

Gen khóa phat hanh
keytool -exportcert -alias com.phongvenhanvan -keystore android/app/com.phongvenhanvan.keystore | openssl sha1 -binary | openssl base64

1. Sinh anh splash va logo
https://github.com/bamlab/generator-rn-toolbox/tree/master/generators/assets
yo rn-toolbox:assets --icon icon.jpg --splash splash.png --store
yo rn-toolbox:assets --icon icon.png --android
yo rn-toolbox:assets --android-notification-icon icon.png
1. Onesignal: thay onesignal id vao app.js
2. 