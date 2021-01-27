import React from 'react';
import config from '../../config';
import PropTypes from 'prop-types';
import BaseContainer from '../BaseContainer';
import { internalFetch } from '../../helper/apiFetch';
import SelectProvinceComponent from '../../component/SelectProvince';
import EventTracker from '../../../../helper/EventTracker';

const defaultListener = () => {};

class SelectProvince extends BaseContainer {
  static propTypes = {
    onSelectProvince: PropTypes.func,
    onClose: PropTypes.func,
    provinceSelected: PropTypes.string,
    allOption: PropTypes.bool,
    listCities: PropTypes.array,
    dataKey: PropTypes.string
  };

  static defaultProps = {
    onSelectProvince: defaultListener,
    onClose: defaultListener,
    provinceSelected: '',
    allOption: true,
    listCities: [],
    dataKey: ''
  };

  constructor(props) {
    super(props);

    this.state = {
      listCities: this.props.listCities
    };
    this.eventTracker = new EventTracker();
  }

  componentDidMount() {
    if (!this.props.listCities.length) {
      this.getListCities();
    }
    this.eventTracker.logCurrentView();
  }

  componentWillUnmount() {
    this.eventTracker.clearTracking();
  }

  getListCities = async () => {
    try {
      const response = await internalFetch(config.rest.listCities());
      if (response.status === config.httpCode.success) {
        const listCities = this.props.allOption
          ? response.data.list_city
          : response.data.list_city.slice(1);

        this.setState({ listCities });
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
        dataKey={this.props.dataKey}
      />
    );
  }
}

export default SelectProvince;
