package id.tick;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.reactnativecommunity.rnpermissions.RNPermissionsPackage;
import com.levelasquez.androidopensettings.AndroidOpenSettingsPackage;
import com.hieuvp.fingerprint.ReactNativeFingerprintScannerPackage;
import com.rt2zz.reactnativecontacts.ReactNativeContacts;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.swmansion.reanimated.ReanimatedPackage;
import org.reactnative.camera.RNCameraPackage;
import org.capslock.RNDeviceBrightness.RNDeviceBrightness;
import com.microsoft.codepush.react.CodePush;
import io.underscope.react.fbak.RNAccountKitPackage;
import com.geektime.rnonesignalandroid.ReactNativeOneSignalPackage;
import com.imagepicker.ImagePickerPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.horcrux.svg.SvgPackage;
import com.reactnativecommunity.netinfo.NetInfoPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.RNFetchBlob.RNFetchBlobPackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.auth.RNFirebaseAuthPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

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
            new RNPermissionsPackage(),
            new AndroidOpenSettingsPackage(),
            new ReactNativeFingerprintScannerPackage(),
            new ReactNativeContacts(),
            new RNGestureHandlerPackage(),
            new ReanimatedPackage(),
            new RNCameraPackage(),
            new RNDeviceBrightness(),
            new CodePush(getResources().getString(R.string.reactNativeCodePush_androidDeploymentKey), getApplicationContext(), BuildConfig.DEBUG),
            new RNAccountKitPackage(),
            new ReactNativeOneSignalPackage(),
            new ImagePickerPackage(),
            new AsyncStoragePackage(),
            new SvgPackage(),
            new NetInfoPackage(),
            new VectorIconsPackage(),
            new RNCWebViewPackage(),
            new RNDeviceInfo(),
            new RNFetchBlobPackage(),
            new RNFirebasePackage(),
            new RNFirebaseAuthPackage()
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
  }
}
