/**
 * @class Multi-Level Category
 *
 * @version 1.1
 * @author Nguyen Hoang Minh
 *
 * @summary Category with multi-level. 2 options for layout.
 * @description current for 2-3 level.
 *
 * @example Category of Beemart, Tiki.
 */
import * as React from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import IconFeather from 'react-native-vector-icons/Feather';
import Button from 'react-native-button';
import Category from './Category';
import SubCategory from './SubCategory';
//@ts-ignore
import appConfig from 'app-config';
//@ts-ignore
import store from 'app-store';
import {MultiLevelCategoryProps} from '.';
import {APIRequest} from '../../../network/Entity';
import APIHandler from '../../../network/APIHandler';
import {Actions} from 'react-native-router-flux';
import Loading from '../../Loading';
//@ts-ignore
import SVGEmptyBoxOpen from '../../../images/empty-box-open.svg';
import NoResult from '../../NoResult';
import {
  CATEGORY_POSITION_TYPE,
  CATEGORY_TYPE,
  TEMP_CATEGORIES,
} from './constants';
import {servicesHandler} from '../../../helper/servicesHandler';
import RightButtonNavBar from '../../RightButtonNavBar';
import {RIGHT_BUTTON_TYPE} from '../../RightButtonNavBar/constants';
import EventTracker from '../../../helper/EventTracker';
import {Container} from 'src/components/Layout';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  mainCategories: {
    backgroundColor: '#fff',
    borderRightColor: '#aaa',
    borderRightWidth: 0.5,
  },
  mainCategoryTitle: {
    fontWeight: '600',
  },
  right_btn_box: {
    flexDirection: 'row',
    marginRight: 12,
  },
});

class MultiLevelCategory extends React.Component<MultiLevelCategoryProps> {
  static defaultProps = {
    type: CATEGORY_TYPE.FIX_2_LEVEL,
    siteId: store.store_id,
    categoryId: 0,
  };

  state = {
    categories: [],
    selectedMainCategory: {
      id: this.props.categoryId || -1,
      name: '',
      list: [],
    },
    mainCategoryDataPosition: {},
    subCategoryDataPosition: {},
    isScrollByMainCategoryPressing: false,
    loading: true,
    refreshing: false,
    type: this.props.type,
  };
  refMainCategory = React.createRef<any>();
  refSubCategory = React.createRef<any>();
  getMultiLevelCategoriesRequest = new APIRequest();
  requests = [this.getMultiLevelCategoriesRequest];

  eventTracker = new EventTracker();

  shouldComponentUpdate(nextProps: MultiLevelCategoryProps, nextState: any) {
    if (
      nextProps.type !== this.props.type &&
      nextProps.type !== this.state.type
    ) {
      this.setState({
        type: nextProps.type,
      });
    }
    if (nextState !== this.state) {
      return true;
    }

    return false;
  }

  get isFullData() {
    return false;
    return this.state.type === CATEGORY_TYPE.FULL_SCROLL;
  }

  get hasCategories() {
    return Array.isArray(this.state.categories);
  }

  get hasSelectedMainCategory() {
    return (
      !!this.state.selectedMainCategory &&
      Object.keys(this.state.selectedMainCategory).length !== 0
    );
  }

  getFormattedCategoryIDForPositionData(categoryID) {
    return categoryID + ' ';
  }

  componentDidMount() {
    this.getMultiLevelCategories();

    setTimeout(() => {
      Actions.refresh({
        right: this._renderRightButton(),
      });
    });
    this.eventTracker.logCurrentView();
  }

  componentWillUnmount() {
    this.eventTracker.clearTracking();
  }

  _renderRightButton() {
    return (
      <View style={[styles.right_btn_box]}>
        {/* <RightButtonOrders tel={store.store_data.tel} /> */}
        <Button
          onPress={() => {
            //@ts-ignore
            const {t} = this.props;
            const categories = [...this.state.categories];
            categories.unshift({
              name: t('stores:tabs.store.title'),
              id: 0,
            });
            Actions.push(appConfig.routes.searchStore, {
              categories: categories,
              category_id: 0,
              // category_name:
              //     this.state.selectedMainCategory.id !== -1
              //         ? this.state.selectedMainCategory.name
              //         : ''
            });
          }}>
          <IconFeather size={26} color={appConfig.colors.white} name="search" />
        </Button>
        <RightButtonNavBar type={RIGHT_BUTTON_TYPE.SHOPPING_CART} />
      </View>
    );
  }

  formatCategories(categories = []) {
    return categories.map((category, index) => ({...category, index}));
  }

  async getMultiLevelCategories() {
    //@ts-ignore
    const {t} = this.props;
    try {
      this.getMultiLevelCategoriesRequest.data = APIHandler.site_get_tree_categories(
        this.props.siteId,
      );

      const response: any = await this.getMultiLevelCategoriesRequest.promise();

      if (response) {
        //@ts-ignore
        if (response.status === STATUS_SUCCESS) {
          const categories = this.formatCategories(response.data.categories);
          const defaultSelectedCategory =
            categories[0] || this.state.selectedMainCategory;
          const selectedMainCategory =
            this.state.selectedMainCategory.id === -1
              ? defaultSelectedCategory
              : categories.find(
                  (cate) => cate.id === this.state.selectedMainCategory.id,
                ) || defaultSelectedCategory;
            // this.setState({
            //   //   type: CATEGORY_TYPE.FIX_2_LEVEL,
            //   categories: this.formatCategories(TEMP_CATEGORIES),
            //   selectedMainCategory: TEMP_CATEGORIES[0],
            // });
          this.setState(
            (prevState: any) => ({
              type: response.data.type || prevState.type,
              categories,
              // selectedMainCategory,
            }),
            () => {
              setTimeout(() =>
                this.onPressMainCategory(selectedMainCategory), 300
              );
            },
          );
        } else {
          //@ts-ignore
          flashShowMessage({
            type: 'danger',
            message: response.data || t('common:api.error.message'),
          });
        }
      } else {
        //@ts-ignore
        flashShowMessage({
          type: 'danger',
          message: t('common:api.error.message'),
        });
      }
    } catch (err) {
      console.log('%cget_multi_level_categories', 'color: red', err);
    } finally {
      this.setState({
        loading: false,
        refreshing: false,
      });
    }
  }

  onPressMainCategory(category, isUpdate = true) {
    if (category?.id === this.state.selectedMainCategory?.id) return;

    if (isUpdate) {
      this.setState(
        {
          selectedMainCategory: category,
        },
        () => {
          this.scrollMainCategoryToIndex(category);
        },
      );
    } else {
      this.scrollMainCategoryToIndex(category);
    }

    if (!this.isFullData) return;
    if (this.refSubCategory.current) {
      this.setState(
        {
          isScrollByMainCategoryPressing: true,
        },
        () =>
          this.refSubCategory.current.scrollTo({
            y: this.state.subCategoryDataPosition[
              this.getFormattedCategoryIDForPositionData(category.id)
            ],
          }),
      );
    }
  }

  onPressBanner(category) {
    if (category.service) {
      servicesHandler(category.service);
    } else {
      this.goToStore(category);
    }
  }

  goToStore(category) {
    Actions.push(appConfig.routes.store, {
      title: category.name,
      categoryId: category.id,
      extraCategoryId:
        Array.isArray(category.list) &&
        category.list.length !== 0 &&
        category.id,
      extraCategoryName: category.name,
    });
  }

  scrollMainCategoryToIndex(category) {
    const offsetTarget = 2;
    if (this.refMainCategory.current) {
      let index = category.index - offsetTarget;
      if (index < 0) {
        index = 0;
      }
      this.refMainCategory.current.scrollToIndex({index});
    }
  }

  onRefresh() {
    this.setState({refreshing: true});
    this.getMultiLevelCategories();
  }

  renderMainCategory({item: category}) {
    const isSelected = category.id === this.state.selectedMainCategory.id;

    return (
      <Category
        isActive={isSelected}
        image={category.image}
        title={category.name}
        onPress={() => this.onPressMainCategory(category)}
        containerStyle={{borderTopColor: '#fff', borderTopWidth: 0.5}}
        titleStyle={styles.mainCategoryTitle}
      />
    );
  }

  renderSubCategories() {
    const categories = this.hasSelectedMainCategory
      ? this.isFullData
        ? this.state.categories
        : this.state.selectedMainCategory.id !== -1
        ? [this.state.selectedMainCategory]
        : []
      : [];

    return categories.map((category, index) => {
      const childCategories =
        this.state.type === CATEGORY_TYPE.FIX_2_LEVEL
          ? categories
          : category.list;
          
      return (
        <Container key={index} flex centerVertical={false}>
          <SubCategory
            type={this.state.type}
            categories={childCategories}
            image={category.banner}
            // image="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQLN3yGu2SdG8D0_HCgx_MBHGglHyaPoypdJA&usqp=CAU"
            title={category.name}
            fullData={this.isFullData}
            onPressTitle={(cate) => this.goToStore(cate || category)}
            onPressBanner={() => this.onPressBanner(category)}
          />
        </Container>
      );
    });
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.loading && <Loading center />}
        <View style={styles.mainContainer}>
          <View style={styles.mainCategories}>
            <FlatList
              ref={this.refMainCategory}
              scrollEventThrottle={16}
              extraData={this.state.selectedMainCategory.id}
              showsVerticalScrollIndicator={false}
              data={this.state.categories}
              contentContainerStyle={{
                paddingBottom: appConfig.device.bottomSpace,
              }}
              renderItem={this.renderMainCategory.bind(this)}
              keyExtractor={(item, index) => index.toString()}
              onScrollToIndexFailed={() => {}}
              getItemLayout={(data, index) => ({
                index,
                length: appConfig.device.width / 4,
                offset: (appConfig.device.width / 4) * index,
              })}
            />
          </View>

          <Container flex centerVertical={false}>
            {Array.isArray(this.state.categories) &&
            this.state.categories.length !== 0
              ? this.renderSubCategories()
              : !this.state.loading && (
                  <NoResult
                    containerStyle={styles.container}
                    icon={
                      <SVGEmptyBoxOpen fill="#aaa" width="100" height="100" />
                    }
                    message="Chưa có danh mục"
                  />
                )}
          </Container>
        </View>
      </View>
    );
  }
}

//@ts-ignore
export default withTranslation(['stores, common'])(MultiLevelCategory);
