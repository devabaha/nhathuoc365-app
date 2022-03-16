import React, {useMemo} from 'react';
import {StyleSheet} from 'react-native';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {TypographyType, BundleIconSetName} from 'src/components/base';
// custom components
import {Container, Typography, Icon, TextButton} from 'src/components/base';
// skeleton
import SectionContainerSkeleton from './SectionContainerSkeleton';

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  topSpacing: {
    marginTop: 8,
  },
  titleWrapper: {
    justifyContent: 'space-between',
  },
  titleContainer: {},
  icon: {
    width: 15,
    fontSize: 15,
  },
  title: {
    marginLeft: 8,
  },
  btnAction: {},
});

const SectionContainer = ({
  style,
  marginTop,
  title,
  customIcon,
  iconStyle: iconStyleProps,
  iconName,
  children,
  loading,
  actionBtnTitle,
  actionBtnStyle: actionBtnStyleProps,
  actionBtnTitleStyle: actionBtnTitleStyleProps,

  onPressActionBtn,
}) => {
  const {theme} = useTheme();

  const hasHeading = !!title || !!actionBtnTitle;

  const containerStyle = useMemo(() => {
    return mergeStyles(
      [
        styles.container,
        {
          borderTopWidth: theme.layout.borderWidthPixel,
          borderBottomWidth: theme.layout.borderWidthPixel,
          borderColor: theme.color.border,
        },
        marginTop && styles.topSpacing,
      ],
      style,
    );
  }, [theme, marginTop, style]);

  const iconStyle = useMemo(() => {
    return mergeStyles(
      [
        styles.icon,
        {
          color: theme.color.iconInactive,
        },
      ],
      iconStyleProps,
    );
  }, [theme, iconStyleProps]);

  const actionBtnStyle = useMemo(() => {
    return mergeStyles(styles.btnAction, actionBtnStyleProps);
  }, [theme, actionBtnStyleProps]);

  const changeTitleStyle = useMemo(() => {
    return mergeStyles(
      theme.typography[TypographyType.LABEL_SMALL_PRIMARY],
      actionBtnTitleStyleProps,
    );
  }, [theme, actionBtnTitleStyleProps]);

  return loading ? (
    <SectionContainerSkeleton />
  ) : (
    <Container style={containerStyle}>
      {!!hasHeading && (
        <Container row noBackground style={styles.titleWrapper}>
          {!!title && (
            <Container noBackground row>
              {customIcon || (
                <Icon
                  bundle={BundleIconSetName.FONT_AWESOME_5}
                  style={iconStyle}
                  name={iconName}
                  solid
                />
              )}
              <Typography
                type={TypographyType.LABEL_LARGE}
                style={styles.title}>
                {title}
              </Typography>
            </Container>
          )}
          {!!actionBtnTitle && (
            <TextButton
              disabled={!onPressActionBtn}
              hitSlop={HIT_SLOP}
              style={actionBtnStyle}
              titleStyle={changeTitleStyle}
              onPress={onPressActionBtn}>
              {actionBtnTitle}
            </TextButton>
          )}
        </Container>
      )}
      {children}
    </Container>
  );
};

export default React.memo(SectionContainer);
