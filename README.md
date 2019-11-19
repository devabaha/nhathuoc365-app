Steps:
1. Tạo App và API Key: tạo bằng cơm
2. Tạo App trên Appstore và Google Play
3. Tạo Onesignal
4. Tạo Google Analytic: lấy key của tạo web
5. CodePush: Tạo Code Push và thay thế
6. FBAK: sử dụng tạm đang có của TickID. Sẽ thay thế bằng Firebase. 
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
code-push app add tick-tickid-ios ios react-native
┌────────────┬──────────────────────────────────────────────────────────────────┐
│ Name       │ Deployment Key                                                   │
├────────────┼──────────────────────────────────────────────────────────────────┤
│ Production │  │
├────────────┼──────────────────────────────────────────────────────────────────┤
│ Staging    │  │
└────────────┴──────────────────────────────────────────────────────────────────┘

code-push app add tick-tickid-android android react-native
┌────────────┬──────────────────────────────────────────────────────────────────┐
│ Name       │ Deployment Key                                                   │
├────────────┼──────────────────────────────────────────────────────────────────┤
│ Production │  │
├────────────┼──────────────────────────────────────────────────────────────────┤
│ Staging    │  │
└────────────┴──────────────────────────────────────────────────────────────────┘

code-push release-react tick-foodhub-ios ios -d "Production" -m --description "Sua loi crash app khi login"
code-push release-react tick-foodhub-android android -d "Production" -m --description "Nang cap 08 11 2019"

6. FBAK: sử dụng key FBAK đang có của TickID. Sẽ thay thế bằng Firebase. 

7. Chuẩn bị Icon và Splash: Tạo icon.png 1024x1024 và splash.png 4096x4096
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
	Sửa cấu hình:
	defaultConfig
        resConfigs "en", "vi"
 
