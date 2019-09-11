import React, { Component } from 'react';
import PropTypes from 'prop-types';
import store from 'app-store';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { View, Text, StyleSheet, Platform } from 'react-native';

@observer
class TabIcon extends Component {
  get normalStyle() {
    return this.props.selected || this.props.iconActive
      ? styles.titleSelected
      : styles.title;
  }

  get notifyCount() {
    if (this.props.notifyKey) {
      return parseInt(store.notify[this.props.notifyKey]);
    }
    return 0;
  }

  renderNotify(notifyCount) {
    if (notifyCount > 0) {
      return (
        <View style={styles.storesInfoActionNotify}>
          <Text style={styles.storesInfoActionNotifyValue}>{notifyCount}</Text>
        </View>
      );
    }
    return null;
  }

  renderTitle() {
    return (
      <Text style={[this.normalStyle, styles.titleDefault]}>
        {this.props.iconTitle}
      </Text>
    );
  }

  renderIcon() {
    return (
      <View
        style={[
          styles.iconBox,
          Platform.OS === 'ios' ? { paddingTop: 3 } : null
        ]}
      >
        <Icon
          style={this.normalStyle}
          name={this.props.iconName}
          size={this.props.iconSize}
        />
      </View>
    );
  }

  render() {
    return (
      <View style={styles.tabIcon}>
        {this.renderIcon()}
        {this.renderTitle()}
        {this.renderNotify(this.notifyCount)}
      </View>
    );
  }
}

TabIcon.propTypes = {
  selected: PropTypes.bool,
  title: PropTypes.string,
  iconActive: PropTypes.string,
  iconTitle: PropTypes.string,
  notifyKey: PropTypes.string,
  iconSize: PropTypes.number
};

TabIcon.defaultProps = {
  selected: false,
  title: '',
  iconActive: '',
  iconTitle: '',
  notifyKey: '',
  iconSize: 24
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  tabIcon: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleSelected: {
    color: DEFAULT_COLOR
  },
  title: {
    color: '#7f7f7f'
  },
  titleDefault: {
    fontSize: 10,
    marginTop: 2,
    fontWeight: '400'
  },
  iconBox: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 4,
    width: 28,
    height: 28
  },
  storesInfoActionNotify: {
    position: 'absolute',
    minWidth: 16,
    paddingHorizontal: 2,
    height: 16,
    backgroundColor: 'red',
    top: 4,
    right: 4,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 8
  },
  storesInfoActionNotifyValue: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600'
  }
});

export default TabIcon;
