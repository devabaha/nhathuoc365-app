import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, RefreshControl } from 'react-native';
import Loading from '../../../components/Loading';
import NoResult from '../../../components/NoResult';
import HomeCardList, {
  HomeCardItem
} from '../../../components/Home/component/HomeCardList';
import { Actions } from 'react-native-router-flux';
import appConfig from 'app-config';
import store from 'app-store';
import WebviewProjectFooter from './WebviewProjectFooter';

const IMAGE_HEIGHT = (appConfig.device.width - 32) / 2;

class ListProject extends Component {
  state = {
    loading: true,
    buildings: null
  };
  unmounted = false;

  get isBuildingEmpty() {
    return this.state.buildings && this.state.buildings.length === 0;
  }

  componentDidMount() {
    this.getListBuilding();
    EventTracker.logEvent('list_building');
  }

  getListBuilding = async () => {
    const { t } = this.props;
    try {
      const response = await APIHandler.user_list_beeland();
      console.log(response);
      if (!this.unmounted && response) {
        if (response.status === STATUS_SUCCESS && response.data) {
          this.setState({ buildings: response.data.list_building });
        } else {
          flashShowMessage({
            type: 'danger',
            message: response.message || t('api.error.message')
          });
        }
        return;
      }
      this.setState({ buildings: [] });
    } catch (err) {
      console.log('get_list_beeland', err);
    } finally {
      !this.unmounted &&
        this.setState({
          loading: false,
          refreshing: false
        });
    }
  };

  onPressBuilding(building) {
    Actions.webview({
      showLoading: false,
      title: building.name,
      url: building.link_web,
      renderAfter: () => this.renderProjectFooter(building)
    });
  }

  goToProductTable = building => {
    Actions.push(appConfig.routes.projectProductBeeLand, {
      siteId: building.site_id,
      projectCode: building.code,
      title: building.name,
      staff: building.staff,
      tel: building.hotline
    });
  };

  onRefresh = () => {
    this.setState({ refreshing: true });
    this.getListBuilding();
  };

  renderProjectFooter(building) {
    return (
      <WebviewProjectFooter
        tel={building.hotline}
        siteId={building.site_id}
        userId={store.user_info.id}
        name={building.name}
        onCheckPress={() => this.goToProductTable(building)}
      />
    );
  }

  renderBuilding(building) {
    const imageStyle = {
      height: IMAGE_HEIGHT,
      borderRadius: 0
    };
    return (
      <HomeCardItem
        containerStyle={styles.buildingContainer}
        textWrapperStyle={styles.textWrapperStyle}
        imageStyle={imageStyle}
        title={building.name}
        subTitle={building.address}
        imageUrl={building.image_url}
        onPress={() => this.onPressBuilding(building)}
      />
    );
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        {this.state.loading && <Loading center />}
        {!!this.isBuildingEmpty ? (
          <NoResult />
        ) : (
          <HomeCardList
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh}
              />
            }
            containerStyle={styles.buildingWrapper}
            onShowAll={false}
            horizontal={false}
            data={this.state.buildings}
          >
            {({ item }) => this.renderBuilding(item)}
          </HomeCardList>
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  buildingWrapper: {
    flex: 1,
    paddingVertical: 0,
    paddingBottom: 0,
    marginTop: 0
  },
  buildingContainer: {
    flex: 1,
    width: null,
    marginRight: 16,
    marginVertical: 15,
    paddingBottom: 15,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: '#fff',
    ...elevationShadowStyle(5)
  },
  textWrapperStyle: {
    paddingHorizontal: 15,
    paddingVertical: 7
  }
});

export default withTranslation()(ListProject);
