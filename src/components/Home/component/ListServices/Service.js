import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
// helpers
import {SERVICES_TYPE} from 'app-helper/servicesHandler';
import {getTheme} from 'src/Themes/Theme.context';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {BASE_SERVICE_DIMENSION, BASE_TITLE_MARGIN} from './constants';
import {IMAGE_ICON_TYPE} from '../../constants';
import {BundleIconSetName, TypographyType} from 'src/components/base';
// custom components
import {NotiBadge} from '../../../Badges';
import Loading from '../../../Loading';
import {BaseButton, Container, Icon, Typography} from 'src/components/base';
import Image from 'src/components/Image';

const styles = StyleSheet.create({
  buttonWrapper: {
    marginBottom: 15,
    paddingHorizontal: 5,
    alignItems: 'center',
  },
  itemWrapper: {
    alignItems: 'center',
  },
  iconWrapper: {
    width: BASE_SERVICE_DIMENSION,
    height: BASE_SERVICE_DIMENSION,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  icon: {
    fontSize: 32,
  },
  title: {
    textAlign: 'center',
    marginTop: BASE_TITLE_MARGIN,
  },
  notifyWrapper: {
    right: -8,
    top: -8,
    minWidth: 20,
    height: 20,
  },
  notifyLabel: {
    fontSize: 12,
  },
  loading: {
    width: '100%',
    height: '100%',
  },
});

class Service extends Component {
  static contextType = ThemeContext;

  state = {
    loading: false,
  };

  get theme() {
    return getTheme(this);
  }

  handlePress(service) {
    if (this.state.loading) return;
    const {type} = service;
    if (
      !!this.props.selfRequest &&
      (type === SERVICES_TYPE.OPEN_SHOP ||
        type === SERVICES_TYPE.PRODUCT_DETAIL)
    ) {
      this.setState({
        loading: true,
      });
      this.handleSelfRequest(service);
    } else {
      this.props.onPress(service);
    }
  }

  handleSelfRequest(service) {
    this.props.selfRequest(service, () => {
      !this.unmounted && this.setState({loading: false});
    });
  }

  get loadingStyle() {
    return {
      backgroundColor: this.theme.color.overlay30,
    };
  }

  get iconWrapperStyle() {
    return {
      borderRadius: this.theme.layout.borderRadiusHuge,
    };
  }

  render() {
    const {
      service,
      containerStyle,
      itemStyle,
      notiLabel,
      isShowNoti,
      titleStyle,
    } = this.props;

    return (
      <BaseButton
        onPress={this.handlePress.bind(this, service)}
        style={[styles.buttonWrapper, containerStyle]}>
        <View style={styles.itemWrapper}>
          <View>
            <Container
              style={[styles.iconWrapper, this.iconWrapperStyle, itemStyle]}>
              {this.state.loading && (
                <Loading
                  size="small"
                  center
                  color={this.theme.color.onOverlay}
                  containerStyle={[styles.loading, this.loadingStyle]}
                />
              )}
              {service.iconType === IMAGE_ICON_TYPE ? (
                <Image style={styles.image} source={{uri: service.icon}} />
              ) : (
                <Icon
                  neutral
                  bundle={BundleIconSetName.MATERIAL_COMMUNITY_ICONS}
                  name={service.icon}
                  style={styles.icon}
                />
              )}
            </Container>
            <NotiBadge
              containerStyle={styles.notifyWrapper}
              labelStyle={styles.notifyLabel}
              label={notiLabel}
              show={isShowNoti}
              alert
              animation
            />
          </View>
          <Typography
            type={TypographyType.LABEL_SMALL}
            style={[styles.title, titleStyle]}>
            {service.title}
          </Typography>
        </View>
      </BaseButton>
    );
  }
}

export default Service;
