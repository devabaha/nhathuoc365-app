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

// librarys
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Actions, ActionConst } from 'react-native-router-flux';
import Store from '../../store';
// components
import FindTickets from './FindTickets';
import config from 'app-config';


class AirlineTicket extends Component {
  constructor(props) {
    super(props);

    this.state = {
      finish: false
    }
  }

  componentDidMount() {

    // get place data
    // Store.getAirportData();
  }

  render() {
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
