import React, {Component} from 'react';
// configs
import appConfig from 'app-config';
// routing
import {push, pop, reset} from 'app-helper/routing';
// custom components
import {default as StoreLocationComponent} from 'src/components/StoreLocation';
import Loading from 'src/components/Loading';
import {ScreenWrapper, ScrollView} from 'src/components/base';

class StoreLocation extends Component {
  state = {
    loading: true,
    locations: [],
    selectedLocation: null,
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
          const locations = this.formatLocations([
            {
              // image: 'https://images.ctfassets.net/hrltx12pl8hq/7yQR5uJhwEkRfjwMFJ7bUK/dc52a0913e8ff8b5c276177890eb0129/offset_comp_772626-opt.jpg?fit=fill&w=800&h=300',
              name: 'test1 uio',
              districts: [
                {
                  district_name: 'Nguyen Trai, Thanh Xuan',
                  name: 'Ha Noi',
                },
              ],
            },
            {
              image:
                'https://images.ctfassets.net/hrltx12pl8hq/7yQR5uJhwEkRfjwMFJ7bUK/dc52a0913e8ff8b5c276177890eb0129/offset_comp_772626-opt.jpg?fit=fill&w=800&h=300',
              name: 'test1',
            },
            {
              image:
                'https://images.ctfassets.net/hrltx12pl8hq/7yQR5uJhwEkRfjwMFJ7bUK/dc52a0913e8ff8b5c276177890eb0129/offset_comp_772626-opt.jpg?fit=fill&w=800&h=300',
              name: 'test1',
            },
            {
              image:
                'https://images.ctfassets.net/hrltx12pl8hq/7yQR5uJhwEkRfjwMFJ7bUK/dc52a0913e8ff8b5c276177890eb0129/offset_comp_772626-opt.jpg?fit=fill&w=800&h=300',
              name: 'test1',
            },
            {
              image:
                'https://images.ctfassets.net/hrltx12pl8hq/7yQR5uJhwEkRfjwMFJ7bUK/dc52a0913e8ff8b5c276177890eb0129/offset_comp_772626-opt.jpg?fit=fill&w=800&h=300',
              name: 'test1',
            },
            {
              image:
                'https://images.ctfassets.net/hrltx12pl8hq/7yQR5uJhwEkRfjwMFJ7bUK/dc52a0913e8ff8b5c276177890eb0129/offset_comp_772626-opt.jpg?fit=fill&w=800&h=300',
              name: 'test1',
            },
            {
              image:
                'https://images.ctfassets.net/hrltx12pl8hq/7yQR5uJhwEkRfjwMFJ7bUK/dc52a0913e8ff8b5c276177890eb0129/offset_comp_772626-opt.jpg?fit=fill&w=800&h=300',
              name: 'test1',
            },
            {
              image:
                'https://images.ctfassets.net/hrltx12pl8hq/7yQR5uJhwEkRfjwMFJ7bUK/dc52a0913e8ff8b5c276177890eb0129/offset_comp_772626-opt.jpg?fit=fill&w=800&h=300',
              name: 'test1',
            },
            {
              image:
                'https://images.ctfassets.net/hrltx12pl8hq/7yQR5uJhwEkRfjwMFJ7bUK/dc52a0913e8ff8b5c276177890eb0129/offset_comp_772626-opt.jpg?fit=fill&w=800&h=300',
              name: 'test1',
            },
            {
              image:
                'https://images.ctfassets.net/hrltx12pl8hq/7yQR5uJhwEkRfjwMFJ7bUK/dc52a0913e8ff8b5c276177890eb0129/offset_comp_772626-opt.jpg?fit=fill&w=800&h=300',
              name: 'test1',
            },
          ]);
          this.setState({locations});
        }
      }
    } catch (err) {
      console.log('getLocations', err);
    } finally {
      !this.unmounted && this.setState({loading: false});
    }
  };

  formatLocations(locations) {
    locations.forEach((location) => {
      if (location.districts) {
        location.districts.forEach((district) => {
          district.title = district.district_name;
          district.description = district.name;
        });
      }
    });

    return locations;
  }

  handleSelectLocation = async (location) => {
    try {
      const response = await APIHandler.user_choose_store_location(
        location.site_id,
      );
      if (!this.unmounted) {
        if (response && response.status === STATUS_SUCCESS) {
          reset(appConfig.routes.sceneWrapper);
        }
      }
    } catch (err) {
      console.log('getLocations', err);
    } finally {
      !this.unmounted && this.setState({loading: false});
    }
  };

  onPressLocation = (selectedLocation) => {
    if (selectedLocation.districts) {
      this.setState({selectedLocation});

      const districts = selectedLocation ? selectedLocation.districts : [];

      const title = selectedLocation ? selectedLocation.name : '';

      push(appConfig.routes.modalList, {
        heading: title,
        data: districts,
        modalStyle: {height: null},
        onCloseModal: this.onCloseModal.bind(this),
        onPressItem: this.handleSelectLocation,
      });
    } else {
      this.handleSelectLocation({site_id: selectedLocation.site_id});
    }
  };

  onCloseModal() {
    pop();
    this.setState({selectedLocation: null});
  }

  render() {
    return (
      <ScreenWrapper>
        {this.state.loading && <Loading center />}
        <ScrollView safeLayout>
          <StoreLocationComponent
            onPressLocation={this.onPressLocation}
            locations={this.state.locations}
            numColumn={2}
          />
        </ScrollView>
      </ScreenWrapper>
    );
  }
}

export default StoreLocation;
