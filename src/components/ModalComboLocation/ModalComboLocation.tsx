import React, {useRef, useEffect, useState, useMemo} from 'react';
import {StyleSheet} from 'react-native';
// 3-party libs
import {default as ModalBox} from 'react-native-modalbox';
import {useTranslation} from 'react-i18next';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import useIsMounted from 'react-is-mounted-hook';
import {debounce} from 'lodash';
// types
import {ModalComboAddressProps} from '.';
// configs
import appConfig from 'app-config';
// network
import APIHandler from 'src/network/APIHandler';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// routing
import {pop} from 'app-helper/routing';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {COMBO_LOCATION_TYPE, LOCATION_HEIGHT} from './constants';
// entities
import {APIRequest} from '../../network/Entity';
// custom components
import NavBar from './NavBar';
import Location from './Location';
import Loading from '../Loading';
import Search from './Search';
import {FlatList} from 'src/components/base';

const PROVINCE_TYPE_QUERY_PARAM = 'province';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modal: {
    height: appConfig.device.height * 0.8,
    backgroundColor: 'transparent',
    overflow: 'hidden',
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
  modalStyle: modalStyleProp,
  onCloseModal,
  onSelectProvince,
  onSelectDistrict,
  onSelectWards,
}: ModalComboAddressProps) => {
  const {theme} = useTheme();

  const isMounted = useIsMounted();
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
  const [canListBounce, setListBounce] = useState(false);

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
      (selectedDistrict.name ? ' ??? ' + selectedDistrict.name : '') +
      (selectedWards.name ? ' ??? ' + selectedWards.name : '')
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
      setTimeout(() => {
        if (!isMounted()) return;

        refList.current && refList.current.scrollToIndex({index});
        setTimeout(() => {
          if (!isMounted()) return;
          setListBounce(true);
        }, 200);
      }, 300);
    }
  };

  const getTitle = () => {
    switch (selectedType) {
      case COMBO_LOCATION_TYPE.PROVINCE:
        return t('common:selectProvinceCity');
      case COMBO_LOCATION_TYPE.DISTRICT:
        return t('common:selectDistrict');
      case COMBO_LOCATION_TYPE.WARDS:
        return t('common:selectWard');
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
      data.type = PROVINCE_TYPE_QUERY_PARAM;
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
    pop();
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

  const modalStyle = useMemo(() => {
    return mergeStyles(
      [
        styles.modal,
        {
          borderTopLeftRadius: theme.layout.borderRadiusHuge,
          borderTopRightRadius: theme.layout.borderRadiusHuge,
          backgroundColor: theme.color.surface,
        },
      ],
      modalStyleProp,
    );
  }, [theme, modalStyleProp]);

  return (
    <ModalBox
      entry="bottom"
      position="bottom"
      style={modalStyle}
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
        safeLayout
        ref={refList}
        bounces={canListBounce}
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
