import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
// configs
import appConfig from 'app-config';
// helpers
import {hasVideo} from 'app-helper/product/product';
import {getTheme} from 'src/Themes/Theme.context';
import {mergeStyles} from 'src/Themes/helper';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {TypographyType, BundleIconSetName} from 'src/components/base';
// custom components
import {Card, Typography, Icon, BaseButton} from 'src/components/base';
import ImageBg from 'src/components/ImageBg';
import Loading from '../../../Loading';

class HomeCardItem extends Component {
  static contextType = ThemeContext;

  static defaultProps = {
    shadowItem: true,
  };

  state = {
    loading: false,
  };
  unmounted = false;

  get theme() {
    return getTheme(this);
  }

  handlePress = () => {
    if (!!this.props.selfRequest) {
      this.setState({
        loading: true,
      });
      this.handleSelfRequest();
    } else {
      this.props.onPress();
    }
  };

  handleSelfRequest = () => {
    this.props.selfRequest(() => {
      !this.unmounted && this.setState({loading: false});
    });
  };

  get imageStyle() {
    return {
      borderTopLeftRadius: this.theme.layout.borderRadiusMedium,
      borderTopRightRadius: this.theme.layout.borderRadiusMedium,
    };
  }

  get videoContainerStyle() {
    return {
      backgroundColor: this.theme.color.overlay30,
    };
  }

  get iconVideoStyle() {
    return {color: this.theme.color.onOverlay};
  }

  get loadingContainerStyle() {
    return {
      backgroundColor: this.theme.color.overlay60,
    };
  }

  get loadingColor() {
    return this.theme.color.onOverlay;
  }

  get titleStyle() {
    return mergeStyles(styles.title, this.props.titleStyle);
  }

  get specialSubTitleStyle() {
    return {
      color: this.theme.color.accent1,
    };
  }

  render() {
    const props = this.props;

    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <BaseButton
          disabled={this.state.loading}
          onPress={this.handlePress}
          style={styles.wrapperBtn}>
          <Card
            shadow={this.props.shadowItem}
            style={[styles.containerBtn, this.props.contentContainerStyle]}>
            <ImageBg
              style={[styles.image, this.imageStyle, props.imageStyle]}
              source={{uri: props.imageUrl}}>
              {hasVideo(props) && (
                <View style={[styles.videoContainer, this.videoContainerStyle]}>
                  <Icon
                    bundle={BundleIconSetName.FONT_AWESOME}
                    name="play"
                    style={[styles.iconVideo, this.iconVideoStyle]}
                  />
                </View>
              )}
              {this.state.loading && (
                <Loading
                  color={this.loadingColor}
                  containerStyle={[styles.loading, this.loadingContainerStyle]}
                />
              )}
            </ImageBg>
            <View style={[styles.titleWrapper, props.textWrapperStyle]}>
              <Typography
                type={TypographyType.LABEL_LARGE}
                numberOfLines={2}
                style={this.titleStyle}>
                {props.title}
              </Typography>
              {!!props.subTitle && (
                <Typography
                  type={TypographyType.DESCRIPTION_MEDIUM_TERTIARY}
                  style={[styles.subTitle, props.subTitleStyle]}>
                  {this.props.iconSubTitle}
                  {!!this.props.iconSubTitle && ` `}
                  <Typography
                    type={TypographyType.LABEL_HUGE}
                    style={this.specialSubTitleStyle}>
                    {props.specialSubTitle}
                  </Typography>
                  {props.subTitle}
                </Typography>
              )}
            </View>
          </Card>
        </BaseButton>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapperBtn: {
    flex: 1,
  },
  containerBtn: {
    width: 280,
    flexDirection: 'column',
    flex: 1,
  },
  container: {
    marginHorizontal: 7.5,
  },
  image: {
    width: '100%',
    height: 280 / 1.91,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleWrapper: {
    padding: 15,
  },
  title: {  },
  specialSubTitle: {},
  subTitle: {
    marginTop: 5,
  },
  loading: {
    height: '100%',
  },
  videoContainer: {
    marginLeft: 'auto',
    marginRight: 7,
    marginBottom: 7,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  iconVideo: {
    fontSize: appConfig.device.isIOS ? 10 : 9,
    left: appConfig.device.isIOS ? 1.5 : 0.75,
  },
});

HomeCardItem.propTypes = {
  title: PropTypes.string,
  imageUrl: PropTypes.string,
  last: PropTypes.bool,
};

HomeCardItem.defaultProps = {
  title: '',
  imageUrl: '',
  last: false,
};

export default HomeCardItem;
