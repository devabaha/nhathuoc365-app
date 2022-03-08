import React from 'react';
import {
  SectionList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';

import appConfig from 'app-config';

import Container from '../Layout/Container';
import CustomPad from 'src/containers/ProgressTracking/ProgressTrackingDetail/CustomPad';
import NoResult from 'src/components/NoResult';
import ProgressTrackingBarSkeleton from './ProgressTrackingBarSkeleton';
import Image from 'src/components/Image';
import {Actions} from 'react-native-router-flux';

const TRACK_CONTENT_WIDTH = 1;
const TRACK_PADDING = 2;
const TRACK_WIDTH = TRACK_CONTENT_WIDTH + TRACK_PADDING;
const PAD_DIMENSIONS = TRACK_WIDTH * 4;
const PAD_BORDER_WIDTH = PAD_DIMENSIONS / 6;

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
  },
  trackWrapper: {},
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

  itemWrapper: {
    marginTop: 5,
    marginLeft: 15,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    ...elevationShadowStyle(3),
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentWrapper: {
    flex: 1,
  },
  imageContainer: {
    marginLeft: 10,
    alignSelf: 'flex-start',
  },
  image: {
    width: 50,
    height: 50,
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

  const onPressImage = (item) => {
    Actions.item_image_viewer({
      images: item.images,
    });
  };

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
        style={[styles.trackWrapper, trackWrapperStyle]}>
        <Container
          style={[styles.trackContainer, extraStyle, trackContainerStyle]}>
          <Container style={[styles.track, extraStyle, trackStyle]} />
          {renderPad ? (
            renderPad(PAD_DIMENSIONS)
          ) : (
            <CustomPad dimensions={PAD_DIMENSIONS} isReverse={!!section.key} />
          )}
        </Container>

        <Container centerVertical={false} style={styles.itemWrapper}>
          <View style={styles.itemContainer}>
            <View style={styles.contentWrapper}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
            {!!item?.images?.length && (
              <TouchableOpacity
                onPress={() => onPressImage(item, index)}
                style={styles.imageContainer}>
                <Image
                  style={styles.image}
                  source={{
                    uri: item?.images[0]?.url,
                  }}
                />
              </TouchableOpacity>
            )}
          </View>
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
