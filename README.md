Tạo nhánh mới tick/asia.homeid từ tick/homeid

Steps:
1. Tạo App và API Key: tạo bằng cơm
2. Tạo App trên Appstore và Google Play
3. Tạo Onesignal
4. Tạo Google Analytic: lấy key của tạo web
5. CodePush: Tạo Code Push và thay thế
6. FBAK: sử dụng tạm đang có của homeid. Sẽ thay thế bằng Firebase. 
7. Chuẩn bị Icon và Splash: Tạo icon.png 1024x1024 và splash.png 4096x4096
8. Build App iOS
9. 9.Build App Android

Chi tiết
1. Tạo App trong trang admin.homeid.vn, tạo API Key bằng tay trong DB
2. Vào Appstore và Google Play, khởi tạo ứng dụng. Tài khoản sẽ tùy theo từng dự án.
3. Tạo App trên Onesignal
	3.1. Firebase: Đăng ký Cloud Message cho Android
	3.2. Appstore Connect: Tạo Key theo hướng dẫn 
4. Tạo Google Analytic: Tạo GA cho web
5. Code Push: chạy các lệnh sau, thay thế bằng 

code-push app add tick-homeid-ios ios react-native

appcenter apps create -d tick-homeid-ios -o iOS -p React-Native
appcenter codepush deployment add -a app.abaha.net-gmail.com/tick-homeid-ios Production
┌────────────┬──────────────────────────────────────────────────────────────────┐
│ Name       │ Deployment Key                                                   │
├────────────┼──────────────────────────────────────────────────────────────────┤
│ Production │  │axkVLCubH_6cgpM0cMeFemCdpc2ZQqIwwGGn9r
├────────────┼──────────────────────────────────────────────────────────────────┤
│ Staging    │  │zq6Mh-R9YitJ91X7QbfEzj1ZjMnyTi3wBBFCG
└────────────┴──────────────────────────────────────────────────────────────────┘

code-push app add tick-homeid-android android react-native

appcenter apps create -d tick-homeid-android -o Android -p React-Native
appcenter codepush deployment add -a app.abaha.net-gmail.com/tick-homeid-android Production
┌────────────┬──────────────────────────────────────────────────────────────────┐
│ Name       │ Deployment Key                                                   │
├────────────┼──────────────────────────────────────────────────────────────────┤
│ Production │  │Dw5jnQkhORiM9eSdO4loklLjSBayy8k3_CR12J
├────────────┼──────────────────────────────────────────────────────────────────┤
│ Staging    │  │aqlsT8KPGWOwEfreKXCL65hTd9KBLYPGxP_7f
└────────────┴──────────────────────────────────────────────────────────────────┘

code-push release-react tick-homeid-ios ios -d "Production" -m --description "upgrade tag b11.4.7"
code-push release-react tick-homeid-android android -d "Production" -m --description "upgrade tag b11.4.7"

appcenter codepush release-react -a app.abaha.net-gmail.com/tick-homeid-ios -d "Production" -m --description "upgrade tag b11.4.8"
appcenter codepush release-react -a app.abaha.net-gmail.com/tick-homeid-android -d "Production" -m --description "upgrade tag b11.4.8"

6. FBAK: sử dụng key FBAK đang có của TickID. Sẽ thay thế bằng Firebase. 

2. Chuẩn bị Icon và Splash: Tạo icon.png 1024x1024 và splash.png 4096x4096
Sử dụng các lệnh theo tài liệu: https://github.com/bamlab/generator-rn-toolbox/tree/master/generators/assets
yo rn-toolbox:assets --icon icon.png --splash splash.png --store
yo rn-toolbox:assets --icon icon-android.png --android
yo rn-toolbox:assets --android-notification-icon icon-android.png

8. Build App iOS
Chạy Xcode, sửa lại version và version code cho App và Onesignal
9.Build App Android
	- Chạy lệnh tạo keystore trong thư mục android/app:
	keytool -genkey -v -keystore asia.homeid.keystore -alias asia.homeid -keyalg RSA -keysize 2048 -validity 10000
	- Sửa lại compile version
	compileSdkVersion 28
    buildToolsVersion "28.0.3"
	- Lỗi AndroidX: Chạy lệnh: 
   	npx jetify 
   	- Sửa tên App
	- 
	- Các lệnh build trong Android
	./gradlew clean
	./gradlew assembleRelease	-> tạo ra file Apk
	./gradlew bundleRelease		-> tạo file aab, nên dùng
	- Đăng ký App Signing để tạo file aab
	Chạy lệnh tạo file pem
	java -jar ../pepk.jar --keystore=android/app/asia.homeid.keystore --alias=asia.homeid --output=android/app/asia.homeid.pem --encryptionkey=xxx

	Build file apk from aab
	java -jar "/Users/thuclh/apps/bundletool-all-0.13.3.jar" build-apks --bundle="app/build/outputs/bundle/release/app.aab" --output="app/build/outputs/bundle/release/app01.apks" --ks="app/vn.cocosoul.keystore" --ks-pass="pass:123456" --ks-key-alias="vn.cocosoul" --key-pass="pass:123456"

	java -jar "/Users/thuclh/apps/bundletool-all-0.13.3.jar"  install-apks --apks=

	Sửa cấu hình:
	defaultConfig
        resConfigs "en", "vi"
 
