import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import appConfig from 'app-config';

import Container from 'src/components/Layout/Container';

const styles = StyleSheet.create({});

const CustomPad = ({dimensions: padDimensions, isReverse}) => {
  const contentDimensions = padDimensions / 6;
  const borderWidth = 1;
  const contentDimensionsOutline = contentDimensions + borderWidth;
  const contentTop = contentDimensionsOutline / 4;

  return (
    <Container
      center
      style={{
        top: 20,
        position: 'absolute',
        transform: [
          {
            rotate: isReverse ? '180deg' : '0deg',
          },
        ],
        ...elevationShadowStyle(3),
      }}>
      <Container row style={{position: 'absolute'}}>
        <Container
          style={{
            width: 0,
            height: 0,
            borderRightWidth: contentDimensionsOutline,
            borderBottomWidth: contentDimensionsOutline * 2,
            borderRightColor: isReverse ? '#fff' : appConfig.colors.primary,
            borderBottomColor: isReverse ? '#fff' : appConfig.colors.primary,

            borderLeftWidth: contentDimensionsOutline,
            borderTopWidth: contentDimensionsOutline * 2,
            borderLeftColor: 'transparent',
            borderTopColor: 'transparent',
          }}
        />
        <Container
          style={{
            width: 0,
            height: 0,
            borderLeftWidth: contentDimensionsOutline,
            borderBottomWidth: contentDimensionsOutline * 2,
            borderLeftColor: isReverse ? '#fff' : appConfig.colors.primary,
            borderBottomColor: isReverse ? '#fff' : appConfig.colors.primary,

            borderRightWidth: contentDimensionsOutline,
            borderTopWidth: contentDimensionsOutline * 2,
            borderRightColor: 'transparent',
            borderTopColor: 'transparent',
          }}
        />
      </Container>
      <Container row style={{top: contentTop}}>
        <Container
          style={{
            width: 0,
            height: 0,
            borderRightWidth: contentDimensions,
            borderBottomWidth: contentDimensions * 2,
            borderRightColor: isReverse ? appConfig.colors.primary : '#fff',
            borderBottomColor: isReverse ? appConfig.colors.primary : '#fff',

            borderLeftWidth: contentDimensions,
            borderTopWidth: contentDimensions * 2,
            borderLeftColor: 'transparent',
            borderTopColor: 'transparent',
          }}
        />
        <Container
          style={{
            width: 0,
            height: 0,
            borderLeftWidth: contentDimensions,
            borderBottomWidth: contentDimensions * 2,
            borderLeftColor: isReverse ? appConfig.colors.primary : '#fff',
            borderBottomColor: isReverse ? appConfig.colors.primary : '#fff',

            borderRightWidth: contentDimensions,
            borderTopWidth: contentDimensions * 2,
            borderRightColor: 'transparent',
            borderTopColor: 'transparent',
          }}
        />
      </Container>
    </Container>
  );
};

export default CustomPad;
