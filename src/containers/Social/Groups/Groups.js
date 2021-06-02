import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Animated, Easing, StyleSheet, Text, View} from 'react-native';
import useIsMounted from 'react-is-mounted-hook';
import {APIRequest} from 'src/network/Entity';
import store from 'app-store';
import {SocialPleasePost} from 'src/components/Social/components';
import {Actions} from 'react-native-router-flux';

import appConfig from 'app-config';
import Posts from '../Posts';
import Container from 'src/components/Layout/Container';
import Image from 'src/components/Image';

import {getNewsFeedSize} from '../../../helper/image';
import GroupHeaderSkeleton from './GroupHeaderSkeleton';

const styles = StyleSheet.create({
  titleContainer: {
    paddingLeft: appConfig.device.isIOS ? 30 : 0,
    paddingRight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  titleImageContainer: {
    width: 30,
    height: 30,
    borderRadius: 4,
    marginRight: 10,
    overflow: 'hidden',
  },
  titleImage: {
    width: '100%',
    height: '100%',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },

  headerInfoContainer: {
    backgroundColor: '#fff',
  },
  bannerContainer: {
    ...getNewsFeedSize(),
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
  },
  groupInfoContainer: {
    padding: 15,
  },
  groupName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#242424',
  },
  groupDescription: {
    fontSize: 16,
    marginTop: 10,
    color: '#333',
  },
  pleasePostContainer: {
    marginBottom: 10,
    marginTop: 5,
  },
});

const Groups = ({id, groupName, siteId = store.store_data?.id}) => {
  const isMounted = useIsMounted();
  const {t} = useTranslation();

  const isTitleVisible = useRef(false);
  const isTitleInvisible = useRef(true);

  const [isLoading, setLoading] = useState(true);
  const [isRefreshing, setRefreshing] = useState(false);
  const [getGroupInfoRequest] = useState(new APIRequest());

  const [groupInfo, setGroupInfo] = useState({});

  const [animatedTitleOpacity] = useState(new Animated.Value(0));

  const animatedTitleStyle = {
    opacity: animatedTitleOpacity,
  };

  useEffect(() => {
    getGroupInfo();

    return () => {
      cancelRequests([getGroupInfoRequest]);
    };
  }, []);

  useEffect(() => {
    Actions.refresh({
      renderTitle: renderTitle(),
    });
  }, [groupInfo?.banner]);

  const renderTitle = () => {
    return (
      <Animated.View style={[styles.titleContainer, animatedTitleStyle]}>
        <View style={styles.titleImageContainer}>
          <Image
            source={{uri: groupInfo?.banner || ''}}
            style={styles.titleImage}
          />
        </View>
        <Text numberOfLines={2} style={styles.title}>
          {groupName}
        </Text>
      </Animated.View>
    );
  };

  const getGroupInfo = async () => {
    const data = {
      site_id: siteId,
    };
    getGroupInfoRequest.data = APIHandler.social_groups_show(id, data);

    try {
      const response = await getGroupInfoRequest.promise();

      if (response) {
        if (response.status === STATUS_SUCCESS) {
          if (response.data) {
            setGroupInfo(response.data || {});
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
    getGroupInfo();
  };

  const handlePressContent = useCallback(
    (isOpenImagePicker) => {
      Actions.push(appConfig.routes.socialCreatePost, {
        group: groupInfo,
        groupId: groupInfo.id,
        siteId: groupInfo.site_id,
        isOpenImagePicker,
      });
    },
    [groupInfo],
  );

  const handleScroll = useCallback((e) => {
    if (e.nativeEvent.contentOffset.y > 300) {
      if (isTitleVisible.current) return;
      isTitleVisible.current = true;
      isTitleInvisible.current = false;
      Animated.timing(animatedTitleOpacity, {
        toValue: 1,
        duration: 100,
        easing: Easing.quad,
        useNativeDriver: true,
      }).start();
    } else {
      if (isTitleInvisible.current) return;
      isTitleVisible.current = false;
      isTitleInvisible.current = true;
      Animated.timing(animatedTitleOpacity, {
        toValue: 0,
        duration: 100,
        easing: Easing.quad,
        useNativeDriver: true,
      }).start();
    }
  }, []);

  renderGroupHeader = () => {
    return isLoading ? (
      <GroupHeaderSkeleton />
    ) : (
      <Container centerVertical={false}>
        <View style={styles.headerInfoContainer}>
          <Image
            canTouch
            source={{uri: groupInfo.banner}}
            containerStyle={styles.bannerContainer}
          />
          <View style={styles.groupInfoContainer}>
            <Text style={styles.groupName}>{groupInfo.name}</Text>
            <Text style={styles.groupDescription}>{groupInfo.desc}</Text>
          </View>
        </View>

        <SocialPleasePost
          avatar={store.user_info.img}
          onPressContent={() => handlePressContent(false)}
          onPressImages={() => handlePressContent(true)}
          containerStyle={styles.pleasePostContainer}
        />
      </Container>
    );
  };

  return (
    <Posts
      groupId={id}
      onRefresh={onRefresh}
      onScroll={handleScroll}
      ListHeaderComponent={renderGroupHeader()}
    />
  );
};

export default React.memo(Groups);
