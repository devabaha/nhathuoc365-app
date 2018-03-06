/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Alert
} from 'react-native';

// library
import Icon from 'react-native-vector-icons/FontAwesome';
import store from '../../store/Store';

export default class StoreSuggest extends Component {
  constructor(props) {
    super(props);

    this.state = {
      suggest_data: null,
      isHide: false
    }
  }

  componentDidMount() {
    this._getData();
  }

  async _getData() {
    try {
      var response = await APIHandler.user_list_suggest_site();
      if (response && response.status == STATUS_SUCCESS) {
        this.setState({
          suggest_data: response.data
        });
      } else {
        this.setState({
          isHide: true
        });
      }

      layoutAnimation();
    } catch (e) {
      console.warn(e + ' user_list_suggest_site');

      store.addApiQueue('user_list_suggest_site', this._getData.bind(this));
    } finally {

    }
  }

  render() {
    var {suggest_data, isHide} = this.state;

    if (isHide) {
      return null;
    }

    return (
      <View style={styles.suggest_box}>
        <View style={styles.suggest_heading_box}>
          <View style={styles.star_box}>
            <Icon name="star" size={12} color="#ffffff" />
          </View>
          <Text style={styles.star_label}>Cửa hàng nổi bật</Text>
        </View>

        {suggest_data != null ? (
          <View style={styles.store_item_box}>
          {
            this.state.suggest_data.map((item, key) => (
              <TouchableHighlight
                key={key}
                style={[styles.store_item]}
                underlayColor="transparent"
                onPress={() => {
                  if (this.props.onPress) {
                    this.props.onPress(item);
                  }
                }}>
                <Text style={styles.store_item_title}>{item.name}</Text>
              </TouchableHighlight>
            ))
          }
          </View>
        ) : (
          <Indicator style={{marginTop: 8}} size="small" />
        )}
      </View>
    );
  }
}

StoreSuggest.propTypes = {
  onPress: PropTypes.func.isRequired
}

const styles = StyleSheet.create({
  suggest_box: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderBottomWidth: Util.pixel,
    borderColor: "#dddddd",
  },
  suggest_heading_box: {
    flexDirection: 'row',
    alignItems: "center",
    marginBottom: 4,
    borderBottomWidth: Util.pixel,
    borderColor: "#dddddd",
    paddingBottom: 14
  },
  star_box: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "orange",
    justifyContent: "center",
    alignItems: "center"
  },
  star_label: {
    fontSize: 12,
    color: "#666666",
    marginLeft: 8,
  },
  store_item_box: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  store_item: {
    borderWidth: Util.pixel,
    borderColor: DEFAULT_COLOR,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 12,
    marginTop: 12,
    borderRadius: 12
  },
  store_item_title: {
    color: DEFAULT_COLOR
  },
});
