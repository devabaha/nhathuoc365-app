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
keytool -genkey -v -keystore vn.foodhub.keystore -alias vn.foodhub -keyalg RSA -keysize 2048 -validity 10000
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
code-push app add tick-foodhub-ios ios react-native
┌────────────┬──────────────────────────────────────────────────────────────────┐
│ Name       │ Deployment Key                                                   │
├────────────┼──────────────────────────────────────────────────────────────────┤
│ Production │ IjE1p0Oymztmj5fKvyOQehDxxsHWf87a6e14-8df5-40b0-b8e4-7ff15b6db3a7 │
├────────────┼──────────────────────────────────────────────────────────────────┤
│ Staging    │ N6ay15IaH8N3CSZe-zzx6nUYMa1Yf87a6e14-8df5-40b0-b8e4-7ff15b6db3a7 │
└────────────┴──────────────────────────────────────────────────────────────────┘

code-push app add tick-foodhub-android android react-native

┌────────────┬──────────────────────────────────────────────────────────────────┐
│ Name       │ Deployment Key                                                   │
├────────────┼──────────────────────────────────────────────────────────────────┤
│ Production │ ovDsGSUDYu_nfXdgWYsw_oQnO79cf87a6e14-8df5-40b0-b8e4-7ff15b6db3a7 │
├────────────┼──────────────────────────────────────────────────────────────────┤
│ Staging    │ Ysxk9PCgfA9owCJfVg2m2AT4C4GDf87a6e14-8df5-40b0-b8e4-7ff15b6db3a7 │
└────────────┴──────────────────────────────────────────────────────────────────┘

code-push release-react tick-foodhub-ios ios -d "Production" -m --description "Nang cap 01 11 2019"
code-push release-react tick-foodhub-android android -d "Production" -m --description "Thu thay doi home"

appcenter codepush release-react -a thuc.lehuy-gmail.com/tick-foodhub-ios -d Production
