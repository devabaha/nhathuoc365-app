import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
// 3-party libs
import {withTranslation} from 'react-i18next';
// helpers
import numberFormat from '../../helper/numberFormat';
import getNetworkImage from '../../helper/getNetworkImage';
import {getTheme} from 'src/Themes/Theme.context';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {TypographyType} from 'src/components/base';
// custom components
import {
  Card,
  FlatList,
  Typography,
  TextButton,
  BaseButton,
} from 'src/components/base';
import Image from 'src/components/Image';

class SelectCardHistory extends Component {
  static contextType = ThemeContext;

  static propTypes = {
    data: PropTypes.array,
    onSelectCardHistory: PropTypes.func,
    onShowHistory: PropTypes.func,
    showHistory: PropTypes.bool,
    heading: PropTypes.string,
  };

  static defaultProps = {
    data: [],
    onSelectCardHistory: () => {},
    onShowHistory: () => {},
    showHistory: true,
    heading: '',
  };

  viewHistoryTitleTypoProps = {type: TypographyType.LABEL_SEMI_LARGE_PRIMARY};

  get theme() {
    return getTheme(this);
  }

  getPrice = (cashback) => {
    return numberFormat(cashback) + 'đ';
  };

  renderCardValues() {
    return (
      <FlatList
        horizontal
        data={this.props.data}
        renderItem={this.renderCardValueItem}
        keyExtractor={(item, index) => `${index}`}
        showsHorizontalScrollIndicator={false}
      />
    );
  }

  renderCardValueItem = ({item: card, index}) => {
    const last = index === this.props.data.length - 1;
    return (
      <BaseButton
        onPress={() => this.props.onSelectCardHistory(card)}
        style={[
          styles.cardBtn,
          {
            marginRight: last ? 0 : 10,
          },
        ]}>
        <Card style={[styles.btnContent, this.btnContentStyle]}>
          <View style={styles.cardInfoWrapper}>
            <Image
              style={styles.networkImage}
              source={getNetworkImage(card.type)}
            />
            <View>
              <Typography
                type={TypographyType.LABEL_MEDIUM}
                style={styles.cardName}>
                {card.name}
              </Typography>
              <Typography
                type={TypographyType.DESCRIPTION_MEDIUM_TERTIARY}
                style={styles.cardBuyTime}>
                {card.created}
              </Typography>
            </View>
          </View>
          <View
            style={[styles.descriptionWrapper, this.descriptionWrapperStyle]}>
            <Typography
              type={TypographyType.LABEL_SMALL}
              style={styles.description}>
              {this.props.t('pricePrefix')}
              {': '}
              <Typography
                type={TypographyType.LABEL_SMALL}
                style={styles.cashback}>
                {card.price_label}
              </Typography>
            </Typography>
          </View>
        </Card>
      </BaseButton>
    );
  };

  get btnContentStyle() {
    return {
      borderWidth: this.theme.layout.borderWidth,
      borderColor: this.theme.color.border,
    };
  }

  get descriptionWrapperStyle() {
    return {
      borderTopWidth: this.theme.layout.borderWidth,
      borderColor: this.theme.color.border,
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headingWrapper}>
          <Typography
            type={TypographyType.TITLE_SEMI_LARGE}
            style={styles.label}>
            {this.props.heading}
          </Typography>

          {this.props.showHistory && (
            <TextButton
              typoProps={this.viewHistoryTitleTypoProps}
              titleStyle={styles.viewHistoryText}
              onPress={this.props.onShowHistory}>
              {this.props.t('transfer:contactInput.historyTitle')}
            </TextButton>
          )}
        </View>

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
  headingWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewHistoryText: {},
  label: {
    fontWeight: 'bold',
  },
  cardBtn: {
    width: 200,
    flexDirection: 'column',
    height: 86,
    overflow: 'hidden',
    marginTop: 16,
  },
  btnContent: {
    flex: 1,
  },
  cardInfoWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  networkImage: {
    width: 56,
    height: 56,
    marginLeft: 10,
  },
  cardName: {
    fontWeight: '600',
    marginLeft: 8,
  },
  cardBuyTime: {
    marginLeft: 8,
  },
  descriptionWrapper: {
    marginHorizontal: 8,
    paddingVertical: 3,
  },
  description: {},
  cashback: {
    fontWeight: '600',
  },
});

export default withTranslation(['phoneCard', 'transfer'])(SelectCardHistory);
