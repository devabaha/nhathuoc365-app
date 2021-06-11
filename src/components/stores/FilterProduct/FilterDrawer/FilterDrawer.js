import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

import {APIRequest} from 'src/network/Entity';
import APIHandler from 'src/network/APIHandler';
import store from 'app-store';
import appConfig from 'app-config';
import ListTag from '../components/ListTag';
import {getValueFromConfigKey} from 'src/helper/configKeyHandler/configKeyHandler';
import {CONFIG_KEY} from 'src/helper/configKeyHandler';
import ListPrice from '../components/ListPrice';
import {reaction, toJS} from 'mobx';
import {isEmpty, isEqual} from 'lodash';
import Button from '../../../Button';
import useIsMounted from 'react-is-mounted-hook';
import {hideDrawer} from '../../../Drawer';
import ScreenWrapper from '../../../ScreenWrapper';
import Container from 'src/components/Layout/Container';
import NoResult from 'src/components/NoResult';
import FilterDrawerSkeleton from './FilterDrawerSkeleton';

function FilterDrawer() {
  const {t} = useTranslation();
  const isMounted = useIsMounted();

  const getTagsRequest = new APIRequest();

  const [isLoading, setLoading] = useState(true);
  const [dataFilterTag, setDataFilterTag] = useState([]);
  const [defaultSelected, setDefaultSelected] = useState(
    store.selectedFilter || {},
  );
  const [selectedTag, setSelectedTag] = useState({});
  const [selectedPrice, setSelectedPrice] = useState({});
  const [disabled, setDisabled] = useState(false);
  const priceValueString = getValueFromConfigKey(CONFIG_KEY.FILTER_PRICES_KEY);

  const refScrollView = useRef();

  const hasData = !isEmpty(dataFilterTag) || !isEmpty(priceValueString);

  const getListFilterTag = async () => {
    try {
      const siteId = store.store_data.id;
      getTagsRequest.data = APIHandler.site_get_tags(siteId);
      const response = await getTagsRequest.promise();
      if (!isMounted()) return;

      if (response) {
        if (response.status === STATUS_SUCCESS) {
          setDataFilterTag(response.data || []);
        } else {
          flashShowMessage({
            type: 'danger',
            message: response.message || t('api.error.message'),
          });
        }
      } else {
        flashShowMessage({
          type: 'danger',
          message: response.message || t('api.error.message'),
        });
      }
    } catch (err) {
      console.log(err);
      if (!isMounted()) return;

      setDataFilterTag([]);
      flashShowMessage({
        type: 'danger',
        message: t('api.error.message'),
      });
    } finally {
      setTimeout(() => {
        if (!isMounted()) return;

        setLoading(false);
      }, 300);
    }
  };

  useEffect(() => {
    getListFilterTag();

    return () => {
      cancelRequests([getTagsRequest]);
    };
  }, []);

  useEffect(() => {
    const disposer = reaction(
      () => store.selectedFilter,
      (data) => {
        if (!isEqual(toJS(data), defaultSelected)) {
          setDefaultSelected(toJS(data));
        }
      },
    );

    return () => {
      disposer();
    };
  }, [defaultSelected]);

  const handleCloseFilter = () => {
    hideDrawer();
    Keyboard.dismiss();
  };

  const handleApplyFilter = () => {
    const selectedFilter = {...selectedPrice, ...selectedTag};
    if (
      selectedFilter?.price?.min_price &&
      selectedFilter?.price?.max_price &&
      checkPriceRange(
        selectedFilter.price.min_price,
        selectedFilter.price.max_price,
      )
    ) {
      return;
    }

    store.setSelectedFilter(selectedFilter);

    handleCloseFilter();
  };

  const handleSelected = (value) => {
    setSelectedTag(value);
  };

  const handleSelectedPrice = (value) => {
    setSelectedPrice(value);
  };

  const checkPriceRange = (minPrice, maxPrice) => {
    if (!!minPrice && !!maxPrice) {
      if (Number(minPrice) >= Number(maxPrice)) {
        !disabled &&
          flashShowMessage({
            type: 'danger',
            message: 'Giá thấp nhất phải nhỏ hơn giá cao nhất',
          });
        setDisabled('Giá thấp nhất phải nhỏ hơn giá cao nhất');
        return true;
      }
    }

    setDisabled('');
    return false;
  };

  const handleResetFilter = () => {
    setSelectedTag({});
    setSelectedPrice({});
    setDefaultSelected({});

    store.setSelectedFilter({});
  };

  return (
    <View style={styles.wrapper}>
      {/* {isLoading && <Loading center />} */}
      <View style={styles.maskTop} />
      <View style={styles.maskBottom} />
      <ScreenWrapper containerStyle={styles.safeArea}>
        <Container row>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Lọc sản phẩm</Text>
          </View>
          <TouchableOpacity onPress={handleCloseFilter}>
            <FontAwesome5Icon name="times" style={styles.closeIcon} />
          </TouchableOpacity>
        </Container>

        <ScrollView
          ref={refScrollView}
          keyboardShouldPersistTaps="handled"
          style={styles.listContainer}
          contentContainerStyle={styles.contentContainer}>
          {isLoading ? (
            <FilterDrawerSkeleton />
          ) : hasData ? (
            <>
              <ListTag
                data={dataFilterTag}
                onChangeValue={handleSelected}
                defaultValue={defaultSelected}
                isOpen
              />
              {!!priceValueString && (
                <ListPrice
                  title="Giá tiền"
                  defaultValue={defaultSelected}
                  onChangeValue={handleSelectedPrice}
                  onChangePriceRange={checkPriceRange}
                  error={disabled}
                  refScrollView={refScrollView}
                />
              )}
            </>
          ) : (
            <NoResult
              iconName="filter-remove-outline"
              message="Chưa có bộ lọc"
            />
          )}
        </ScrollView>

        {hasData && (
          <Container row style={styles.btnFooterContainer}>
            <Button
              containerStyle={styles.btnResetContainer}
              btnContainerStyle={styles.btnResetContent}
              onPress={handleResetFilter}>
              <AntDesignIcon name="sync" style={styles.closeIcon} />
            </Button>

            <Button
              containerStyle={styles.btnApplyContainer}
              disabled={disabled}
              title="Áp dụng"
              onPress={handleApplyFilter}
            />
          </Container>
        )}
        {appConfig.device.isIOS && <KeyboardSpacer />}
      </ScreenWrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  safeArea: {
    backgroundColor: 'transparent',
  },
  listContainer: {
    backgroundColor: appConfig.colors.white,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    paddingTop: 15,
  },
  btnContainer: {
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: appConfig.colors.primary,
    marginHorizontal: 15,
  },
  absolute: {
    marginTop: 15,
  },
  titleContainer: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  txtButton: {
    color: '#fff',
    fontWeight: '500',
  },

  maskTop: {
    position: 'absolute',
    backgroundColor: appConfig.colors.primary,
    width: '100%',
    height: '50%',
  },
  maskBottom: {
    position: 'absolute',
    backgroundColor: appConfig.colors.white,
    width: '100%',
    height: '50%',
    bottom: 0,
  },

  closeIcon: {
    color: '#fff',
    fontSize: 20,
    paddingHorizontal: 15,
  },

  btnResetContainer: {
    width: undefined,
    flex: 0.3,
    paddingHorizontal: 10,
  },
  btnResetContent: {
    backgroundColor: '#aaa',
  },
  btnApplyContainer: {
    paddingLeft: 0,
    paddingRight: 10,
    width: undefined,
    flex: 1,
  },
  btnFooterContainer: {
    borderColor: '#eee',
    borderTopWidth: 0.5,
  },
});

export default React.memo(FilterDrawer);
