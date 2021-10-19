/* @flow */

import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  ScrollView,
} from 'react-native';

import Store from '../../store';
import FindTickets from '../AirlineTicket/component/FindTicket';
import appConfig from 'app-config';

class AirlineTicket extends Component {
  constructor(props) {
    super(props);

    this.state = {
      finish: false,
    };
  }

  componentDidMount() {
    this._getData();
    Store.getAirportData();
  }

  _getData = async () => {
    try {
      var response = await APIHandler.site_info();
      if (response && response.status == STATUS_SUCCESS) {
        action(() => {
          Store.setSiteData(response.data);
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
      <View style={styles.container}>
        <ScrollView>
          <FindTickets ref={(ref) => (this.ref_ticket = ref)} />
        </ScrollView>

        <View style={styles.boxBtnSearch}>
          <TouchableHighlight
            onPress={() => this.ref_ticket.onSearch()}
            underlayColor="transparent">
            <View style={styles.btnSearchContent}>
              <Text style={styles.textBtnSearch}>Tìm kiếm</Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  boxBtnSearch: {
    width: Util.size.width,
    alignItems: 'center',
    marginBottom: 20,
  },
  btnSearchContent: {
    width: Util.size.width * 0.916,
    height: Util.size.width * 0.916 * 0.1515,
    backgroundColor: appConfig.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  textBtnSearch: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
export default AirlineTicket;
