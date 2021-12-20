import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
// constants
import {TypographyType} from 'src/components/base';
// custom components
import {Typography} from 'src/components/base';

export default class ListHeader extends Component {
  render() {
    let {title, alignLeft, containerStyle, titleStyle} = this.props;

    return (
      <View
        style={[
          styles.store_heading_box,
          {
            alignItems: alignLeft ? 'flex-start' : 'center',
          },
          containerStyle,
        ]}>
        {!!title && (
          <Typography
            type={TypographyType.TITLE_MEDIUM}
            style={[styles.store_heading_title, titleStyle]}>
            {title}
          </Typography>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  store_heading_box: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  store_heading_title: {
    marginVertical: 15,
    textAlign: 'center',
  },
});
