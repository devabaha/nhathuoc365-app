import React, { Component } from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  SectionList
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome';
import NoResult from '../../../components/NoResult';
import APIRequest from '../../../network/Entity/APIRequest/APIRequest';
import HorizontalInfoItem from '../../../components/account/HorizontalInfoItem';
import Promotion from '../../../components/Home/component/Promotion';
import WebviewProjectFooter from '../ListProject/WebviewProjectFooter';
import appConfig from 'app-config';
import store from 'app-store';
import Loading from '../../../components/Loading';

const IMAGE_WIDTH = appConfig.device.width;
const IMAGE_HEIGHT = appConfig.device.width / 2;
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  imagesWrapper: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    backgroundColor: '#eee',
    marginBottom: 5
  },
  imagesSlideContainer: {
    borderRadius: 0,
    marginTop: 0
  },
  imagesContainer: {
    flex: 1
  },
  image: {
    width: '100%',
    height: '100%'
  },
  sectionList: {
    flex: 1
  },
  sectionTitle: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: '#333'
  },
  contentSectionList: {},
  sectionSeperator: {
    height: 5
  },
  itemSeperatorContainer: {
    backgroundColor: '#fff',
    height: 1
  },
  itemSeperator: {
    position: 'absolute',
    width: '100%',
    borderBottomWidth: 0.5,
    borderBottomColor: '#f3f3f3',
    left: 15
  }
});

class Project extends Component {
  state = {
    loadingImages: true,
    images: null,
    room: null
  };
  getImagesRequest = new APIRequest();
  requests = [this.getImagesRequest];

  get projectName() {
    return this.props.room && this.props.room.project_name
      ? this.props.room.project_name
      : '';
  }

  get roomName() {
    return this.props.room && this.props.room.room_name
      ? this.props.room.room_name
      : '';
  }

  get totalPrice() {
    return this.props.room ? this.props.room.total_price_view : '';
  }

  componentDidMount() {
    this.getImages();
    this.formatRoomData();
  }

  componentWillUnmount() {
    cancelRequests(this.requests);
  }

  async getImages() {
    const { t } = this.props;
    const data = {
      // product_code: this.props.room.product_code,
      product_code: '106680',
      id_code: this.props.staff.id_code,
      company_name: this.props.staff.company_name
    };
    try {
      this.getImagesRequest.data = APIHandler.user_list_image_room_detail_beeland(
        data
      );
      const response = await this.getImagesRequest.promise();
      console.log(response);
      if (response.status === STATUS_SUCCESS && response.data) {
        this.setState({
          images: response.data.list_image
            ? response.data.list_image.map(image => ({
                ...image,
                banner: image.image_url
              }))
            : null
        });
      } else {
        flashShowMessage({
          type: 'danger',
          message: response.message || t('api.error.message')
        });
      }
    } catch (err) {
      console.log('get_images_prj_detail_beeland', err);
      flashShowMessage({
        type: 'danger',
        message: t('api.error.message')
      });
    } finally {
      this.setState({
        loadingImages: false
      });
    }
  }

  formatRoomData() {
    if (!this.props.room) return;
    let room = [];

    const statusRoom = this.props.room.status
      ? this.formatSectionListData('status_room', {
          'Trạng thái': this.props.room.status
        })
      : null;
    const infoRoom = this.props.room.info_room
      ? this.formatSectionListData('info_room', this.props.room.info_room)
      : null;
    const infoPriceRoom = this.props.room.info_price_room
      ? this.formatSectionListData(
          'info_price_room',
          this.props.room.info_price_room,
          { title: 'Thông tin giá' }
        )
      : null;

    if (statusRoom) {
      room.push(statusRoom);
    }

    if (infoRoom) {
      room.push(infoRoom);
    }

    if (infoPriceRoom) {
      room.push(infoPriceRoom);
    }

    this.setState({
      room: room.length !== 0 ? room : null
    });
  }

  formatSectionListData(
    sectionId,
    data,
    extraSectionParams = {},
    extraItemParams = {}
  ) {
    return {
      id: sectionId,
      ...extraSectionParams,
      data: Object.keys(data).map((key, index) => {
        return {
          id: index,
          title: key,
          value: data[key],
          ...extraItemParams
        };
      })
    };
  }

  handlePressImage = (image, index) => {
    Actions.item_image_viewer({
      images: this.state.images.map(image => ({ url: image.banner })),
      index
    });
  };

  handleBooking() {
    Actions.push(appConfig.routes.customerInfoBookingBeeLand, {
      siteId: this.props.siteId,
      staff: this.props.staff,
      room: this.props.room
    });
  }

  renderHeader() {
    return (
      <>
        <View style={styles.imagesWrapper}>
          {!this.state.loadingImages ? (
            !!this.state.images && this.state.images.length !== 0 ? (
              <Promotion
                data={this.state.images}
                containerStyle={styles.imagesContainer}
                ratio="2:1"
                padding={0}
                containerSlideStyle={styles.imagesSlideContainer}
                onPress={this.handlePressImage.bind(this)}
              />
            ) : (
              <CachedImage
                source={require('../../../images/logo-640x410.jpg')}
                style={styles.image}
              />
            )
          ) : (
            <Loading center />
          )}
        </View>
        <ProjectHeader
          projectName={this.projectName}
          roomName={this.roomName}
          totalPrice={this.totalPrice}
        />
      </>
    );
  }

  renderSectionHeader({ section: { title } }) {
    return !!title && <Text style={[styles.sectionTitle]}>{title}</Text>;
  }

  renderRoomInfo({ item, index, section }) {
    return <HorizontalInfoItem data={item} />;
  }

  renderItemSeparator() {
    return (
      <View style={styles.itemSeperatorContainer}>
        <View style={styles.itemSeperator} />
      </View>
    );
  }

  renderSectionSeparator() {
    return <View style={styles.sectionSeperator} />;
  }

  render() {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.container}>
          {!!this.state.room ? (
            <SectionList
              ListHeaderComponent={this.renderHeader.bind(this)}
              style={styles.sectionList}
              contentContainerStyle={styles.contentSectionList}
              renderSectionHeader={this.renderSectionHeader}
              renderItem={this.renderRoomInfo}
              SectionSeparatorComponent={this.renderSectionSeparator}
              ItemSeparatorComponent={this.renderItemSeparator}
              sections={this.state.room}
              keyExtractor={(item, index) => `${item.title}-${index}`}
            />
          ) : (
            <NoResult
              message="Chưa có dữ liệu"
              icon={<Icon name="exclamation-circle" size={72} color="#aaa" />}
            />
          )}
          <WebviewProjectFooter
            phoneTitle="Gọi ngay"
            chatTitle="Chat ngay"
            submitTitle="Book ngay"
            submitIconName="flag"
            tel={this.props.tel}
            name={this.props.buildingName}
            userId={store.user_info.id}
            siteId={this.props.siteId}
            onCheckPress={this.handleBooking.bind(this)}
          />
        </SafeAreaView>
      </View>
    );
  }
}

export default withTranslation()(Project);

const projectHeaderStyles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#fff'
  },
  title: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10
  },
  row: {
    flexDirection: 'row'
  },
  box: {
    borderRadius: 8,
    marginRight: 15
  },
  name: {
    backgroundColor: '#04a002'
  },
  price: {
    backgroundColor: '#af2e35'
  },
  text: {
    color: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 5
  }
});

const ProjectHeader = ({ projectName, roomName, totalPrice }) => {
  return (
    <View style={projectHeaderStyles.container}>
      <Text style={projectHeaderStyles.title}>{projectName}</Text>
      <View style={projectHeaderStyles.row}>
        {!!roomName && (
          <View style={[projectHeaderStyles.box, projectHeaderStyles.name]}>
            <Text style={projectHeaderStyles.text}>{roomName}</Text>
          </View>
        )}
        {!!totalPrice && (
          <View style={[projectHeaderStyles.box, projectHeaderStyles.price]}>
            <Text style={projectHeaderStyles.text}>{totalPrice}</Text>
          </View>
        )}
      </View>
    </View>
  );
};
