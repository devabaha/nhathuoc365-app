import React from 'react';
import {StyleSheet} from 'react-native';
// 3-party libs
import moment from 'moment';
import {withTranslation} from 'react-i18next';
// configs
import appConfig from 'app-config';
// routing
import {push} from 'app-helper/routing';
// entities
import APIHandler from 'src/network/APIHandler';
// custom components
import {TypographyType} from 'src/components/base';
// custom components
import SectionContainer from '../SectionContainer';
import {Typography, Container} from 'src/components/base';
import Loading from 'src/components/Loading';

const styles = StyleSheet.create({
  container: {
    paddingLeft: 22,
    marginTop: 8,
  },
  detailContainer: {
    flex: 1,
  },
  labelPrefix: {
    marginTop: 4,
    flex: 1,
    paddingRight: 40,
  },
  detailLabelAfter: {
    fontWeight: 'bold',
    marginTop: 4,
  },
  loadingWrapper: {
    width: 40,
    height: '100%',
    overflow: 'visible',
    alignItems: 'flex-end',
    left: undefined,
  },
});

class DeliveryScheduleSection extends React.Component {
  state = {
    loading: false,
    scheduleDeliveryData: [],
    scheduleDeliveryTime: null,
  };
  unmounted = false;

  componentWillUnmount() {
    this.unmounted = true;
  }

  get scheduleDateTime() {
    return this.state.scheduleDeliveryTime != null
      ? this.state.scheduleDeliveryTime
      : this.props.dateTime;
  }

  get dateTimeFormatted() {
    if (!this.scheduleDateTime) {
      return null;
    }

    const deliveryTime = moment(
      this.scheduleDateTime,
      'YYYY-MM-DD HH:mm:ss',
    ).format('DD/MM/YYYY HH:mm');

    const [date, time] = deliveryTime.split(' ');
    if (!!date && !!time) {
      const isToday = date === moment().format('L');

      if (isToday) {
        return (
          time +
          ' ' +
          this.props.t('confirm.scheduleDelivery.modal.todayLabel') +
          date
        );
      } else return time + ' ' + date;
    } else {
      return null;
    }
  }

  handleUpdateCartInfo = async (deliveryTime) => {
    const {t} = this.props;
    const data = {
      delivery_time: deliveryTime,
    };

    try {
      const response = await APIHandler.update_info_cart(
        this.props.siteId,
        this.props.cartId,
        data,
      );
      if (this.unmounted) return;

      if (response && response?.status === STATUS_SUCCESS) {
        this.props.onDeliveryTimeChange(response.data?.delivery_time || null);

        this.setState({
          scheduleDeliveryTime: response.data?.delivery_time || '',
        });

        flashShowMessage({
          type: 'success',
          message: response.message,
        });
      } else {
        flashShowMessage({
          type: 'danger',
          message: response?.message || t('common:api.error.message'),
        });
      }
    } catch (e) {
      console.log('update_info_cart ' + e);
      flashShowMessage({
        type: 'danger',
        message: t('common:api.error.message'),
      });
    } finally {
      if (this.unmounted) return;
      this.setState({loading: false});
    }
  };

  getScheduleDeliveryData = async () => {
    this.setState({loading: true});
    try {
      const response = await APIHandler.get_cart_delivery_date(
        this.props.siteId,
      );

      if (this.unmounted) return;
      if (response && response.status === STATUS_SUCCESS) {
        this.setState({scheduleDeliveryData: response.data || []}, () => {
          push(appConfig.routes.modalDeliverySchedule, {
            siteId: this.props.siteId,
            scheduleDateTime: this.scheduleDateTime,
            scheduleDeliveryData: this.state.scheduleDeliveryData,
            onConfirm: (scheduleTime) => {
              this.setState({
                loading: true,
              });

              this.handleUpdateCartInfo(scheduleTime);
            },
          });
        });
      } else {
        flashShowMessage({
          type: 'danger',
          message:
            response?.message || this.props.t('common:api.error.message'),
        });
      }
    } catch (e) {
      console.log('get_cart_delivery_date:' + e);
    } finally {
      if (this.unmounted) return;
      this.setState({
        loading: false,
      });
    }
  };

  render() {
    const {t} = this.props;

    return (
      <SectionContainer
        marginTop
        title={this.props.title}
        iconName="clock"
        actionBtnTitle={this.props.editable ? t('confirm.change') : null}
        onPressActionBtn={!this.state.loading && this.getScheduleDeliveryData}>
        <Container row style={styles.container}>
          {!!this.dateTimeFormatted ? (
            <Container style={styles.detailContainer}>
              <Typography
                style={styles.labelPrefix}
                type={TypographyType.LABEL_MEDIUM}>
                {t('confirm.scheduleDelivery.detailLabel')}
                <Typography
                  type={TypographyType.LABEL_MEDIUM}
                  style={styles.detailLabelAfter}>
                  {this.dateTimeFormatted}
                </Typography>
              </Typography>
            </Container>
          ) : (
            <Typography
              style={styles.labelPrefix}
              type={TypographyType.DESCRIPTION_MEDIUM}>
              {t('confirm.scheduleDelivery.description')}
            </Typography>
          )}
          {this.state.loading && (
            <Loading size="small" wrapperStyle={styles.loadingWrapper} />
          )}
        </Container>
      </SectionContainer>
    );
  }
}

export default withTranslation('orders')(DeliveryScheduleSection);
