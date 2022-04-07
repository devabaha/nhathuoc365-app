import React, {useEffect, useRef, useState, useMemo} from 'react';
import {View, StyleSheet, Keyboard} from 'react-native';
// 3-party libs
import KeyboardSpacer from 'react-native-keyboard-spacer';
import useIsMounted from 'react-is-mounted-hook';
import {reaction, toJS} from 'mobx';
import {Observer} from 'mobx-react';
import {isEmpty, isEqual} from 'lodash';
// configs
import store from 'app-store';
import appConfig from 'app-config';
// network
import APIHandler from 'src/network/APIHandler';
// helpers
import {getValueFromConfigKey} from 'src/helper/configKeyHandler/configKeyHandler';
import {mergeStyles} from 'src/Themes/helper';
import {hideDrawer} from 'src/components/Drawer';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {CONFIG_KEY} from 'src/helper/configKeyHandler';
import {
  BundleIconSetName,
  NavBarWrapper,
  TypographyType,
} from 'src/components/base';
// entities
import {APIRequest} from 'src/network/Entity';
// custom components
import ListTag from '../components/ListTag';
import ListPrice from '../components/ListPrice';
import Button from 'src/components/Button';
import {
  IconButton,
  ScreenWrapper,
  ScrollView,
  Typography,
  Container,
  Icon,
} from 'src/components/base';
import NoResult from 'src/components/NoResult';
// skeleton
import FilterDrawerSkeleton from './FilterDrawerSkeleton';

function FilterDrawer(props) {
  const {theme} = useTheme();

  const {t} = useTranslation(['common', 'filterProduct']);

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
            message: t('filterProduct:priceRange'),
          });
        setDisabled(t('filterProduct:priceRange'));
        return true;
      }
    }

    setDisabled('');
    return false;
  };

  const isResetFilterDisabled = () => {
    return (
      !Object.keys(store.selectedFilter)?.length &&
      !Object.keys(selectedTag)?.length &&
      !Object.keys(selectedPrice)?.length
    );
  };

  const handleResetFilter = () => {
    if (isResetFilterDisabled()) return;

    setSelectedTag({});
    setSelectedPrice({});
    setDefaultSelected({});

    store.setSelectedFilter({});
  };

  const renderResetFilterIcon = (titleStyle) => {
    return (
      <Icon
        bundle={BundleIconSetName.ANT_DESIGN}
        name="sync"
        style={[
          titleStyle,
          styles.closeIcon,
          !isResetFilterDisabled() && styles.resetIcon,
        ]}
      />
    );
  };

  const btnFooterContainerStyle = useMemo(() => {
    return mergeStyles(styles.btnFooterContainer, {
      borderColor: theme.color.contentBackgroundStrong,
      borderTopWidth: theme.layout.borderWidthSmall,
    });
  }, [theme]);

  const navBarContainerStyle = useMemo(() => {
    return {backgroundColor: theme.color.navBarBackground};
  }, [theme]);

  const navBarContentStyle = useMemo(() => {
    return {color: theme.color.onNavBarBackground};
  }, [theme]);

  return (
    <ScreenWrapper>
      <NavBarWrapper containerStyle={navBarContainerStyle}>
        <Container noBackground row flex>
          <View style={styles.titleContainer}>
            <Typography
              type={TypographyType.TITLE_SEMI_LARGE}
              style={[styles.title, navBarContentStyle]}>
              {t('filterProduct:title')}
            </Typography>
          </View>
          <IconButton
            bundle={BundleIconSetName.FONT_AWESOME_5}
            name="times"
            iconStyle={[styles.closeIcon, navBarContentStyle]}
            onPress={handleCloseFilter}
          />
        </Container>
      </NavBarWrapper>

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
                title={t('filterProduct:price')}
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
            message={t('filterProduct:noResult')}
          />
        )}
      </ScrollView>

      {hasData && (
        <Observer>
          {() => (
            <Container
              safeLayout={!store.keyboardTop}
              row
              style={btnFooterContainerStyle}>
              <Button
                disabled={isResetFilterDisabled()}
                neutral
                containerStyle={styles.btnResetContainer}
                renderTitleComponent={renderResetFilterIcon}
                onPress={handleResetFilter}
              />

              <Button
                containerStyle={styles.btnApplyContainer}
                disabled={disabled || isResetFilterDisabled()}
                title={t('filterProduct:apply')}
                onPress={handleApplyFilter}
              />
            </Container>
          )}
        </Observer>
      )}
      {appConfig.device.isIOS && <KeyboardSpacer />}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  listContainer: {},
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 10,
    paddingTop: 15,
  },
  absolute: {
    marginTop: 15,
  },
  titleContainer: {
    paddingHorizontal: 15,
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  maskTop: {
    position: 'absolute',
    width: '100%',
    height: '50%',
  },
  maskBottom: {
    position: 'absolute',
    width: '100%',
    height: '50%',
    bottom: 0,
  },

  closeIcon: {
    fontSize: 20,
    paddingHorizontal: 15,
  },
  resetIcon: {},

  btnResetContainer: {
    width: undefined,
    flex: 0.3,
    paddingHorizontal: 10,
  },
  btnResetContent: {},
  btnApplyContainer: {
    paddingLeft: 0,
    paddingRight: 10,
    width: undefined,
    flex: 1,
  },
  btnFooterContainer: {},
});

export default React.memo(FilterDrawer);
