import React, {Component} from 'react';
import {View, ViewPropTypes, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
// 3-party libs
import {withTranslation} from 'react-i18next';
// configs
import config from '../../config';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {Card, TypographyType} from 'src/components/base';
// custom components
import {BaseButton, Typography} from 'src/components/base';

class SelectCardValue extends Component {
  static contextType = ThemeContext;

  static propTypes = {
    data: PropTypes.array,
    onSelectCardValue: PropTypes.func,
    cardValueType: PropTypes.string,
    title: PropTypes.string,
    cardValueBtnStyle: ViewPropTypes.style,
  };

  static defaultProps = {
    data: [],
    onSelectCardValue: () => {},
    cardValueType: '',
    cardValueBtnStyle: {},
  };

  get theme() {
    return getTheme(this);
  }

  get title() {
    return this.props.title || this.props.t('cardPrice');
  }

  renderCardValues() {
    return (
      <View style={styles.cardValueContainer}>
        {this.props.data.map((item, index) => {
          return this.renderCardValueItem({item, index});
        })}
      </View>
    );
  }

  renderCardValueItem = ({item: cardValue, index}) => {
    const isActive = this.props.cardValueType === cardValue.type;
    const isLastInRow = (index + 1) % 3 === 0;
    return (
      <BaseButton
        key={index}
        onPress={() => this.props.onSelectCardValue(cardValue)}
        style={[
          styles.cardValueBtn,
          !isLastInRow && styles.cardValueBtnSpacing,
          this.props.cardValueBtnStyle,
        ]}>
        <Card
          style={[
            styles.btnContent,
            this.btnContentStyle,
            isActive && this.cardValueBtnActiveStyle,
          ]}>
          <View style={styles.valueWrapper}>
            <Typography
              type={TypographyType.LABEL_LARGE_TERTIARY}
              style={[styles.value, isActive && this.valueActiveStyle]}>
              {cardValue.label}
            </Typography>
            {!!cardValue.subLabel && (
              <Typography
                type={TypographyType.LABEL_SMALL}
                style={styles.subValue}>
                {cardValue.subLabel}
              </Typography>
            )}
          </View>
          {cardValue.cashbackValue && (
            <View
              style={[styles.descriptionWrapper, this.descriptionWrapperStyle]}>
              <Typography
                type={TypographyType.DESCRIPTION_TINY_TERTIARY}
                style={styles.description}>
                {cardValue.cashbackLabel}
                {cardValue.cashbackValue && (
                  <Typography
                    type={TypographyType.DESCRIPTION_TINY_TERTIARY}
                    style={[styles.cashback, this.cashbackStyle]}>
                    {cardValue.cashbackValue}
                  </Typography>
                )}
              </Typography>
            </View>
          )}
        </Card>
      </BaseButton>
    );
  };

  get btnContentStyle() {
    return {
      borderWidth: this.theme.layout.borderWidthLarge,
      borderColor: this.theme.color.border,
    };
  }

  get cardValueBtnActiveStyle() {
    return {
      borderColor: this.theme.color.primaryHighlight,
    };
  }

  get valueActiveStyle() {
    return {
      color: this.theme.color.primaryHighlight,
    };
  }

  get descriptionWrapperStyle() {
    return {
      borderTopWidth: this.theme.layout.borderWidth,
      borderColor: this.theme.color.border,
    };
  }

  get cashbackStyle() {
    return {
      color: this.theme.color.accent2,
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <Typography type={TypographyType.TITLE_SEMI_LARGE} style={styles.label}>
          {this.title}
        </Typography>

        {this.renderCardValues()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    paddingTop: 10,
    paddingHorizontal: 16,
  },
  label: {
    fontWeight: 'bold',
  },
  cardValueContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cardValueBtn: {
    width: config.device.width / 3 - 16,
    flexDirection: 'column',
    height: 71,
    marginTop: 16,
    justifyContent: 'center',
  },
  cardValueBtnSpacing: {
    marginRight: 8,
  },
  btnContent: {
    width: config.device.width / 3 - 16,
    height: 73,
  },
  valueWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  value: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subValue: {
    textAlign: 'center',
    marginTop: 5,
  },
  valueActive: {},
  descriptionWrapper: {
    marginHorizontal: 6,
    paddingVertical: 3,
  },
  description: {
    // textAlign: 'center',
  },
  cashback: {
    fontWeight: '600',
  },
});

export default withTranslation('phoneCard')(SelectCardValue);
