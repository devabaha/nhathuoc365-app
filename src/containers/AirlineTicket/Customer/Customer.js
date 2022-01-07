import React, {Component} from 'react';
import {View, StyleSheet, Animated} from 'react-native';
import PropTypes from 'prop-types';
// helpers
import {mergeStyles} from 'src/Themes/helper';
import {getTheme} from 'src/Themes/Theme.context';
// routing
import {pop} from 'app-helper/routing';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {BundleIconSetName, TypographyType} from 'src/components/base';
// custom components
import {
  BaseButton,
  Container,
  IconButton,
  Typography,
} from 'src/components/base';
import Button from 'src/components/Button';

class Customer extends Component {
  static contextType = ThemeContext;

  static propTypes = {
    onSelected: PropTypes.func,
    nguoi_lon: PropTypes.number,
    tre_em: PropTypes.number,
    tre_so_sinh: PropTypes.number,
  };

  static defaultProps = {
    onSelected: (value) => value,
  };

  constructor(props) {
    super(props);

    var {nguoi_lon, tre_em, tre_so_sinh} = props;

    this.state = {
      opacity: new Animated.Value(0),
      bottom: new Animated.Value(100),
      nguoi_lon: nguoi_lon || 0,
      tre_em: tre_em || 0,
      tre_so_sinh: tre_so_sinh || 0,
    };
  }

  get theme() {
    return getTheme(this);
  }

  componentDidMount() {
    Animated.timing(this.state.opacity, {
      duration: 250,
      toValue: 1,
      useNativeDriver: true,
    }).start();

    Animated.timing(this.state.bottom, {
      duration: 250,
      toValue: 0,
      useNativeDriver: true,
    }).start();
  }

  _onClose = () => {
    Animated.timing(this.state.bottom, {
      duration: 250,
      toValue: 100,
      useNativeDriver: true,
    }).start();

    Animated.timing(this.state.opacity, {
      duration: 250,
      toValue: 0,
      useNativeDriver: true,
    }).start(pop);
  };

  _valid = (key, prefix) => {
    var pers = this.state[key];

    var vaild = CUSTOMER_VALID;

    var {min, max} = vaild[key];

    if (prefix == '-') {
      return pers > min;
    } else if (prefix == '+') {
      return pers < max;
    } else {
      console.warn('Error prefix _valid func');
    }
  };

  _onSave() {
    if (this.props.onSelected) {
      var {nguoi_lon, tre_em, tre_so_sinh} = this.state;

      this.props.onSelected({
        nguoi_lon,
        tre_em,
        tre_so_sinh,
      });
    }

    this._onClose();
  }

  get containerStyle() {
    return mergeStyles(styles.container, {
      backgroundColor: this.theme.color.overlay60,
    });
  }

  get headerContentStyle() {
    return mergeStyles(styles.headerContent, {
      borderRadius: this.theme.layout.borderRadiusLarge,
    });
  }

  get headerStyle() {
    return mergeStyles(styles.header, {
      backgroundColor: this.theme.color.primary,
      borderBottomWidth: this.theme.layout.borderWidthPixel,
      borderBottomColor: this.theme.color.border,
    });
  }

  get titleStyle() {
    return mergeStyles(styles.title, {
      color: this.theme.color.onPrimary,
    });
  }

  get actionButtonStyle() {
    return mergeStyles(styles.actionButton, {
      backgroundColor: this.theme.color.primaryHighlight,
    });
  }

  get iconCustomerStyle() {
    return mergeStyles(styles.iconCustomer, {
      color: this.theme.color.onPrimaryHighlight,
    });
  }

  render() {
    var {nguoi_lon, tre_em, tre_so_sinh} = this.state;

    return (
      <Container
        animated
        style={[
          this.containerStyle,
          {
            opacity: this.state.opacity,
          },
        ]}>
        <Container
          animated
          noBackground
          style={[
            styles.headerBackdrop,
            {
              transform: [
                {
                  translateY: this.state.bottom,
                },
              ],
            },
          ]}>
          <BaseButton style={styles.headerClose} onPress={this._onClose} />

          <Container style={this.headerContentStyle}>
            <Container style={this.headerStyle}>
              <Typography
                onPrimary
                type={TypographyType.TITLE_SEMI_LARGE}
                style={styles.title}>
                {this.props.t('passenger')}
              </Typography>
              <View style={styles.leftNav}>
                <View style={styles.btnCloseBox}>
                  <IconButton
                    bundle={BundleIconSetName.IONICONS}
                    name="ios-close"
                    style={styles.btnClose}
                    iconStyle={[this.titleStyle, styles.iconClose]}
                    onPress={this._onClose}
                  />
                </View>
              </View>
            </Container>

            <View
              style={[
                styles.headerRows,
                {
                  marginTop: 20,
                },
              ]}>
              <View style={styles.leftContent}>
                <Typography
                  type={TypographyType.LABEL_LARGE}
                  style={styles.labelRow}>
                  {this.props.t('customer.adults')}
                </Typography>
                <Typography
                  type={TypographyType.LABEL_SEMI_MEDIUM_TERTIARY}
                  style={styles.subLabel}>
                  {this.props.t('customer.adultsSub')}
                </Typography>
              </View>

              <View style={styles.rightContent}>
                <IconButton
                  bundle={BundleIconSetName.IONICONS}
                  name="ios-remove"
                  iconStyle={this.iconCustomerStyle}
                  style={this.actionButtonStyle}
                  onPress={() => {
                    if (!this._valid('nguoi_lon', '-')) {
                      return;
                    }
                    this.setState({
                      nguoi_lon: nguoi_lon > 0 ? --nguoi_lon : 0,
                    });
                  }}
                />

                <Typography
                  type={TypographyType.LABEL_LARGE}
                  style={styles.textQuantity}>
                  {nguoi_lon}
                </Typography>

                <IconButton
                  bundle={BundleIconSetName.IONICONS}
                  name="ios-add"
                  iconStyle={this.iconCustomerStyle}
                  style={this.actionButtonStyle}
                  onPress={() => {
                    if (!this._valid('nguoi_lon', '+')) {
                      return;
                    }
                    this.setState({
                      nguoi_lon: ++nguoi_lon,
                    });
                  }}
                />
              </View>
            </View>

            <View style={styles.headerRows}>
              <View style={styles.leftContent}>
                <Typography
                  type={TypographyType.LABEL_LARGE}
                  style={styles.labelRow}>
                  {this.props.t('customer.children')}
                </Typography>
                <Typography
                  type={TypographyType.LABEL_SEMI_MEDIUM_TERTIARY}
                  style={styles.subLabel}>
                  {this.props.t('customer.childrenSub')}
                </Typography>
              </View>

              <View style={styles.rightContent}>
                <IconButton
                  bundle={BundleIconSetName.IONICONS}
                  name="ios-remove"
                  iconStyle={this.iconCustomerStyle}
                  style={this.actionButtonStyle}
                  onPress={() => {
                    if (!this._valid('tre_em', '-')) {
                      return;
                    }
                    this.setState({
                      tre_em: tre_em > 0 ? --tre_em : 0,
                    });
                  }}
                />

                <Typography
                  type={TypographyType.LABEL_LARGE}
                  style={styles.textQuantity}>
                  {tre_em}
                </Typography>

                <IconButton
                  bundle={BundleIconSetName.IONICONS}
                  name="ios-add"
                  iconStyle={this.iconCustomerStyle}
                  style={this.actionButtonStyle}
                  onPress={() => {
                    if (!this._valid('tre_em', '+')) {
                      return;
                    }
                    this.setState({
                      tre_em: ++tre_em,
                    });
                  }}
                />
              </View>
            </View>

            <View style={styles.headerRows}>
              <View style={styles.leftContent}>
                <Typography
                  type={TypographyType.LABEL_LARGE}
                  style={styles.labelRow}>
                  {this.props.t('customer.infant')}
                </Typography>
                <Typography
                  type={TypographyType.LABEL_SEMI_MEDIUM_TERTIARY}
                  style={styles.subLabel}>
                  {this.props.t('customer.infantSub')}
                </Typography>
              </View>

              <View style={styles.rightContent}>
                <IconButton
                  bundle={BundleIconSetName.IONICONS}
                  name="ios-remove"
                  iconStyle={this.iconCustomerStyle}
                  style={this.actionButtonStyle}
                  onPress={() => {
                    if (!this._valid('tre_so_sinh', '-')) {
                      return;
                    }
                    this.setState({
                      tre_so_sinh: tre_so_sinh > 0 ? --tre_so_sinh : 0,
                    });
                  }}
                />

                <Typography
                  type={TypographyType.LABEL_LARGE}
                  style={styles.textQuantity}>
                  {tre_so_sinh}
                </Typography>

                <IconButton
                  bundle={BundleIconSetName.IONICONS}
                  name="ios-add"
                  iconStyle={this.iconCustomerStyle}
                  style={this.actionButtonStyle}
                  onPress={() => {
                    if (!this._valid('tre_so_sinh', '+')) {
                      return;
                    }
                    this.setState({
                      tre_so_sinh: ++tre_so_sinh,
                    });
                  }}
                />
              </View>
            </View>

            <View style={styles.boxBtnSearch}>
              <Button safeLayout onPress={this._onSave.bind(this)}>
                {this.props.t('common:done')}
              </Button>
            </View>
          </Container>
        </Container>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    zIndex: 99999,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    width: '100%',
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    height: 360,
    borderRadius: 10,
    overflow: 'hidden',
  },
  headerClose: {
    width: '100%',
    height: '100%',
  },
  headerBackdrop: {
    width: '100%',
    height: '100%',
  },
  leftNav: {
    position: 'absolute',
    left: 0,
    height: '100%',
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnClose: {
    padding: 8,
  },
  btnTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    fontWeight: '600',
  },

  headerRows: {
    width: '100%',
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  actionButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    overflow: 'hidden',
  },
  actionButtonBox: {
    // padding: 8,
  },

  leftContent: {
    width: '50%',
    height: '100%',
    paddingLeft: 15,
  },
  labelRow: {
    marginTop: 8,
  },
  subLabel: {
    marginTop: 4,
  },

  rightContent: {
    width: '50%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: '4%',
  },
  textQuantity: {
    fontWeight: '600',
  },

  boxBtnSearch: {
    marginTop: 40,
  },

  iconClose: {
    fontSize: 30,
  },
  iconCustomer: {
    fontSize: 20,
    alignContent: 'center',
  },
});

export default withTranslation(['airlineTicket', 'common'])(Customer);
