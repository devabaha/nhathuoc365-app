package asia.homeid;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.reactcommunity.rnlocalize.RNLocalizePackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.BV.LinearGradient.LinearGradientPackage;
import com.mkuczera.RNReactNativeHapticFeedbackPackage;
import com.masteratul.exceptionhandler.ReactNativeExceptionHandlerPackage;

// import Branch and RNBranch
import io.branch.referral.Branch;
import io.branch.rnbranch.RNBranchPackage;

import com.robinpowered.react.ScreenBrightness.ScreenBrightnessPackage;
import com.rnfs.RNFSPackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import com.reactnativecommunity.cameraroll.CameraRollPackage;
import com.reactnativecommunity.rnpermissions.RNPermissionsPackage;
import com.levelasquez.androidopensettings.AndroidOpenSettingsPackage;
import com.hieuvp.fingerprint.ReactNativeFingerprintScannerPackage;
import com.rt2zz.reactnativecontacts.ReactNativeContacts;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.swmansion.reanimated.ReanimatedPackage;
import org.reactnative.camera.RNCameraPackage;
import com.microsoft.codepush.react.CodePush;
import com.geektime.rnonesignalandroid.ReactNativeOneSignalPackage;
import com.imagepicker.ImagePickerPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.horcrux.svg.SvgPackage;
import com.reactnativecommunity.netinfo.NetInfoPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.auth.RNFirebaseAuthPackage;
import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import io.invertase.firebase.fabric.crashlytics.RNFirebaseCrashlyticsPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    protected String getJSBundleFile(){
      return CodePush.getJSBundleFile();
    }

    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new PickerPackage(),
            new RNLocalizePackage(),
            new RNDeviceInfo(),
            new LinearGradientPackage(),
            new RNReactNativeHapticFeedbackPackage(),
            new ReactNativeExceptionHandlerPackage(),
            new RNBranchPackage(),
            new ScreenBrightnessPackage(1234),
            new RNFSPackage(),
            new FastImageViewPackage(),
            new CameraRollPackage(),
            new RNPermissionsPackage(),
            new AndroidOpenSettingsPackage(),
            new ReactNativeFingerprintScannerPackage(),
            new ReactNativeContacts(),
            new RNGestureHandlerPackage(),
            new ReanimatedPackage(),
            new RNCameraPackage(),
            new CodePush(getResources().getString(R.string.reactNativeCodePush_androidDeploymentKey), getApplicationContext(), BuildConfig.DEBUG),
            new ReactNativeOneSignalPackage(),
            new ImagePickerPackage(),
            new AsyncStoragePackage(),
            new SvgPackage(),
            new NetInfoPackage(),
            new VectorIconsPackage(),
            new RNCWebViewPackage(),
            new RNFetchBlobPackage(),
            new RNFirebasePackage(),
            new RNFirebaseAuthPackage(),
            new RNFirebaseAnalyticsPackage(),
            new RNFirebaseCrashlyticsPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    Branch.getAutoInstance(this);
  }
}
