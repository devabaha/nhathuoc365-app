import React, { Component } from 'react';
import ScanScreenComponent from '../../component/ScanScreen';

class ScanScreen extends Component {
  handleReadedCode = event => {
    // const code = event.data;
  };

  handlePressEnterCode = () => {
    //
  };

  render() {
    return (
      <ScanScreenComponent
        onReadedCode={this.handleReadedCode}
        onPressEnterCode={this.handlePressEnterCode}
      />
    );
  }
}

export default ScanScreen;
