import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import useIsMounted from 'react-is-mounted-hook';
import {APIRequest} from 'src/network/Entity';
import store from 'app-store';
import {SocialPleasePost} from 'src/components/Social/components';
import { Actions } from 'react-native-router-flux';

import appConfig from 'app-config';

const styles = StyleSheet.create({});

const Groups = ({siteId = store.store_data?.id}) => {
  const isMounted = useIsMounted();
  const {t} = useTranslation();
  const [isLoading, setLoading] = useState(false);
  const [getGroupsRequest] = useState(new APIRequest());

  const [groups, setGroups] = useState([]);

  useEffect(() => {
    // getGroups();
    console.log(store.user_info);
    return () => {
      cancelRequests([getGroupsRequest]);
    };
  }, []);

  const getGroups = async () => {
    const data = {
      site_id: siteId,
    };
    getGroupsRequest.data = APIHandler.social_groups(data);

    try {
      const response = await getGroupsRequest.promise();
      console.log(response);
      if (response) {
        if (response.status === STATUS_SUCCESS) {
          if (response.data) {
            setPosts(response.data.list || []);
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

  const handlePressContent = () => {
   Actions.push(appConfig.routes.socialCreatePost)
  };

  return (
    <>
      <SocialPleasePost avatar={store.user_info.img} onPressContent={handlePressContent}/>
    </>
  );
};

export default React.memo(Groups);
