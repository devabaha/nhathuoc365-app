import React, {memo} from 'react';
import {StyleSheet, Animated} from 'react-native';
// 3-party libs
import {useTranslation} from 'react-i18next';
// constants
import {WIDTH} from 'app-packages/tickid-chat/constants';
import {BundleIconSetName, TypographyType} from 'src/components/base';
// custom components
import {AppFilledButton, Icon, Typography} from 'src/components/base';

const styles = StyleSheet.create({
  permissionNotGranted: {
    position: 'absolute',
    width: WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  permissionNotGrantedBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginTop: 5,
  },
  permissionNotGrantedMess: {
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 15,
  },
  icon: {
    fontSize: 40,
  },
});

const PermissionLibraryNotGranted = (props) => {
  const {t} = useTranslation(['chat', 'common']);

  const needLibraryAccessLabel: string = t('needLibraryAccess');
  const settingLabel: string = t('common:settings');

  return (
    <Animated.View
      style={[
        styles.permissionNotGranted,
        props.containerStyle,
        {
          height: props.height || '100%',
        },
      ]}>
      <Icon
        bundle={BundleIconSetName.MATERIAL_COMMUNITY_ICONS}
        name="folder-multiple-image"
        style={styles.icon}
      />
      <Typography
        type={TypographyType.LABEL_LARGE}
        style={styles.permissionNotGrantedMess}>
        {needLibraryAccessLabel}
      </Typography>
      <AppFilledButton
        style={styles.permissionNotGrantedBtn}
        onPress={props.onPress}>
        {settingLabel}
      </AppFilledButton>
    </Animated.View>
  );
};

export default memo(PermissionLibraryNotGranted);
