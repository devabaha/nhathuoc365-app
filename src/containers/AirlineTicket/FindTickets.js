/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Switch
} from 'react-native';

// library
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Actions, ActionConst } from 'react-native-router-flux';
import Store from '../../store';

class FindTickets extends Component {

  constructor(props) {
    super(props);

    var date = new Date();
    var from_date = dateHandler(date.setDate(date.getDate() + 1));
    var to_date = dateHandler(date.setDate(date.getDate() + 2));

    this.state = {
      khu_hoi: true,
      from: 'HAN',
      from_view: 'Hà Nội (HAN)',
      to: 'SGN',
      to_view: 'Hồ Chí Minh (SGN)',
      from_date: {
        date: from_date.date,
        dateString: from_date.dateString,
        current: from_date.current
      },
      to_date: {
        date: to_date.date,
        dateString: to_date.dateString,
        current: to_date.current
      },
      nguoi_lon: 1,
      tre_em: 0,
      tre_so_sinh: 0
    }
  }

  componentDidMount() {

  }

  _khuHoiChange(value) {
    this.setState({
      khu_hoi: value
    });
    layoutAnimation();
  }

  _fromSelected(item) {
    this.setState({
      from: item.code,
      from_view: `${item.city_name_vi} (${item.code})`
    });
  }

  _toSelected(item) {
    this.setState({
      to: item.code,
      to_view: `${item.city_name_vi} (${item.code})`
    });
  }

  _placeSwitch() {
    this.setState(prevState => ({
      from: prevState.to,
      from_view: prevState.to_view,
      to: prevState.from,
      to_view: prevState.from_view
    }));
  }

  onSearch = () => {
    var {
      khu_hoi,
      from,
      from_view,
      to,
      to_view,
      from_date,
      to_date,
      nguoi_lon,
      tre_em,
      tre_so_sinh
    } = this.state;

    var params = '';
    if (khu_hoi) {
      params = `${from}-${to}-${from_date.date}-${to_date.date}-${nguoi_lon}-${tre_em}-${tre_so_sinh}`;
    } else {
      params = `${from}-${to}-${from_date.date}-${nguoi_lon}-${tre_em}-${tre_so_sinh}`;
    }

    var url = Store.site_data.result_url + '?Request=' + params;

    Actions.result({
      title: `${from_view} - ${to_view}`,
      url
    });
  }

  _fromDateSelected() {
    var { from_date, to_date, khu_hoi } = this.state;

    Actions.datePicker({
      current: from_date.current,
      onSelected: value => {
        var date = dateHandler(value);

        var _from_date, _to_date;
        _from_date = {
          date: date.date,
          dateString: date.dateString,
          current: date.current
        }
        _to_date = to_date;

        const cal_date = () => {
          var date = new Date(_from_date.current);
          var cal_from_date = dateHandler(date.setDate(date.getDate() + 2));

          _to_date = {
            date: cal_from_date.date,
            dateString: cal_from_date.dateString,
            current: cal_from_date.current
          }
        }

        if (khu_hoi) {
          if (_from_date.current > to_date.current) {
            cal_date();
          }
        } else {
          cal_date();
        }

        this.setState({
          from_date: _from_date,
          to_date: _to_date
        });
      }
    });
  }

  _toDateSelected() {
    var { to_date, from_date } = this.state;

    Actions.datePicker({
      current: to_date.current,
      minDate: from_date.current,
      onSelected: value => {
        var date = dateHandler(value);

        this.setState({
          to_date: {
            date: date.date,
            dateString: date.dateString,
            current: date.current
          }
        });
      }
    });
  }

  render() {
    var {
      khu_hoi,
      from_view,
      to_view,
      from_date,
      to_date,
      nguoi_lon,
      tre_em,
      tre_so_sinh
    } = this.state;

    var customer_to_string = [];
    if (nguoi_lon) {
      customer_to_string.push(nguoi_lon + ' người lớn');
    }
    if (tre_em) {
      customer_to_string.push(tre_em + ' trẻ em');
    }
    if (tre_so_sinh) {
      customer_to_string.push(tre_so_sinh + ' trẻ sơ sinh');
    }

    customer_to_string = customer_to_string.join(', ');

    return (
      <View style={styles.container}>
        <View>
          <View style={[styles.groupInput, {
            marginTop: 0
          }]}>
            <View style={styles.boxIcon}>
              <Icon style={styles.icon} name="flight-takeoff" size={24} color={DEFAULT_COLOR} />
            </View>

            <TouchableHighlight
              onPress={() => {
                Actions.place({
                  onSelected: this._fromSelected.bind(this)
                });
              }}
              underlayColor="transparent"
              style={styles.boxInput}>
              <View style={[styles.boxBtn, {
                width: Util.size.width - BOX_ICON_WIDTH - 50
              }]}>
                <Text style={styles.inputLabel}>Điểm khởi hành</Text>
                <Text style={styles.inputValue}>{from_view}</Text>
              </View>
            </TouchableHighlight>
          </View>

          <View style={styles.groupInput}>
            <View style={styles.boxIcon}>
              <Icon style={styles.icon} name="flight-land" size={24} color={DEFAULT_COLOR} />
            </View>

            <TouchableHighlight
              onPress={() => {
                Actions.place({
                  onSelected: this._toSelected.bind(this)
                });
              }}
              underlayColor="transparent"
              style={styles.boxInput}>
              <View style={styles.boxBtn}>
                <Text style={styles.inputLabel}>Điểm đến</Text>
                <Text style={styles.inputValue}>{to_view}</Text>
              </View>
            </TouchableHighlight>
          </View>

          <TouchableHighlight
            onPress={this._placeSwitch.bind(this)}
            underlayColor="transparent"
            style={styles.switchBtn}>
            <View style={styles.switchBtnContent}>
              <Icon name="swap-vert" size={24} color="#ffffff" />
            </View>
          </TouchableHighlight>
        </View>

        <View style={styles.groupInput}>
          <View style={styles.boxIcon}>
            <Icon style={styles.icon} name="date-range" size={24} color={DEFAULT_COLOR} />
          </View>

          <TouchableHighlight
            onPress={this._fromDateSelected.bind(this)}
            underlayColor="transparent"
            style={styles.boxInput}>
            <View style={[styles.boxBtn, {
              width: Util.size.width - BOX_ICON_WIDTH - 80
            }]}>
              <Text style={styles.inputLabel}>Ngày đi</Text>
              <Text style={styles.inputValue}>{from_date.dateString}</Text>
            </View>
          </TouchableHighlight>

          <View style={styles.boxKhuHoi}>
            <Text style={styles.textKhuHoi}>Khứ hồi?</Text>

            <Switch
              onValueChange={this._khuHoiChange.bind(this)}
              onTintColor="#0071ce"
              value={khu_hoi} />
          </View>
        </View>

        <View style={[styles.groupInput, {
          height: khu_hoi ? ROW_HEIGHT : 0,
          marginTop: khu_hoi ? 8 : 0
        }]}>
          <View style={styles.boxIcon}>
            <Icon style={styles.icon} name="date-range" size={24} color={DEFAULT_COLOR} />
          </View>

          <TouchableHighlight
            onPress={this._toDateSelected.bind(this)}
            underlayColor="transparent"
            style={styles.boxInput}>
            <View style={styles.boxBtn}>
              <Text style={styles.inputLabel}>Ngày về</Text>
              <Text style={styles.inputValue}>{to_date.dateString}</Text>
            </View>
          </TouchableHighlight>
        </View>

        <View style={styles.groupInput}>
          <View style={styles.boxIcon}>
            <Icon style={styles.icon} name="supervisor-account" size={24} color={DEFAULT_COLOR} />
          </View>

          <TouchableHighlight
            onPress={() => {
              Actions.customer({
                nguoi_lon,
                tre_em,
                tre_so_sinh,
                onSelected: ({nguoi_lon, tre_em, tre_so_sinh}) => {
                  this.setState({
                    nguoi_lon, tre_em, tre_so_sinh
                  });
                }
              });
            }}
            underlayColor="transparent"
            style={styles.boxInput}>
            <View style={styles.boxBtn}>
              <Text style={styles.inputLabel}>Hành khách</Text>
              <Text style={styles.inputValue}>{customer_to_string}</Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const ROW_HEIGHT = 64;
const BOX_ICON_WIDTH = 42;

const styles = StyleSheet.create({
  container: {
    width: Util.size.width
  },
  groupInput: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 8,
    height: ROW_HEIGHT,
    overflow: 'hidden',
    backgroundColor: '#F5FCFF'
  },
  boxIcon: {
    width: BOX_ICON_WIDTH,
    height: ROW_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {
    marginTop: 24,
    marginLeft: 4
  },
  boxBtn: {
    borderColor: '#b8b8b8',
    borderBottomWidth: Util.pixel,
    width: Util.size.width - BOX_ICON_WIDTH - 16,
    height: '100%'
  },
  inputLabel: {
    color: '#888888',
    fontSize: 14,
    marginTop: 12
  },
  inputValue: {
    marginTop: 8,
    color: '#404040',
    fontSize: 16
  },
  switchBtn: {
    position: 'absolute',
    top: 42,
    right: 8,
    padding: 8
  },
  switchBtnContent: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#0071ce',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  boxKhuHoi: {
    width: 70,
    height: '100%',
    marginLeft: 10
  },
  textKhuHoi: {
    color: '#909090',
    fontSize: 14,
    marginBottom: 4
  }
});
export default FindTickets;