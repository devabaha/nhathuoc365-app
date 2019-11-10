Build:
1. Onesignal: TickID e2e80243-08c0-405a-9a36-5d060ba0af12
2. GA
3. Firebase
4. CodePush
5. FBAK
6. API Key và tên
7. Chuẩn bị Logo
8. 
Build Release
https://facebook.github.io/react-native/docs/signed-apk-android.html
keytool -genkey -v -keystore id.tick.keystore -alias id.tick -keyalg RSA -keysize 2048 -validity 10000
Build: cần xóa trống trong thư mục app/build trước 
./gradlew clean
./gradlew assembleRelease
./gradlew bundleRelease

java -jar ../pepk.jar --keystore=android/app/id.tick.keystore --alias=id.tick --output=android/app/id.ti
ck.pem --encryptionkey=eb10fe8f7c7c9df715022017b00c6471f8ba8170b13049a11e6c09ffe3056a104a3bbe4ac5a955f4ba4fe93fc8cef27558a3eb9d2a529a209
2761fb833b656cd48b9de6a

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

5. Sinh anh splash va logo
https://github.com/bamlab/generator-rn-toolbox/tree/master/generators/assets
yo rn-toolbox:assets --icon icon.png --splash splash.png --store
yo rn-toolbox:assets --icon icon-android.png --android
yo rn-toolbox:assets --android-notification-icon icon-android.png


Code Push:
code-push app add tick-tickid-ios ios react-native
┌────────────┬──────────────────────────────────────────────────────────────────┐
│ Name       │ Deployment Key                                                   │
├────────────┼──────────────────────────────────────────────────────────────────┤
│ Production │ zNRC9fLTHDCBngHiUamHbfziyRM7f87a6e14-8df5-40b0-b8e4-7ff15b6db3a7 │
├────────────┼──────────────────────────────────────────────────────────────────┤
│ Staging    │ HBdrFNUZM3iGduYjVK_KfJMZu0Dof87a6e14-8df5-40b0-b8e4-7ff15b6db3a7 │
└────────────┴──────────────────────────────────────────────────────────────────┘

code-push app add tick-tickid-android android react-native
┌────────────┬──────────────────────────────────────────────────────────────────┐
│ Name       │ Deployment Key                                                   │
├────────────┼──────────────────────────────────────────────────────────────────┤
│ Production │ 64zepyz9oRV-xfXlJdrsyNKcRTJzf87a6e14-8df5-40b0-b8e4-7ff15b6db3a7 │
├────────────┼──────────────────────────────────────────────────────────────────┤
│ Staging    │ HzM0ZE3HI9MC09-70ljG7aUktD1zf87a6e14-8df5-40b0-b8e4-7ff15b6db3a7 │
└────────────┴──────────────────────────────────────────────────────────────────┘

code-push release-react tick-tickid-ios ios -d "Production" -m --description "Them dung ma voucher trong don hang"
code-push release-react tick-tickid-android android -d "Production" -m --description "Them dung ma voucher trong don hang"