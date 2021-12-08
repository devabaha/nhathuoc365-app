import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
// configs
import appConfig from 'app-config';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// context
import {getTheme, ThemeContext} from 'src/Themes/Theme.context';
// constants
import {ScrollView, TypographyType} from 'src/components/base';
// images
import SVGRocket from './src/images/rocket.svg';
// customs components
import {Typography, Container} from 'src/components/base';
import ProgressBar from './src/components/ProgressBar';
import Button from './src/components/Button';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    marginHorizontal: '-100%',
    marginVertical: '-100%',
  },
  contentContainer: {
    paddingHorizontal: 15,
    paddingTop: 30,
    paddingBottom: 15,
    marginHorizontal: -20,
  },
  suggestContainer: {
    maxHeight: appConfig.device.height * 0.28,
  },
  titleContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
    marginBottom: 20,
    overflow: 'hidden',
  },
  title: {
    textTransform: 'uppercase',
    fontWeight: '600',
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
  },
  progressBar: {
    marginTop: 25,
  },
  btnContainer: {
    paddingHorizontal: 0,
    marginTop: 10,
  },
  rocketContainer: {
    top: 0,
    left: 0,
    marginHorizontal: 10,
    width: 25,
    height: 25,
  },
  footerContainer: {
    marginTop: 20,
  },
  suggest: {
    fontWeight: '300',
    lineHeight: 18,
    paddingHorizontal: 15,
  },
  noteContainer: {
    marginTop: 20,
    padding: 15,
    paddingVertical: 10,
    marginHorizontal: 15,
  },
  note: {
    fontWeight: '300',
    fontStyle: 'italic',
  },
});

class AppCodePush extends Component {
  static contextType = ThemeContext;
  state = {
    remainingTime: 5,
  };
  counter = null;

  get theme() {
    return getTheme(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState !== this.state) {
      return true;
    }

    if (
      nextProps.title !== this.props.title ||
      nextProps.description !== this.props.description ||
      nextProps.progress !== this.props.progress ||
      nextProps.btnTitle !== this.props.btnTitle ||
      nextProps.t !== this.props.t
    ) {
      return true;
    }

    return false;
  }

  componentDidMount() {
    this.counter = setInterval(() => {
      this.setState((prevState) => {
        if (!prevState.remainingTime) {
          clearInterval(this.counter);
          return;
        }

        return {
          remainingTime: prevState.remainingTime - 1,
        };
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.counter);
  }

  get containerStyle() {
    return mergeStyles(styles.container, {
      backgroundColor: this.theme.color.overlay60,
    });
  }

  get contentContainerStyle() {
    return mergeStyles(styles.contentContainer, {
      borderRadius: this.theme.layout.borderRadiusExtraSmall,
    });
  }

  get noteContainerStyle() {
    return mergeStyles(styles.noteContainer, {
      backgroundColor: this.theme.color.contentBackgroundWeak,
      borderRadius: this.theme.layout.borderRadiusExtraSmall,
    });
  }

  get titleContainerStyle() {
    return mergeStyles(styles.titleContainer, {
      borderBottomColor: this.theme.color.border,
      borderBottomWidth: this.theme.layout.borderWidthSmall,
    });
  }

  render() {
    const confirmBtnTitle =
      this.props.confirmBtnTitle || this.props.t('codePush.runInBackground');
    return (
      <>
        <View style={this.containerStyle} />
        <Container style={this.contentContainerStyle}>
          {!!this.props.title && (
            <Container noBackground style={this.titleContainerStyle}>
              <View style={styles.rocketContainer}>
                <SVGRocket width="100%" height="100%" />
              </View>
              <Typography
                type={TypographyType.TITLE_SEMI_LARGE_TERTIARY}
                style={styles.title}>
                {this.props.title}
              </Typography>
            </Container>
          )}

          {!!this.props.description && (
            <Typography
              type={TypographyType.LABEL_MEDIUM_TERTIARY}
              style={styles.description}>
              {this.props.description}
            </Typography>
          )}

          {!!this.props.progress && (
            <View style={styles.progressBar}>
              <ProgressBar
                progress={this.props.progress}
                height={7}
                backgroundColor={this.theme.color.persistPrimary}
                onCompletion={this.props.onProgressComplete}
              />
            </View>
          )}

          <View style={styles.footerContainer}>
            <ScrollView style={styles.suggestContainer}>
              <Typography
                type={TypographyType.DESCRIPTION_SEMI_MEDIUM_TERTIARY}
                style={styles.suggest}>
                {this.props.t('codePush.alert.suggestMessage', {
                  btnTitle: confirmBtnTitle,
                })}
              </Typography>
            </ScrollView>
            <Container style={this.noteContainerStyle}>
              <Typography type={TypographyType.LABEL_SMALL} style={styles.note}>
                {this.props.t('codePush.alert.noteMessage')}
              </Typography>
            </Container>
            <Button
              disabled={!!this.state.remainingTime}
              title={
                confirmBtnTitle +
                (this.state.remainingTime
                  ? ` (${this.state.remainingTime})`
                  : '')
              }
              containerStyle={styles.btnContainer}
              onPress={this.props.onPressConfirm}
            />
          </View>
        </Container>
      </>
    );
  }
}

export default withTranslation()(AppCodePush);
