import React, {memo, useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
// 3-party libs
import Svg, {Circle} from 'react-native-svg';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {
  AREA_SIZE,
  CENTER_POINT_COOR,
} from 'src/components/ResetPassword/constants';
import {TypographyType, BundleIconSetName} from 'src/components/base';
// custom components
import {Typography, Icon} from 'src/components/base';

const Header = () => {
  const {theme} = useTheme();

  const {t} = useTranslation(['resetPassword', 'common']);

  const iconStyle = useMemo(() => {
    return mergeStyles(styles.icon, {color: theme.color.onPersistPrimary});
  }, [theme]);

  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <Svg style={styles.iconBackground}>
          <Circle
            strokeWidth={10}
            stroke={hexToRgba(theme.color.persistPrimary, 0.3)}
            cx={CENTER_POINT_COOR}
            cy={CENTER_POINT_COOR}
            r="50"
            fill={theme.color.persistPrimary}
          />
          <Circle
            strokeWidth={3}
            stroke={hexToRgba(theme.color.persistPrimary, 0.4)}
            strokeDasharray={[3, 15]}
            strokeLinecap="round"
            cx={CENTER_POINT_COOR}
            cy={CENTER_POINT_COOR}
            r={CENTER_POINT_COOR - 13}
            fill="transparent"
          />
          <Circle
            strokeWidth={2.5}
            stroke={hexToRgba(theme.color.persistPrimary, 0.3)}
            cx={13}
            cy={CENTER_POINT_COOR - 8}
            r={8}
            fill={theme.color.surface}
          />
        </Svg>
        <Icon bundle={BundleIconSetName.FONTISO} name="key" style={iconStyle} />
      </View>
      <Typography type={TypographyType.TITLE_HUGE} style={styles.title}>
        {t('common:screen.resetPassword.mainTitle')}
      </Typography>
      <Typography
        type={TypographyType.LABEL_SEMI_MEDIUM_TERTIARY}
        style={styles.description}>
        {t('instruction')}
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 20,
  },
  headerContent: {
    height: AREA_SIZE,
    width: AREA_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  iconBackground: {
    position: 'absolute',
    zIndex: 0,
  },
  icon: {
    fontSize: 40,
  },
  title: {
    fontWeight: 'bold',
  },
  description: {
    marginTop: 15,
    maxWidth: 300,
    textAlign: 'center',
  },
});

export default memo(Header);
