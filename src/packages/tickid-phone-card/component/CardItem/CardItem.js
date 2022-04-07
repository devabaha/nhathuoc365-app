import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
// 3-party libs
import {withTranslation} from 'react-i18next';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
import {hexToRgba} from 'app-helper';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {SERVICE_TYPE} from '../../constants';
import {BundleIconSetName, TypographyType} from 'src/components/base';
// custom components
import {
  Typography,
  BaseButton,
  Card,
  IconButton,
  TextButton,
} from 'src/components/base';
import Image from 'src/components/Image';

const defaultListener = () => {};

class CardItem extends Component {
  static contextType = ThemeContext;

  static propTypes = {
    cardId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    image: PropTypes.string,
    type: PropTypes.string,
    package: PropTypes.string,
    networkType: PropTypes.string,
    networkName: PropTypes.string,
    statusView: PropTypes.string,
    price: PropTypes.string,
    buyTime: PropTypes.string,
    cardCode: PropTypes.string,
    cardSeri: PropTypes.string,
    isPay: PropTypes.bool,
    isUsed: PropTypes.bool,
    showMoreMenu: PropTypes.bool,
    isBuyCard: PropTypes.bool,
    onOpenMoreMenu: PropTypes.func,
    onCopyCardCode: PropTypes.func,
    onSendCard: PropTypes.func,
    onUseNow: PropTypes.func,
    onPressService: PropTypes.func,
  };

  static defaultProps = {
    cardId: '',
    image: '',
    type: '',
    package: '',
    networkType: '',
    networkName: '',
    statusView: '',
    price: '',
    buyTime: '',
    cardCode: '',
    cardSeri: '',
    isPay: false,
    isUsed: false,
    showMoreMenu: true,
    isBuyCard: false,
    onOpenMoreMenu: defaultListener,
    onCopyCardCode: defaultListener,
    onSendCard: defaultListener,
    onUseNow: defaultListener,
    onPressService: defaultListener,
  };

  copyTitleTypoProps = {type: TypographyType.LABEL_SMALL};

  get theme() {
    return getTheme(this);
  }

  get isUsedOrPaid() {
    return this.props.isUsed || this.props.isPay;
  }

  get cardStyle() {
    return {
      borderWidth: this.theme.layout.borderWidth,
      borderColor: this.theme.color.border,
      opacity: this.isUsedOrPaid ? 0.5 : 1,
    };
  }

  get copyTextColor() {
    return this.theme.color.accent2;
  }

  get copyTextStyle() {
    return {
      color: this.copyTextColor,
    };
  }

  get codeBoxStyle() {
    return {
      backgroundColor: hexToRgba(this.copyTextColor, 0.05),
      borderRadius: this.theme.layout.borderRadiusSmall,
    };
  }

  get usedOverlayStyle() {
    return {
      backgroundColor: hexToRgba(this.theme.color.onPrimaryHighlight, 0.6),
    };
  }

  render() {
    return (
      <Card style={[styles.wrapper, this.cardStyle]}>
        <BaseButton
          disabled={this.isUsedOrPaid}
          onPress={this.props.onPressService}
          style={styles.container}>
          <View style={styles.cardInfoWrapper}>
            {!!this.props.image && (
              <Image
                style={styles.cardImage}
                source={{uri: this.props.image}}
              />
            )}
            <View style={styles.cardInfoBox}>
              <Typography
                type={TypographyType.LABEL_MEDIUM}
                style={styles.networkName}>
                {this.props.networkName}
              </Typography>
              <Typography
                type={TypographyType.LABEL_SEMI_LARGE_PRIMARY}
                style={styles.cardValue}>
                {this.props.code ? this.props.code + ' - ' : ''}
                {this.props.price}
              </Typography>
              <Typography
                type={TypographyType.DESCRIPTION_SMALL_TERTIARY}
                style={styles.cardBuyTime}>
                {this.props.buyTime}
              </Typography>
            </View>
          </View>
          {!this.props.isBuyCard && (
            <Typography
              type={TypographyType.LABEL_SEMI_MEDIUM_PRIMARY}
              style={styles.statusView}>
              {this.props.isPay
                ? this.props.t('paidCard')
                : this.props.statusView}
            </Typography>
          )}
          {!!this.props.cardCode &&
            this.props.type === SERVICE_TYPE.PHONE_CARD && (
              <View style={[styles.codeBox, this.codeBoxStyle]}>
                <Typography
                  type={TypographyType.LABEL_LARGE}
                  style={styles.cardCode}>
                  {this.props.cardCode} {this.props.package}
                </Typography>
                <TextButton
                  hitSlop={HIT_SLOP}
                  typoProps={this.copyTitleTypoProps}
                  titleStyle={[styles.copyText, this.copyTextStyle]}
                  style={styles.copyBtn}
                  onPress={() => this.props.onCopyCardCode(this.props.cardId)}>
                  {this.props.t('common:copy')}
                </TextButton>
              </View>
            )}

          {!!this.props.cardSeri && (
            <Typography
              type={TypographyType.LABEL_SEMI_MEDIUM}
              style={styles.cardSeri}>
              {this.props.t('serialNumber')}: {this.props.cardSeri}
            </Typography>
          )}

          {this.props.isBuyCard && (
            <View style={styles.buttonBox}>
              {!this.isUsedOrPaid && (
                <TextButton
                  neutral
                  hitSlop={HIT_SLOP}
                  titleStyle={styles.sendCardText}
                  style={styles.sendCardBtn}
                  onPress={() => this.props.onSendCard(this.props.cardId)}>
                  {this.props.t('sendCard')}
                </TextButton>
              )}

              <TextButton
                primaryHighlight
                hitSlop={HIT_SLOP}
                titleStyle={styles.useNowText}
                style={styles.useNowBtn}
                onPress={() => this.props.onUseNow(this.props.cardId)}>
                {this.props.isPay
                  ? this.props.t('paidCard')
                  : this.props.isUsed
                  ? this.props.t('usedCard')
                  : this.props.t('rechargeNow')}
              </TextButton>
            </View>
          )}

          {false && ( //this.props.showMoreMenu
            <IconButton
              bundle={BundleIconSetName.IONICONS}
              name="ios-ellipsis-horizontal"
              style={styles.moreBtn}
              iconStyle={styles.moreIcon}
              onPress={this.props.onOpenMoreMenu}
            />
          )}
        </BaseButton>
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 15,
    marginHorizontal: 15,
    overflow: 'hidden',
  },
  container: {
    minHeight: 90,
    justifyContent: 'center',
    padding: 15,
  },
  usedOverlay: {
    position: 'absolute',
    ...StyleSheet.absoluteFill,
  },
  cardInfoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardImage: {
    width: 60,
    height: 60,
    marginRight: 8,
  },
  cardInfoBox: {
    flex: 1,
  },
  networkName: {
    fontWeight: 'bold',
    marginTop: 2,
  },
  cardValue: {
    fontWeight: 'bold',
    marginTop: 2,
  },
  cardBuyTime: {
    marginTop: 2,
  },
  codeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  cardCode: {
    marginTop: 2,
  },
  copyText: {
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  copyBtn: {
    paddingVertical: 13,
    paddingLeft: 32,
  },
  cardSeri: {
    fontWeight: '600',
    marginTop: 8,
  },
  buttonBox: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  sendCardText: {
    fontWeight: 'bold',
  },
  sendCardBtn: {
    paddingTop: 16,
  },
  useNowText: {
    fontWeight: 'bold',
    marginLeft: 15,
  },
  useNowBtn: {
    paddingTop: 16,
  },
  moreText: {},
  moreImage: {
    width: 20,
    height: 20,
  },
  moreBtn: {
    position: 'absolute',
    top: -4,
    right: 0,
    padding: 12,
  },
  statusView: {
    flex: 1,
    alignSelf: 'flex-end',
    textAlign: 'right',
    right: 10,
  },
  moreIcon: {
    fontSize: 20,
  },
});

export default withTranslation(['phoneCard', 'common'])(CardItem);
