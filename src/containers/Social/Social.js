import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
// 3-party libs
import useIsMounted from 'react-is-mounted-hook';
import LinearGradient from 'react-native-linear-gradient';
import {Actions} from 'react-native-router-flux';
// configs
import store from 'app-store';
// helpers
import {servicesHandler} from 'app-helper/servicesHandler';
import {TypographyType} from 'src/components/base';
import {mergeStyles} from 'src/Themes/helper';
import {hexToRgba} from 'app-helper';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {SERVICES_TYPE} from 'app-helper/servicesHandler';
// entities
import {APIRequest} from 'src/network/Entity';
// custom components
import {
  Container,
  ScreenWrapper,
  BaseButton,
  Typography,
  FlatList,
} from 'src/components/base';
import Image from 'src/components/Image';
import Posts from './Posts';
// skeleton
import ListGroupThumbnailSkeleton from './ListGroupThumbnailSkeleton';

const styles = StyleSheet.create({
  container: {
    height: 130,
  },
  contentContainer: {
    paddingLeft: 15,
    paddingVertical: 20,
    flex: 0,
  },

  groupThumbnailsContainer: {
    marginBottom: 15,
  },
  groupContainer: {
    width: 90,
    height: 90,
    overflow: 'hidden',
    marginRight: 15,
  },
  gradient: {
    height: '100%',
    width: '100%',
    position: 'absolute',
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'absolute',
    resizeMode: 'cover',
  },
  groupNameContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  groupName: {
    padding: 5,
    fontWeight: '600',
  },
});

const Social = ({title, siteId = store.store_data?.id}) => {
  const {theme} = useTheme();

  const isMounted = useIsMounted();
  const {t} = useTranslation();

  const [thumbnailGroups, setThumbnailGroups] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isRefreshing, setRefreshing] = useState(false);

  const linearGradientValues = useMemo(() => {
    return [
      hexToRgba(theme.color.coreOverlay, 0),
      hexToRgba(theme.color.coreOverlay, 0.2),
      hexToRgba(theme.color.coreOverlay, 0.5),
      hexToRgba(theme.color.coreOverlay, 0.9),
    ];
  }, [theme]);

  const [getThumbnailGroupsRequest] = useState(new APIRequest());

  useEffect(() => {
    getThumbnailGroups();

    if (!title) {
      setTimeout(() => {
        Actions.refresh({
          title: t('screen.social.mainTitle'),
        });
      });
    }

    return () => {
      cancelRequests([getThumbnailGroupsRequest]);
    };
  }, []);

  const getThumbnailGroups = async () => {
    const data = {
      site_id: siteId,
    };
    getThumbnailGroupsRequest.data = APIHandler.social_groups(data);

    try {
      const response = await getThumbnailGroupsRequest.promise();
      // console.log(response);
      if (response) {
        if (response.status === STATUS_SUCCESS) {
          if (response.data) {
            setThumbnailGroups(response.data || []);
          }
        } else {
          flashShowMessage({
            type: 'danger',
            message: response.message || t('api.error.message'),
          });
        }
      } else {
        flashShowMessage({
          type: 'danger',
          message: t('api.error.message'),
        });
      }
    } catch (error) {
      console.log('get_groups', error);
      flashShowMessage({
        type: 'danger',
        message: t('api.error.message'),
      });
    } finally {
      if (isMounted()) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  };

  const onRefresh = () => {
    getThumbnailGroups();
  };

  const goToGroup = useCallback((group) => {
    servicesHandler({
      type: SERVICES_TYPE.SOCIAL_GROUP,
      id: group.id,
      name: group.name,
      theme,
    });
  }, []);

  const renderGroup = ({item: thumbnailGroup}) => {
    return (
      <BaseButton onPress={() => goToGroup(thumbnailGroup)}>
        <View style={groupContainerStyle}>
          <Image source={{uri: thumbnailGroup.banner}} style={styles.image} />
          <LinearGradient
            colors={linearGradientValues}
            locations={[0.5, 0.62, 0.8, 1]}
            angle={180}
            useAngle
            style={[styles.gradient]}
          />
          <View style={styles.groupNameContainer}>
            <Typography
              type={TypographyType.LABEL_SEMI_MEDIUM}
              numberOfLines={2}
              style={groupNameStyle}>
              {thumbnailGroup.name}
            </Typography>
          </View>
        </View>
      </BaseButton>
    );
  };

  const renderThumbnailGroups = () => {
    return isLoading ? (
      <ListGroupThumbnailSkeleton />
    ) : (
      !!thumbnailGroups?.length && (
        <Container style={styles.groupThumbnailsContainer}>
          <FlatList
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            horizontal
            showsHorizontalScrollIndicator={false}
            data={thumbnailGroups}
            renderItem={renderGroup}
            keyExtractor={(item, index) =>
              item?.id ? String(item.id) : index.toString()
            }
          />
        </Container>
      )
    );
  };

  const groupContainerStyle = useMemo(() => {
    return mergeStyles(styles.groupContainer, {
      borderColor: theme.color.border,
      borderWidth: theme.layout.borderWidth,
      borderRadius: theme.layout.borderRadiusLarge,
    });
  });

  const groupNameStyle = useMemo(() => {
    return mergeStyles(styles.groupName, {
      color: theme.color.onOverlay,
    });
  }, [theme]);

  return (
    <ScreenWrapper>
      <Posts
        safeLayout
        onRefresh={onRefresh}
        ListHeaderComponent={renderThumbnailGroups()}
      />
    </ScreenWrapper>
  );
};

export default React.memo(Social);
