import React, {useMemo} from 'react';
import {StyleSheet} from 'react-native';
// 3-party libs
import Shimmer from 'react-native-shimmer';
// configs
import appConfig from 'app-config';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// context
import {useTheme} from 'src/Themes/Theme.context';
// custom components
import {Typography, Container, Skeleton} from 'src/components/base';

const styles = StyleSheet.create({
  shimmer: {
    marginBottom: 6,
  },
  icon: {
    width: 20,
    height: 20,
    borderRadius: 15,
    marginRight: 10,
  },
  wrapper: {
    height: 130,
  },
  container: {
    width: appConfig.device.width,
    flex: 1,
  },
  block: {
    marginBottom: 1,
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  bodyBlock: {
    paddingBottom: '100%',
  },

  content: {
    height: 7,
    borderRadius: 4,
    width: 70,
  },
  description1: {
    marginTop: 5,
    width: 100,
  },
  description2: {
    marginTop: 5,
    width: 150,
  },
});

const SectionContainerSkeleton = () => {
  const {theme} = useTheme();

  const contentStyle = useMemo(() => {
    return mergeStyles(styles.content, {
      borderRadius: theme.layout.borderRadiusSmall,
    });
  }, [theme]);

  return (
    <Shimmer style={styles.shimmer}>
      <Typography style={styles.wrapper}>
        <Container centerVertical={false} style={styles.container}>
          <Skeleton container noBackground row style={styles.block}>
            <Skeleton content style={[styles.content, styles.icon]} />
            <Skeleton content style={[styles.content]} />
          </Skeleton>
          <Skeleton
            container
            flex
            centerVertical={false}
            style={[styles.block, styles.bodyBlock]}>
            <Skeleton content style={[styles.content, styles.description1]} />
            <Skeleton content style={[styles.content, styles.description2]} />
          </Skeleton>
        </Container>
      </Typography>
    </Shimmer>
  );
};

export default React.memo(SectionContainerSkeleton);
