import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
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
  feeBox: {
    marginTop: 12,
    flexDirection: 'row',
  },
  firstCommission: {
    marginTop: 0,
  },
  lastCommission: {
    marginHorizontal: -15,
    marginVertical: -12,
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  commissionTitle: {
    paddingRight: 15,
    flex: 1,
  },
  both: {
    fontWeight: '600',
  },
});

const CommissionsSection = ({commissions = []}) => {
  if (!commissions?.length) return null;

  const {theme} = useTheme();

  const lastCommissionStyle = useMemo(() => {
    return mergeStyles(styles.lastCommission, {
      borderTopWidth: theme.layout.borderWidthPixel,
      borderColor: theme.color.border,
    });
  }, [theme]);

  const activeTitleStyle = useMemo(() => {
    return {
      color: theme.color.primaryHighlight,
    };
  }, [theme]);

  if (!commissions?.map) return null;

  return (
    <SectionContainer marginTop>
      {commissions.map((commission, index) => {
        const isFirst = index === 0;
        const isLast = index === commissions.length - 1;
        return (
          <View
            key={index}
            style={[
              styles.feeBox,
              isFirst && styles.firstCommission,
              isLast && lastCommissionStyle,
            ]}>
            <Typography
              type={TypographyType.LABEL_LARGE}
              style={[
                styles.commissionTitle,
                isLast ? styles.both : activeTitleStyle,
              ]}>
              {commission.name}
            </Typography>

            <View>
              <Typography
                type={TypographyType.LABEL_LARGE_PRIMARY}
                style={isLast && styles.both}>
                {commission.value_view}
              </Typography>
            </View>
          </View>
        );
      })}
    </SectionContainer>
  );
};

export default React.memo(CommissionsSection);
