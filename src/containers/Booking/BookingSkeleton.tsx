import React, {useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
// 3-party libs
import Shimmer from 'react-native-shimmer';
// configs
import appConfig from 'app-config';
// custom components
import {Typography, Container, ScrollView, Skeleton} from 'src/components/base';
// skeleton
import {SectionContainerSkeleton} from 'src/components/payment/Confirm/components/SectionContainer';

const styles = StyleSheet.create({
  shimmer: {
    marginBottom: 10,
  },
  icon: {
    width: 20,
    height: 20,
    borderRadius: 15,
    marginRight: 10,
  },
  wrapper: {},
  container: {
    width: appConfig.device.width,
    paddingVertical: 15,
  },
  imageContainer: {
    paddingLeft: 30,
  },
  image: {
    width: 110,
    height: 110,
    marginBottom: 0,
    borderRadius: 8,
  },
  block: {
    padding: 15,
    height: '100%',
  },

  content: {
    height: 7,
    width: 150,
    borderRadius: 4,
    marginBottom: 7,
  },
  title: {
    height: 15,
    borderRadius: 8,
    width: 100,
    marginTop: 15,
    marginBottom: 20,
  },
  description1: {
    width: '40%',
  },
  description2: {
    width: '60%',
  },
  description3: {
    width: '70%',
  },
});

const BookingSkeleton = () => {
  const renderSectionContainerSkeleton = useCallback(() => {
    return (
      <View>
        {Array.from({length: 4}).map((value, index) => (
          <SectionContainerSkeleton key={index} />
        ))}
      </View>
    );
  }, []);

  return (
    <ScrollView>
      <Shimmer style={styles.shimmer}>
        <Typography style={styles.wrapper}>
          <Skeleton container>
            <Container noBackground row style={styles.container}>
              <Container
                noBackground
                style={[styles.block, styles.imageContainer]}>
                <Skeleton content style={[styles.content, styles.image]} />
              </Container>

              <Container
                noBackground
                flex
                centerVertical={false}
                style={styles.block}>
                <Skeleton content style={[styles.content, styles.title]} />
                <Skeleton
                  content
                  style={[styles.content, styles.description1]}
                />
                <Skeleton
                  content
                  style={[styles.content, styles.description2]}
                />
                <Skeleton
                  content
                  style={[styles.content, styles.description3]}
                />
              </Container>
            </Container>
          </Skeleton>
        </Typography>
      </Shimmer>

      {renderSectionContainerSkeleton()}
    </ScrollView>
  );
};

export default React.memo(BookingSkeleton);
