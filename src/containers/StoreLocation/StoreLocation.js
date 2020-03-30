import React, { Component } from 'react';
import { default as StoreLocationComponent } from '../../components/StoreLocation';
import { Actions } from 'react-native-router-flux';
import appConfig from 'app-config';
import Loading from '../../components/Loading';

class StoreLocation extends Component {
  state = {
    loading: true,
    locations: [],
    selectedLocation: null
  };
  unmounted = false;

  componentDidMount() {
    this.getLocations();
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  getLocations = async () => {
    try {
      const response = await APIHandler.user_list_store_location();
      if (!this.unmounted) {
        if (response && response.status === STATUS_SUCCESS && response.data) {
          const locations = this.formatLocations(response.data);
          this.setState({ locations });
        }
      }
    } catch (err) {
      console.log('getLocations', err);
    } finally {
      !this.unmounted && this.setState({ loading: false });
    }
  };

  formatLocations(locations) {
    locations.forEach(location => {
      if (location.districts) {
        location.districts.forEach(district => {
          district.title = district.district_name;
          district.description = district.name;
        });
      }
    });

    return locations;
  }

  handleSelectLocation = async location => {
    try {
      const response = await APIHandler.user_choose_store_location(
        location.site_id
      );
      if (!this.unmounted) {
        if (response && response.status === STATUS_SUCCESS) {
          Actions.reset(appConfig.routes.sceneWrapper);
        }
      }
    } catch (err) {
      console.log('getLocations', err);
    } finally {
      !this.unmounted && this.setState({ loading: false });
    }
  };

  onPressLocation = selectedLocation => {
    if (selectedLocation.districts) {
      this.setState({ selectedLocation });

      const districts = selectedLocation ? selectedLocation.districts : [];

      const title = selectedLocation ? selectedLocation.name : '';

      Actions.push(appConfig.routes.modalList, {
        heading: title,
        data: districts,
        onCloseModal: this.onCloseModal.bind(this),
        onPressItem: this.handleSelectLocation
      });
    } else {
      this.handleSelectLocation({ site_id: selectedLocation.site_id });
    }
  };

  onCloseModal() {
    Actions.pop();
    this.setState({ selectedLocation: null });
  }

  render() {
    return (
      <>
        {this.state.loading && <Loading center />}
        <StoreLocationComponent
          onPressLocation={this.onPressLocation}
          locations={this.state.locations}
          numColumn={2}
        />
      </>
    );
  }
}

export default StoreLocation;
