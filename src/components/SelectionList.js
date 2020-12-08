import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableHighlight
} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import store from '../store/Store';

@observer
class SelectionList extends Component {
  render() {
    var { data, containerStyle } = this.props;

    return (
      <FlatList
        ItemSeparatorComponent={() => <View style={styles.separator}></View>}
        data={data}
        style={[styles.profile_list_opt, containerStyle]}
        renderItem={({ item }) => {
          if (item.isHidden) {
            return null;
          }

          if (typeof item.render === 'function') {
            return item.render();
          }

          var notifyCount = 0;
          if (item.notify) {
            notifyCount = parseInt(store.notify[item.notify]);
          }

          let Icon = FontAwesomeIcon;
          switch (item.iconType) {
            case 'MaterialCommunityIcons':
              Icon = MaterialCommunityIcons;
              break;
          }

          return (
            <TouchableHighlight
              underlayColor="transparent"
              onPress={item.onPress}
            >
              <>
                <View
                  style={[
                    styles.profile_list_opt_btn,
                    {
                      marginTop: item.marginTop ? 8 : 0,
                      borderTopWidth: item.marginTop ? Util.pixel : 0,
                      borderColor: '#dddddd'
                    },
                    item.containerStyle
                  ]}
                >
                  <View
                    style={[styles.profile_list_icon_box, item.boxIconStyle]}
                  >
                    <Icon
                      name={item.icon}
                      size={item.iconSize || 16}
                      color={item.iconColor || '#999999'}
                    />
                  </View>

                  <View style={styles.labelContainer}>
                    <Text
                      {...item.labelProps}
                      style={[styles.profile_list_label, item.labelStyle]}
                    >
                      {item.label}
                    </Text>
                    {!!item.desc && (
                      <Text
                        {...item.desProps}
                        style={[
                          styles.profile_list_small_label,
                          item.descStyle
                        ]}
                      >
                        {item.desc}
                      </Text>
                    )}
                  </View>

                  {!item.hideAngle && (
                    <View
                      style={[
                        styles.profile_list_icon_box,
                        styles.profile_list_icon_box_angle
                      ]}
                    >
                      {item.rightIcon || (
                        <Icon name="angle-right" size={16} color="#999999" />
                      )}
                    </View>
                  )}

                  {notifyCount > 0 && (
                    <View style={styles.stores_info_action_notify}>
                      <Text style={styles.stores_info_action_notify_value}>
                        {notifyCount}
                      </Text>
                    </View>
                  )}
                </View>

                {typeof item.renderAfter === 'function' && item.renderAfter()}
              </>
            </TouchableHighlight>
          );
        }}
      />
    );
  }
}

SelectionList.propTypes = {
  data: PropTypes.array.isRequired
};

const styles = StyleSheet.create({
  profile_list_opt: {
    // borderTopWidth: Util.pixel,
    // borderBottomWidth: Util.pixel,
    // borderColor: '#dddddd'
  },
  profile_list_opt_btn: {
    width: Util.size.width,
    height: 52,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4
  },
  profile_list_icon_box: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
    marginLeft: 4,
    marginRight: 4
  },
  labelContainer: {
    flex: 1
  },
  profile_list_icon_box_angle: {
    paddingRight: 7,
    width: undefined,
    height: '100%'
  },
  profile_list_label: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '400'
  },
  profile_list_small_label: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2
  },
  separator: {
    width: '100%',
    height: Util.pixel,
    backgroundColor: '#dddddd'
  },

  stores_info_action_notify: {
    position: 'absolute',
    minWidth: 16,
    paddingHorizontal: 2,
    height: 16,
    backgroundColor: 'red',
    top: 4,
    left: 30,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 8
  },
  stores_info_action_notify_value: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600'
  }
});

export default SelectionList;
