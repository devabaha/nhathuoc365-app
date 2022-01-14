Tạo nhánh mới tick/vn.tickid từ tick/tickid
Steps:

Tạo App và API Key: tạo bằng cơm
Tạo App trên Appstore và Google Play
Tạo Onesignal
Tạo Google Analytic: lấy key của tạo web
CodePush: Tạo Code Push và thay thế
FBAK: sử dụng tạm đang có của TickID. Sẽ thay thế bằng Firebase.
Chuẩn bị Icon và Splash: Tạo icon.png 1024x1024 và splash.png 4096x4096
Build App iOS
9.Build App Android

Chi tiết
1. Tạo App trong trang admin.tickid.vn, tạo API Key bằng tay trong DB
2. Vào Appstore và Google Play, khởi tạo ứng dụng. Tài khoản sẽ tùy theo từng dự án.
3. Tạo App trên Onesignal
	3.1. Firebase: Đăng ký Cloud Message cho Android
	3.2. Appstore Connect: Tạo Key theo hướng dẫn 
4. Tạo Google Analytic: Tạo GA cho web
5. Code Push: chạy các lệnh sau, thay thế bằng 

code-push app add tick-tickid-ios ios react-native

appcenter apps create -d tick-test-ios -o iOS -p React-Native
appcenter codepush deployment add -a app.abaha.net-gmail.com/tick-test-ios Production
┌────────────┬──────────────────────────────────────────────────────────────────┐
│ Name │ Deployment Key │
├────────────┼──────────────────────────────────────────────────────────────────┤
│ Production │ │dq825PqnCsKHfU-fNG1-kctcgVf_5qMrsdKJ5
├────────────┼──────────────────────────────────────────────────────────────────┤
│ Staging │ │TmwoHNrS7cd8FiguTU7fL6MmPR-U85Lf8keAJ
└────────────┴──────────────────────────────────────────────────────────────────┘

code-push app add tick-tickid-android android react-native

appcenter apps create -d tick-test-android -o Android -p React-Native
appcenter codepush deployment add -a app.abaha.net-gmail.com/tick-test-android Production
┌────────────┬──────────────────────────────────────────────────────────────────┐
│ Name │ Deployment Key │
├────────────┼──────────────────────────────────────────────────────────────────┤
│ Production │ │lvcmrPZq9JC1CYOD3J-CLuAk1kSkdXP-byppm
├────────────┼──────────────────────────────────────────────────────────────────┤
│ Staging │ │Ekl91GWSUVXNB4brJzJxUNWNy7ZBnTrFIsQCn
└────────────┴──────────────────────────────────────────────────────────────────┘
code-push release-react tick-nhathuoc365-ios ios -d "Production" -m --description "new app"
code-push release-react tick-nhathuoc365-android android -d "Production" -m --description "new app"

code-push release-react tick-nhathuoc365-ios ios -d "Production" -m --description "test codepush"
code-push release-react tick-nhathuoc365-android android -d "Production" -m --description "test codepush"

appcenter codepush release-react -a app.abaha.net-gmail.com/tick-nhathuoc365-ios -d "Production" -m --description "fix re-create request to check payment status in transaction"
appcenter codepush release-react -a app.abaha.net-gmail.com/tick-nhathuoc365-android -d "Production" -m --description "fix re-create request to check payment status in transaction"

6. FBAK: sử dụng key FBAK đang có của TickID. Sẽ thay thế bằng Firebase. 

Chuẩn bị Icon và Splash: Tạo icon.png 1024x1024 và splash.png 4096x4096
Sử dụng các lệnh theo tài liệu: https://github.com/bamlab/generator-rn-toolbox/tree/master/generators/assets
yo rn-toolbox:assets --icon icon.png --splash splash.png --store
yo rn-toolbox:assets --icon icon-android.png --android
yo rn-toolbox:assets --android-notification-icon icon-android.png

Build App iOS
Chạy Xcode, sửa lại version và version code cho App và Onesignal
9.Build App Android

Chạy lệnh tạo keystore trong thư mục android/app:
keytool -genkey -v -keystore vn.tickid.keystore -alias vn.tickid -keyalg RSA -keysize 2048 -validity 10000
Sửa lại compile version
compileSdkVersion 28
buildToolsVersion "28.0.3"
Lỗi AndroidX: Chạy lệnh:
npx jetify
Sửa tên App

Các lệnh build trong Android
./gradlew clean
./gradlew assembleRelease -> tạo ra file Apk
./gradlew bundleRelease -> tạo file aab, nên dùng
Đăng ký App Signing để tạo file aab
Chạy lệnh tạo file pem
java -jar ../pepk.jar --keystore=android/app/vn.tickid.keystore --alias=vn.tickid --output=android/app/vn.tickid.pem --encryptionkey=xxx

Build file apk from aab
java -jar "/Users/thuclh/apps/bundletool-all-0.13.3.jar" build-apks --bundle="app/build/outputs/bundle/release/app.aab" --output="app/build/outputs/bundle/release/app01.apks" --ks="app/vn.cocosoul.keystore" --ks-pass="pass:123456" --ks-key-alias="vn.cocosoul" --key-pass="pass:123456"
java -jar "/Users/thuclh/apps/bundletool-all-0.13.3.jar" install-apks --apks=
Sửa cấu hình:
defaultConfig
resConfigs "en", "vi"
