import React, {useMemo} from 'react';
import {SectionList, StyleSheet, View} from 'react-native';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {TypographyType, BundleIconSetName} from 'src/components/base';
// custom components
import {Card, Container, Typography, Icon} from 'src/components/base';
import CustomPad from 'src/containers/ProgressTracking/ProgressTrackingDetail/CustomPad';
import NoResult from 'src/components/NoResult';
// skeleton
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
    paddingHorizontal: TRACK_PADDING,
    paddingVertical: TRACK_WIDTH,
    left: -TRACK_WIDTH,
  },
  track: {
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

  itemContainer: {
    marginTop: 5,
    marginLeft: 15,
    padding: 15,
    marginBottom: 10,
  },
  title: {},
  description: {
    marginTop: 5,
  },

  sectionHeader: {
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
    fontWeight: 'bold',
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
  const {theme} = useTheme();

  const {t} = useTranslation(['common']);

  const renderIconSectionHeader = (titleStyle) => {
    return (
      <Icon
        bundle={BundleIconSetName.ENTYPO}
        name="dot-single"
        style={[titleStyle, styles.headerIcon]}
      />
    );
  };

  const renderSectionHeader = ({section}) => {
    return (
      <Container row style={[styles.headerTitleContainer, sectionHeaderStyle]}>
        <Typography
          style={styles.headerTitle}
          type={TypographyType.LABEL_SEMI_LARGE_TERTIARY}
          renderIconBefore={renderIconSectionHeader}>
          {section.title}
        </Typography>
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
      <Container noBackground style={[styles.itemWrapper, trackWrapperStyle]}>
        <Container
          shadow
          style={[styles.trackContainer, extraStyle, trackContainerStyle]}>
          <Container style={[trackContentStyle, extraStyle, trackStyle]} />
          {renderPad ? (
            renderPad(PAD_DIMENSIONS)
          ) : (
            <CustomPad dimensions={PAD_DIMENSIONS} isReverse={!!section.key} />
          )}
        </Container>

        <Card shadow style={styles.itemContainer}>
          <Typography type={TypographyType.LABEL_MEDIUM} style={styles.title}>
            {item.title}
          </Typography>
          <Typography
            type={TypographyType.LABEL_SEMI_MEDIUM_TERTIARY}
            style={styles.description}>
            {item.description}
          </Typography>
        </Card>
      </Container>
    );
  };

  const sectionHeaderStyle = useMemo(() => {
    return mergeStyles(styles.sectionHeader, {
      backgroundColor: theme.color.background,
    });
  }, [theme]);

  const trackContentStyle = useMemo(() => {
    return mergeStyles(styles.track, {
      backgroundColor: theme.color.primaryHighlight,
    });
  }, [theme]);

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
