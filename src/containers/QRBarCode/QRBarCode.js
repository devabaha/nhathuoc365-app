import React, { Component } from 'react';
import QRBarCodeComponent from '../../components/QRBarCode';
import mobxStore from 'app-store';

class QRBarCode extends Component {
  render() {
    return <QRBarCodeComponent store={mobxStore} />;
  }
}

export default QRBarCode;
