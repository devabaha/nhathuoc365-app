import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, RefreshControl, StyleSheet, Text, View} from 'react-native';
import {Actions} from 'react-native-router-flux';
import useIsMounted from 'react-is-mounted-hook';

import appConfig from 'app-config';

import {APIRequest} from 'src/network/Entity';

import NoResult from 'src/components/NoResult';
import ScreenWrapper from 'src/components/ScreenWrapper';
import Loading from 'src/components/Loading';
import ProgressItem from './ProgressItem';
import {servicesHandler, SERVICES_TYPE} from 'app-helper/servicesHandler';

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
  },
});

const ProgressTracking = () => {
  const isMounted = useIsMounted();
  const {t} = useTranslation();
  const [getListProgressItemRequest] = useState(new APIRequest());

  const [listProgressItem, setListProgressItem] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [isRefreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getListProgressItem();
  }, []);

  const getListProgressItem = async () => {
    getListProgressItemRequest.data = APIHandler.user_list_warranty();

    try {
      const response = await getListProgressItemRequest.promise();
      if (!isMounted()) return;

      if (response) {
        if (response.status === STATUS_SUCCESS) {
          if (response.data) {
            setListProgressItem(response.data);
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
      console.log('get_list_warranty', error);
      flashShowMessage({
        type: 'danger',
        message: t('api.error.message'),
      });
    } finally {
      if (!isMounted()) return;
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handlePressProgressItem = useCallback((progressItem) => {
    servicesHandler({
      type: SERVICES_TYPE.PROGRESS_TRACKING_DETAIL,
      title: progressItem.product?.name,
      id: progressItem.id,
    });
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    getListProgressItem();
  };

  const renderListEmpty = () => {
    return (
      !isLoading && (
        <NoResult iconName="note-multiple" message="Chưa có dữ liệu" />
      )
    );
  };

  const renderProgressItem = ({item: progressItem}) => {
    return (
      <ProgressItem
        image={progressItem.product?.image}
        title={progressItem.product?.name}
        code={progressItem.warranty_code}
        startDate={progressItem.start_date}
        endDate={progressItem.end_date}
        onPress={() => handlePressProgressItem(progressItem)}
      />
    );
  };

  return (
    <ScreenWrapper>
      {isLoading && <Loading center />}
      <FlatList
        data={listProgressItem}
        renderItem={renderProgressItem}
        contentContainerStyle={styles.contentContainer}
        ListEmptyComponent={renderListEmpty()}
        keyExtractor={(item, index) => index.toString()}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      />
    </ScreenWrapper>
  );
};

export default React.memo(ProgressTracking);
