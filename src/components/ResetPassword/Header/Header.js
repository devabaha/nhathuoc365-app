import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Icon from 'react-native-vector-icons/Fontisto';
import { AREA_SIZE, CENTER_POINT_COOR } from '../constants';

const Header = () => {
  const { t } = useTranslation(['resetPassword', 'common']);
  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <Svg style={styles.iconBackground}>
          <Circle
            strokeWidth={10}
            stroke={hexToRgba(DEFAULT_COLOR, 0.3)}
            cx={CENTER_POINT_COOR}
            cy={CENTER_POINT_COOR}
            r="50"
            fill={DEFAULT_COLOR}
          />
          <Circle
            strokeWidth={3}
            stroke={hexToRgba(DEFAULT_COLOR, 0.4)}
            strokeDasharray={[3, 15]}
            strokeLinecap="round"
            cx={CENTER_POINT_COOR}
            cy={CENTER_POINT_COOR}
            r={CENTER_POINT_COOR - 13}
            fill="transparent"
          />
          <Circle
            strokeWidth={2.5}
            stroke={hexToRgba(DEFAULT_COLOR, 0.3)}
            cx={13}
            cy={CENTER_POINT_COOR - 8}
            r={8}
            fill="#fff"
          />
        </Svg>
        <Icon name="key" style={styles.icon} />
      </View>
      <Text style={styles.title}>
        {t('common:screen.resetPassword.mainTitle')}
      </Text>
      <Text style={styles.description}>{t('instruction')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 40,
    marginBottom: 20
  },
  headerContent: {
    height: AREA_SIZE,
    width: AREA_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20
  },
  iconBackground: {
    position: 'absolute',
    zIndex: 0
  },
  icon: {
    fontSize: 40,
    color: '#fff'
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
    color: '#242424'
  },
  description: {
    marginTop: 5,
    maxWidth: 300,
    fontSize: 13,
    textAlign: 'center',
    color: '#666'
  }
});

export default memo(Header);
