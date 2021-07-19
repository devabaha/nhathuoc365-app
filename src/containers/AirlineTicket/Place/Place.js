import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  TouchableHighlight,
} from 'react-native';
import PropTypes from 'prop-types';
import { Actions} from 'react-native-router-flux';
import Store from '../../../store';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

@observer
class Place extends Component {
  static propTypes = {
    onSelected: PropTypes.func,
  };

  static defaultProps = {
    onSelected: (value) => value,
  };

  static onEnter = () => {};

  static onExit = () => {
    action(() => {
      Store.setPlaceData(Store.place_data_static);
    })();
  };

  componentDidMount() {
    setTimeout(() =>
      Actions.refresh({
        onChangeText: this._onChangeText,
      }),
    );
  }

  _onChangeText = (value) => {
    clearTimeout(this._timerSearch);
    if (value) {
      this._timerSearch = setTimeout(() => {
        Store.getAirportData({
          query: value,
        });
      }, 300);
    } else {
      action(() => {
        Store.setPlaceData(Store.place_data_static);
      })();
    }
  };

  _onSelected(item) {
    this.props.onSelected(item);
    Actions.pop();
  }

  _renderItem = ({ item, index }) => {
    return (     
      <TouchableHighlight
        onPress={this._onSelected.bind(this, item)}
        underlayColor="transparent">
        <View
          style={{
            height: 60,
            justifyContent: 'center',
            paddingHorizontal: 15,
            backgroundColor: '#ffffff',
            borderBottomWidth: Util.pixel,
            borderColor: '#dddddd',
          }}>
          <Text
            style={{
              fontSize: 16,
              color: '#404040',
            }}>{`${item.city_name_vi}, ${item.country_name_vi}`}</Text>
          <Text
            style={{
              fontSize: 12,
              color: '#999999',
            }}>{`${item.code} - ${item.name_vi}`}</Text>
        </View>
      </TouchableHighlight>
    );
  };

  renderSectionHeader = ({ section }) => {
    return (
      <View
        style={{
          backgroundColor: '#f1f1f1',
          justifyContent: 'center',
          paddingHorizontal: 15,
          height: 36,
          borderBottomWidth: Util.pixel,
          borderColor: '#dddddd',
        }}>
        <Text
          style={{
            fontSize: 16,
            color: '#666666',
            fontWeight: '500',
          }}>
          {section.title}
        </Text>
      </View>
    );
  };

  render() {
    var { place_data, formattedList } = Store;
    return (
      <View style={styles.container}>
        {place_data ? (
          <SectionList
            keyboardShouldPersistTaps="always"
            style={{
              marginBottom: Store.keyboardTop,
            }}
            renderItem={this._renderItem}
            renderSectionHeader={this.renderSectionHeader}
            sections={formattedList}
            keyExtractor={(item) => item.id}
          />
        ) : (
          <View style={styles.noValue}>
            <Icon style={styles.icon} name="airplane-off" size={40} color='#666666' />
              <Text style={styles.textValue} >Chưa có sân bay</Text>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flex: 1,
  },
  noValue: {
    alignContent:'center',
    justifyContent:'center',
    alignItems:'center',
  },
  textValue: {
    marginTop:5,
    fontSize:14,
    color:'#666666'
  }
});
export default Place;