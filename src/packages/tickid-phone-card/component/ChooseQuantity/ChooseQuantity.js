import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
// 3-party libs
import {withTranslation} from 'react-i18next';
//helpers
import {getTheme} from 'src/Themes/Theme.context';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {BundleIconSetName, TypographyType} from 'src/components/base';
// custom components
import {Typography, IconButton} from 'src/components/base';

const MAX_CARD_BUY_AT_ONCE = 5;

class ChooseQuantity extends Component {
  static contextType = ThemeContext;

  static propTypes = {
    initQuantity: PropTypes.number,
    minValue: PropTypes.number,
    maxValue: PropTypes.number,
    onChangeQuantity: PropTypes.func,
  };

  static defaultProps = {
    initQuantity: 1,
    minValue: 1,
    maxValue: MAX_CARD_BUY_AT_ONCE,
    onChangeQuantity: () => {},
  };

  state = {
    quantity: this.props.initQuantity,
  };

  get theme() {
    return getTheme(this);
  }

  get canIncrease() {
    return this.state.quantity < this.props.maxValue;
  }

  get canDecrease() {
    return this.state.quantity > this.props.minValue;
  }

  decrease = () => {
    if (this.canDecrease) {
      this.setState(
        (prevState) => ({
          quantity: prevState.quantity - 1,
        }),
        () => {
          this.props.onChangeQuantity(this.state.quantity);
        },
      );
    }
  };

  increase = () => {
    if (this.canIncrease) {
      this.setState(
        (prevState) => ({
          quantity: prevState.quantity + 1,
        }),
        () => {
          this.props.onChangeQuantity(this.state.quantity);
        },
      );
    }
  };

  get valueWrapperStyle() {
    return {
      borderRadius: this.theme.layout.borderRadiusSmall,
      borderColor: this.theme.color.border,
      borderWidth: this.theme.layout.borderWidth,
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <Typography type={TypographyType.TITLE_SEMI_LARGE} style={styles.label}>
          {this.props.t('quantity')}
        </Typography>

        <View style={styles.controlBtnWrapper}>
          <IconButton
            primaryHighlight
            disabled={!this.canDecrease}
            bundle={BundleIconSetName.ANT_DESIGN}
            name="minuscircle"
            iconStyle={styles.icon}
            onPress={this.decrease}
          />
          <View style={[styles.valueWrapper, this.valueWrapperStyle]}>
            <Typography type={TypographyType.LABEL_LARGE} style={styles.value}>
              {this.state.quantity}
            </Typography>
          </View>
          <IconButton
            primaryHighlight
            disabled={!this.canIncrease}
            bundle={BundleIconSetName.ANT_DESIGN}
            name="pluscircle"
            iconStyle={styles.icon}
            onPress={this.increase}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    paddingTop: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontWeight: 'bold',
  },
  controlBtnWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlBtn: {
    width: 26,
    height: 26,
  },
  valueWrapper: {
    width: 42,
    paddingVertical: 6,
    marginHorizontal: 12,
  },
  value: {
    fontWeight: '500',
    textAlign: 'center',
  },
  icon: {
    fontSize: 26,
  },
});

export default withTranslation('phoneCard')(ChooseQuantity);
