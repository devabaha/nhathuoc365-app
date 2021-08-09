import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Shimmer from 'react-native-shimmer';

import appConfig from 'app-config';

import {Container} from 'src/components/Layout';
import {
  CONTENT_SKELETON_COLOR,
  SKELETON_COLOR,
} from 'src/components/SkeletonLoading/constants';
import {SectionContainerSkeleton} from 'src/components/payment/Confirm/components/SectionContainer';
import { ScrollView } from 'react-native';

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
  wrapper: {
    backgroundColor: SKELETON_COLOR,
  },
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
    borderRadius: 8
  },
  block: {
    padding: 15,
    height: '100%',
  },

  content: {
    backgroundColor: CONTENT_SKELETON_COLOR,
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
  return (
    <ScrollView>
      <Shimmer style={styles.shimmer}>
        <Text style={styles.wrapper}>
          <Container row style={styles.container}>
            <Container style={[styles.block, styles.imageContainer]}>
              <View style={[styles.content, styles.image]} />
            </Container>

            <Container flex centerVertical={false} style={styles.block}>
              <View style={[styles.content, styles.title]} />
              <View style={[styles.content, styles.description1]} />
              <View style={[styles.content, styles.description2]} />
              <View style={[styles.content, styles.description3]} />
            </Container>
          </Container>
        </Text>
      </Shimmer>

      {Array.from({length: 4}).map((value, index) => (
        <SectionContainerSkeleton key={index} />
      ))}
    </ScrollView>
  );
};

export default React.memo(BookingSkeleton);
