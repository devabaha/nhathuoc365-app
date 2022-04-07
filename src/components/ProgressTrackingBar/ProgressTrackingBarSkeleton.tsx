import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
// 3-party libs
import Shimmer from 'react-native-shimmer';
// configs
import appConfig from 'app-config';
// custom components
import {Container, Skeleton} from 'src/components/base';

const styles = StyleSheet.create({
  shimmer: {
    marginBottom: 6,
    flex: 1,
  },
  title: {
    width: 100,
    height: 20,
    borderRadius: 15,
    marginBottom: 15,
    marginLeft: 15,
  },
  wrapper: {
    flex: 1,
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

  trackContainer: {
    height: '100%',
    width: 5,
    borderRadius: 5,
  },

  contentWrapper: {
    paddingLeft: 15,
  },
  contentContainer: {},
  padContainer: {
    padding: 15,
    borderRadius: 8,
    width: appConfig.device.width - 50,
    marginBottom: 10,
  },
  content: {
    height: 7,
    width: 70,
    borderRadius: 4,
  },
  pad: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    top: 15,
    left: -7.5,
  },
  description1: {
    marginTop: 5,
    width: 100,
    height: 12,
    borderRadius: 6,
  },
  description2: {
    marginTop: 10,
    width: 150,
  },
});

const ProgressTrackingBarSkeleton = () => {
  return (
    <Container style={styles.container}>
      <Shimmer style={styles.shimmer}>
        <Text style={styles.wrapper}>
          <Container noBackground style={styles.block}>
            <Skeleton content style={[styles.content, styles.title]} />
            <Container noBackground row>
              <Skeleton
                container
                style={styles.trackContainer}
              />
              <View>
                {Array.from({length: 5}).map((_, index) => (
                  <View key={index} style={styles.contentWrapper}>
                    <Skeleton content style={[styles.content, styles.pad]} />
                    <Skeleton
                      container
                      style={[styles.contentContainer, styles.padContainer]}>
                      <Skeleton
                        content
                        style={[styles.content, styles.description1]}
                      />
                      <Skeleton
                        content
                        style={[styles.content, styles.description2]}
                      />
                    </Skeleton>
                  </View>
                ))}
              </View>
            </Container>
          </Container>
        </Text>
      </Shimmer>
    </Container>
  );
};

export default React.memo(ProgressTrackingBarSkeleton);
