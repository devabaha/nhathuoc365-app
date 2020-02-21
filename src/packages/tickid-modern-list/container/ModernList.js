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
    containerStyle: PropTypes.object,
    headerWrapperStyle: PropTypes.object,
    headerComponent: PropTypes.node,
    headerLeftComponent: PropTypes.node,
    headerRightComponent: PropTypes.node,
    renderItem: PropTypes.func,
    onPressItem: PropTypes.func
  };

  static defaultProps = {
    headerTitle: '',
    listScrollable: false,
    data: [],
    mainKey: '',
    type: LIST_TYPE.NORMAL,
    containerStyle: {},
    headerWrapperStyle: {},
    headerComponent: null,
    headerLeftComponent: null,
    headerRightComponent: null,
    renderItem: DEFAULT_LISTENER,
    onPressItem: DEFAULT_LISTENER
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
      />
    );
  }
}

export default ModernList;
