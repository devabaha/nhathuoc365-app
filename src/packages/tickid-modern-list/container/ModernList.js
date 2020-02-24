import React, { Component } from 'react';
import ModernListComponent from '../component';
import PropTypes from 'prop-types';
import { LIST_TYPE, DEFAULT_LISTENER } from '../constants';

class ModernList extends Component {
  static propTypes = {
    headerTitle: PropTypes.string,
    listScrollable: PropTypes.bool,
    data: PropTypes.array,
    mainKey: PropTypes.string,
    type: PropTypes.oneOf([LIST_TYPE.NORMAL, LIST_TYPE.TAG]),
    containerStyle: PropTypes.any,
    headerWrapperStyle: PropTypes.any,
    activeStyle: PropTypes.any,
    activeTextStyle: PropTypes.any,
    bodyWrapperStyle: PropTypes.any,
    headerComponent: PropTypes.node,
    headerLeftComponent: PropTypes.node,
    headerRightComponent: PropTypes.node,
    renderItem: PropTypes.func,
    onPressItem: PropTypes.func,
    onBodyLayout: PropTypes.func
  };

  static defaultProps = {
    headerTitle: '',
    listScrollable: false,
    data: [],
    mainKey: '',
    type: LIST_TYPE.NORMAL,
    containerStyle: {},
    headerWrapperStyle: {},
    activeStyle: {},
    activeTextStyle: {},
    bodyWrapperStyle: {},
    headerComponent: null,
    headerLeftComponent: null,
    headerRightComponent: null,
    renderItem: DEFAULT_LISTENER,
    onPressItem: DEFAULT_LISTENER,
    onBodyLayout: DEFAULT_LISTENER
  };

  state = {};

  render() {
    return (
      <ModernListComponent
        headerTitle={this.props.headerTitle}
        scrollEnabled={this.props.listScrollable}
        data={this.props.data}
        mainKey={this.props.mainKey}
        type={this.props.type}
        containerStyle={this.props.containerStyle}
        headerComponent={this.props.headerComponent}
        headerWrapperStyle={this.props.headerWrapperStyle}
        headerRightComponent={this.props.headerRightComponent}
        headerLeftComponent={this.props.headerLeftComponent}
        renderItem={this.props.renderItem}
        onPressItem={this.props.onPressItem}
        onBodyLayout={this.props.onBodyLayout}
        activeStyle={this.props.activeStyle}
        activeTextStyle={this.props.activeTextStyle}
        bodyWrapperStyle={this.props.bodyWrapperStyle}
      />
    );
  }
}

export default ModernList;
