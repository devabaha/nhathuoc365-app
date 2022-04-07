import React, {PureComponent} from 'react';
import {View, StyleSheet} from 'react-native';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {TypographyType} from 'src/components/base';
// custom components
import {Container, Typography} from 'src/components/base';

class PaymentWallet extends PureComponent {
  static contextType = ThemeContext;

  get theme() {
    return getTheme(this);
  }

  get leftStyle() {
    return {
      borderRightWidth: this.theme.layout.borderWidthSmall,
      borderRightColor: this.theme.color.border,
    };
  }

  render() {
    return (
      <Container style={styles.container}>
        <View style={[styles.left, this.leftStyle]}>
          <Typography
            type={TypographyType.LABEL_SEMI_MEDIUM}
            style={styles.title}>
            {this.props.sourceTitle}
          </Typography>
          <Typography
            style={styles.value}
            type={TypographyType.LABEL_SEMI_LARGE}>
            {this.props.sourceValue}
          </Typography>
        </View>
        <View style={styles.right}>
          <Typography
            style={styles.title}
            type={TypographyType.LABEL_SEMI_MEDIUM}>
            {this.props.balanceTitle}
          </Typography>
          <Typography
            type={TypographyType.LABEL_SEMI_LARGE}
            style={styles.value}>
            {this.props.balanceValue}
          </Typography>
        </View>
      </Container>
    );
  }
}

export default PaymentWallet;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingBottom: 50,
  },
  left: {
    flex: 1,
    paddingHorizontal: 15,
  },
  right: {
    flex: 1,
    alignItems: 'flex-end',
    paddingHorizontal: 15,
  },
  title: {
    marginBottom: 10,
  },
  value: {
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
