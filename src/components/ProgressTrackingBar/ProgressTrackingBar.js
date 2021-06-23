import React from 'react';
import {FlatList, RefreshControl, StyleSheet, Text, View} from 'react-native';

import appConfig from 'app-config';

import Container from '../Layout/Container';

const TRACK_CONTENT_WIDTH = 1;
const TRACK_PADDING = 2;
const TRACK_WIDTH = TRACK_CONTENT_WIDTH + TRACK_PADDING;
const PAD_DIMENSIONS = TRACK_WIDTH * 4;
const PAD_BORDER_WIDTH = PAD_DIMENSIONS / 6;

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
  },
  itemWrapper: {},
  trackContainer: {
    position: 'absolute',
    height: '100%',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: TRACK_PADDING,
    paddingVertical: TRACK_WIDTH,
    left: -TRACK_WIDTH,
    ...elevationShadowStyle(3),
  },
  track: {
    backgroundColor: hexToRgbA(appConfig.colors.primary, 1),
    width: TRACK_CONTENT_WIDTH,
    height: '100%',
  },
  firstTrack: {
    borderTopLeftRadius: TRACK_WIDTH,
    borderTopRightRadius: TRACK_WIDTH,
    paddingTop: TRACK_WIDTH * 2,
  },
  lastTrack: {
    borderBottomLeftRadius: TRACK_WIDTH,
    borderBottomRightRadius: TRACK_WIDTH,
    paddingBottom: TRACK_WIDTH * 2,
  },
  pad: {
    width: PAD_DIMENSIONS,
    height: PAD_DIMENSIONS,
    borderRadius: PAD_DIMENSIONS / 2,
    backgroundColor: appConfig.colors.primary,
    position: 'absolute',
    top: 10,
    borderWidth: PAD_BORDER_WIDTH,
    borderColor: '#fff',
  },

  itemContainer: {
    marginTop: 5,
    marginLeft: 15,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    ...elevationShadowStyle(3),
  },
  title: {
    color: '#333',
  },
  description: {
    color: '#666',
    marginTop: 5,
    fontSize: 13,
  },
});

const ProgressTrackingBar = ({
  renderPad,
  trackContainerStyle,
  trackStyle,
  data = [],
  listProps = {},
}) => {
  const renderItem = ({item, index}) => {
    const extraStyle =
      index === 0
        ? styles.firstTrack
        : index === data.length - 1 && styles.lastTrack;
    return (
      <Container centerVertical={false} style={styles.itemWrapper}>
        <Container
          style={[styles.trackContainer, extraStyle, trackContainerStyle]}>
          <Container style={[styles.track, extraStyle, trackStyle]} />
          {renderPad ? (
            renderPad(PAD_DIMENSIONS)
          ) : (
            <Container style={styles.pad} />
          )}
        </Container>

        <Container centerVertical={false} style={styles.itemContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </Container>
      </Container>
    );
  };

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      {...listProps}
      contentContainerStyle={{
        ...styles.contentContainer,
        ...(listProps?.contentContainerStyle || {}),
      }}
    />
  );
};

export default React.memo(ProgressTrackingBar);
