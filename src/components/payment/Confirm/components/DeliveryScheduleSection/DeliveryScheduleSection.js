import React, {useMemo} from 'react';
import {StyleSheet} from 'react-native';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {TypographyType} from 'src/components/base';
// custom components
import SectionContainer from '../SectionContainer';
import {Typography} from 'src/components/base';

const styles = StyleSheet.create({
  container: {
    zIndex: 1,
  },
});

const DeliveryScheduleSection = ({title, onPressActionBtn}) => {
  const {theme} = useTheme();

  const {t} = useTranslation('orders');

  const containerStyle = useMemo(() => {
    return mergeStyles(styles.container, {
      backgroundColor: theme.color.surface,
    });
  }, [theme]);

  return (
    <SectionContainer
      marginTop
      style={containerStyle}
      title={
        <Typography type={TypographyType.LABEL_MEDIUM}>{title}</Typography>
      }
      iconName="clock"
      actionBtnTitle={t('confirm.change')}
      onPressActionBtn={onPressActionBtn}
    />
  );
};

export default React.memo(DeliveryScheduleSection);
