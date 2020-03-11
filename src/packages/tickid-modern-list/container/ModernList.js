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
    extraData: PropTypes.any,
    containerStyle: PropTypes.any,
    headerWrapperStyle: PropTypes.any,
    headerTitleStyle: PropTypes.any,
    activeStyle: PropTypes.any,
    activeTextStyle: PropTypes.any,
    disabledStyle: PropTypes.any,
    disabledTextStyle: PropTypes.any,
    bodyWrapperStyle: PropTypes.any,
    headerComponent: PropTypes.node,
    headerLeftComponent: PropTypes.node,
    headerRightComponent: PropTypes.node,
    renderItem: PropTypes.any,
    onPressItem: PropTypes.func,
    onBodyLayout: PropTypes.func,
    listEmptyComponent: PropTypes.node
  };

  static defaultProps = {
    headerTitle: '',
    listScrollable: false,
    data: [],
    mainKey: '',
    type: LIST_TYPE.NORMAL,
    extraData: null,
    containerStyle: {},
    headerWrapperStyle: {},
    headerTitleStyle: {},
    activeStyle: {},
    activeTextStyle: {},
    disabledStyle: {},
    disabledTextStyle: {},
    bodyWrapperStyle: {},
    headerComponent: null,
    headerLeftComponent: null,
    headerRightComponent: null,
    renderItem: null,
    onPressItem: DEFAULT_LISTENER,
    onBodyLayout: DEFAULT_LISTENER,
    listEmptyComponent: null
  };

  state = {};

  render() {
    return (
      <ModernListComponent
        headerTitle={this.props.headerTitle}
        headerTitleStyle={this.props.headerTitleStyle}
        scrollEnabled={this.props.listScrollable}
        data={this.props.data}
        extraData={this.props.extraData}
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
        disabledStyle={this.props.disabledStyle}
        disabledTextStyle={this.props.disabledTextStyle}
        bodyWrapperStyle={this.props.bodyWrapperStyle}
        listEmptyComponent={this.props.listEmptyComponent}
      />
    );
  }
}

export default ModernList;
