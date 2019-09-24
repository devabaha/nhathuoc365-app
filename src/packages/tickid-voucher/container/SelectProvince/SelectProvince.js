import React from 'react';
import PropTypes from 'prop-types';
import BaseContainer from '../BaseContainer';
import SelectProvinceComponent from '../../component/SelectProvince';

const defaultListener = () => {};

class SelectProvince extends BaseContainer {
  static propTypes = {
    onSelectProvince: PropTypes.func,
    onClose: PropTypes.func,
    provinceSelected: PropTypes.object
  };

  static defaultProps = {
    onSelectProvince: defaultListener,
    onClose: defaultListener,
    provinceSelected: undefined
  };

  render() {
    return (
      <SelectProvinceComponent
        onClose={this.props.onClose}
        onSelect={this.props.onSelectProvince}
        provinceSelected={this.props.provinceSelected}
      />
    );
  }
}

export default SelectProvince;
