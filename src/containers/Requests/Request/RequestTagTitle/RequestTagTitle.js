import React, {memo} from 'react';
import {StyleSheet} from 'react-native';
// constants
import {TypographyType, BundleIconSetName} from 'src/components/base';
// custom components
import {Container, Typography, Icon} from 'src/components/base';

const styles = StyleSheet.create({
  container: {},
  icon: {
    marginRight: 0,
    fontSize: 10,
  },
  title: {
    fontStyle: 'italic',
    marginHorizontal: 5,
  },
});

const RequestTagTitle = ({code, name, containerStyle}) => {
  const renderIconHashtag = () => {
    return (
      <Icon
        primaryHighlight
        bundle={BundleIconSetName.FONTISO}
        name="hashtag"
        style={styles.icon}
      />
    );
  };

  const renderIconName = () => {
    return (
      <Icon
        primaryHighlight
        bundle={BundleIconSetName.OCTICONS}
        name="primitive-dot"
        style={styles.icon}
      />
    );
  };

  return (
    (!!code || !!name) && (
      <Container row noBackground style={[styles.container, containerStyle]}>
        {!!code && (
          <Typography
            type={TypographyType.LABEL_SMALL_TERTIARY}
            style={styles.title}
            renderIconBefore={renderIconHashtag}>
            {code}
          </Typography>
        )}

        {!!name && (
          <Typography
            type={TypographyType.LABEL_SMALL_TERTIARY}
            style={styles.title}
            renderIconBefore={renderIconName}>
            {name}
          </Typography>
        )}
      </Container>
    )
  );
};

export default memo(RequestTagTitle);
