import React from 'react';
import config from '../../config';
import PropTypes from 'prop-types';
import BaseContainer from '../BaseContainer';
import { internalFetch } from '../../helper/apiFetch';
import SelectProvinceComponent from '../../component/SelectProvince';

const defaultListener = () => {};

class SelectProvince extends BaseContainer {
  static propTypes = {
    onSelectProvince: PropTypes.func,
    onClose: PropTypes.func,
    provinceSelected: PropTypes.string
  };

  static defaultProps = {
    onSelectProvince: defaultListener,
    onClose: defaultListener,
    provinceSelected: ''
  };

  constructor(props) {
    super(props);

    this.state = {
      listCities: []
    };
  }

  componentDidMount() {
    this.getListCities();
  }

  getListCities = async () => {
    try {
      const response = await internalFetch(config.rest.listCities());
      if (response.status === config.httpCode.success) {
        this.setState({
          listCities: response.data.list_city
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({ refreshing: false });
    }
  };

  render() {
    return (
      <SelectProvinceComponent
        onClose={this.props.onClose}
        onSelect={this.props.onSelectProvince}
        provinceSelected={this.props.provinceSelected}
        listCities={this.state.listCities}
      />
    );
  }
}

export default SelectProvince;
