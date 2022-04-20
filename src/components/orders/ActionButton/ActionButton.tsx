import React, {memo} from 'react';
import {View, StyleSheet} from 'react-native';
// constants
import {
  BundleIconSetName,
  ButtonRoundedType,
  TypographyType,
} from 'src/components/base';
// custom components
import {AppFilledButton, Icon} from 'src/components/base';

const actionBtnStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginRight: 15,
  },
  btnContainer: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginTop: 8,
  },
  btnTitle: {
    fontSize: 12,
  },
  btnIcon: {
    paddingLeft: 4,
  },
});

const ActionButton = ({title, onGoToStore}) => {
  const titleButtonTypoProps = {type: TypographyType.LABEL_SMALL};

  const renderIconRight = (titleStyle) => {
    return (
      <Icon
        bundle={BundleIconSetName.FONT_AWESOME}
        name="angle-right"
        style={[actionBtnStyles.btnIcon, titleStyle]}
      />
    );
  };

  return (
    <View style={actionBtnStyles.container}>
      <AppFilledButton
        rounded={ButtonRoundedType.EXTRA_SMALL}
        typoProps={titleButtonTypoProps}
        style={actionBtnStyles.btnContainer}
        renderIconRight={renderIconRight}
        onPress={onGoToStore}>
        {title}
      </AppFilledButton>
    </View>
  );
};

export default memo(ActionButton);
