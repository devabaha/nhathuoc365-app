import React, {Component} from 'react';
import {View, StyleSheet, Switch} from 'react-native';
// 3-party libs
import {withTranslation} from 'react-i18next';
// configs
import Store from 'app-store';
import appConfig from 'app-config';
// helpers
import {mergeStyles} from 'src/Themes/helper';
import {getTheme} from 'src/Themes/Theme.context';
// routing
import {push} from 'app-helper/routing';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {BundleIconSetName, TypographyType} from 'src/components/base';
// custom components
import {
  ScreenWrapper,
  Icon,
  Typography,
  BaseButton,
  IconButton,
} from 'src/components/base';

class FindTickets extends Component {
  static contextType = ThemeContext;

  date = new Date();
  from_date = dateHandler(this.date.setDate(this.date.getDate() + 1));
  to_date = dateHandler(this.date.setDate(this.date.getDate() + 2));

  state = {
    khu_hoi: true,
    from: 'HAN',
    from_view: 'Hà Nội (HAN)',
    to: 'SGN',
    to_view: 'Hồ Chí Minh (SGN)',
    from_date: {
      date: this.from_date.date,
      dateString: this.from_date.dateString,
      current: this.from_date.current,
    },
    to_date: {
      date: this.to_date.date,
      dateString: this.to_date.dateString,
      current: this.to_date.current,
    },
    nguoi_lon: 1,
    tre_em: 0,
    tre_so_sinh: 0,
  };

  onSearch = React.createRef();

  get theme() {
    return getTheme(this);
  }

  _khuHoiChange(value) {
    this.setState({
      khu_hoi: value,
    });
    layoutAnimation();
  }

  _fromSelected(item) {
    this.setState({
      from: item.code,
      from_view: `${item.city_name_vi} (${item.code})`,
    });
  }

  _toSelected(item) {
    this.setState({
      to: item.code,
      to_view: `${item.city_name_vi} (${item.code})`,
    });
  }

  _placeSwitch() {
    this.setState((prevState) => ({
      from: prevState.to,
      from_view: prevState.to_view,
      to: prevState.from,
      to_view: prevState.from_view,
    }));
  }

  onSearch = () => {
    var {
      khu_hoi,
      from,
      from_view,
      to,
      to_view,
      from_date,
      to_date,
      nguoi_lon,
      tre_em,
      tre_so_sinh,
    } = this.state;

    var params = '';
    if (khu_hoi) {
      params = `${from}-${to}-${from_date.date}-${to_date.date}-${nguoi_lon}-${tre_em}-${tre_so_sinh}`;
    } else {
      params = `${from}-${to}-${from_date.date}-${nguoi_lon}-${tre_em}-${tre_so_sinh}`;
    }

    var url = Store.site_data?.result_url + '?Request=' + params;
    push(
      appConfig.routes.airlineTicketResult,
      {
        title: `${from_view} - ${to_view}`,
        url,
      },
      this.theme,
    );
  };

  _fromDateSelected() {
    var {from_date, to_date, khu_hoi} = this.state;

    push(
      appConfig.routes.airlineTicketDatePicker,
      {
        current: from_date.current,
        onSelected: (value) => {
          var date = dateHandler(value);

          var _from_date, _to_date;
          _from_date = {
            date: date.date,
            dateString: date.dateString,
            current: date.current,
          };
          _to_date = to_date;

          const cal_date = () => {
            var date = new Date(_from_date.current);
            var cal_from_date = dateHandler(date.setDate(date.getDate() + 2));

            _to_date = {
              date: cal_from_date.date,
              dateString: cal_from_date.dateString,
              current: cal_from_date.current,
            };
          };

          if (khu_hoi) {
            if (_from_date.current > to_date.current) {
              cal_date();
            }
          } else {
            cal_date();
          }

          this.setState({
            from_date: _from_date,
            to_date: _to_date,
          });
        },
      },
      this.theme,
    );
  }

  _toDateSelected() {
    var {to_date, from_date} = this.state;
    push(
      appConfig.routes.airlineTicketDatePicker,
      {
        current: to_date.current,
        minDate: from_date.current,
        onSelected: (value) => {
          var date = dateHandler(value);
          this.setState({
            to_date: {
              date: date.date,
              dateString: date.dateString,
              current: date.current,
            },
          });
        },
      },
      this.theme,
    );
  }

  get iconStyle() {
    return mergeStyles(styles.icon, {color: this.theme.color.primaryHighlight});
  }

  get switchBtnStyle() {
    return mergeStyles(styles.switchBtn, {
      backgroundColor: this.theme.color.primaryHighlight,
    });
  }

  get iconPlaceSwitchStyle() {
    return mergeStyles(styles.iconPlaceSwitch, {
      color: this.theme.color.onPrimaryHighlight,
    });
  }

  get boxBtnStyle() {
    return mergeStyles(styles.boxBtn, {
      borderColor: this.theme.color.contentBackgroundStrong,
      borderBottomWidth: this.theme.layout.borderWidthPixel,
    });
  }

  render() {
    var {
      khu_hoi,
      from_view,
      to_view,
      from_date,
      to_date,
      nguoi_lon,
      tre_em,
      tre_so_sinh,
    } = this.state;

    var customer_to_string = [];
    if (nguoi_lon) {
      customer_to_string.push(
        nguoi_lon + ' ' + this.props.t('customer.adults'),
      );
    }
    if (tre_em) {
      customer_to_string.push(tre_em + ' ' + this.props.t('customer.children'));
    }
    if (tre_so_sinh) {
      customer_to_string.push(
        tre_so_sinh + ' ' + this.props.t('customer.infant'),
      );
    }

    customer_to_string = customer_to_string.join(', ');

    return (
      <ScreenWrapper style={styles.container}>
        <View>
          <View
            style={[
              styles.groupInput,
              {
                marginTop: 0,
              },
            ]}>
            <View style={styles.boxIcon}>
              <Icon
                bundle={BundleIconSetName.MATERIAL_ICONS}
                style={this.iconStyle}
                name="flight-takeoff"
              />
            </View>

            <BaseButton
              onPress={() => {
                push(
                  appConfig.routes.airlineTicketPlace,
                  {
                    onSelected: this._fromSelected.bind(this),
                  },
                  this.theme,
                );
              }}
              underlayColor="transparent"
              style={styles.boxInput}>
              <View
                style={[
                  this.boxBtnStyle,
                  {
                    width: appConfig.device.width - BOX_ICON_WIDTH - 50,
                  },
                ]}>
                <Typography
                  type={TypographyType.LABEL_MEDIUM_TERTIARY}
                  style={styles.inputLabel}>
                  {this.props.t('departure')}
                </Typography>
                <Typography
                  type={TypographyType.LABEL_LARGE}
                  style={styles.inputValue}>
                  {from_view}
                </Typography>
              </View>
            </BaseButton>
          </View>

          <View style={styles.groupInput}>
            <View style={styles.boxIcon}>
              <Icon
                bundle={BundleIconSetName.MATERIAL_ICONS}
                style={this.iconStyle}
                name="flight-land"
              />
            </View>

            <BaseButton
              onPress={() => {
                push(
                  appConfig.routes.airlineTicketPlace,
                  {
                    onSelected: this._toSelected.bind(this),
                  },
                  this.theme,
                );
              }}
              style={styles.boxInput}>
              <View style={this.boxBtnStyle}>
                <Typography
                  type={TypographyType.LABEL_MEDIUM_TERTIARY}
                  style={styles.inputLabel}>
                  {this.props.t('destination')}
                </Typography>
                <Typography
                  type={TypographyType.LABEL_LARGE}
                  style={styles.inputValue}>
                  {to_view}
                </Typography>
              </View>
            </BaseButton>
          </View>

          <IconButton
            onPress={this._placeSwitch.bind(this)}
            underlayColor="transparent"
            style={this.switchBtnStyle}
            name="swap-vert"
            bundle={BundleIconSetName.MATERIAL_ICONS}
            iconStyle={this.iconPlaceSwitchStyle}
          />
        </View>

        <View style={styles.groupInput}>
          <View style={styles.boxIcon}>
            <Icon
              bundle={BundleIconSetName.MATERIAL_ICONS}
              style={this.iconStyle}
              name="date-range"
            />
          </View>

          <BaseButton
            onPress={this._fromDateSelected.bind(this)}
            underlayColor="transparent"
            style={styles.boxInput}>
            <View
              style={[
                this.boxBtnStyle,
                {
                  width: Util.size.width - BOX_ICON_WIDTH - 80,
                },
              ]}>
              <Typography
                type={TypographyType.LABEL_MEDIUM_TERTIARY}
                style={styles.inputLabel}>
                {this.props.t('departureDate')}
              </Typography>
              <Typography
                type={TypographyType.LABEL_LARGE}
                style={styles.inputValue}>
                {from_date.dateString}
              </Typography>
            </View>
          </BaseButton>

          <View style={styles.boxKhuHoi}>
            <Typography
              type={TypographyType.LABEL_MEDIUM_TERTIARY}
              style={styles.textKhuHoi}>
              {this.props.t('roundTrip')}
            </Typography>

            <Switch
              onValueChange={this._khuHoiChange.bind(this)}
              value={khu_hoi}
            />
          </View>
        </View>

        <View
          style={[
            styles.groupInput,
            {
              height: khu_hoi ? ROW_HEIGHT : 0,
              marginTop: khu_hoi ? 8 : 0,
            },
          ]}>
          <View style={styles.boxIcon}>
            <Icon
              bundle={BundleIconSetName.MATERIAL_ICONS}
              style={this.iconStyle}
              name="date-range"
            />
          </View>

          <BaseButton
            onPress={this._toDateSelected.bind(this)}
            underlayColor="transparent"
            style={styles.boxInput}>
            <View style={this.boxBtnStyle}>
              <Typography
                type={TypographyType.LABEL_MEDIUM_TERTIARY}
                style={styles.inputLabel}>
                {this.props.t('returnDate')}
              </Typography>
              <Typography
                type={TypographyType.LABEL_LARGE}
                style={styles.inputValue}>
                {to_date.dateString}
              </Typography>
            </View>
          </BaseButton>
        </View>

        <View style={styles.groupInput}>
          <View style={styles.boxIcon}>
            <Icon
              bundle={BundleIconSetName.MATERIAL_ICONS}
              style={this.iconStyle}
              name="supervisor-account"
            />
          </View>

          <BaseButton
            onPress={() => {
              push(
                appConfig.routes.airlineTicketCustomer,
                {
                  nguoi_lon,
                  tre_em,
                  tre_so_sinh,
                  onSelected: ({nguoi_lon, tre_em, tre_so_sinh}) => {
                    this.setState({
                      nguoi_lon,
                      tre_em,
                      tre_so_sinh,
                    });
                  },
                },
                this.theme,
              );
            }}
            underlayColor="transparent"
            style={styles.boxInput}>
            <View style={this.boxBtnStyle}>
              <Typography
                type={TypographyType.LABEL_MEDIUM_TERTIARY}
                style={styles.inputLabel}>
                {this.props.t('passenger')}
              </Typography>
              <Typography
                type={TypographyType.LABEL_LARGE}
                style={styles.inputValue}>
                {customer_to_string}
              </Typography>
            </View>
          </BaseButton>
        </View>
      </ScreenWrapper>
    );
  }
}

const ROW_HEIGHT = 64;
const BOX_ICON_WIDTH = 42;

const styles = StyleSheet.create({
  container: {
    width: appConfig.device.width,
    zIndex: 999,
  },
  groupInput: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 8,
    height: ROW_HEIGHT,
    overflow: 'hidden',
  },
  boxIcon: {
    width: BOX_ICON_WIDTH,
    height: ROW_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginTop: 24,
    marginLeft: 4,
    fontSize: 24,
  },
  boxBtn: {
    width: Util.size.width - BOX_ICON_WIDTH - 16,
    height: '100%',
  },
  inputLabel: {
    marginTop: 12,
  },
  inputValue: {
    marginTop: 8,
  },
  switchBtn: {
    position: 'absolute',
    top: 48,
    right: 12,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  boxKhuHoi: {
    marginLeft: appConfig.device.isIOS ? 10 : 0,
    right: 12,
    alignItems: 'center',
  },
  textKhuHoi: {
    marginBottom: 4,
  },
  iconPlaceSwitch: {
    fontSize: 24,
  },
});

export default withTranslation('airlineTicket', {withRef: true})(FindTickets);
