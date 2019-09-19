import React, { Component } from 'react';
import { StatusBar } from 'react-native';
import QRBarCodeComponent from '../../components/QRBarCode';
import mobxStore from 'app-store';

class QRBarCode extends Component {
  componentDidMount() {
    StatusBar.setBarStyle('dark-content');
  }

  componentWillUnmount() {
    StatusBar.setBarStyle('light-content');
  }

  render() {
    return (
      <QRBarCodeComponent
        mobxStore={mobxStore}
        that={this.props.that}
        address={this.props.address}
        index={this.props.index}
        wallet={this.props.wallet}
        from={this.props.from}
        title={this.props.title}
        content={this.props.content}
      />
    );
  }
}

export default QRBarCode;
