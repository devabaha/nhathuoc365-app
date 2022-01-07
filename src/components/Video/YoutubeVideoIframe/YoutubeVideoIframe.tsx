import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
// 3-party libs
import YoutubeIframe, {getYoutubeMeta} from 'react-native-youtube-iframe';
import equal from 'deep-equal';
import {withTranslation} from 'react-i18next';
// types
import {YoutubeVideoIframeProps} from '.';
import {Style} from 'src/Themes/interface';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {TypographyType, BundleIconSetName} from 'src/components/base';
// custom components
import {Container, Typography, Icon} from 'src/components/base';
import Loading from 'src/components/Loading';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mask: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorIcon: {
    fontSize: 36,
  },
  errorMessage: {
    marginTop: 15,
  },
});

class YoutubeVideoIframe extends Component<YoutubeVideoIframeProps> {
  static contextType = ThemeContext;

  static defaultProps = {
    autoAdjustLayout: false,
  };

  refPlayer = React.createRef();

  state = {
    isError: false,
    loading: true,
    height: this.props.height,
    width: this.props.width,
    metaData: undefined,
    containerWidth: undefined,
    containerHeight: undefined,
  };

  get theme() {
    return getTheme(this);
  }

  shouldComponentUpdate(nextProps: YoutubeVideoIframeProps, nextState) {
    if (nextState !== this.state) {
      return true;
    }

    if (!equal(nextProps, this.props)) {
      if (
        nextProps.autoAdjustLayout &&
        (nextProps.height !== this.props.height ||
          nextProps.width !== this.props.width)
      ) {
        const {width, height} = this.getAdjustedVideoLayout(
          nextState.metaData,
          nextState.containerWidth,
          nextProps.width,
          nextProps.height,
        );

        this.setState({width, height});
      }

      if (
        nextProps.autoAdjustLayout !== this.props.autoAdjustLayout &&
        !nextProps.autoAdjustLayout
      ) {
        this.setState({width: nextProps.width, height: nextProps.height});
      }
      return true;
    }

    return false;
  }

  getAdjustedVideoLayout = (
    metaData = this.state.metaData,
    containerWidth = this.state.containerWidth,
    widthProps = this.props.width,
    heightProps = this.props.height,
  ) => {
    const {width: actualWidth, height: actualHeight} = metaData;
    const actualRatio = actualWidth / actualHeight;

    let width = typeof widthProps === 'number' ? widthProps : containerWidth;
    let height = heightProps;
    const heightBasedOnWidth = width / actualRatio;
    if (heightBasedOnWidth > height) {
      width = height * actualRatio;
    } else {
      height = heightBasedOnWidth;
    }

    return {width, height, metaData};
  };

  handleReady = () => {
    this.setState({isError: false, loading: false});
    this.props.onReady && this.props.onReady();
  };

  handleError = (error) => {
    console.log(error);
    this.setState({
      isError: true,
      loading: false,
    });
    this.props.onError && this.props.onError(error);
  };

  handleContainerLayout = (e) => {
    const {
      width: containerWidth,
      height: containerHeight,
    } = e.nativeEvent.layout;
    if (this.props.autoAdjustLayout && this.props.videoId) {
      getYoutubeMeta(this.props.videoId)
        .then((meta) => {
          const {width, height, metaData} = this.getAdjustedVideoLayout(
            meta,
            containerWidth,
          );
          this.setState({width, height, metaData});
        })
        .catch((error) => {
          console.log('get_youtube_video_meta_data', error);
          const {width, height} = this.getAdjustedVideoLayout(
            {width: 16, height: 9},
            this.state.width || containerWidth,
          );
          this.setState({width, height});
        });
    }
    this.setState({
      containerWidth,
      containerHeight,
    });
  };

  handleStartShouldSetResponder = () => {
    return true;
  };

  renderErrorIcon = (titleStyle, fontStyle) => {
    return (
      <Icon
        bundle={BundleIconSetName.ANT_DESIGN}
        name="exclamationcircle"
        style={[fontStyle, styles.errorIcon]}
      />
    );
  };

  get maskStyle(): Style {
    return {
      backgroundColor: this.theme.color.coreOverlay,
    };
  }

  render() {
    return (
      <View
        onLayout={this.handleContainerLayout}
        style={[styles.container, this.props.containerStyle]}>
        <View onStartShouldSetResponder={this.handleStartShouldSetResponder}>
          <YoutubeIframe
            ref={this.props.refPlayer}
            videoId={this.props.videoId}
            height={this.state.height}
            width={this.state.width}
            webViewStyle={this.props.webviewStyle}
            onChangeState={this.props.onChangeState}
            onReady={this.handleReady}
            onError={this.handleError}
            forceAndroidAutoplay
            {...this.props.youtubeIframeProps}
          />
        </View>
        {(this.state.isError || this.state.loading) && (
          <View style={[styles.mask, this.maskStyle]}>
            {this.state.isError ? (
              <Container noBackground center>
                <Typography
                  type={TypographyType.LABEL_LARGE_TERTIARY}
                  style={styles.errorMessage}
                  renderIconBefore={this.renderErrorIcon}>
                  {this.props.t('api.error.message') as string}
                </Typography>
              </Container>
            ) : (
              this.state.loading && <Loading center />
            )}
          </View>
        )}
      </View>
    );
  }
}

export default withTranslation()(YoutubeVideoIframe);
export {getYoutubeMeta};
