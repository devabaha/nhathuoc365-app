Build:
1. Onesignal
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

code-push release-react tick-tickid-ios ios -d "Production" -m --description "Thu thay doi home"
code-push release-react tick-tickid-android android -d "Production" -m --description "Thu thay doi home"