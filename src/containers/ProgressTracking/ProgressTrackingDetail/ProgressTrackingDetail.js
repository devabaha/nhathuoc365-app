import React, {useCallback, useEffect, useRef, useState} from 'react';
import {RefreshControl, StyleSheet, Text, View} from 'react-native';
import useIsMounted from 'react-is-mounted-hook';
import {TabView, TabBar} from 'react-native-tab-view';
import Button from 'react-native-button';

import appConfig from 'app-config';

import {APIRequest} from 'src/network/Entity';

import Loading from 'src/components/Loading';
import NoResult from 'src/components/NoResult';
import ProgressTrackingBar from 'src/components/ProgressTrackingBar';
import ScreenWrapper from 'src/components/ScreenWrapper';
import ProgressItem from '../ProgressItem';
import Container from 'src/components/Layout/Container';
import CustomPad from './CustomPad';

const styles = StyleSheet.create({
  trackingContainer: {
    paddingVertical: 20,
    paddingHorizontal: 15,
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
});

const ProgressTrackingDetail = ({id, index: indexProp = 0}) => {
  const {t} = useTranslation(['common', 'progressTracking']);
  const isMounted = useIsMounted();
  const [getProgressTrackingDetailRequest] = useState(new APIRequest());

  const ROUTE_KEY = 0;
  const HISTORY_KEY = 1;
  const DEFAULT_ROUTES = [
    {
      key: ROUTE_KEY,
      title: t('progressTracking:routeTitle'),
    },
    {
      key: HISTORY_KEY,
      title: t('progressTracking:historyTitle'),
    },
  ];

  const jumpTo = useRef();

  const [index, setIndex] = useState(indexProp);
  const [routes, setRoutes] = useState(DEFAULT_ROUTES);

  const [progressTrackingDetail, setProgressTrackingDetail] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [isRefreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getProgressTrackingDetail();
  }, [getProgressTrackingDetail]);

  const getProgressTrackingDetail = useCallback(async () => {
    getProgressTrackingDetailRequest.data = APIHandler.user_warranty_detail(id);

    try {
      const response = await getProgressTrackingDetailRequest.promise();
      if (!isMounted()) return;
      console.log(response);
      if (response) {
        if (response.status === STATUS_SUCCESS) {
          if (response.data) {
            const updatedRoutes = DEFAULT_ROUTES.map((route, index) => {
              const extraData =
                (index === 0
                  ? response.data?.route_detail?.route
                  : response.data?.histories?.route) || [];

              return {
                route: extraData,
                ...route,
              };
            });
            const formattedRoutes = routesFormatter(updatedRoutes);

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
      key: index,
      ...item,
      route: item.route.map((r) => ({
        title: r.date_time,
        description: r.content,
      })),
    }));
  };

  const handleIndexChange = (index, isTabBarPress = false) => {
    if (!!jumpTo.current && isTabBarPress) {
      jumpTo.current(index);
    }
    setIndex(index);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    getProgressTrackingDetail();
  };

  const renderTabBarLabel = (props) => {
    const {
      route: {title, key},
    } = props;
    const focused = key === index;

    return (
      <Text
        numberOfLines={2}
        style={[styles.tabBarLabel, focused && styles.tabBarLabelActive]}>
        {title}
      </Text>
    );
  };

  const renderTabBar = (props) => {
    if (!jumpTo.current) {
      // use this function instead of default behavior (using index) when change index of tab bar to improve FPS.
      jumpTo.current = props.jumpTo;
    }
    const tabWidth = appConfig.device.width / 2;
    return (
      <TabBar
        {...props}
        renderTabBarItem={(props) => {
          return (
            <Button
              key={props.key}
              onPress={() => handleIndexChange(props.route.key, true)}
              containerStyle={{
                minHeight: 48,
                width: tabWidth,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {renderTabBarLabel(props)}
            </Button>
          );
        }}
        indicatorStyle={styles.indicatorStyle}
        tabStyle={{width: tabWidth}}
        style={styles.tabBarContainer}
        scrollEnabled
      />
    );
  };

  const renderScene = ({route}) => {
    const isReverse = route.key === ROUTE_KEY;
    return (
      <ProgressTrackingBar
        data={route?.route || []}
        renderPad={(padDimensions) => {
          return <CustomPad dimensions={padDimensions} isReverse={isReverse} />;
        }}
        listProps={{
          contentContainerStyle: styles.trackingContainer,
          ListEmptyComponent: renderEmpty(),
          refreshControl: (
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
            />
          ),
        }}
      />
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
      {isLoading && <Loading center />}
      <ProgressItem
        image={progressTrackingDetail.product?.image}
        title={progressTrackingDetail.product?.name}
        code={progressTrackingDetail.warranty_code}
        startDate={progressTrackingDetail.start_date}
        endDate={progressTrackingDetail.end_date}
      />

      {!!routes.length ? (
        <TabView
          navigationState={{
            routes: routes,
            index: index,
          }}
          renderTabBar={renderTabBar}
          renderScene={renderScene}
          onIndexChange={(index) => handleIndexChange(index)}
          initialLayout={{width: appConfig.device.width}}
        />
      ) : (
        !isLoading && (
          <NoResult iconName="note-multiple" message={t('noResult')} />
        )
      )}
    </ScreenWrapper>
  );
};

export default React.memo(ProgressTrackingDetail);
