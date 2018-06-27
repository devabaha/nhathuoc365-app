# README #
App React Native

yarn install
rm ./node_modules/react-native/local-cli/core/__fixtures__/files/package.json

react-native run-ios


OneSignal ios : c437636c-1e52-489c-b3bd-e64616fe2735

Google Project Number: 1006062787830

Lỗi Could not find com.android.tools.lint:lint-gradle:26.1.1. -> sửa classpath 'com.android.tools.build:gradle:3.1.1' thành classpath 'com.android.tools.build:gradle:3.0.1'

Run
adb reverse tcp:8081 tcp:8081


Generate icon: https://makeappicon.com
Generate Splash Screen: https://apetools.webprofusion.com/app/#/tools/imagegorilla

Build Release
https://facebook.github.io/react-native/docs/signed-apk-android.html
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
