import React, {memo, useMemo} from 'react';
import {StyleSheet, TouchableWithoutFeedback, View} from 'react-native';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {WINDOW_HEIGHT} from 'app-packages/tickid-chat/constants';

import {BundleIconSetName, TypographyType} from 'src/components/base';
// custom components
import {Icon, Typography} from 'src/components/base';

const styles = StyleSheet.create({
  emptyChatContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    paddingBottom: '50%',
    height: WINDOW_HEIGHT,
    position: 'absolute',
    zIndex: 0,
  },
  emptyChatText: {
    textAlign: 'center',
    marginTop: 30,
    fontWeight: '500',
  },

  icon: {
    fontSize: 60,
  },
});

const EmptyChat = ({
  onPress,
  style,
  message,
  icon,
  iconName = 'comments',
  iconBundle = BundleIconSetName.FONTISO,
}) => {
  const {theme} = useTheme();

  const iconStyle = useMemo(() => {
    return mergeStyles(styles.icon, {
      color: theme.color.iconInactive,
    });
  }, [theme]);

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[styles.emptyChatContainer, style]}>
        {icon || <Icon bundle={iconBundle} name={iconName} style={iconStyle} />}
        <Typography
          type={TypographyType.TITLE_LARGE_SECONDARY}
          style={styles.emptyChatText}>
          {message}
        </Typography>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default memo(EmptyChat);
