import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
// 3-party libs
import useIsMounted from 'react-is-mounted-hook';
// configs
import appConfig from 'app-config';
// helpers
import {servicesHandler} from 'app-helper/servicesHandler';
import {updateNavbarTheme} from 'src/Themes/helper/updateNavBarTheme';
//routing
import {refresh} from 'app-helper/routing';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {SERVICES_TYPE} from 'app-helper/servicesHandler';
import {BundleIconSetName} from 'src/components/base';
// entities
import {APIRequest} from 'src/network/Entity';
// custom components
import {IconButton, ScreenWrapper, RefreshControl} from 'src/components/base';
import NoResult from 'src/components/NoResult';
import Button from 'src/components/Button';
import ProgressTrackingBar from 'src/components/ProgressTrackingBar';
import ProgressItem from '../ProgressItem';

const styles = StyleSheet.create({
  trackingWrapper: {
    marginHorizontal: 15,
  },

  nav_right: {
    paddingHorizontal: 8,
  },
  nav_right_btn: {
    paddingVertical: 1,
    paddingTop: appConfig.device.isAndroid ? 8 : 4,
  },
  iconNav: {
    fontSize: 28,
  },
});

const ProgressTrackingDetail = ({id, index: indexProp = 0, navigation}) => {
  const {theme} = useTheme();

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
    if (!navigation) return;

    const updateNavBarDisposer = updateNavbarTheme(navigation, theme);

    return updateNavBarDisposer;
  }, [theme]);

  useEffect(() => {
    getProgressTrackingDetail();
  }, [getProgressTrackingDetail]);

  useEffect(() => {
    setTimeout(() => {
      refresh({
        right: renderRightNavBar(),
      });
    });
  }, [progressTrackingDetail, theme]);

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
      theme: theme,
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
      theme: theme,
    });
  };

  const goToRequestDetail = (request = {}) => {
    servicesHandler({
      type: SERVICES_TYPE.REQUEST_DETAIL,
      site_id: progressTrackingDetail.site_id,
      room_id: progressTrackingDetail.room_id,
      request_id: request.id,
      theme: theme,
    });
  };

  const renderRightNavBar = () => {
    return (
      <View style={styles.nav_right}>
        <IconButton
          underlayColor="transparent"
          onPress={goToRequestCreation}
          style={styles.nav_right_btn}
          iconStyle={[styles.iconNav, iconNavStyle]}
          name="plus"
          bundle={BundleIconSetName.ENTYPO}></IconButton>
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

  const iconNavStyle = useMemo(() => {
    return {color: theme.color.onPrimary};
  }, [theme]);

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
        <Button
          safeLayout
          title={t('screen.requests.mainTitle')}
          onPress={goToRequests}
        />
      )}
    </ScreenWrapper>
  );
};

export default React.memo(ProgressTrackingDetail);
