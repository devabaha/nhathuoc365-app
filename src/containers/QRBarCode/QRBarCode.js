import React, { Component } from 'react';
import QRBarCodeComponent from '../../components/QRBarCode';
import mobxStore from 'app-store';

class QRBarCode extends Component {
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
        isEnterCode={this.props.isEnterCode}
        isVisibleBtnEnterCode={this.props.isVisibleBtnEnterCode}
      />
    );
  }
}

export default QRBarCode;
