import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import NormalList from './NormalList';
import TagList from './TagList';
import { LIST_TYPE } from '../constants';
import Animated from 'react-native-reanimated';

class MordernListComponent extends Component {
  state = {};

  renderHeader() {
    return (
      <View style={[styles.headerContent]}>
        {this.props.headerLeftComponent}
        <Text style={[styles.headerTitle, this.props.headerTitleStyle]}>
          {this.props.headerTitle}
        </Text>
        {this.props.headerRightComponent}
      </View>
    );
  }

  renderBody() {
    const props = {
      data: this.props.data,
      mainKey: this.props.mainKey,
      scrollEnabled: this.props.scrollEnabled,
      onPressItem: this.props.onPressItem,
      activeStyle: this.props.activeStyle,
      activeTextStyle: this.props.activeTextStyle,
      disabledStyle: this.props.disabledStyle,
      disabledTextStyle: this.props.disabledTextStyle,
      renderItem: this.props.renderItem,
      extraData: this.props.extraData,
      listEmptyComponent: this.props.listEmptyComponent
    };
    switch (this.props.type) {
      case LIST_TYPE.NORMAL:
        return <NormalList {...props} />;
      case LIST_TYPE.TAG:
        return <TagList {...props} />;
      default:
        return <NormalList {...props} />;
    }
  }

  render() {
    const header = this.props.headerComponent || this.renderHeader();
    const body = this.renderBody();

    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <View style={[styles.headerWrapper, this.props.headerWrapperStyle]}>
          {header}
        </View>

        <Animated.View
          style={[styles.container, styles.body, this.props.bodyWrapperStyle]}
          onLayout={this.props.onBodyLayout}
        >
          {body}
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 0.00001
  },
  headerWrapper: {
    paddingVertical: 10,
    paddingHorizontal: 15
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerTitle: {
    fontSize: 16,
    flex: 1,
    color: '#555'
  },
  body: {}
});

export default MordernListComponent;
