import React, {Component} from 'react';
import {View, StyleSheet, Image, Keyboard} from 'react-native';
import appConfig from 'app-config';
// 3-party libs
import Animated, {Easing} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import Shimmer from 'react-native-shimmer';
// helpers
import {mergeStyles} from 'src/Themes/helper';
import {getTheme} from 'src/Themes/Theme.context';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {BundleIconSetName, TypographyType} from 'src/components/base';
// custom components
import {
  Container,
  Typography,
  ScrollView,
  Input,
  Icon,
} from 'src/components/base';
import Button from 'src/components/Button';

const {concat, Extrapolate} = Animated;
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  borderTop: {
    height: 2,
    width: appConfig.device.width,
  },
  header: {
    justifyContent: 'space-between',
    padding: 15,
  },
  image: {
    width: 30,
    height: '100%',
    position: 'absolute',
    zIndex: 9,
    top: '-55%',
    left: 20,
    transform: [{rotate: '-3deg'}],
  },
  titleContainer: {
    flex: 1,
    flexWrap: 'wrap',
  },
  mainTitleContainer: {
    flexWrap: 'wrap',
  },
  noteContainer: {
    paddingVertical: 3,
    paddingHorizontal: 7,
    marginBottom: 5,
  },
  note: {
    fontStyle: 'italic',
  },
  highlight: {
    fontWeight: 'bold',
  },
  title: {
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginRight: 7,
    marginBottom: 5,
  },
  pointTitle: {
    marginTop: 5,
    marginRight: 20,
    fontWeight: '300',
  },
  totalPoint: {
    fontWeight: '500',
  },
  feePoint: {
    fontWeight: '500',
  },
  collapseContainer: {
    top: -3,
    width: null,
    alignSelf: 'flex-start',
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  collapseWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  collapseBtnContainer: {
    width: null,
    backgroundColor: 'transparent',
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  collapseIcon: {
    fontSize: 30,
  },
  collapseText: {
    fontWeight: '300',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    padding: 15,
    paddingBottom: 0,
  },
  inputContainer: {
    borderTopLeftRadius: 0,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 15,
    textAlign: 'center',
    fontSize: 20,
    letterSpacing: 2,
    fontWeight: 'bold',
  },
  btnContainer: {
    width: null,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  submitBtnContainer: {
    width: null,
    borderTopLeftRadius: 0,
    paddingHorizontal: 15,
  },
  footer: {
    marginTop: 10,
  },
  resultsContainer: {
    maxHeight: 300,
  },
  results: {
    flexGrow: 1,
    flexWrap: 'wrap',
    paddingBottom: 10,
  },
  resultsSubmittedTitle: {
    marginRight: 10,
    marginTop: 10,
  },
  resultContainer: {
    paddingVertical: 3,
    paddingHorizontal: 5,
    marginRight: 7,
    marginTop: 10,
  },
  result: {
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
  messageContainer: {
    marginHorizontal: -15,
    marginTop: -15,
    padding: 15,
  },
  message: {
    textAlign: 'center',
    letterSpacing: 0.3,
    fontWeight: '500',
  },
});

const animatedConfig = {
  duration: 300,
  easing: Easing.out(Easing.quad),
};

class Footer extends Component {
  static contextType = ThemeContext;

  state = {
    containerHeight: undefined,
    isCollapsed: false,
    collapseText: this.props.t('footer.closeTitle'),
    number: '',
  };
  translateY = new Animated.Value(0);

  get theme() {
    return getTheme(this);
  }

  get submitDisabled() {
    return Number.isNaN(this.state.number) || this.state.number === '';
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.isCollapsed !== this.state.isCollapsed) {
      Animated.timing(this.translateY, {
        ...animatedConfig,
        toValue: nextState.isCollapsed ? 1 : 0,
        duration: 300,
      }).start();
    }
    return true;
  }

  submit = () => {
    Keyboard.dismiss();
    this.props.onSubmit(this.state.number);
    this.setState({number: ''});
  };

  onChangeText = (number) => {
    this.setState({number});
  };

  onToogleCollapse = () => {
    this.props.collapsing(!this.state.isCollapsed, {
      ...animatedConfig,
      toValue: this.state.isCollapsed ? this.state.containerHeight : 0,
    });
    this.setState({
      isCollapsed: !this.state.isCollapsed,
      collapseText: !this.state.isCollapsed
        ? this.props.t('footer.openTitle')
        : this.props.t('footer.closeTitle'),
    });
  };

  handleContentLayout = (e) => {
    const containerHeight = e.nativeEvent.layout.height;
    if (this.state.containerHeight === undefined) {
      this.props.collapsing(!this.state.isCollapsed, {
        ...animatedConfig,
        toValue: containerHeight,
      });
    }
    this.setState({containerHeight});
  };

  renderResults() {
    if (!this.props.hasResults) {
      return (
        <Container style={this.resultContainerStyle}>
          <Typography
            type={TypographyType.LABEL_SMALL}
            style={this.resultStyle}>
            {this.props.t('footer.noResult')}
          </Typography>
        </Container>
      );
    }
    return this.props.results.map((result, index) => (
      <View key={index} style={this.resultContainerStyle}>
        <Typography type={TypographyType.LABEL_SMALL} style={this.resultStyle}>
          {result}
        </Typography>
      </View>
    ));
  }

  get noteContainerStyle() {
    return mergeStyles(styles.noteContainer, {
      backgroundColor: this.theme.color.contentBackground,
      borderRadius: this.theme.layout.borderRadiusExtraSmall,
    });
  }

  get collapseIconStyle() {
    return mergeStyles(styles.collapseIcon, {
      color: this.theme.color.onSurface,
    });
  }

  get contentStyle() {
    return mergeStyles(styles.content, {
      borderColor: this.theme.color.border,
      borderTopWidth: this.theme.layout.borderWidthSmall,
    });
  }

  get inputContainerStyle() {
    return mergeStyles(styles.inputContainer, {
      backgroundColor: this.theme.color.contentBackground,
      borderRadius: this.theme.layout.borderRadiusMedium,
    });
  }

  get feePointStyle() {
    return mergeStyles(styles.feePoint, {color: this.theme.color.marigold});
  }

  get totalPointStyle() {
    return mergeStyles(styles.totalPoint, {color: this.theme.color.cherry});
  }

  get highlightStyle() {
    return mergeStyles(styles.highlight, {color: this.theme.color.marigold});
  }

  get textInputStyle() {
    return mergeStyles(styles.textInput, {
      color: this.theme.color.primaryHighlight,
    });
  }

  get resultContainerStyle() {
    return mergeStyles(styles.resultContainer, {
      backgroundColor: this.theme.color.cherry,
      borderRadius: this.theme.layout.borderRadiusExtraSmall,
    });
  }

  get resultStyle() {
    return mergeStyles(styles.result, {
      color: this.theme.color.onPersistPrimary,
    });
  }

  get messageContainerStyle() {
    return mergeStyles(styles.messageContainer, {
      backgroundColor: this.theme.color.marigold,
    });
  }
  get messageStyle() {
    return mergeStyles(styles.message, {
      color: this.theme.color.onPersistPrimary,
    });
  }

  get linearGradientColor() {
    return [this.theme.color.cherry, this.theme.color.marigold];
  }

  render() {
    const translateYStyle = this.state.containerHeight !== undefined && {
      transform: [
        {
          translateY: this.translateY.interpolate({
            inputRange: [0, 1],
            outputRange: [0, this.state.containerHeight],
          }),
        },
      ],
    };
    const rotateStyle = {
      transform: [
        {
          rotate: concat(
            this.translateY.interpolate({
              inputRange: [0, 0.5],
              outputRange: [0, 180],
              extrapolate: Extrapolate.CLAMP,
            }),
            'deg',
          ),
        },
      ],
    };

    return (
      <Container reanimated shadow style={[styles.container, translateYStyle]}>
        <Shimmer
          animating
          opacity={1}
          animationOpacity={0.4}
          pauseDuration={3000}>
          <View>
            <LinearGradient
              style={styles.borderTop}
              colors={this.linearGradientColor}
              locations={[0, 1]}
              useAngle
              angle={135}
            />
          </View>
        </Shimmer>
        <View style={[styles.row, styles.header]}>
          <Image
            source={require('../../../../images/numbers.png')}
            resizeMode="contain"
            style={styles.image}
          />
          <View style={[styles.titleContainer]}>
            <View style={[styles.row, styles.mainTitleContainer]}>
              <Typography
                type={TypographyType.LABEL_MEDIUM_TERTIARY}
                style={styles.title}>
                {this.props.title}
              </Typography>
              {!!this.props.isActive && (
                <Container style={this.noteContainerStyle}>
                  <Typography
                    type={TypographyType.LABEL_SMALL}
                    style={styles.note}>
                    {this.props.t('footer.remainTurnTitle')}{' '}
                    <Typography
                      type={TypographyType.LABEL_MEDIUM}
                      style={this.highlightStyle}>
                      {this.props.maxTurn}
                    </Typography>{' '}
                    {this.props.t('footer.freeTurn')}
                  </Typography>
                </Container>
              )}
            </View>
            <View style={styles.row}>
              {!!this.props.totalPoint && (
                <Typography
                  type={TypographyType.LABEL_SMALL}
                  style={styles.pointTitle}>
                  {this.props.t('footer.remainPointTitle')}{' '}
                  <Typography
                    type={TypographyType.LABEL_MEDIUM}
                    style={this.totalPointStyle}>
                    {this.props.totalPoint}
                  </Typography>
                </Typography>
              )}
              {!!this.props.feePoint && (
                <Typography
                  type={TypographyType.LABEL_SMALL}
                  style={styles.pointTitle}>
                  {this.props.t('footer.pointOfUse')}{' '}
                  <Typography
                    type={TypographyType.LABEL_MEDIUM}
                    style={this.feePointStyle}>
                    {this.props.feePoint}
                  </Typography>
                </Typography>
              )}
            </View>
          </View>

          <Button
            iconLeft={
              <View style={styles.collapseWrapper}>
                <Typography
                  type={TypographyType.LABEL_SMALL}
                  style={styles.collapseText}>
                  {this.state.collapseText}
                </Typography>
                <Icon
                  reanimated
                  bundle={BundleIconSetName.MATERIAL_ICONS}
                  style={[this.collapseIconStyle, rotateStyle]}
                  name="arrow-drop-down"
                />
              </View>
            }
            onPress={this.onToogleCollapse}
            containerStyle={styles.collapseContainer}
            btnContainerStyle={styles.collapseBtnContainer}
          />
        </View>

        <Container
          style={this.contentStyle}
          onLayout={this.handleContentLayout}>
          <>
            {this.props.isActive ? (
              <Container style={[styles.row, this.inputContainerStyle]}>
                <Input
                  style={this.textInputStyle}
                  keyboardType={
                    appConfig.device.isIOS ? 'number-pad' : 'numeric'
                  }
                  maxLength={this.props.maxLengthInput || 3}
                  selectionColor={this.theme.color.cherry}
                  placeholder={this.props.t('footer.placeholder')}
                  value={this.state.number}
                  onChangeText={this.onChangeText}
                />
                <Button
                  disabled={this.submitDisabled}
                  title={this.props.submitTitle}
                  onPress={this.submit}
                  containerStyle={styles.btnContainer}
                  btnContainerStyle={styles.submitBtnContainer}
                />
              </Container>
            ) : (
              <View style={[this.messageContainerStyle]}>
                <Typography
                  type={TypographyType.LABEL_MEDIUM}
                  style={this.messageStyle}>
                  {this.props.message}
                </Typography>
              </View>
            )}

            <ScrollView
              style={[styles.footer, styles.resultsContainer]}
              contentContainerStyle={[styles.results]}>
              <View style={[styles.row, styles.results]}>
                <Typography
                  type={TypographyType.LABEL_SMALL}
                  style={styles.resultsSubmittedTitle}>
                  {this.props.resultsSubmittedTitle}
                </Typography>
                {this.renderResults()}
              </View>
            </ScrollView>
          </>
        </Container>
      </Container>
    );
  }
}

export default withTranslation('lotteryGame')(Footer);
