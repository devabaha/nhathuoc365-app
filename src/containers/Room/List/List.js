import React, { Component, useEffect, useState } from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  FlatList,
  ImageBackground,
  Image,
  Text,
  Easing,
  RefreshControl,
  TouchableHighlight,
  TouchableOpacity,
  Animated
} from 'react-native';
import Loading from '../../../components/Loading';
import { Actions } from 'react-native-router-flux';
import Modal from 'react-native-modalbox';
import Icon from 'react-native-vector-icons/AntDesign';
import appConfig from 'app-config';

class List extends Component {
  state = {
    loading: true,
    refreshing: false,
    rooms: null,
    contentHeight: undefined
  };
  unmounted = false;
  refModal = React.createRef();

  componentDidMount() {
    this.getListRoom();
    setTimeout(() =>
      Actions.refresh({
        onBack: () => {
          Actions.pop();
          // this.props.onConfirm();
        }
      })
    );
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  async getListRoom() {
    const { t } = this.props;
    try {
      const response = await APIHandler.user_list_room();

      if (!this.unmounted && response) {
        if (response.data && response.status === STATUS_SUCCESS) {
          this.setState({
            rooms: response.data.rooms
          });
        } else {
          const errMess = response.message || t('api.error.message');
          flashShowMessage({
            type: 'danger',
            message: errMess
          });
        }
      }
    } catch (err) {
      console.log(api, err);
      flashShowMessage({
        type: 'danger',
        message: t('api.error.message')
      });
    } finally {
      !this.unmounted &&
        this.setState({
          loading: false,
          refreshing: false
        });
    }
  }

  async updateRoomDefault(room_id, callBack) {
    const { t } = this.props;
    const data = { room_id };
    try {
      const response = await APIHandler.user_update_room_default(data);

      if (!this.unmounted && response) {
        if (response.data && response.status === STATUS_SUCCESS) {
          callBack(response.data.room);
        } else {
          const errMess = response.message || t('api.error.message');
          flashShowMessage({
            type: 'danger',
            message: errMess
          });
        }
      }
    } catch (err) {
      console.log(api, err);
      flashShowMessage({
        type: 'danger',
        message: t('api.error.message')
      });
    } finally {
      !this.unmounted &&
        this.setState({
          loading: false,
          refreshing: false
        });
    }
  }

  onRefresh = () => {
    this.setState({ refreshing: true });
    this.getListRoom();
  };

  onClosed = () => {
    Actions.pop();
  };

  onRoomPress(room) {
    if (room.id === this.props.room_id) {
      this.onCancelPress();
      return;
    }
    this.updateRoomDefault(room.id, room => {
      this.props.onConfirm(room);
      this.onCancelPress();
    });
  }

  onCancelPress = () => {
    this.refModal.current.close();
  };

  renderRoom = ({ item: room }) => {
    return (
      <Row
        selected={room.id === this.props.room_id}
        cover={room.image_url}
        avatar={room.logo_url}
        title={room.title}
        subTitle={room.address}
        onPress={() => this.onRoomPress(room)}
      />
    );
  };

  render() {
    return (
      <Modal
        ref={this.refModal}
        isOpen
        position="bottom"
        backdropColor={'#000'}
        backdropOpacity={0.8}
        onClosed={this.onClosed}
        animationDuration={200}
        useNativeDriver
        swipeToClose={false}
        style={[styles.modal]}
        easing={Easing.bezier(0.54, 0.96, 0.74, 1.01)}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <SafeAreaView>
              <View style={styles.headerWrapper}>
                <TouchableOpacity
                  hitSlop={HIT_SLOP}
                  onPress={this.onCancelPress}
                  style={styles.close}
                >
                  <Icon name="closecircle" style={styles.leftIcon} />
                </TouchableOpacity>
                <View style={styles.headingContainer}>
                  <Text style={styles.heading}>Danh sách căn hộ</Text>
                  {/* <Text style={styles.subHeading}>{this.props.title}</Text> */}
                </View>
              </View>
            </SafeAreaView>
          </View>

          {this.state.loading && <Loading center />}

          {!!this.state.rooms && (
            <FlatList
              data={this.state.rooms}
              renderItem={this.renderRoom}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this.onRefresh}
                />
              }
              keyExtractor={(item, index) => index.toString()}
            />
          )}
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: '#fff',
    maxHeight: '70%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    ...elevationShadowStyle(5, 0, -5)
  },
  container: {
    flex: 1,
    backgroundColor: '#eee',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden'
  },
  close: {
    zIndex: 1,
    left: 15,
    alignSelf: 'flex-start'
  },
  leftIcon: {
    color: '#666',
    fontSize: 22
  },
  header: {
    zIndex: 1,
    paddingTop: 15,
    backgroundColor: '#f0f0f0',
    borderBottomColor: appConfig.colors.primary,
    borderBottomWidth: 3
  },
  headerWrapper: {
    paddingVertical: 10,
    justifyContent: 'center'
  },
  headingContainer: {
    width: '100%',
    position: 'absolute'
  },
  heading: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.2,
    textTransform: 'uppercase',
    color: '#666'
  },
  subHeading: {
    marginVertical: 5,
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 11,
    color: '#666'
  },

  /** Row */
  rowContainer: {
    backgroundColor: '#666',
    borderBottomWidth: 0.5,
    borderBottomColor: '#fafafa'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  imageContainer: {
    margin: 15,
    marginRight: 0,
    width: 70,
    height: 70,
    borderRadius: 35,
    borderColor: '#fff',
    borderWidth: 0.5,
    backgroundColor: '#eee',
    ...elevationShadowStyle(5)
  },
  mask: {
    backgroundColor: 'rgba(0,0,0,.4)',
    position: 'absolute',
    width: '100%',
    height: '100%'
  },
  selected: {
    color: '#aaa',
    fontSize: 16,
    position: 'absolute',
    right: 0,
    width: 10,
    height: '100%',
    backgroundColor: appConfig.colors.primary
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 35
  },
  mainContent: {
    flex: 1,
    padding: 15,
    margin: 15,
    marginLeft: 0,
    borderRadius: 8
  },
  title: {
    fontWeight: '500',
    color: '#fff',
    ...elevationShadowStyle(5)
  },
  subTitle: {
    color: '#ddd',
    fontSize: 12,
    ...elevationShadowStyle(5)
  }
});

export default withTranslation()(List);

const bgRowColor = hexToRgbA(appConfig.colors.primary, 0.3);

const Row = ({ selected, avatar, cover, title, subTitle, onPress }) => {
  const [animatedOpacity] = useState(new Animated.Value(0));
  useEffect(() => {
    startShowUpAnimation();
  }, []);

  function startShowUpAnimation() {
    Animated.timing(animatedOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true
    }).start();
  }

  return (
    <Animated.View style={{ opacity: animatedOpacity }}>
      <TouchableHighlight onPress={onPress} underlayColor={bgRowColor}>
        <ImageBackground
          blurRadius={2}
          style={[styles.rowContainer]}
          imageStyle={{ opacity: 0.5 }}
          source={{ uri: cover }}
        >
          <View style={styles.mask} />
          {selected && <View style={styles.selected} />}
          <View style={styles.row}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: avatar }} style={styles.image} />
            </View>
            <View style={styles.mainContent}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.subTitle}>{subTitle}</Text>
            </View>
          </View>
        </ImageBackground>
      </TouchableHighlight>
    </Animated.View>
  );
};
