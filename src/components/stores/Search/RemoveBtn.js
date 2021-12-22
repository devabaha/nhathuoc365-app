import React, {memo} from 'react';
import {StyleSheet} from 'react-native';
import {TextButton, TypographyType} from 'src/components/base';

const styles = StyleSheet.create({
  removeHistoryTxt: {
    fontWeight: 'bold',
  },
});

const RemoveBtn = (props) => (
  <TextButton
    titleStyle={styles.removeHistoryTxt}
    activeOpacity={0.6}
    onPress={props.onPress}
    neutral
    typoProps={{type: TypographyType.LABEL_MEDIUM}}>
    {props.t('stores:deleteHistory')}
  </TextButton>
);

export default memo(RemoveBtn);
