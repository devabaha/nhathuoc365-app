import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import useIsMounted from 'react-is-mounted-hook';
import {APIRequest} from 'src/network/Entity';
import Posts from './Posts';
import store from 'app-store';
import Image from 'src/components/Image';
import LinearGradient from 'react-native-linear-gradient';
import {Actions} from 'react-native-router-flux';

import {servicesHandler, SERVICES_TYPE} from 'app-helper/servicesHandler';
import ListGroupThumbnailSkeleton from './ListGroupThumbnailSkeleton';
import {useTheme} from 'src/Themes/Theme.context';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginBottom: 15,
    height: 130,
  },
  contentContainer: {
    paddingLeft: 15,
    paddingVertical: 20,
    flex: 0,
  },

  groupContainer: {
    width: 90,
    height: 90,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#ddd',
    overflow: 'hidden',
    marginRight: 15,
  },
  gradient: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    // bottom: '-30%',
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
    color: '#fff',
    fontSize: 13,
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
      <TouchableOpacity onPress={() => goToGroup(thumbnailGroup)}>
        <View style={styles.groupContainer}>
          <Image source={{uri: thumbnailGroup.banner}} style={styles.image} />
          <LinearGradient
            colors={[
              'rgba(0,0,0,0)',
              'rgba(0,0,0,.2)',
              'rgba(0,0,0,.45)',
              'rgba(0,0,0,.5)',
            ]}
            locations={[0.5, 0.75, 0.88, 1]}
            angle={180}
            useAngle
            style={[styles.gradient]}
          />
          <View style={styles.groupNameContainer}>
            <Text numberOfLines={2} style={styles.groupName}>
              {thumbnailGroup.name}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderThumbnailGroups = () => {
    return isLoading ? (
      <ListGroupThumbnailSkeleton />
    ) : (
      !!thumbnailGroups?.length && (
        <View>
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
        </View>
      )
    );
  };

  return (
    <Posts
      onRefresh={onRefresh}
      ListHeaderComponent={renderThumbnailGroups()}
    />
  );
};

export default React.memo(Social);
