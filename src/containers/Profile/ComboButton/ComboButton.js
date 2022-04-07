import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// images
import SVGPhone from 'src/images/phone.svg';
import SVGChat from 'src/images/chat.svg';
// custom components
import Button from 'src/components/Button';
import {Container} from 'src/components/base';

class ComboButton extends Component {
  static contextType = ThemeContext;

  state = {};

  renderCallIcon = (titleStyle) => {
    return (
      <SVGPhone
        style={styles.icon}
        width={20}
        height={20}
        fill={this.iconFillColor}
      />
    );
  };

  renderChatIcon = (titleStyle) => {
    return (
      <SVGChat
              style={styles.icon}
              width={20}
              height={20}
              fill={this.iconFillColor}
            />
    );
  };

  get theme() {
    return getTheme(this);
  }

  get btnCallStyle() {
    return {
      backgroundColor: this.theme.color.accent1,
    };
  }

  get iconFillColor() {
    return this.theme.color.onSecondary;
  }

  render() {
    return (
      <Container row style={[styles.container, this.props.style]}>
        <Button
          onPress={this.props.onCall}
          title={this.props.t('call')}
          containerStyle={styles.btnContainer}
          btnContainerStyle={[styles.btnContent, this.btnCallStyle]}
          titleStyle={styles.btnTitle}
          renderIconLeft={this.renderCallIcon}
        />
        <Button
          onPress={this.props.onChat}
          title={this.props.t('chat')}
          containerStyle={styles.btnContainer}
          btnContainerStyle={[styles.btnContent]}
          titleStyle={styles.btnTitle}
          renderIconLeft={this.renderChatIcon}
        />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
  },
  btnContainer: {
    width: null,
    flex: 1,
  },
  btnContent: {
    paddingVertical: 12,
  },
  icon: {
    marginRight: 7,
  },
  btnTitle: {
    fontSize: 14,
  },
});

export default withTranslation('profileDetail')(ComboButton);
