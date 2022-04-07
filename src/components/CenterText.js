import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import PropTypes from 'prop-types';
// constants
import {TypographyType, BundleIconSetName} from 'src/components/base';
// custom components
import {Typography, Icon} from 'src/components/base';

class CenterText extends Component {
  renderIconBefore(iconStyle) {
    return (
      <Icon
        bundle={BundleIconSetName.FONT_AWESOME}
        name="smile-o"
        style={[iconStyle, styles.icon]}
      />
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Typography
          type={TypographyType.LABEL_MEDIUM}
          style={{
            marginTop:
              this.props.marginTop != undefined
                ? this.props.marginTop
                : -NAV_HEIGHT / 2,
            textAlign: 'center',
            // lineHeight: 20
          }}
          renderIconBefore={this.props.showIcon ? this.renderIconBefore : null}>
          {this.props.showIcon && '\n\n'}
          {this.props.title}
        </Typography>
      </View>
    );
  }
}

CenterText.propTypes = {
  title: PropTypes.string.isRequired,
  color: PropTypes.string,
  fontSize: PropTypes.number,
  marginTop: PropTypes.number,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 28,
  },
});

export default CenterText;
