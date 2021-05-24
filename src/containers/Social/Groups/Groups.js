import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
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

const styles = StyleSheet.create({});

const Groups = ({id, siteId = store.store_data?.id}) => {
  const isMounted = useIsMounted();
  const {t} = useTranslation();
  const [isLoading, setLoading] = useState(false);
  const [isRefreshing, setRefreshing] = useState(false);
  const [getGroupInfoRequest] = useState(new APIRequest());

  const [groupInfo, setGroupInfo] = useState({});

  useEffect(() => {
    getGroupInfo();
    return () => {
      cancelRequests([getGroupInfoRequest]);
    };
  }, []);

  const getGroupInfo = async () => {
    const data = {
      site_id: siteId,
    };
    getGroupInfoRequest.data = APIHandler.social_groups_show(id, data);

    try {
      const response = await getGroupInfoRequest.promise();
      console.log(response);
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

  const handlePressContent = () => {
    Actions.push(appConfig.routes.socialCreatePost);
  };

  renderGroupHeader = () => {
    return (
      <Container centerVertical={false}>
        <View style={{backgroundColor: '#fff'}}>
          <Image
            source={{uri: groupInfo.banner}}
            style={{
              ...getNewsFeedSize(),
              borderBottomWidth: 0.5,
              borderColor: '#ddd',
            }}
          />
          <View style={{padding: 15}}>
            <Text style={{fontSize: 26, fontWeight: 'bold', color: '#242424'}}>
              {groupInfo.name}
            </Text>
            <Text style={{fontSize: 16, marginTop: 10, color: '#333'}}>
              {groupInfo.desc}
            </Text>
          </View>
        </View>

        <SocialPleasePost
          avatar={store.user_info.img}
          onPressContent={handlePressContent}
          containerStyle={{marginVertical: 10}}
        />
      </Container>
    );
  };

  return (
    <>
      <Posts
        groupId={id}
        ListHeaderComponent={renderGroupHeader()}
        onRefresh={onRefresh}
      />
    </>
  );
};

export default React.memo(Groups);
