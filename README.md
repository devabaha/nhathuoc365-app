Build:
1. Onesignal: c437636c-1e52-489c-b3bd-e64616fe2735
2. GA: UA-106153171-1
3. Firebase: 
4. CodePush: 
5. FBAK: 2175231729436595
6. API Key: mydinhhubkey / 0406mydinhhubjfsdfd1414h52
7. Chuẩn bị Logo
8. 
Build Release
https://facebook.github.io/react-native/docs/signed-apk-android.html
keytool -genkey -v -keystore vn.foodhub.keystore -alias vn.foodhub -keyalg RSA -keysize 2048 -validity 10000
Build: cần xóa trống trong thư mục app/build trước 
./gradlew clean
./gradlew assembleRelease
./gradlew bundleRelease


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

code-push release-react tick-foodhub-ios ios -d "Production" -m --description "Nang cap 08 11 2019"
code-push release-react tick-foodhub-android android -d "Production" -m --description "Nang cap 08 11 2019"

appcenter codepush release-react -a thuc.lehuy-gmail.com/tick-foodhub-ios -d Production


java -jar ../pepk.jar --keystore=android/app/vn.foodhub.keystore --alias=vn.foodhub --output=android/app/vn.foodhub.pem --encryptionkey=eb10fe8f7c7c9df715022017b00c6471f8ba8170b13049a11e6c09ffe3056a104a3bbe4ac5a955f4ba4fe93fc8cef27558a3eb9d2a529a2092761fb833b656cd48b9de6a