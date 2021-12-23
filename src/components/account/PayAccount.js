import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
// 3-party libs
import {withTranslation} from 'react-i18next';
// configs
import appConfig from 'app-config';
// helpers
import EventTracker from 'app-helper/EventTracker';
import {getTheme} from 'src/Themes/Theme.context';
import {updateNavbarTheme} from 'src/Themes/helper/updateNavBarTheme';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {BundleIconSetName, TypographyType} from 'src/components/base';
// custom components
import {
  Typography,
  Icon,
  Container,
  BaseButton,
  ScreenWrapper,
} from 'src/components/base';

class PayAccount extends Component {
  static contextType = ThemeContext;

  state = {
    historiesData: null,
    wallet: this.props.wallet,
    account: this.props.account,
    app: this.props.app,
    barcode: this.props.barcode,
    loading: false,
    amount: this.props.amount ? this.props.amount : 0,
  };
  eventTracker = new EventTracker();

  updateNavBarDisposer = () => {};

  get theme() {
    return getTheme(this);
  }

  componentDidMount() {
    this.eventTracker.logCurrentView();

    this.updateNavBarDisposer = updateNavbarTheme(
      this.props.navigation,
      this.theme,
    );
  }

  componentWillUnmount() {
    this.eventTracker.clearTracking();

    this.updateNavBarDisposer();
  }

  renderUserIcon = (titleStyle) => {
    return (
      <Icon
        bundle={BundleIconSetName.MATERIAL_COMMUNITY_ICONS}
        name="account"
        style={[titleStyle, styles.userIcon]}
      />
    );
  };

  renderTopLabelCoin() {
    const {wallet, account} = this.state;
    return (
      <Container
        row
        centerVertical={false}
        style={[styles.add_store_actions_box, this.topLabelContainerStyle]}>
        <BaseButton
          useTouchableHighlight
          // onPress={this._goScanQRCode.bind(this)}
          style={styles.add_store_action_btn}>
          <View
            style={[
              styles.add_store_action_btn_box_balance,
              this.userInfoContainerStyle,
            ]}>
            <View style={styles.add_store_action_label_balance_container}>
              <Container noBackground row>
                <Typography
                  type={TypographyType.LABEL_MEDIUM_TERTIARY}
                  style={styles.add_store_action_label_balance}
                  renderInlineIconBefore={this.renderUserIcon}>
                  {' '}
                  {account.name}
                </Typography>
              </Container>
            </View>

            <Typography
              type={TypographyType.LABEL_SEMI_HUGE}
              style={styles.add_store_action_content}>
              {account.username}
            </Typography>
          </View>
        </BaseButton>

        <BaseButton
          // onPress={() => Actions.vnd_wallet({})}
          useTouchableHighlight
          style={styles.add_store_action_btn}>
          <View style={styles.add_store_action_btn_box_balance}>
            <View style={styles.add_store_action_label_balance_container}>
              <Typography
                type={TypographyType.LABEL_MEDIUM_TERTIARY}
                style={styles.add_store_action_label_balance}>
                {wallet.name}
              </Typography>
            </View>

            <Typography
              type={TypographyType.LABEL_SEMI_HUGE_PRIMARY}
              style={styles.add_store_action_content}>
              {wallet.balance_view}
            </Typography>
          </View>
        </BaseButton>
      </Container>
    );
  }

  renderTitleIcon = (titleStyle) => {
    return (
      <Icon
        bundle={BundleIconSetName.FONT_AWESOME}
        name="bank"
        style={[titleStyle, styles.titleIcon]}
      />
    );
  };

  get userInfoContainerStyle() {
    return {
      borderRightWidth: this.theme.layout.borderWidthPixel,
      borderColor: this.theme.color.border,
    };
  }

  get balanceTextStyle() {
    return {color: this.theme.color.accountAffiliate};
  }

  get topLabelContainerStyle() {
    return {
      borderBottomWidth: this.theme.layout.borderWidthPixel,
      borderColor: this.theme.color.border,
    };
  }

  get containerStyle() {
    return {
      borderBottomWidth: this.theme.layout.borderWidthSmall,
      borderColor: this.theme.color.border,
    };
  }

  render() {
    const {wallet, account, app, barcode, loading} = this.state;

    return (
      <ScreenWrapper safeLayout>
        <Container row style={[styles.container, this.containerStyle]}>
          <Typography
            type={TypographyType.LABEL_SEMI_HUGE}
            style={styles.historyCoinText}
            renderIconBefore={this.renderTitleIcon}>
            {this.props.t('common:screen.qrBarCode.mainTitle')} {barcode}
          </Typography>
        </Container>
        {this.renderTopLabelCoin()}
      </ScreenWrapper>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
  },
  historyCoinText: {
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
    flex: 1,
  },

  add_store_actions_box: {
    paddingVertical: 8,
  },
  add_store_action_btn: {
    flex: 1,
  },
  add_store_action_btn_box_balance: {
    alignItems: 'center',
    flexGrow: 1,
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  add_store_action_label_balance_container: {
    flexGrow: 1,
    justifyContent: 'center',
    width: '100%',
  },
  add_store_action_label_balance: {
    textAlign: 'center',
    flex: 1,
  },
  add_store_action_content: {
    marginTop: 10,
    fontWeight: 'bold',
  },
  titleIcon: {
    marginRight: 10,
    flex: undefined,
  },
  userIcon: {
    fontSize: 15,
    flex: undefined,
    alignSelf: 'flex-start',
  },
});

export default withTranslation()(observer(PayAccount));
