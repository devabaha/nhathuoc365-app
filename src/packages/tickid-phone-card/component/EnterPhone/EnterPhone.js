import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, StyleSheet} from 'react-native';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {Card, TypographyType} from 'src/components/base';
// images
import phoneBookImage from '../../assets/images/phone-book.png';
// custom components
import {ImageButton, Input, TextButton, Typography} from 'src/components/base';

const defaultListener = () => {};

class EnterPhone extends Component {
  static contextType = ThemeContext;

  static propTypes = {
    data: PropTypes.array,
    editable: PropTypes.bool,
    showHistory: PropTypes.bool,
    hideChangeNetwork: PropTypes.bool,
    hideContact: PropTypes.bool,
    contactName: PropTypes.string,
    contactPhone: PropTypes.string,
    onOpenContact: PropTypes.func,
    onShowHistory: PropTypes.func,
    onBlur: PropTypes.func,
    onPressSelectNetwork: PropTypes.func,
    onChangeText: PropTypes.func,
    networkType: PropTypes.string,
    keyboardType: PropTypes.string,
    errorMessage: PropTypes.string,
    placeholder: PropTypes.string,
    title: PropTypes.string,
    historyTitle: PropTypes.string,
    customRightComponent: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.node,
    ]),
    inputStyle: PropTypes.object,
    inputContainerStyle: PropTypes.object,
  };

  static defaultProps = {
    data: [],
    editable: false,
    showHistory: true,
    hideChangeNetwork: false,
    hideContact: false,
    contactName: '',
    contactPhone: '',
    onOpenContact: defaultListener,
    onShowHistory: defaultListener,
    onBlur: defaultListener,
    onPressSelectNetwork: defaultListener,
    onChangeText: defaultListener,
    networkType: '',
    keyboardType: 'phone-pad',
    errorMessage: '',
    customRightComponent: null,
    inputStyle: {},
    inputContainerStyle: {},
  };

  contactBtnTypoProps = {type: TypographyType.LABEL_SEMI_HUGE};

  get theme() {
    return getTheme(this);
  }

  get currentNetworkType() {
    return this.props.data.find(
      (network) => network.type === this.props.networkType,
    );
  }

  get title() {
    return this.props.title || this.props.t('contactInput.title');
  }

  get placeholder() {
    return this.props.placeholder || this.props.t('contactInput.placeholder');
  }

  get historyTitle() {
    return this.props.historyTitle || this.props.t('contactInput.historyTitle');
  }

  get hasError() {
    return !!this.props.errorMessage;
  }

  get errorStyle() {
    return {borderColor: this.theme.color.danger};
  }

  get errorMessageStyle() {
    return {color: this.theme.color.danger};
  }

  get placeholderStyle() {
    return {
      color: this.theme.color.placeholder,
    };
  }

  get networkImageStyle() {
    return {
      borderRadius: this.theme.layout.borderRadiusMedium,
      borderWidth: this.theme.layout.borderWidth,
      borderColor: this.theme.color.border,
    };
  }
  get inputBtnStyle() {
    return {
      borderColor: this.theme.color.border,
      borderWidth: this.theme.layout.borderWidth,
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headingWrapper}>
          <Typography
            type={TypographyType.LABEL_SEMI_HUGE}
            style={styles.label}>
            {this.title}
          </Typography>

          {this.props.showHistory && (
            <TextButton
              typoProps={{type: TypographyType.LABEL_SEMI_LARGE}}
              onPress={this.props.onShowHistory}
              primaryHighlight>
              {this.historyTitle}
            </TextButton>
          )}
        </View>
        {!!this.props.contactName && (
          <Typography
            type={TypographyType.LABEL_TINY}
            style={styles.contactName}>
            {this.props.contactName}
          </Typography>
        )}

        <View style={styles.enterContact}>
          <Card
            style={[
              this.inputBtnStyle,
              styles.inputBtn,
              this.hasError && this.errorStyle,
              this.props.inputContainerStyle,
            ]}>
            {this.props.editable ? (
              <View style={styles.phoneBtn}>
                <Input
                  type={TypographyType.LABEL_SEMI_HUGE}
                  style={[styles.input, this.props.inputStyle]}
                  value={this.props.contactPhone}
                  onBlur={this.props.onBlur}
                  onChangeText={this.props.onChangeText}
                  keyboardType={this.props.keyboardType}
                  placeholder={this.placeholder}
                  placeholderTextColor={this.theme.color.placeholder}
                />
              </View>
            ) : (
              <TextButton
                style={this.props.inputStyle}
                typoProps={this.contactBtnTypoProps}
                titleStyle={
                  this.props.contactPhone ? styles.input : this.placeholderStyle
                }
                onPress={this.props.onOpenContact}>
                {this.props.contactPhone || this.placeholder}
              </TextButton>
            )}
            {!this.props.hideContact && (
              <ImageButton
                onPress={this.props.onOpenContact}
                style={styles.contactBtn}
                imageStyle={styles.phoneBook}
                source={phoneBookImage}
              />
            )}
          </Card>

          {!this.props.hideChangeNetwork &&
            !!!this.props.customRightComponent && (
              <ImageButton
                onPress={this.props.onPressSelectNetwork}
                style={styles.networkBtn}
                imageStyle={[this.networkImageStyle, styles.networkImage]}
                source={this.currentNetworkType.localImage}
              />
            )}
          {!!this.props.customRightComponent && this.props.customRightComponent}
        </View>
        {this.hasError && (
          <Typography
            type={TypographyType.LABEL_LARGE}
            style={[this.errorMessageStyle, styles.errorMessage]}>
            {this.props.errorMessage}
          </Typography>
        )}
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
  viewHistoryText: {
    fontWeight: '400',
  },
  label: {
    fontWeight: 'bold',
  },
  contactName: {
    marginTop: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  inputBtn: {
    flex: 1,
    marginTop: 12,
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  errorMessage: {
    fontWeight: '400',
    marginTop: 8,
  },
  input: {
    paddingTop: 0,
    paddingBottom: 0,
    fontWeight: '400',
    textAlign: 'left',
  },
  phoneBtn: {
    flex: 1,
  },
  contactBtn: {
    paddingLeft: 32,
  },
  phoneBook: {
    width: 28,
    height: 28,
  },
  enterContact: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  networkBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
  },
  networkImage: {
    marginTop: 13,
    width: 46,
    height: 46,
    resizeMode: 'contain',
  },
});

export default withTranslation('transfer')(EnterPhone);
