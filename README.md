Tạo nhánh mới tick/vn.tickid từ tick/tickid

Steps:
1. Tạo App và API Key: mydinhhubkey / 0406mydinhhubjfsdfd1414h52
2. Tạo App trên Appstore và Google Play
3. Tạo Onesignal: c437636c-1e52-489c-b3bd-e64616fe2735
4. Tạo Google Analytic: lấy key của tạo web
5. CodePush: Tạo Code Push và thay thế
6. FBAK: sử dụng tạm đang có của TickID. Sẽ thay thế bằng Firebase. 2175231729436595
7. Chuẩn bị Icon và Splash: Tạo icon.png 1024x1024 và splash.png 4096x4096
8. Build App iOS
9. 9.Build App Android

Chi tiết
1. Tạo App trong trang admin.tickid.vn, tạo API Key bằng tay trong DB
2. Vào Appstore và Google Play, khởi tạo ứng dụng. Tài khoản sẽ tùy theo từng dự án.
3. Tạo App trên Onesignal
	3.1. Firebase: Đăng ký Cloud Message cho Android
	3.2. Appstore Connect: Tạo Key theo hướng dẫn 
4. Tạo Google Analytic: Tạo GA cho web
5. Code Push: chạy các lệnh sau, thay thế bằng 
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

code-push release-react tick-foodhub-ios ios -d "Production" -m --description "Them Attr"
code-push release-react tick-foodhub-android android -d "Production" -m --description "Nang cap Chat va loading"

1. FBAK: sử dụng key FBAK đang có của TickID. Sẽ thay thế bằng Firebase. 

2. Chuẩn bị Icon và Splash: Tạo icon.png 1024x1024 và splash.png 4096x4096
Sử dụng các lệnh theo tài liệu: https://github.com/bamlab/generator-rn-toolbox/tree/master/generators/assets
yo rn-toolbox:assets --icon icon.png --splash splash.png --store
yo rn-toolbox:assets --icon icon-android.png --android
yo rn-toolbox:assets --android-notification-icon icon-android.png

8. Build App iOS
Chạy Xcode, sửa lại version và version code cho App và Onesignal
9.Build App Android
	- Chạy lệnh tạo keystore trong thư mục android/app:
	keytool -genkey -v -keystore vn.tickid.keystore -alias vn.tickid -keyalg RSA -keysize 2048 -validity 10000
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
	java -jar ../pepk.jar --keystore=android/app/vn.tickid.keystore --alias=vn.tickid --output=android/app/vn.tickid.pem --encryptionkey=xxx

	Build file apk from aab
	java -jar "/Users/thuclh/apps/bundletool-all-0.13.3.jar" build-apks --bundle="app/build/outputs/bundle/release/app.aab" --output="app/build/outputs/bundle/release/app01.apks" --ks="app/vn.foodhub.keystore" --ks-pass="pass:123456" --ks-key-alias="vn.foodhub" --key-pass="pass:123456"

	java -jar "/Users/thuclh/apps/bundletool-all-0.13.3.jar"  install-apks --apks=

	Sửa cấu hình:
	defaultConfig
        resConfigs "en", "vi"