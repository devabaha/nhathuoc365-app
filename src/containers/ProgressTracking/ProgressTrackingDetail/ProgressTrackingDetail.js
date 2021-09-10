import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  RefreshControl,
  StyleSheet,
  TouchableHighlight,
  View,
} from 'react-native';
import useIsMounted from 'react-is-mounted-hook';
import Icon from 'react-native-vector-icons/AntDesign';

import appConfig from 'app-config';

import {APIRequest} from 'src/network/Entity';

import NoResult from 'src/components/NoResult';
import ProgressTrackingBar from 'src/components/ProgressTrackingBar';
import ScreenWrapper from 'src/components/ScreenWrapper';
import ProgressItem from '../ProgressItem';
import {default as CustomButton} from 'src/components/Button';
import {Actions} from 'react-native-router-flux';
import {servicesHandler, SERVICES_TYPE} from 'app-helper/servicesHandler';

const styles = StyleSheet.create({
  trackingWrapper: {
    marginHorizontal: 15,
  },

  tabBarContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 0,
    ...elevationShadowStyle(3),
  },
  tabBarLabel: {
    minWidth: '100%',
    flex: appConfig.device.isIOS ? undefined : 1,
    color: '#333',
    textAlignVertical: 'center',
    textAlign: 'center',
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  tabBarLabelActive: {
    fontWeight: 'bold',
    color: appConfig.colors.primary,
  },
  indicatorStyle: {
    backgroundColor: appConfig.colors.primary,
    height: 2,
  },

  nav_right: {
    paddingRight: 8,
  },
  nav_right_btn: {
    paddingVertical: 1,
    paddingHorizontal: 8,
    paddingTop: appConfig.device.isAndroid ? 8 : 4,
  },
});

const ProgressTrackingDetail = ({id, index: indexProp = 0}) => {
  const {t} = useTranslation(['common', 'progressTracking']);
  const isMounted = useIsMounted();
  const [getProgressTrackingDetailRequest] = useState(new APIRequest());

  const HISTORY_KEY = 0;
  const ROUTE_KEY = 1;
  const DEFAULT_ROUTES = [
    {
      key: HISTORY_KEY,
      title: t('progressTracking:historyTitle'),
      data: [],
    },
    {
      key: ROUTE_KEY,
      title: t('progressTracking:routeTitle'),
      data: [],
    },
  ];

  const [routes, setRoutes] = useState(DEFAULT_ROUTES);

  const [progressTrackingDetail, setProgressTrackingDetail] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [isRefreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getProgressTrackingDetail();
  }, [getProgressTrackingDetail]);

  useEffect(() => {
    setTimeout(() => {
      Actions.refresh({
        right: renderRightNavBar(),
      });
    });
  }, [progressTrackingDetail]);

  const getProgressTrackingDetail = useCallback(async () => {
    getProgressTrackingDetailRequest.data = APIHandler.user_warranty_detail(id);

    try {
      const response = await getProgressTrackingDetailRequest.promise();
      if (!isMounted()) return;

      if (response) {
        if (response.status === STATUS_SUCCESS) {
          if (response.data) {
            const formattedRoutes = DEFAULT_ROUTES.map((route, index) => {
              const extraData =
                (index === 0
                  ? response.data?.histories?.route
                  : response.data?.route_detail?.route) || [];

              return {
                key: index,
                data: routesFormatter(extraData),
                title: route.title,
              };
            });
            // const formattedRoutes = routesFormatter(updatedRoutes);
            console.log(formattedRoutes);

            setProgressTrackingDetail(response.data);
            setRoutes(formattedRoutes);
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
      console.log('get_progress_tracking_detail', error);
      flashShowMessage({
        type: 'danger',
        message: t('api.error.message'),
      });
    } finally {
      if (!isMounted()) return;
      setRefreshing(false);
      setLoading(false);
    }
  }, [id]);

  const routesFormatter = (data = []) => {
    return data.map((item, index) => ({
      ...item,
      title: item.date_time,
      description: item.content,
    }));
  };

  const handleRefresh = () => {
    setRefreshing(true);
    getProgressTrackingDetail();
  };

  const goToRequestCreation = () => {
    servicesHandler({
      type: SERVICES_TYPE.CREATE_REQUEST,
      site_id: progressTrackingDetail.site_id,
      room_id: progressTrackingDetail.room_id,
      object_type: progressTrackingDetail.object_type,
      object_id: progressTrackingDetail.object_id,
      object: progressTrackingDetail,
      onRefresh: (request) => setTimeout(() => goToRequestDetail(request)),
    });
  };

  const goToRequests = () => {
    servicesHandler({
      type: SERVICES_TYPE.REQUESTS,
      site_id: progressTrackingDetail.site_id,
      room_id: progressTrackingDetail.room_id,
      object_type: progressTrackingDetail.object_type,
      object_id: progressTrackingDetail.object_id,
      object: progressTrackingDetail,
    });
  };

  const goToRequestDetail = (request = {}) => {
    servicesHandler({
      type: SERVICES_TYPE.REQUEST_DETAIL,
      site_id: progressTrackingDetail.site_id,
      room_id: progressTrackingDetail.room_id,
      request_id: request.id,
    });
  };

  const renderRightNavBar = () => {
    return (
      <View style={styles.nav_right}>
        <TouchableHighlight
          underlayColor="transparent"
          onPress={goToRequestCreation}>
          <View style={styles.nav_right_btn}>
            <Icon name="plus" size={22} color="#ffffff" />
          </View>
        </TouchableHighlight>
      </View>
    );
  };

  const renderEmpty = () => {
    return (
      !isLoading && (
        <NoResult iconName="note-multiple" message={t('noResult')} />
      )
    );
  };

  return (
    <ScreenWrapper>
      <ProgressItem
        image={progressTrackingDetail.product?.image}
        title={progressTrackingDetail.product?.name}
        code={progressTrackingDetail.warranty_code}
        startDate={progressTrackingDetail.start_date}
        endDate={progressTrackingDetail.end_date}
      />

      <ProgressTrackingBar
        loading={isLoading}
        data={routes}
        trackWrapperStyle={styles.trackingWrapper}
        listProps={{
          ListEmptyComponent: renderEmpty(),
          refreshControl: (
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
            />
          ),
        }}
      />

      {!!progressTrackingDetail?.room_id && (
        <CustomButton
          title={t('screen.requests.mainTitle')}
          onPress={goToRequests}
        />
      )}
    </ScreenWrapper>
  );
};

export default React.memo(ProgressTrackingDetail);
