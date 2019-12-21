import React, { Component } from 'react';
import {
  StyleSheet,
  ViewPropTypes,
  Text,
  Dimensions,
  TouchableOpacity,
  View,
  Image
} from 'react-native';
import PropTypes from 'prop-types';
const { width: WIDTH, height: HEIGHT } = Dimensions.get('screen');

const defaultListener = () => {};

class AlbumItem extends Component {
  static propTypes = {
    leftStyle: ViewPropTypes.style,
    onPress: PropTypes.func,
    title: PropTypes.string,
    subTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    rightComponent: PropTypes.node,
    coverSource: PropTypes.any.isRequired
  };

  static defaultProps = {
    leftStyle: {},
    onPress: defaultListener,
    title: '',
    subTitle: '',
    rightComponent: <Text>\/</Text>
  };

  state = {};

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState !== this.state) {
      return true;
    }
    if (
      nextProps.leftStyle !== this.props.leftStyle ||
      nextProps.title !== this.props.title ||
      nextProps.subTitle !== this.props.subTitle ||
      nextProps.rightComponent !== this.props.rightComponent
    ) {
      return true;
    }

    return false;
  }

  render() {
    return (
      <TouchableOpacity
        style={[styles.container]}
        onPress={() => this.props.onPress()}
      >
        <View style={[styles.wrapper]}>
          <View style={[styles.leftWrapper, this.props.leftStyle]}>
            <Image style={styles.leftContent} source={this.props.coverSource} />
          </View>
          <View style={[styles.centerWrapper]}>
            <Text numberOfLines={1} style={[styles.title]}>
              {this.props.title}
            </Text>
            <Text numberOfLines={1} style={[styles.subTitle]}>
              {this.props.subTitle}
            </Text>
          </View>
          <View style={[styles.rightWrapper]}>{this.props.rightComponent}</View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: WIDTH,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#d9d9d9'
  },
  wrapper: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  leftWrapper: {
    flex: 0.2
  },
  leftContent: {
    height: '95%',
    width: '95%',
    left: 0,
    resizeMode: 'cover',
    top: 0
  },
  centerWrapper: {
    flex: 0.8,
    paddingLeft: 10,
    flexDirection: 'column'
  },
  rightWrapper: {
    position: 'absolute',
    right: 15,
    flexDirection: 'column'
  },
  title: {
    fontWeight: 'bold',
    color: '#404040',
    fontSize: 16
  },
  subTitle: {
    color: 'gray',
    fontSize: 14
  }
});

export default AlbumItem;
