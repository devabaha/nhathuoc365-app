import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
// 3-party libs
import {withTranslation} from 'react-i18next';
// configs
import store from 'app-store';
import appConfig from 'app-config';
// helpers
import {updateNavbarTheme} from 'src/Themes/helper/updateNavBarTheme';
import {getTheme} from 'src/Themes/Theme.context';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// custom components
import FindTickets from '../AirlineTicket/component/FindTicket';
import {ScreenWrapper, Container, ScrollView} from 'src/components/base';
import Button from 'src/components/Button';

class AirlineTicket extends Component {
  static contextType = ThemeContext;

  state = {
    finish: false,
  };
  updateNavBarDisposer = () => {};

  get theme() {
    return getTheme(this);
  }

  componentDidMount() {
    this._getData();
    store.getAirportData();

    this.updateNavBarDisposer = updateNavbarTheme(
      this.props.navigation,
      this.theme,
    );
  }

  componentWillUnmount() {
    this.updateNavBarDisposer();
  }

  _getData = async () => {
    try {
      var response = await APIHandler.site_info();
      if (response && response.status == STATUS_SUCCESS) {
        action(() => {
          store.setSiteData(response.data);
        })();
      }
    } catch (e) {
      console.warn(e);
    } finally {
      this.setState({
        finish: true,
      });

      layoutAnimation();
    }
  };

  render() {
    return (
      <ScreenWrapper style={styles.container}>
        <ScrollView>
          <FindTickets ref={(ref) => (this.ref_ticket = ref)} />
        </ScrollView>

        <Container safeLayout noBackground style={styles.boxBtnSearch}>
          <Button
            onPress={() => this.ref_ticket.onSearch()}
            title={this.props.t('modal.province.placeholder')}
          />
        </Container>
      </ScreenWrapper>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  boxBtnSearch: {
    width: appConfig.device.width,
    alignItems: 'center',
  },
});

export default withTranslation('voucher')(AirlineTicket);
