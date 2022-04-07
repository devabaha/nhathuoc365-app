import React, {useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {BundleIconSetName, TypographyType} from 'src/components/base';
// custom components
import {Typography, Icon} from 'src/components/base';

const styles = StyleSheet.create({
  block: {
    padding: 15,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: -15,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  icon: {
    fontSize: 20,
    marginLeft: 15,
  },
  title: {
    flex: 1,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginLeft: 15,
    fontStyle: 'italic',
  },
  content: {},
});

const Block = ({
  containerStyle,
  titleContainerStyle,
  titleStyle,
  contentStyle,
  iconStyle,
  title,
  content,
  iconName,
  icon,

  customContent,
}) => {
  const {theme} = useTheme();

  const titleContainerStyles = useMemo(() => {
    return mergeStyles(styles.titleContainer, {
      backgroundColor: theme.color.contentBackgroundWeak,
    });
  });

  const headingStyle = useMemo(() => {
    return {color: theme.color.primaryHighlight};
  });

  return (
    <View style={[styles.block, containerStyle]}>
      <View style={[titleContainerStyles, titleContainerStyle]}>
        <Typography
          type={TypographyType.TITLE_MEDIUM_PRIMARY}
          style={[styles.title, headingStyle, titleStyle]}>
          {title}
        </Typography>
        {icon || (
          <Icon
            bundle={BundleIconSetName.FONT_AWESOME_5}
            name={iconName}
            style={[styles.icon, headingStyle, iconStyle]}
          />
        )}
      </View>
      {customContent || (
        <Typography
          type={TypographyType.LABEL_MEDIUM}
          style={[styles.content, contentStyle]}>
          {content}
        </Typography>
      )}
    </View>
  );
};

export default Block;
