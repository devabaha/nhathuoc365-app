import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {CardBorderRadiusType, TypographyType} from 'src/components/base';
// images
import searchImage from '../../assets/images/search.png';
import closeImage from '../../assets/images/close.png';
// custom components
import {Card, ImageButton, Input} from 'src/components/base';
import Image from 'src/components/Image';

class Search extends PureComponent {
  static contextType = ThemeContext;

  static propTypes = {
    value: PropTypes.string,
    onChangeText: PropTypes.func,
    onClearText: PropTypes.func,
    placeholder: PropTypes.string,
  };

  static defaultProps = {
    value: '',
    onChangeText: () => {},
    onClearText: () => {},
  };

  get theme() {
    return getTheme(this);
  }

  get placeholder() {
    return this.props.placeholder || this.props.t('searchContactsPlaceholder');
  }
  render() {
    return (
      <Card
        row
        borderRadiusSize={CardBorderRadiusType.SMALL}
        style={styles.container}>
        <Image style={styles.icon} source={searchImage} />
        <Input
          type={TypographyType.LABEL_SEMI_LARGE}
          style={styles.textInput}
          placeholder={this.props.placeholder}
          placeholderTextColor={this.theme.color.placeholder}
          value={this.props.value}
          onChangeText={this.props.onChangeText}
        />
        {!!this.props.value && (
          <ImageButton
            imageStyle={styles.icon}
            source={closeImage}
            onPress={this.props.onClearText}
          />
        )}
      </Card>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 8,
    paddingHorizontal: 8,
  },
  icon: {
    width: 18,
    height: 18,
  },
  textInput: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 8,
  },
});

export default withTranslation('phoneCardContact')(Search);
