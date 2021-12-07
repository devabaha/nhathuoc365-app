import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Animated, Easing, StyleSheet, Text, View} from 'react-native';
import useIsMounted from 'react-is-mounted-hook';
import {Actions} from 'react-native-router-flux';
// configs
import appConfig from 'app-config';
import store from 'app-store';
// helpers
import {getNewsFeedSize} from 'app-helper/image';
import {servicesHandler, SERVICES_TYPE} from 'app-helper/servicesHandler';
import {mergeStyles} from 'src/Themes/helper';
// context
import {useTheme} from 'src/Themes/Theme.context';
// entities
import {APIRequest} from 'src/network/Entity';
// custom components
import {SocialPleasePost} from 'src/components/Social/components';
import Posts from '../Posts';
import {
  Card,
  CardBorderRadiusType,
  Container,
  ScreenWrapper,
  Typography,
  TypographyType,
} from 'src/components/base';
import Image from 'src/components/Image';
// skeleton
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

  headerInfoContainer: {},
  bannerContainer: {
    ...getNewsFeedSize(),
  },
  groupInfoContainer: {
    padding: 15,
  },
  groupName: {
    fontWeight: 'bold',
  },
  groupDescription: {
    marginTop: 10,
  },
  pleasePostContainer: {
    marginVertical: 3,
  },
});

const Group = ({id, groupName, siteId = store.store_data?.id}) => {
  const {theme} = useTheme();

  const isMounted = useIsMounted();
  const {t} = useTranslation();

  const isTitleVisible = useRef(false);
  const isTitleInvisible = useRef(true);

  const [isLoading, setLoading] = useState(true);
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
  }, [groupInfo?.banner, groupName, groupInfo?.name]);

  const renderTitle = () => {
    return (
      <Animated.View style={[styles.titleContainer, animatedTitleStyle]}>
        <Card
          borderRadiusSize={CardBorderRadiusType.EXTRA_SMALL}
          style={styles.titleImageContainer}>
          <Image
            source={{uri: groupInfo?.banner || ''}}
            style={styles.titleImage}
          />
        </Card>
        <Typography
          type={TypographyType.TITLE_SEMI_LARGE}
          numberOfLines={2}
          style={styles.title}>
          {groupInfo?.name || groupName}
        </Typography>
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
      }
    }
  };

  const onRefresh = () => {
    getGroupInfo();
  };

  const handlePressContent = useCallback(
    (isOpenImagePicker) => {
      servicesHandler({
        type: SERVICES_TYPE.SOCIAL_CREATE_POST,
        group_id: groupInfo.id,
        site_id: groupInfo.site_id,
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

  const renderGroupHeader = () => {
    return isLoading ? (
      <GroupHeaderSkeleton />
    ) : (
      <>
        <Container>
          <View style={styles.headerInfoContainer}>
            <Image
              canTouch
              source={{uri: groupInfo.banner}}
              containerStyle={bannerContainerStyle}
            />
            <View style={styles.groupInfoContainer}>
              <Typography
                type={TypographyType.LABEL_DISPLAY_SMALL}
                style={styles.groupName}>
                {groupInfo.name}
              </Typography>
              <Typography
                type={TypographyType.LABEL_LARGE}
                style={styles.groupDescription}>
                {groupInfo.desc}
              </Typography>
            </View>
          </View>
        </Container>

        <SocialPleasePost
          avatar={store.user_info.img}
          onPressContent={() => handlePressContent(false)}
          onPressImages={() => handlePressContent(true)}
          containerStyle={styles.pleasePostContainer}
        />
      </>
    );
  };

  const bannerContainerStyle = useMemo(() => {
    return mergeStyles(styles.bannerContainer, {
      borderBottomWidth: theme.layout.borderWidthPixel,
      borderColor: theme.color.border,
    });
  }, [theme]);

  return (
    <ScreenWrapper>
      <Posts
        safeLayout
        groupId={id}
        onRefresh={onRefresh}
        onScroll={handleScroll}
        ListHeaderComponent={renderGroupHeader}
      />
    </ScreenWrapper>
  );
};

export default React.memo(Group);
