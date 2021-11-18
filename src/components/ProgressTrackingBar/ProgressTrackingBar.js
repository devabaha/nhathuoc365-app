import React from 'react';
import {
  SectionList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';

import appConfig from 'app-config';

import Container from '../Layout/Container';
import CustomPad from 'src/containers/ProgressTracking/ProgressTrackingDetail/CustomPad';
import NoResult from 'src/components/NoResult';
import ProgressTrackingBarSkeleton from './ProgressTrackingBarSkeleton';

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
    backgroundColor: hexToRgba(appConfig.colors.primary, 1),
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

  sectionHeader: {
    backgroundColor: appConfig.colors.sceneBackground,
    paddingVertical: 10,
    marginBottom: 5,
  },
  headerIcon: {
    paddingHorizontal: 6,
    fontSize: 18,
  },
  headerTitleContainer: {
    paddingRight: 15,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#666',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },

  sectionFooter: {
    marginBottom: 30,
    flex: undefined,
    width: undefined,
    height: undefined,
    paddingTop: 0,
    paddingBottom: 0,
    paddingHorizontal: 30,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  sectionFooterText: {
    fontStyle: 'italic',
    fontSize: 13,
    paddingTop: 0,
  },
});

const ProgressTrackingBar = ({
  renderPad,
  trackWrapperStyle,
  trackContainerStyle,
  trackStyle,
  data = [],
  listProps = {},
  loading,
  renderSectionFooter: renderSectionFooterProp = () => null,
}) => {
  const {t} = useTranslation(['common']);

  const renderSectionHeader = ({section}) => {
    return (
      <Container row style={styles.sectionHeader}>
        <EntypoIcon
          name="dot-single"
          style={[styles.headerTitle, styles.headerIcon]}
        />

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>{section.title}</Text>
        </View>
      </Container>
    );
  };

  const renderSectionFooter = ({section}) => {
    return (
      renderSectionFooterProp() || (
        <NoResult
          textStyle={styles.sectionFooterText}
          containerStyle={[styles.sectionFooter]}
          icon={<View />}
          message={!section.data.length && t('noResult')}
        />
      )
    );
  };

  const renderItem = ({item, index, section}) => {
    const extraStyle =
      index === 0
        ? styles.firstTrack
        : index === section.data.length - 1 && styles.lastTrack;
    return (
      <Container
        centerVertical={false}
        style={[styles.itemWrapper, trackWrapperStyle]}>
        <Container
          style={[styles.trackContainer, extraStyle, trackContainerStyle]}>
          <Container style={[styles.track, extraStyle, trackStyle]} />
          {renderPad ? (
            renderPad(PAD_DIMENSIONS)
          ) : (
            <CustomPad dimensions={PAD_DIMENSIONS} isReverse={!!section.key} />
          )}
        </Container>

        <Container centerVertical={false} style={styles.itemContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </Container>
      </Container>
    );
  };

  return loading ? (
    <ProgressTrackingBarSkeleton />
  ) : (
    <SectionList
      sections={data}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      renderSectionFooter={renderSectionFooter}
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
