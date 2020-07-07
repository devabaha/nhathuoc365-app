import React, { Component } from 'react';
import { View } from 'react-native';
import APIHandler from '../../../network/APIHandler';
import Loading from '../../../components/Loading';

class Bills extends Component {
  state = {
    loading: true
  };
  unmounted = false;

  componentDidMount() {
    this.getBills();
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  getBills = async () => {
    const { t } = this.props;
    try {
      const response = await APIHandler.site_bills_room(
        this.props.siteId,
        this.props.roomId
      );
      console.log(response, this.props.siteId, this.props.roomId);
    } catch (err) {
      console.log('get_all_bills', err);
      flashShowMessage({
        type: 'danger',
        message: t('api.error.message')
      });
    } finally {
      !this.unmounted &&
        this.setState({
          loading: false
        });
    }
  };

  render() {
    return <View>{this.state.loading && <Loading center />}</View>;
  }
}

export default withTranslation()(Bills);
