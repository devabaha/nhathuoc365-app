import React, { Component } from 'react';
import { View } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { Actions } from 'react-native-router-flux';
import store from 'app-store';
import { APIRequest } from '../../../network/Entity';

class CaptureFaceID extends Component {
  state = {
    loading: false
  };
  uploadFaceIDRequest = new APIRequest();
  requests = [this.uploadFaceIDRequest];

  componentDidMount() {
    this.openCamera();
  }

  componentWillUnmount() {
    cancelRequests(this.requests);
  }

  async uploadFaceID(image) {
    this.setState({ loading: true });
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
        path: 'images'
      }
    };

    ImagePicker.launchCamera(options, response => {
      if (response.error) {
        console.log(response.error);
      } else if (response.didCancel) {
        console.log(response);
        Actions.pop();
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
