import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Platform} from 'react-native';
import {APIRequest} from 'src/network/Entity';
import APIHandler from 'src/network/APIHandler';
import store from 'app-store';
import appConfig from 'app-config';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ListTag from './ListTag';
import {getValueFromConfigKey} from 'src/helper/configKeyHandler/configKeyHandler';
import {CONFIG_KEY} from 'src/helper/configKeyHandler';
import ListPrice from './ListPrice';
import {Actions} from 'react-native-router-flux';
import mobx, {autorun, reaction} from 'mobx';
import {isEmpty} from 'lodash';

function FilterComponent(props) {
  const getListFilterTagRequest = new APIRequest();
  const [dataFilterTag, setDataFilterTag] = useState([]);
  const [defaultSelected, setDefaultSelected] = useState({});
  const [selectedTag, setSelectedTag] = useState({});
  const [selectedPrice, setSelectedPrice] = useState({});
  const priceValueString = getValueFromConfigKey(CONFIG_KEY.FILTER_PRICES_KEY);
  const disposer = useRef(null);

  const getListFilterTag = async () => {
    try {
      const siteId = store.store_data.id;
      getListFilterTagRequest.data = APIHandler.getListFilterProduct(siteId);
      const response = await getListFilterTagRequest.promise();
      if (response.status === 200) {
        setDataFilterTag(response.data);
      }
    } catch (err) {
      console.log(err);
      setDataFilterTag([]);
    }
  };
  useEffect(() => {
    reaction(
      () => store.selectedFilter,
      (data) => {
        console.log({aa: mobx.toJS(data)});
        setDefaultSelected(data);
      },
    );
    return () => {
      console.log('da unmount chua');
    };
  }, []);

  useEffect(() => {
    getListFilterTag();
  }, []);

  const handleCloseFilter = () => {
    store.setSelectedFilter({...selectedPrice, ...selectedTag});
    Actions.drawerClose();
    // disposer.current();
  };

  const handleSelected = (value) => {
    setSelectedTag(value);
    // store.setSelectedFilter(value);
  };

  const handleSelectedPrice = (value) => {
    setSelectedPrice(value);
    // store.setSelectedFilter({...store.selectedFilter, ...value});
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView>
        <ListTag
          data={dataFilterTag}
          onChangeValue={handleSelected}
          defaultValue={defaultSelected}
          isOpen={props.navigation.state.isDrawerOpen}
        />
        {!!priceValueString && (
          <ListPrice
            title="Giá tiền"
            defaultValue={defaultSelected}
            onChangeValue={handleSelectedPrice}
          />
        )}
      </KeyboardAwareScrollView>
      <View style={styles.absolute}>
        <TouchableOpacity
          style={styles.btnContainer}
          onPress={handleCloseFilter}>
          <Text style={styles.txtButton}>Áp dụng</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: appConfig.device.isIphoneX ? 30 : 0,
    flex: 1,
  },
  btnContainer: {
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: appConfig.primaryColor,
    marginHorizontal: 15,
  },
  absolute: {
    paddingBottom: appConfig.device.isIphoneX ? 23 : 0,
    paddingTop: 10,
    backgroundColor: '#fafafa',
    ...Platform.select({
      ios: {
        shadowColor: '#333',
        shadowOffset: {
          width: 1,
          height: 5,
        },
        shadowOpacity: 0.1,
        shadowRadius: 5,
      },
      android: {
        elevation: 8,
        borderWidth: Util.pixel,
        borderColor: '#E1E1E1',
      },
    }),
  },
  txtButton: {
    color: '#fff',
    fontWeight: '500',
  },
});

export default FilterComponent;
