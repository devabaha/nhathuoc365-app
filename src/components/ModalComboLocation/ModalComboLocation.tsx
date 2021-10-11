import React, {useRef, useEffect, useState} from 'react';
import {StyleSheet, FlatList} from 'react-native';
import {default as ModalBox} from 'react-native-modalbox';
import {Actions} from 'react-native-router-flux';
import {useTranslation} from 'react-i18next';
import KeyboardSpacer from 'react-native-keyboard-spacer';

import appConfig from 'app-config';

import NavBar from './NavBar';
import Location from './Location';
import Loading from '../Loading';
import Search from './Search';

import {ModalComboAddressProps} from '.';

import APIHandler from '../../network/APIHandler';
import {APIRequest} from '../../network/Entity';

import {COMBO_LOCATION_TYPE, LOCATION_HEIGHT} from './constants';
import {debounce} from 'lodash';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modal: {
    height: appConfig.device.height * 0.8,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  contentContainer: {
    paddingBottom: appConfig.device.bottomSpace,
  },
});

const ModalComboLocation = ({
  type,
  parentId,
  provinceId,
  districtId,
  wardsId,
  provinceName,
  districtName,
  wardsName,
  modalStyle,
  onCloseModal,
  onSelectProvince,
  onSelectDistrict,
  onSelectWards,
}: ModalComboAddressProps) => {
  const getDefaultLocation = () => {
    let id: any = '';
    switch (type) {
      case COMBO_LOCATION_TYPE.PROVINCE:
        id = provinceId;
        break;
      case COMBO_LOCATION_TYPE.DISTRICT:
        id = districtId;
        break;
      case COMBO_LOCATION_TYPE.WARDS:
        id = wardsId;
        break;
    }

    return {id};
  };

  const {t} = useTranslation();
  const refModal = useRef<any>();
  const refList = useRef<any>();

  const [isLoading, setLoading] = useState(true);

  const [locations, setLocations] = useState([]);
  const [listProvince, setListProvince] = useState([]);
  const [listDistrict, setListDistrict] = useState([]);
  const [listWards, setListWards] = useState([]);

  const [selectedType, setSelectedType]: any = useState(type);
  const [selectedParentId, setSelectedParentId] = useState(parentId);

  const [selectedLocation, setSelectedLocation]: any = useState(
    getDefaultLocation(),
  );
  const [selectedProvince, setSelectedProvince]: any = useState({
    id: provinceId,
    name: provinceName,
  });
  const [selectedDistrict, setSelectedDistrict]: any = useState({
    id: districtId,
    name: districtName,
  });
  const [selectedWards, setSelectedWards]: any = useState({
    id: wardsId,
    name: wardsName,
  });

  const [searchValue, setSearchValue] = useState('');
  const [searchLocations, setSearchLocations] = useState([]);

  const getLocationRequest = new APIRequest();
  const requests = [getLocationRequest];

  const getDescription = () => {
    return (
      (selectedProvince.name || '') +
      (selectedDistrict.name ? ' • ' + selectedDistrict.name : '') +
      (selectedWards.name ? ' • ' + selectedWards.name : '')
    );
  };

  useEffect(() => {
    getLocationInfo();

    return () => {
      //@ts-ignore
      cancelRequests(requests);
    };
  }, []);

  useEffect(() => {
    scrollToItem(selectedLocation);
  }, [locations]);

  const scrollToItem = (location) => {
    let index = locations.findIndex(({id}) => id === location.id) - 3;
    index < 3 && (index = 0);
    index > locations.length - 4 && (index = locations.length - 1);

    if (refList.current && index !== -1) {
      // have to wait to item in list rendered.
      setTimeout(
        () => refList.current && refList.current.scrollToIndex({index}),
      );
    }
  };

  const getTitle = () => {
    switch (selectedType) {
      case COMBO_LOCATION_TYPE.PROVINCE:
        return 'Chọn tỉnh/ thành phố';
      case COMBO_LOCATION_TYPE.DISTRICT:
        return 'Chọn quận/ huyện';
      case COMBO_LOCATION_TYPE.WARDS:
        return 'Chọn phường/ xã';
    }
  };

  const getLocationInfo = async (
    type = selectedType,
    parentId = selectedParentId,
  ) => {
    const data: any = {};

    if (parentId) {
      data.parent = parentId;
    }

    if (type === COMBO_LOCATION_TYPE.PROVINCE) {
      data.type = 'province';
    }

    getLocationRequest.data = APIHandler.user_location(data);
    try {
      const response = await getLocationRequest.promise();
      // console.log(response, data, type, parentId)
      setSelectedType(type);

      if (response) {
        //@ts-ignore
        if (response.status === STATUS_SUCCESS) {
          if (response.data) {
            switch (type) {
              case COMBO_LOCATION_TYPE.PROVINCE:
                setListProvince(response.data);
                break;
              case COMBO_LOCATION_TYPE.DISTRICT:
                setListDistrict(response.data);
                break;
              case COMBO_LOCATION_TYPE.WARDS:
                setListWards(response.data);
                break;
            }
            setLocations(response.data);
            setSearchValue('');
            setSearchLocations([]);
          }
        } else {
          //@ts-ignore
          flashShowMessage({
            type: 'danger',
            message: response.message || t('api.error.message'),
          });
        }
      } else {
        //@ts-ignore
        flashShowMessage({
          type: 'danger',
          message: response.message || t('api.error.message'),
        });
      }
    } catch (error) {
      console.log('get_location_info', error);
      //@ts-ignore
      flashShowMessage({
        type: 'danger',
        message: t('api.error.message'),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    // console.log(locations, selectedType)
    setSearchValue('');
    setSearchLocations([]);

    switch (selectedType) {
      case COMBO_LOCATION_TYPE.PROVINCE:
        handleCloseModal();
        break;
      case COMBO_LOCATION_TYPE.DISTRICT:
        setSelectedType(COMBO_LOCATION_TYPE.PROVINCE);
        if (!!listProvince?.length) {
          setLocations(listProvince);
        } else {
          setLoading(true);
          getLocationInfo(COMBO_LOCATION_TYPE.PROVINCE, '');
        }
        setSelectedLocation(selectedProvince);
        break;
      case COMBO_LOCATION_TYPE.WARDS:
        setSelectedType(COMBO_LOCATION_TYPE.DISTRICT);
        if (!!listDistrict?.length) {
          setLocations(listDistrict);
        } else {
          setLoading(true);
          getLocationInfo(COMBO_LOCATION_TYPE.DISTRICT, provinceId);
        }
        setSelectedLocation(selectedDistrict);
        break;
    }
  };

  const handlePressLocation = (location) => {
    setSelectedLocation(location);
    let type = selectedType,
      parentId = selectedParentId;
    switch (selectedType) {
      case COMBO_LOCATION_TYPE.PROVINCE:
        type = COMBO_LOCATION_TYPE.DISTRICT;
        setSelectedProvince(location);
        parentId = location.id;
        onSelectProvince(location);
        onSelectDistrict({});
        onSelectWards({});
        setSelectedDistrict({});
        setSelectedWards({});
        break;
      case COMBO_LOCATION_TYPE.DISTRICT:
        type = COMBO_LOCATION_TYPE.WARDS;
        setSelectedDistrict(location);
        parentId = location.id;
        onSelectDistrict(location);
        onSelectWards({});
        setSelectedWards({});
        break;
      case COMBO_LOCATION_TYPE.WARDS:
        setSelectedWards(location);
        setLoading(false);
        onSelectWards(location);
        // onCloseModal(selectedProvince, selectedDistrict, selectedWards);
        handleCloseModal();
        return;
    }

    setSelectedParentId(parentId);
    setLoading(true);
    getLocationInfo(type, parentId);
  };

  const onChangeSearch = (searchValue) => {
    setSearchValue(searchValue);
    handleSearchLocations(searchValue);
  };

  const handleSearchLocations = debounce((searchValue) => {
    const searchLocations = locations.filter(({name}) => {
      return name.includes(searchValue);
    });

    setSearchLocations(searchLocations);
  }, 300);

  const handleCloseModal = () => {
    if (refModal.current) {
      refModal.current.close();
    }
  };

  const onClosedModal = () => {
    Actions.pop();
  };

  const renderLocation = ({item: location}) => {
    return (
      <Location
        selected={location.id === selectedLocation.id}
        title={location.name}
        onPress={() => handlePressLocation(location)}
      />
    );
  };

  return (
    <ModalBox
      entry="bottom"
      position="bottom"
      style={[styles.modal, modalStyle]}
      backButtonClose
      ref={refModal}
      isOpen
      onClosed={onClosedModal}
      useNativeDriver>
      {isLoading && <Loading center />}
      <NavBar
        type={selectedType}
        title={getTitle()}
        description={getDescription()}
        onPressBack={handleBack}
      />
      <Search value={searchValue} onChangeText={onChangeSearch} />
      <FlatList
        ref={refList}
        contentContainerStyle={styles.contentContainer}
        data={!!searchLocations.length ? searchLocations : locations}
        renderItem={renderLocation}
        getItemLayout={(data, index) => ({
          length: LOCATION_HEIGHT,
          offset: LOCATION_HEIGHT * index,
          index,
        })}
        keyboardShouldPersistTaps="handled"
        keyExtractor={(item, index) => index.toString()}
        onScrollToIndexFailed={(e) => console.log(e)}
        ListFooterComponent={appConfig.device.isIOS && <KeyboardSpacer />}
      />
    </ModalBox>
  );
};

export default React.memo(ModalComboLocation);
