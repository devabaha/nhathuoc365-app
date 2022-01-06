import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {TypographyType, BundleIconSetName} from 'src/components/base';
// custom components
import {
  Typography,
  BaseButton,
  Container,
  Icon,
  Card,
} from 'src/components/base';
import Image from 'src/components/Image';
import ModalOverlay from '../ModalOverlay';

class ChangeNetwork extends Component {
  static contextType = ThemeContext;

  static propTypes = {
    data: PropTypes.array,
    visible: PropTypes.bool,
    onNetworkChange: PropTypes.func,
    networkType: PropTypes.string,
  };

  static defaultProps = {
    data: [],
    visible: false,
    onNetworkChange: () => {},
    networkType: '',
  };

  get theme() {
    return getTheme(this);
  }

  renderNetworks() {
    return this.props.data.map((network) => {
      const isActive = this.props.networkType === network.type;
      return (
        <Card key={network.type} style={isActive && this.networkBtnActiveStyle}>
          <BaseButton
            onPress={() => this.props.onNetworkChange(network)}
            style={styles.networkBtn}>
            <Container noBackground row>
              <Image
                style={[styles.networkImage, this.networkImageStyle]}
                source={network.localImage}
              />
              <View style={styles.networkInfoWrapper}>
                <Typography
                  type={TypographyType.LABEL_LARGE}
                  style={styles.networkName}>
                  {network.name}
                </Typography>
                <Typography
                  type={TypographyType.DESCRIPTION_SMALL_TERTIARY}
                  style={styles.networkDescription}>
                  {network.discount_label}
                </Typography>
              </View>
              {isActive && (
                <Icon
                  bundle={BundleIconSetName.ANT_DESIGN}
                  name="check"
                  style={[styles.checkIcon, this.checkIconStyle]}
                />
              )}
            </Container>
          </BaseButton>
        </Card>
      );
    });
  }

  get networkImageStyle() {
    return {
      borderRadius: this.theme.layout.borderRadiusMedium,
    };
  }

  get checkIconStyle() {
    return {
      color: this.theme.color.accent1,
    };
  }

  get networkBtnActiveStyle() {
    return {
      backgroundColor: this.theme.color.contentBackgroundWeak,
    };
  }

  render() {
    return (
      <ModalOverlay
        transparent
        visible={this.props.visible}
        heading={this.props.t('changeNetwork')}
        onClose={this.props.onClose}>
        <View style={styles.body}>
          <Typography
            type={TypographyType.LABEL_MEDIUM_TERTIARY}
            style={styles.message}>
            {this.props.t('changeNetworkNote')}
          </Typography>

          {this.renderNetworks()}
        </View>
      </ModalOverlay>
    );
  }
}

const styles = StyleSheet.create({
  overlayBtn: {
    flex: 1,
  },
  body: {
    padding: 15,
  },
  message: {
    marginBottom: 20,
  },
  networkBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  networkBtnActive: {},
  networkImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  networkInfoWrapper: {
    flex: 1,
    marginLeft: 12,
  },
  networkName: {},
  networkDescription: {
    marginTop: 2,
  },
  checkImage: {
    width: 20,
    height: 20,
  },
  checkIcon: {
    fontSize: 20,
  },
});

export default withTranslation('phoneCard')(ChangeNetwork);
