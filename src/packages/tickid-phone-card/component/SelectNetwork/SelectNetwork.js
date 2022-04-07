import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
// 3-party libs
import {withTranslation} from 'react-i18next';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {TypographyType} from 'src/components/base';
// custom components
import {FlatList, Typography, ImageButton} from 'src/components/base';

class NetworkProvider extends Component {
  static contextType = ThemeContext;

  static propTypes = {
    data: PropTypes.array,
    onSelectNetwork: PropTypes.func,
    networkType: PropTypes.string,
  };

  static defaultProps = {
    data: [],
    onSelectNetwork: () => {},
    networkType: '',
  };

  get theme() {
    return getTheme(this);
  }

  renderNetworks() {
    return (
      <FlatList
        horizontal
        data={this.props.data}
        extraData={this.props.networkType}
        renderItem={this.renderNetworkItem}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
      />
    );
  }

  renderNetworkItem = ({item: network, index}) => {
    const isActive = this.props.networkType === network.type;
    const last = index === this.props.data.length - 1;
    return (
      <ImageButton
        source={network.localImage}
        style={[
          styles.networkBtn,
          this.networkBtnStyle,
          isActive && this.networkBtnActiveStyle,
          {
            marginRight: last ? 0 : 16,
          },
        ]}
        imageStyle={[styles.networkImage, this.networkImageStyle]}
        onPress={() => this.props.onSelectNetwork(network)}
      />
    );
  };

  get networkBtnStyle() {
    return {
      borderWidth: this.theme.layout.borderWidthLarge,
      borderColor: this.theme.color.border,
      borderRadius: this.theme.layout.borderRadiusMedium,
    };
  }

  get networkBtnActiveStyle() {
    return {
      borderColor: this.theme.color.primaryHighlight,
    };
  }

  get networkImageStyle() {
    return {
      borderColor: this.theme.color.border,
      borderWidth: this.theme.layout.borderWidthSmall,
      borderRadius: this.theme.layout.borderRadiusSmall,
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <Typography type={TypographyType.TITLE_SEMI_LARGE} style={styles.label}>
          {this.props.t('selectNetwork')}
        </Typography>

        {this.renderNetworks()}
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
  label: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  networkBtn: {
    overflow: 'hidden',
  },
  networkBtnActive: {},
  networkImage: {
    width: 70,
    height: 70,
  },
});

export default withTranslation('phoneCard')(NetworkProvider);
