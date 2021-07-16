/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  ScrollView,
  Switch
} from 'react-native';

import { Actions, ActionConst } from 'react-native-router-flux';
import Store from '../../store';
import FindTickets from './FindTicket/FindTickets';
import config from 'app-config';

class AirlineTicket extends Component {
  constructor(props) {
    super(props);

    this.state = {
      finish: false
    }
  }

  componentDidMount() {
    this._getData();
    Store.getAirportData();
  }


  _getData = async () => {
    try {
      var response = await APIHandler.site_info();
      console.log('responseS',response);
      if (response && response.status == STATUS_SUCCESS) {
        action(() => {
          Store.setSiteData(response.data);
        })();
      }
    } catch (e) {
      console.log('responseS');
      console.warn(e);
    } finally {
      console.log('responseS');
      this.setState({
        finish: true,
      });

      layoutAnimation();
    }
  };

  render() {
    console.log('Store',Store.getAirportData())
    return (
      <View style={styles.container}>
        <ScrollView>
          <FindTickets ref={ref => this.ref_ticket = ref} />
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
     backgroundColor: '#fff'
  },
  boxBtnSearch: {
    width: Util.size.width,
    alignItems: 'center',
    marginBottom: 20
  },
  btnSearchContent: {
    width: Util.size.width * 0.916,
    height: Util.size.width * 0.916 * 0.1515,
    backgroundColor: config._primaryColor,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5
  },
  textBtnSearch: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600'
  }
});
export default AirlineTicket;
