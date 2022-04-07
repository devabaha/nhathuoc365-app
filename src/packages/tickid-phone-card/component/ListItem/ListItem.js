import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {BundleIconSetName, TypographyType} from 'src/components/base';
// custom components
import {BaseButton, Icon, Typography} from 'src/components/base';

class ListItem extends Component {
  static contextType = ThemeContext;

  static propTypes = {
    heading: PropTypes.string,
    text: PropTypes.string,
    children: PropTypes.node,
    texts: PropTypes.array,
    onPress: PropTypes.func,
  };

  static defaultProps = {
    heading: '',
    text: '',
    children: null,
    texts: [],
    onPress: () => {},
  };

  get theme() {
    return getTheme(this);
  }

  renderTexts = () => {
    return this.props.texts.map((text, index) => (
      <Typography
        type={TypographyType.LABEL_MEDIUM_TERTIARY}
        style={styles.text}
        key={index}>
        {`${text[0]} `}
        <Typography type={TypographyType.LABEL_MEDIUM} style={styles.textBlack}>
          {text[1]}
        </Typography>
      </Typography>
    ));
  };

  get containerStyle() {
    return {
      borderBottomWidth: this.theme.layout.borderWidth,
      borderColor: this.theme.color.border,
    };
  }

  render() {
    return (
      <BaseButton
        style={[styles.container, this.containerStyle]}
        onPress={this.props.onPress}>
        <View style={styles.content}>
          <Typography
            type={TypographyType.LABEL_SEMI_LARGE}
            style={styles.heading}>
            {this.props.heading}
          </Typography>
          {!!this.props.text && (
            <Typography
              type={TypographyType.DESCRIPTION_MEDIUM_TERTIARY}
              style={styles.text}>
              {this.props.text}
            </Typography>
          )}
          {this.props.texts.length > 0 && this.renderTexts()}
        </View>
        <Icon
          neutral
          bundle={BundleIconSetName.ANT_DESIGN}
          name="right"
          style={styles.rightIcon}
        />
      </BaseButton>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    paddingVertical: 8,
  },
  content: {
    flex: 1,
  },
  heading: {
    fontWeight: '500',
    marginBottom: 6,
  },
  text: {},
  textBlack: {},
  rightIcon: {
    fontSize: 20,
  },
});

export default ListItem;
