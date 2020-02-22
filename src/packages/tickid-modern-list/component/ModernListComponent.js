import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import NormalList from './NormalList';
import TagList from './TagList';
import { LIST_TYPE } from '../constants';

class MordernListComponent extends Component {
  state = {};

  renderHeader() {
    return (
      <View style={[styles.headerContent]}>
        {this.props.headerLeftComponent}
        <Text style={styles.headerTitle}>{this.props.headerTitle}</Text>
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
      activeTextStyle: this.props.activeTextStyle
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

        <View style={[styles.container, styles.body]}>{body}</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff'
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
