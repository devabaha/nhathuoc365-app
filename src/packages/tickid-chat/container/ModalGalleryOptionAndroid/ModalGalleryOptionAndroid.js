import React, {Component} from 'react';
import {
  Modal,
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  BackHandler,
} from 'react-native';

import {
  CameraPermission,
  PhotoLibraryPermission,
} from '../../../../helper/permissionHelper';

class ModalGalleryOptionAndroid extends Component {
  state = {};

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.visible !== this.props.visible) {
      if (nextProps.visible) {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
      } else {
        BackHandler.removeEventListener(
          'hardwareBackPress',
          this.handleBackPress,
        );
      }
    }

    if (nextProps !== this.props) {
      return true;
    }

    return false;
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleOpenCamera = async () => {
    const granted = await CameraPermission.request();
    if (granted) {
      this.props.onPressCamera();
    } else {
      this.handleBackPress();
      setTimeout(() => {
        CameraPermission.openPermissionAskingModal();
      }, 500);
    }
  };

  handleOpenLibrary = async () => {
    const granted = await PhotoLibraryPermission.request();
    if (granted) {
      this.props.onPressLibrary();
    } else {
      this.handleBackPress();
      setTimeout(() => {
        PhotoLibraryPermission.openPermissionAskingModal();
      }, 500);
    }
  };

  handleBackPress = () => {
    this.props.onClose();
    return false;
  };

  render() {
    return (
      <Modal
        animationType="fade"
        transparent
        visible={this.props.visible}
        onRequestClose={this.props.onRequestClose}>
        <TouchableWithoutFeedback onPress={this.props.onClose}>
          <View style={styles.container}>
            <View style={styles.content}>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>Chọn ảnh từ</Text>
              </View>
              <TouchableOpacity onPress={this.handleOpenCamera}>
                <Text style={styles.option}>Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.handleOpenLibrary}>
                <Text style={styles.option}>Mở thư viện</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,.3)',
  },
  content: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
  },
  titleContainer: {
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
  },
  title: {
    fontSize: 20,
    paddingVertical: 15,
    color: '#888',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  option: {
    width: '100%',
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
  },
});

export default ModalGalleryOptionAndroid;
