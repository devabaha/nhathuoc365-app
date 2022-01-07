import React, {Component} from 'react';
import {View} from 'react-native';
// 3-party libs
import ImagePicker from 'react-native-image-picker';
// configs
import store from 'app-store';
// helpers
import {updateNavbarTheme} from 'src/Themes/helper/updateNavBarTheme';
import {getTheme} from 'src/Themes/Theme.context';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// routing
import {pop} from 'app-helper/routing';
// entities
import {APIRequest} from 'src/network/Entity';

class CaptureFaceID extends Component {
  static contextType = ThemeContext;

  state = {
    loading: false,
  };
  uploadFaceIDRequest = new APIRequest();
  requests = [this.uploadFaceIDRequest];
  updateNavBarDisposer = () => {};

  get theme() {
    return getTheme(this);
  }

  componentDidMount() {
    this.openCamera();

    this.updateNavBarDisposer = updateNavbarTheme(
      this.props.navigation,
      this.theme,
    );
  }
  componentWillUnmount() {
    cancelRequests(this.requests);

    this.updateNavBarDisposer();
  }

  async uploadFaceID(image) {
    this.setState({loading: true});
    const siteId = this.props.siteId || store.store_id;
    const uploadImageBase64 = 'data:' + image.type + ';base64,' + image.data;
    console.log(uploadImageBase64);
    // const data = {
    //     image1: image,
    //     image2: image,
    //     image3: image,
    // }
    // try {
    //     this.uploadFaceIDRequest.data = APIHandler.site_upload_image_faceID(
    //         siteId,
    //         data
    //     )
    //     const response = await this.uploadFaceIDRequest.promise();
    //     console.log(response);
    // } catch (err) {
    // } finally {
    //   this.setState({ loading: false });
    // }
  }

  openCamera() {
    const options = {
      cameraType: 'front',
      rotation: 360,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.launchCamera(options, (response) => {
      if (response.error) {
        console.log(response.error);
      } else if (response.didCancel) {
        console.log(response);
        pop();
      } else {
        // console.log(response);
        this.uploadFaceID(response);
      }
    });
  }

  render() {
    return <View></View>;
  }
}

export default withTranslation()(CaptureFaceID);
