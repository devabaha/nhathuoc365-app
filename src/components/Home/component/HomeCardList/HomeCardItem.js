import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import Loading from '../../../Loading';
import Icon from 'react-native-vector-icons/FontAwesome';

import appConfig from 'app-config';
import {hasVideo} from 'app-helper/product/product';
import {getTheme, ThemeContext} from 'src/Themes/Theme.context';
import {TypographyType} from 'src/components/base/Typography/constants';
import {Card, Typography} from 'src/components/base';
import { mergeStyles } from 'src/Themes/helper';

class HomeCardItem extends Component {
  static contextType = ThemeContext;

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

  render() {
    const props = this.props;

    const titleStyle = mergeStyles(styles.title, props.titleStyle);

    const imageBackgroundStyle = mergeStyles([styles.image, {
      backgroundColor: this.theme.color.contentBackground
    }], props.imageStyle);

    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <TouchableOpacity
          activeOpacity={0.8}
          disabled={this.state.loading}
          onPress={this.handlePress}
          style={[styles.wrapperBtn]}>
          <Card style={styles.containerBtn}>
            <ImageBackground
              style={imageBackgroundStyle}
              source={{uri: props.imageUrl}}>
              {hasVideo(props) && (
                <View style={styles.videoContainer}>
                  <Icon name="play" style={styles.iconVideo} />
                </View>
              )}
              {this.state.loading && (
                <Loading color="#fff" containerStyle={styles.loading} />
              )}
            </ImageBackground>
            <View style={[styles.titleWrapper, props.textWrapperStyle]}>
              <Typography
                type={TypographyType.TITLE_MEDIUM}
                numberOfLines={2}
                style={titleStyle}>
                {props.title}
              </Typography>
              {!!props.subTitle && (
                <Text style={[styles.subTitle, props.subTitleStyle]}>
                  {this.props.iconSubTitle}
                  {!!this.props.iconSubTitle && ` `}
                  <Text style={styles.specialSubTitle}>
                    {props.specialSubTitle}
                  </Text>
                  {props.subTitle}
                </Text>
              )}
            </View>
          </Card>
        </TouchableOpacity>
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
    // backgroundColor: '#fff',
    // borderRadius: 8,
    flexDirection: 'column',
    flex: 1,
    ...appConfig.styles.shadow,
  },
  container: {
    marginHorizontal: 7.5,
  },
  image: {
    backgroundColor: '#ebebeb',
    width: '100%',
    height: 280 / 1.91,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleWrapper: {
    padding: 15,
    // paddingVertical: 15,
  },
  title: {
    // ...appConfig.styles.typography.heading3,
  },
  specialSubTitle: {
    ...appConfig.styles.typography.heading1,
    color: appConfig.colors.highlight[1],
  },
  subTitle: {
    marginTop: 5,
    ...appConfig.styles.typography.text,
  },
  loading: {
    height: '100%',
    backgroundColor: 'rgba(0,0,0,.5)',
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
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  iconVideo: {
    color: appConfig.colors.white,
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
