/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useCallback, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  // Text,
  StatusBar,
  Platform,
  Image,
  Dimensions,
  TouchableOpacity,
  PermissionsAndroid,
  ActivityIndicator,
  TextInput,
  useWindowDimensions,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import CameraRoll from '@react-native-community/cameraroll';
import Geolocation from '@react-native-community/geolocation';
import NetInfo from '@react-native-community/netinfo';
import {Accordion, Panel} from '@tickid/react-native-accordion';
import Icon, {FA5Style} from 'react-native-vector-icons/FontAwesome5';
import {Tabs, Tab} from '@tickid/react-native-tabs';
import {WebView} from 'react-native-webview';
import {TabView, SceneMap} from 'react-native-tab-view';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {default as ModalBox} from 'react-native-modalbox';
import Loading from '@tickid/tickid-rn-loading';
import {withTranslation} from 'react-i18next';
import {isEmpty} from 'lodash';
import {Container, Text} from 'native-base';
import ActionSheet from 'react-native-actionsheet';
import AndroidOpenSettings from 'react-native-android-open-settings';
import * as Animatable from 'react-native-animatable';
import AutoHeightWebView from 'react-native-autoheight-webview';
import AwesomeAlert from 'react-native-awesome-alerts';
import Barcode from 'react-native-barcode-builder';
import branch from 'react-native-branch';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import codePush, {LocalPackage} from 'react-native-code-push';
import Communications from 'react-native-communications';
import Contacts from 'react-native-contacts';
import DatePicker from '@react-native-community/datetimepicker';
import DeviceInfo from 'react-native-device-info';
import {CheckBox} from 'react-native-elements';
import FlashMessage, {showMessage} from 'react-native-flash-message';
import {
  setJSExceptionHandler,
  setNativeExceptionHandler,
} from 'react-native-exception-handler';
import FastImage from 'react-native-fast-image';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import RNFS from 'react-native-fs';
import {GiftedChat} from 'react-native-gifted-chat';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import ImageCropPicker from 'react-native-image-crop-picker';
import ImageViewer from 'react-native-image-zoom-viewer';
import {ifIphoneX} from 'react-native-iphone-x-helper';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Lightbox from 'react-native-lightbox';
import LinearGradient from 'react-native-linear-gradient';
import * as RNLocalize from 'react-native-localize';
import openMap from 'react-native-open-maps';
import OneSignal from 'react-native-onesignal';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';
import {Linking} from 'react-native';
import Svg, {SvgXml, Path, Circle, Rect} from 'react-native-svg';
import SVGRocket from './rocket.svg';
import QRCode from 'react-native-qrcode-svg';
import HTML from 'react-native-render-html';
import ScreenBrightness from 'react-native-screen-brightness';
import Toast from 'react-native-simple-toast';
import Storage from 'react-native-storage';
import Swiper from 'react-native-swiper';
import RNFetchBlob from 'rn-fetch-blob';

import MaskedView from '@react-native-masked-view/masked-view';
import Shimmer from 'react-native-shimmer';
import {BlurView, VibrancyView} from '@react-native-community/blur';

const FirstRoute = () => (
  <View style={[styles.scene, {backgroundColor: '#ff4081'}]} />
);

const SecondRoute = () => (
  <View style={[styles.scene, {backgroundColor: '#673ab7'}]} />
);

const initialLayout = {width: Dimensions.get('window').width};

const App: () => React$Node = () => {
  const [image, setImage] = useState();
  const [isShowAlert, setShowAlert] = useState(false);
  const [isShimmering, setShimmering] = useState(false);
  const [messages, setMessages] = useState([
    {
      _id: 1,
      text: 'Hello developer',
      createdAt: new Date(),
      user: {
        _id: 2,
        name: 'React Native',
        avatar: 'https://placeimg.com/140/140/any',
      },
    },
  ]);

  useEffect(() => {
    // storeData({test: 'abc'});
    // getAlbum();
    // updateLocation();
    // getNetInfo();
    // Icon.getImageSource(
    //   'comments',
    //   30,
    //   '#000',
    //   FA5Style.solid,
    // ).then((source) => setImage(source));
    // if(Platform.OS === "android"){
    //   AndroidOpenSettings.appDetailsSettings();
    // }
    // branchSubscribe();
    // getContacts();
    // getDeviceInfo();
    // showFlashMessage();
    // scanFingerprint();
    // readFileSystem();
    // hapticFeedBack();
    // openPicker();
    // testIphoneXHelper();
    // testLocalize();
    // testOpenMaps();
    // handleAddListenerOneSignal();
    // testRequestPermission();
    // testScreenBrightness();
    // testToast();
    // testStorage();
    // testFetchBlob();

    setTimeout(() => setShimmering(true));
  }, []);
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'first', title: 'First'},
    {key: 'second', title: 'Second'},
  ]);

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  const log = (title, mess) => console.log(`${Platform.OS} - ${title}`, mess);
  const logError = (title, err) =>
    console.log(`%c${Platform.OS} ${title}`, 'color: red', err);

  const branchSubscribe = () => {
    branch.subscribe(({error, params}) => {
      if (error) {
        console.error('Error from Branch: ' + error);
        return;
      }
      log('branchIO', params);
      // params will never be null if error is null
    });
  };

  // ASYNC STORAGE
  //------------------
  // const storeData = async (value) => {
  //   try {
  //     const jsonValue = JSON.stringify(value);
  //     await AsyncStorage.setItem('@storage_Key', jsonValue);
  //     log("get_async", await getData());
  //   } catch (e) {
  //     // saving error
  //     logError("err_set_async_storage", e);
  //   }
  // };

  // const getData = async () => {
  //   try {
  //     const jsonValue = await AsyncStorage.getItem('@storage_Key')
  //     return jsonValue != null ? JSON.parse(jsonValue) : null;
  //   } catch(e) {
  //     // error reading value
  //     logError("err_get_async_storage", e);
  //   }
  // }
  //------------------

  // CAMERA ROLL
  //------------------
  // const getAlbum = () => {
  //     CameraRoll.getPhotos({
  //       first: 100,
  //       assetType: 'Photos',
  //       groupTypes: 'All',
  //     })
  //       .then(r => {
  //        log("camera-roll", r)

  //       })
  //       .catch(err => {
  //         //Error Loading Images
  //         logError('get recent photo album', err.message);
  //       });
  // }
  //------------------

  // GEOLOCATION
  //------------------
  // updateLocation = (timeout = 5000) => {
  //   const config = {
  //     timeout,
  //     enableHighAccuracy: Platform.OS === 'ios',
  //   };
  //   Geolocation.getCurrentPosition(
  //     (position) => {
  //       log('geolocation', position);
  //       Geolocation.watchPosition(
  //         (position) => log('watch_geolocation_position', position),
  //         (err) => {
  //           logError('watch_geolocation_position', position);
  //         },
  //         {...config},
  //       );
  //     },
  //     (error) => {
  //       logError('geolocation', error);
  //     },
  //     config,
  //   );
  // };
  //------------------

  // NET INFO
  //------------------
  // const getNetInfo = () => {
  //   const unsubscribe = NetInfo.addEventListener((state) => {
  //     log('NetInfo', state);
  //   });

  //   setTimeout(() => unsubscribe(), 3000);
  // };
  //------------------

  // ACTION SHEET
  //------------------
  // let ref_ActionSheet = {};
  // const showActionSheet = () => {
  //   ref_ActionSheet.show();
  // };
  //------------------

  // AWESOME ALERTS
  //------------------
  // const showAlert = () => {
  //   setShowAlert(true);
  // };

  // const hideAlert = () => {
  //   setShowAlert(false);
  // };
  //------------------

  // CAMERA
  //------------------
  // let camera = {};
  // const takePicture = async () => {
  //   if (camera) {
  //     const options = { quality: 0.5, base64: true };
  //     const data = await camera.takePictureAsync(options);
  //     log("camera", data.uri);
  //   }
  // };
  //------------------

  // CONTACTS
  //------------------
  // const getContacts = () => {
  //   if (Platform.OS === 'android') {
  //     PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
  //       title: 'Contacts',
  //       message: 'This app would like to view your contacts.',
  //       buttonPositive: 'Please accept bare mortal',
  //     }).then(() => {
  //       Contacts.getAll((err, contacts) => {
  //         log('get_contacts_permission', err);
  //         log('get_contacts', contacts);
  //         if (err === 'denied') {
  //           // error
  //         } else {
  //           // contacts returned in Array
  //         }
  //       });
  //     });
  //   } else {
  //     Contacts.getAll((err, contacts) => {
  //       log('get_contacts_permission', err);
  //       log('get_contacts', contacts);
  //       if (err === 'denied') {
  //         // error
  //       } else {
  //         // contacts returned in Array
  //       }
  //     });
  //   }
  // };
  //------------------

  // DEVICE INFO
  //------------------
  // const getDeviceInfo = () => {
  //   DeviceInfo.getApiLevel().then(apiLevel => log("api_level", apiLevel));
  //   log("unique_id", DeviceInfo.getUniqueId());
  // }
  //------------------

  // FLASH MESSAGE
  //------------------
  // const showFlashMessage = () => {
  //   showMessage({
  //     message: 'Hello World',
  //     description: 'This is our second message',
  //     type: 'success',
  //   });
  // };
  //------------------

  // EXCEPTION HANDLER
  //------------------
  // setJSExceptionHandler(jsExceptionHandler, true);
  // setNativeExceptionHandler(nativeExceptionHandler);

  // const jsExceptionHandler = (error, isFatal) => {
  //   console.log("js_exception", error, isFatal);
  // }
  // const nativeExceptionHandler = (error) => {
  //   console.log("native_exception", error);
  // }
  //------------------

  // FINGERPRINT
  //------------------
  // const scanFingerprint = () => {
  //   FingerprintScanner.authenticate({
  //     description: 'Scan your fingerprint on the device scanner to continue',
  //   })
  //     .then(() => {
  //      alert('Authenticated successfully');
  //     })
  //     .catch((error) => {
  //       alert(error.message);
  //     });
  // };
  //------------------

  // FS
  //------------------
  // const readFileSystem = () => {
  //   const path = Platform.OS === 'ios' ? RNFS.MainBundlePath: RNFS.DocumentDirectoryPath;
  //   RNFS.readDir(path) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
  //     .then((result) => {
  //       console.log('GOT RESULT', result);

  //       // stat the first file
  //       return Promise.all([RNFS.stat(result[0].path), result[0].path]);
  //     })
  //     .then((statResult) => {
  //       if (statResult[0].isFile()) {
  //         // if we have a file, read it
  //         return RNFS.readFile(statResult[1], 'utf8');
  //       }

  //       return 'no file';
  //     })
  //     .then((contents) => {
  //       // log the file contents
  //       console.log(contents);
  //     })
  //     .catch((err) => {
  //       console.log(err.message, err.code);
  //     });
  // };
  //------------------

  // GIFTED CHAT
  //------------------
  // const onSend = useCallback((messages = []) => {
  //   setMessages((previousMessages) =>
  //     GiftedChat.append(previousMessages, messages),
  //   );
  // }, []);
  //------------------

  // HAPTIC FEEDBACK
  //------------------
  // const hapticFeedBack = () => {
  //   const options = {
  //     enableVibrateFallback: true,
  //     ignoreAndroidSystemSettings: true
  //   };

  //   ReactNativeHapticFeedback.trigger("impactLight", options);
  // }
  //------------------

  // IMAGE CROP PICKER
  //------------------
  // const openPicker = () => {
  //   ImageCropPicker.openCamera({
  //     // useFrontCamera: true,
  //     includeExif: true,
  //     includeBase64: true,
  //   })
  //     .then((res) => console.log(res))
  //     .catch((err) => console.log(err));
  //   ImageCropPicker.openPicker({
  //     includeExif: true,
  //     multiple: true,
  //     includeBase64: true,
  //     mediaType: 'photo',
  //     smartAlbums: ['UserLibrary', 'PhotoStream', 'Panoramas', 'Videos', 'Bursts', 'Favorites']
  //   })
  //     .then((images) => {
  //       console.log(images);
  //     })
  //     .catch((err) => {
  //       console.log('open_picker_err', err);
  //     });
  // };
  //------------------

  // IPHONE_X HELPER
  //------------------
  // const testIphoneXHelper = () => {
  //   console.log(ifIphoneX())
  // }
  //------------------

  // LOCALIZE
  //------------------
  // const testLocalize = () => {
  //   log('localize', RNLocalize.getLocales());
  //   log('localize', RNLocalize.getCurrencies());
  // };
  //------------------

  // OPEN MAPS
  //------------------
  // const testOpenMaps = () => {
  //   openMap({ latitude: 37.865101, longitude: -119.538330 });
  // }
  //------------------

  // ONESIGNAL
  //------------------
  // const handleAddListenerOpenedOneSignal = () => {
  //   OneSignal.addEventListener('opened', handleOpeningNotification);
  // };

  // const handleRemoveListenerOpenedOneSignal = () => {
  //   OneSignal.removeEventListener('opened', handleOpeningNotification);
  // };

  // const handleOpeningNotification = openResult => {
  //   const params = openResult.notification.payload.additionalData;
  //   console.log(params);
  // };

  // const handleAddListenerOneSignal = () => {
  //   OneSignal.init("437375e6-9a46-42fd-836e-30d3b1c28cd1");
  //   OneSignal.addEventListener('ids', handleAddListenerOpenedOneSignal);
  //   OneSignal.inFocusDisplaying(2);
  // };

  // const handleRemoveListenerOneSignal = () => {
  //   OneSignal.removeEventListener('ids', handleAddListenerOpenedOneSignal);
  // };
  //------------------

  // PERMISSIONS
  //------------------
  // const testRequestPermission = () => {
  //   request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE)
  //     .then((result) => {
  //       switch (result) {
  //         case RESULTS.UNAVAILABLE:
  //           console.log(
  //             'This feature is not available (on this device / in this context)',
  //           );
  //           break;
  //         case RESULTS.DENIED:
  //           console.log(
  //             'The permission has not been requested / is denied but requestable',
  //           );
  //           break;
  //         case RESULTS.LIMITED:
  //           console.log('The permission is limited: some actions are possible');
  //           break;
  //         case RESULTS.GRANTED:
  //           console.log('The permission is granted');
  //           break;
  //         case RESULTS.BLOCKED:
  //           console.log('The permission is denied and not requestable anymore');
  //           break;
  //       }
  //     })
  //     .catch((error) => {
  //       // …
  //       logError('request_permission', error);
  //     });
  // };
  //------------------

  // QRCODE SCANNER
  //------------------
  // const onSuccess = (e) => {
  //   Linking.openURL(e.data).catch((err) =>
  //     console.error('An error occured', err),
  //   );
  // };
  //------------------

  // SVG
  //------------------
  //   const xml = `
  //   <svg width="32" height="32" viewBox="0 0 32 32">
  //     <path
  //       fill-rule="evenodd"
  //       clip-rule="evenodd"
  //       fill="url(#gradient)"
  //       d="M4 0C1.79086 0 0 1.79086 0 4V28C0 30.2091 1.79086 32 4 32H28C30.2091 32 32 30.2091 32 28V4C32 1.79086 30.2091 0 28 0H4ZM17 6C17 5.44772 17.4477 5 18 5H20C20.5523 5 21 5.44772 21 6V25C21 25.5523 20.5523 26 20 26H18C17.4477 26 17 25.5523 17 25V6ZM12 11C11.4477 11 11 11.4477 11 12V25C11 25.5523 11.4477 26 12 26H14C14.5523 26 15 25.5523 15 25V12C15 11.4477 14.5523 11 14 11H12ZM6 18C5.44772 18 5 18.4477 5 19V25C5 25.5523 5.44772 26 6 26H8C8.55228 26 9 25.5523 9 25V19C9 18.4477 8.55228 18 8 18H6ZM24 14C23.4477 14 23 14.4477 23 15V25C23 25.5523 23.4477 26 24 26H26C26.5523 26 27 25.5523 27 25V15C27 14.4477 26.5523 14 26 14H24Z"
  //     />
  //     <defs>
  //       <linearGradient
  //         id="gradient"
  //         x1="0"
  //         y1="0"
  //         x2="8.46631"
  //         y2="37.3364"
  //         gradient-units="userSpaceOnUse">
  //         <stop offset="0" stop-color="#FEA267" />
  //         <stop offset="1" stop-color="#E75A4C" />
  //       </linearGradient>
  //     </defs>
  //   </svg>
  // `;
  //------------------

  // SCREEN BRIGHTNESS
  //------------------
  // const testScreenBrightness = () => {
  //   ScreenBrightness.getBrightness().then((originLuminous) => {
  //     console.log(originLuminous);
  //     setTimeout(() =>ScreenBrightness.setBrightness(originLuminous* .5), 3000);
  //   });
  // };
  //------------------

  // TOAST
  //------------------
  // const testToast = () => {
  //   Toast.showWithGravity(
  //     'This is a long toast at the top.',
  //     Toast.LONG,
  //     Toast.CENTER,
  //   );
  // };
  //------------------

  // STORAGE
  //------------------
  // const testStorage = () => {
  //   const storage = new Storage({
  //     size: 30000,
  //     storageBackend: AsyncStorage,
  //     defaultExpires: null,
  //     enableCache: true,
  //     sync: {}
  //   });

  //   storage
  //     .save({
  //       key: 'loginState', // Note: Do not use underscore("_") in key!
  //       data: {
  //         from: 'some other site',
  //         userid: 'some userid',
  //         token: 'some token',
  //       },

  //       // if expires not specified, the defaultExpires will be applied instead.
  //       // if set to null, then it will never expire.
  //       expires: 1000 * 3600,
  //     })
  //     .then(() => {
  //       storage
  //         .load({
  //           key: 'loginState',
  //         })
  //         .then((ret) => {
  //           // found data goes to then()
  //           console.log('storage_load', ret);
  //           storage
  //             .remove({
  //               key: 'loginState',
  //             })
  //             .then((res) => console.log('storage_remove', res))
  //             .catch((err) => console.log('storage_error_remove', err));
  //         })
  //         .catch((err) => {
  //           // any exception including data not found
  //           // goes to catch()
  //           console.log('storage_error_load_catch', err);
  //           switch (err.name) {
  //             case 'NotFoundError':
  //               // TODO;
  //               break;
  //             case 'ExpiredError':
  //               // TODO
  //               break;
  //           }
  //         });
  //     });
  // };
  //------------------

  // FETCH BLOB
  //------------------
  // const testFetchBlob = () => {
  //   RNFetchBlob.fetch('GET', 'http://www.example.com/images/img1.png', {
  //     Authorization: 'Bearer access-token...',
  //     // more headers  ..
  //   })
  //     .then((res) => {
  //       let status = res.info().status;
  //       console.log(res);
  //       if (status == 200) {
  //         // the conversion is done in native code
  //         let base64Str = res.base64();
  //         // the following conversions are done in js, it's SYNC
  //         let text = res.text();
  //         let json = res.json();
  //       } else {
  //         // handle other status codes
  //       }
  //     })
  //     // Something went wrong:
  //     .catch((errorMessage, statusCode) => {
  //       // error handling
  //       console.log(errorMessage, statusCode);
  //     });
  // };
  //------------------

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
        {/* <Accordion>
          <Panel title="Panel #1">
            <Text>Content of panel #1</Text>
          </Panel>

          <Panel title="Panel #2">
            <Text>Content of panel #2</Text>
          </Panel>

          <Panel title="Panel #3">
            <Text>Content of panel #3</Text>
          </Panel>
        </Accordion> */}
        {/* {!!image && <Image style={{width: 30, height: 30}} source={image} />} */}
        {/* <Tabs  tabTitleStyle={{height: 30, }}>
        <Tab heading="Tab one">
          <Text>Content of #tabOne</Text>
        </Tab>

        <Tab heading="Tab two">
          <Text>Content of #tabTwo</Text>
        </Tab>

        <Tab heading="Tab three">
          <Text>Content of #tabThree</Text>
        </Tab>
      </Tabs> */}
        {/* <WebView
          source={{uri: 'https://infinite.red'}}
          style={{marginTop: 20}}
        /> */}
        {/* <TabView
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={initialLayout}
        /> */}
        {/* <GooglePlacesAutocomplete
          placeholder="Search"
          onPress={(data, details = null) => {
            // 'details' is provided when fetchDetails = true
            console.log(data, details);
          }}
          query={{
            key: 'AIzaSyBZfS1WyeCgdWk9D6RVMT65RXl5ZOptJAQ',
            region: 'vi',
            language: 'vi',
          }}
        /> */}
        {/* <ModalBox
          entry="bottom"
          position="bottom"
          style={[styles.modal]}
          backButtonClose
          isOpen
          useNativeDriver>
          <View>
            <Text>test modal</Text>
          </View>
        </ModalBox> */}
        {/* <Loading loading /> */}
        {/* <Container>
        <Text>Open up App.js to start working on your app!</Text>
      </Container> */}
        {/* <View>
          <Text onPress={showActionSheet}>Open ActionSheet</Text>
          <ActionSheet
            ref={(inst) => (ref_ActionSheet = inst)}
            title={'Which one do you like ?'}
            options={['Apple', 'Banana', 'cancel']}
            cancelButtonIndex={2}
            destructiveButtonIndex={1}
            onPress={(index) => {
              alert(index);
            }}
          />
        </View> */}
        {/* <Animatable.Text
          animation="slideInDown"
          iterationCount={5}
          direction="alternate">
          Up and down you go
        </Animatable.Text>
        <Animatable.Text
          animation="pulse"
          easing="ease-out"
          iterationCount="infinite"
          style={{textAlign: 'center'}}>
          ❤️
        </Animatable.Text> */}
        {/* <AutoHeightWebView
          onError={() => console.log('on error')}
          onLoad={() => console.log('on load')}
          onLoadStart={() => console.log('on load start')}
          onLoadEnd={() => console.log('on load end')}
          onShouldStartLoadWithRequest={(result) => {
            console.log(result);
            return true;
          }}
          style={{
            paddingHorizontal: 6,
            marginHorizontal: 15,
            width: '70%',
          }}
          onHeightUpdated={(height) => this.setState({height})}
          source={{
            html: `<p style="font-weight: 400;font-style: normal;font-size: 21px;line-height: 1.58;letter-spacing: -.003em;">Tags are great for describing the essence of your story in a single word or phrase, but stories are rarely about a single thing. <span style="background-color: transparent !important;background-image: linear-gradient(to bottom, rgba(146, 249, 190, 1), rgba(146, 249, 190, 1));">If I pen a story about moving across the country to start a new job in a car with my husband, two cats, a dog, and a tarantula, I wouldn’t only tag the piece with “moving”. I’d also use the tags “pets”, “marriage”, “career change”, and “travel tips”.</span></p>`,
          }}
          zoomable={false}
          scrollEnabled={false}
          customScript={`

                  `}
          customStyle={`
                  * {
                    font-family: 'arial';
                  }
                  a {
                    pointer-events:none;
                    text-decoration: none !important;
                    color: #404040 !important;
                  }
                  p {
                    font-size: 15px;
                    line-height: 24px
                  }
                  img {
                    max-width: 100% !important;
                  }`}
        /> */}
        {/* <Text>I'm AwesomeAlert</Text>
        <TouchableOpacity
          onPress={() => {
            showAlert();
          }}>
          <View style={styles.button}>
            <Text style={styles.text}>Try me!</Text>
          </View>
        </TouchableOpacity>

        <AwesomeAlert
          show={isShowAlert}
          showProgress={false}
          title="AwesomeAlert"
          message="I have a message for you!"
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          showConfirmButton={true}
          cancelText="No, cancel"
          confirmText="Yes, delete it"
          confirmButtonColor="#DD6B55"
          onCancelPressed={() => {
            hideAlert();
          }}
          onConfirmPressed={() => {
            hideAlert();
          }}
        /> */}

        {/* <Barcode
          value="abc"
          format="CODE128"
          width={1.5}
          height={80}
          background="transparent"
        /> */}

        {/* <View style={styles.container}>
          <RNCamera
            ref={(ref) => {
              camera = ref;
            }}
            style={styles.preview}
            type={RNCamera.Constants.Type.back}
            flashMode={RNCamera.Constants.FlashMode.on}
            androidCameraPermissionOptions={{
              title: 'Permission to use camera',
              message: 'We need your permission to use your camera',
              buttonPositive: 'Ok',
              buttonNegative: 'Cancel',
            }}
            androidRecordAudioPermissionOptions={{
              title: 'Permission to use audio recording',
              message: 'We need your permission to use your audio',
              buttonPositive: 'Ok',
              buttonNegative: 'Cancel',
            }}
            onGoogleVisionBarcodesDetected={({barcodes}) => {
              console.log(barcodes);
            }}
          />
          <View
            style={{flex: 0, flexDirection: 'row', justifyContent: 'center'}}>
            <TouchableOpacity onPress={takePicture} style={styles.capture}>
              <Text style={{fontSize: 14}}> SNAP </Text>
            </TouchableOpacity>
          </View>
        </View> */}

        {/* <View style={styles.container}>
          <TouchableOpacity
            onPress={() => Communications.phonecall('0123456789', true)}>
            <View style={styles.holder}>
              <Text style={styles.text}>Make phonecall</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              Communications.email(
                ['emailAddress1', 'emailAddress2'],
                null,
                null,
                'My Subject',
                'My body text',
              )
            }>
            <View style={styles.holder}>
              <Text style={styles.text}>Send an email</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Communications.text('0123456789')}>
            <View style={styles.holder}>
              <Text style={styles.text}>Send a text/iMessage</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              Communications.web('https://github.com/facebook/react-native')
            }>
            <View style={styles.holder}>
              <Text style={styles.text}>Open react-native repo on Github</Text>
            </View>
          </TouchableOpacity>
        </View> */}

        {/* <DatePicker
          style={{flex: 1, justifyContent: 'center'}}
          value={new Date()}
          mode="date"
          placeholder="heloo"
          format="YYYY-MM-DD"
          confirmBtnText="Xong"
          cancelBtnText="Huỷ"
          showIcon={false}
          customStyles={{
            dateText: {
              fontSize: 14,
              color: 'black',
              position: 'absolute',
              right: 0,
            },
            placeholderText: {
              fontSize: 14,
              color: '#989898',
              position: 'absolute',
              right: 0,
            },
            dateInput: {
              borderColor: 'transparent',
            },
          }}
          onChange={(e, date) => {
            console.log(date);
          }}
        /> */}

        {/* <CheckBox title="Click Here" checked={true} /> */}

        {/* <FlashMessage />  */}

        {/* <FastImage
          style={{width: 200, height: 200, backgroundColor: 'blue'}}
          source={{
            uri: 'https://unsplash.it/400/400?image=1',
          }}
          // resizeMode={FastImage.resizeMode.contain}
        /> */}

        {/* <GiftedChat
          messages={messages}
          onSend={(messages) => onSend(messages)}
          user={{
            _id: 1,
          }}
        /> */}

        {/* <ImageViewer
          menuContext={{saveToLocal: 'Lưu ảnh', cancel: 'Hủy'}}
          enableSwipeDown
          loadingRender={() => <ActivityIndicator />}
          failImageSource={{
            url: 'https://avatars2.githubusercontent.com/u/7970947?v=3&s=460',
          }}
          useNativeDriver
          imageUrls={[
            {
              url: "https://images.unsplash.com/photo-1571501679680-de32f1e7aad4",
            },
            {
              url: "https://images.unsplash.com/photo-1573273787173-0eb81a833b34",
            },
            {
              url: "https://images.unsplash.com/photo-1569569970363-df7b6160d111",
            },
          ]}
        /> */}

        {/* <KeyboardAwareScrollView>
          <View>
            <TextInput style={{backgroundColor: 'red', width: '100%', height: 50, marginBottom: 10}} />
            <TextInput style={{backgroundColor: 'red', width: '100%', height: 50, marginBottom: 10}} />
            <TextInput style={{backgroundColor: 'red', width: '100%', height: 50, marginBottom: 10}} />
            <TextInput style={{backgroundColor: 'red', width: '100%', height: 50, marginBottom: 10}} />
            <TextInput style={{backgroundColor: 'red', width: '100%', height: 50, marginBottom: 10}} />
            <TextInput style={{backgroundColor: 'red', width: '100%', height: 50, marginBottom: 10}} />
            <TextInput style={{backgroundColor: 'red', width: '100%', height: 50, marginBottom: 10}} />
            <TextInput style={{backgroundColor: 'red', width: '100%', height: 50, marginBottom: 10}} />
            <TextInput style={{backgroundColor: 'red', width: '100%', height: 50, marginBottom: 10}} />
            <TextInput style={{backgroundColor: 'red', width: '100%', height: 50, marginBottom: 10}} />
            <TextInput style={{backgroundColor: 'red', width: '100%', height: 50, marginBottom: 10}} />
            <TextInput style={{backgroundColor: 'red', width: '100%', height: 50, marginBottom: 10}} />
            <TextInput style={{backgroundColor: 'red', width: '100%', height: 50, marginBottom: 10}} />
          </View>
        </KeyboardAwareScrollView> */}

        {/* <Lightbox
          springConfig={{ overshootClamping: true }}
          >
          <Image
            style={{height: 300}}
            source={{
              uri:
                'http://knittingisawesome.com/wp-content/uploads/2012/12/cat-wearing-a-reindeer-hat1.jpg',
            }}
          />
        </Lightbox> */}

        {/* <LinearGradient
          start={{x: 0.0, y: 0.25}}
          end={{x: 0.5, y: 1.0}}
          locations={[0, 0.5, 0.6]}
          colors={['#4c669f', '#3b5998', '#192f6a']}
          style={styles.linearGradient}>
          <Text style={styles.buttonText}>Sign in with Facebook</Text>
        </LinearGradient> */}

        {/* <QRCodeScanner
          checkAndroid6Permissions
          onRead={onSuccess}
          flashMode={RNCamera.Constants.FlashMode.torch}
          topContent={
            <Text style={styles.centerText}>
              Go to{' '}
              <Text style={styles.textBold}>wikipedia.org/wiki/QR_code</Text> on
              your computer and scan the QR code.
            </Text>
          }
          bottomContent={
            <TouchableOpacity style={styles.buttonTouchable}>
              <Text style={styles.buttonText}>OK. Got it!</Text>
            </TouchableOpacity>
          }
        /> */}

        {/* <SvgXml xml={xml} width="100%" height="100%" />
        <Svg height="100" width="100">
          <Rect x="0" y="0" width="100" height="100" fill="black" />
          <Circle cx="50" cy="50" r="30" fill="yellow" />
          <Circle cx="40" cy="40" r="4" fill="black" />
          <Circle cx="60" cy="40" r="4" fill="black" />
          <Path d="M 40 60 A 10 10 0 0 0 60 60" stroke="black" />
        </Svg> 
        <SvgXml width="200" height="200" xml={SVGRocket} />*/}

        {/* <QRCode value="http://awesome.link.qr" /> */}

        {/* <HTML
          source={{
            html: `<h1>This HTML snippet is now rendered with native components !</h1>
    <h2>Enjoy a webview-free and blazing fast application</h2>
    <img src="https://i.imgur.com/dHLmxfO.jpg?2" />
    <em style="textAlign: center;">Look at how happy this native cat is</em>`,
          }}
          computeEmbeddedMaxWidth={(availableWidth) => availableWidth - 32}
        /> */}

        {/* <Swiper
          style={styles.wrapper}
          showsButtons={true}
          autoplayTimeout={3}
          // showsPagination={false}
          horizontal
          autoplay
          paginationStyle={{marginBottom: 100}}
          backgroundColor="blue"
          removeClippedSubviews={false}
          renderPagination={() => null}
          onIndexChanged={(i) => console.log(i)}>
          <View style={styles.slide1}>
            <Text style={styles.text}>Hello Swiper</Text>
          </View>
          <View style={styles.slide2}>
            <Text style={styles.text}>Beautiful</Text>
          </View>
          <View style={styles.slide3}>
            <Text style={styles.text}>And simple</Text>
          </View>
        </Swiper> */}

        {/* <MaskedView
              style={{flex: 1, flexDirection: 'row', height: '100%'}}
              maskElement={
                <View
                  style={{
                    // Transparent background because mask is based off alpha channel.
                    backgroundColor: 'transparent',
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 60,
                      color: 'black',
                      fontWeight: 'bold',
                    }}>
                    Basic Mask
                  </Text>
                </View>
              }>
              <View
                style={{flex: 1, height: '100%', backgroundColor: '#324376'}}
              />
              <View
                style={{flex: 1, height: '100%', backgroundColor: '#F5DD90'}}
              />
              <View
                style={{flex: 1, height: '100%', backgroundColor: '#F76C5E'}}
              />
              <View
                style={{flex: 1, height: '100%', backgroundColor: '#e1e1e1'}}
              />
            </MaskedView> */}

        {/* <Shimmer
          duration={5000}
          opacity={0.1}
          highlightLength={0.5}
          animating={Platform.OS === 'ios' ? isShimmering : true}>
          <View style={{width: 200, height: 100, backgroundColor: 'yellow'}}>
            <Text style={{color: 'red'}}>
              testing alo alo ho ho hobla blohh
            </Text>
          </View>
        </Shimmer> */}

        <View style={styles.blurContainer}>
          <Image
            key={'blurryImage'}
            source={{
              uri:
                'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg',
            }}
            style={styles.absolute}
          />
          <Text style={styles.absolute}>Hi, I am some blurred text</Text>

          {/* <BlurView
            style={styles.absolute}
            blurType="light"
            blurAmount={10}
            reducedTransparencyFallbackColor="white"
            blurRadius={1}
            // downsampleFactor={20}
          /> */}
          <Text style={styles.text}>
            Vàng
          </Text>
          {Platform.OS === 'ios' && (
          <VibrancyView
            blurType=""
            style={styles.blurContainer}
            blurAmount={10}
            >
            <Text style={styles.text}>Vibrancy component (iOS-only)</Text>
          </VibrancyView>
        )}
        </View>

        
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
  modal: {
    height: '80%',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    // backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    margin: 10,
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
  blurContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  text: {
    fontFamily: "SairaStencilOne-Regular",
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: 'white',
  },
});

export default App;
