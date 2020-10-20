/**
 * @class Multi-Level Category
 * 
 * @version 1.0
 * @author Nguyen Hoang Minh
 * 
 * @summary Category with multi-level. 2 options for layout.
 * @description current for 2-3 level.
 * 
 * @example Category of Beemart, Clingme (others app on store).
 */
import * as React from "react";
import { SafeAreaView, View, StyleSheet, FlatList, RefreshControl, ScrollView } from "react-native";
import IconFeather from 'react-native-vector-icons/Feather';
import Button from 'react-native-button';
import RightButtonChat from '../../RightButtonChat';
import Category from "./Category";
import SubCategory from "./SubCategory";
//@ts-ignore
import appConfig from 'app-config';
//@ts-ignore
import store from 'app-store';
import { MultiLevelCategoryProps } from ".";
import { APIRequest } from "../../../network/Entity";
import APIHandler from "../../../network/APIHandler";
import { Actions } from "react-native-router-flux";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    mainContainer: {
        flex: 1,
        flexDirection: 'row'
    },
    mainCategories: {
        backgroundColor: '#fff',
        borderRightColor: '#aaa',
        borderRightWidth: .5
    },
    right_btn_box: {
        flexDirection: 'row'
    },
})

const CATEGORY_POSITION_TYPE = {
    MAIN: 0,
    SUB: 1
}

const CATEGORY_TYPE = {
    BEE_MART: 'fix',
    CLING_ME: 'scroll'
}

const categories = [
    {
        id: 1,
        name: "Kem, bơ, sữa, phomai",
        image: "https://imgs.vietnamnet.vn/Images/2017/09/07/09/20170907092930-pho-mai-2.jpg",
        list: [
            {
                name: "Nguyên liệu nấu ăn",
                image: "https://media.cooky.vn/images/blog-2016/ten-tieng-anh-cac-nguyen-lieu-dung-cu-trong-nau-an-lam-banh%201.jpg",
                list: [
                    {
                        name: "Máy móc thiết bị",
                        image: "https://lh3.googleusercontent.com/proxy/YjrFqpvatBmLn6_hRg5MPq_JH1-JKcdCgsjXf1Bgi8Wq_X-EMKzi3NQq4lq0dWiFRW7hx9r0GChBVrrykQwKeCQ9PqvUw9DSR0C5yyJ9B_evDXDt6vKzN6CCCbvIHbGXI9pFhi2lnYSmutA7zr8d"
                    },
                    {
                        name: "Nguyên liệu nấu ăn",
                        image: "https://media.cooky.vn/images/blog-2016/ten-tieng-anh-cac-nguyen-lieu-dung-cu-trong-nau-an-lam-banh%201.jpg"
                    },
                    {
                        name: "Sản phẩm/ dịch vụ khác",
                        image: "https://www.vietguys.biz/wp-content/uploads/2017/11/icon-06-1.png"
                    }
                ]
            },
            {
                name: "Nguyên liệu nấu ăn 1",
                image: "https://media.cooky.vn/images/blog-2016/ten-tieng-anh-cac-nguyen-lieu-dung-cu-trong-nau-an-lam-banh%201.jpg",
                list: []
            },
            {
                name: "Nguyên liệu nấu ăn 2",
                image: "https://media.cooky.vn/images/blog-2016/ten-tieng-anh-cac-nguyen-lieu-dung-cu-trong-nau-an-lam-banh%201.jpg",
                list: []
            }]
    },
    {
        id: 2,
        name: "Nguyên liệu làm bánh",
        image: "https://blog.beemart.vn/wp-content/uploads/2020/06/nguyen-lieu-lam-banh-kem-co-ban-nhat-cho-nguoi-moi-bat-dau.jpg",
        list: [{
            name: "Đồ làm bánh",
            image: "https://shopquangchau.vn/images/uploaded/tin-tuc/anh%202222/dung-cu-lam-banh2.jpg",
            list: [
                {
                    name: "Đồ dinh dưỡng",
                    image: "https://wedeliver.vn/images/Di%CC%A3ch-vu%CC%A3-giao-cha%CC%81o-dinh-d%C6%B0%C6%A1%CC%83ng-ta%CC%A3i-nha%CC%80-%C6%A1%CC%89-tphcm-1.jpg",
                },
                {
                    name: "Nguyên liệu nấu ăn",
                    image: "https://media.cooky.vn/images/blog-2016/ten-tieng-anh-cac-nguyen-lieu-dung-cu-trong-nau-an-lam-banh%201.jpg"
                },
                {
                    name: "Sản phẩm/ dịch vụ khác",
                    image: "https://www.vietguys.biz/wp-content/uploads/2017/11/icon-06-1.png"
                }
            ]
        }]
    },
    {
        id: 3,
        name: "Nguyên liệu pha chế",
        image: "https://lacdavang.com/wp-content/uploads/2015/08/siro-monin.jpg",
        list: [{
            name: "Nguyên liệu nấu ăn",
            image: "https://media.cooky.vn/images/blog-2016/ten-tieng-anh-cac-nguyen-lieu-dung-cu-trong-nau-an-lam-banh%201.jpg",
            list: [
                {
                    name: "Máy móc thiết bị",
                    image: "https://lh3.googleusercontent.com/proxy/YjrFqpvatBmLn6_hRg5MPq_JH1-JKcdCgsjXf1Bgi8Wq_X-EMKzi3NQq4lq0dWiFRW7hx9r0GChBVrrykQwKeCQ9PqvUw9DSR0C5yyJ9B_evDXDt6vKzN6CCCbvIHbGXI9pFhi2lnYSmutA7zr8d"
                },
                {
                    name: "Nguyên liệu nấu ăn",
                    image: "https://media.cooky.vn/images/blog-2016/ten-tieng-anh-cac-nguyen-lieu-dung-cu-trong-nau-an-lam-banh%201.jpg"
                },
                {
                    name: "Sản phẩm/ dịch vụ khác",
                    image: "https://www.vietguys.biz/wp-content/uploads/2017/11/icon-06-1.png"
                }
            ]
        }]
    },
    {
        id: 4,
        name: "Đồ làm bánh",
        image: "https://shopquangchau.vn/images/uploaded/tin-tuc/anh%202222/dung-cu-lam-banh2.jpg",
        list: [{
            name: "Nguyên liệu nấu ăn",
            image: "https://media.cooky.vn/images/blog-2016/ten-tieng-anh-cac-nguyen-lieu-dung-cu-trong-nau-an-lam-banh%201.jpg",
            list: [
                {
                    name: "Máy móc thiết bị",
                    image: "https://lh3.googleusercontent.com/proxy/YjrFqpvatBmLn6_hRg5MPq_JH1-JKcdCgsjXf1Bgi8Wq_X-EMKzi3NQq4lq0dWiFRW7hx9r0GChBVrrykQwKeCQ9PqvUw9DSR0C5yyJ9B_evDXDt6vKzN6CCCbvIHbGXI9pFhi2lnYSmutA7zr8d"
                },
                {
                    name: "Nguyên liệu nấu ăn",
                    image: "https://media.cooky.vn/images/blog-2016/ten-tieng-anh-cac-nguyen-lieu-dung-cu-trong-nau-an-lam-banh%201.jpg"
                },
                {
                    name: "Sản phẩm/ dịch vụ khác",
                    image: "https://www.vietguys.biz/wp-content/uploads/2017/11/icon-06-1.png"
                }
            ]
        }]
    },
    {
        id: 5,
        name: "Đồ dinh dưỡng",
        image: "https://wedeliver.vn/images/Di%CC%A3ch-vu%CC%A3-giao-cha%CC%81o-dinh-d%C6%B0%C6%A1%CC%83ng-ta%CC%A3i-nha%CC%80-%C6%A1%CC%89-tphcm-1.jpg",
        list: [{
            name: "Nguyên liệu nấu ăn",
            image: "https://media.cooky.vn/images/blog-2016/ten-tieng-anh-cac-nguyen-lieu-dung-cu-trong-nau-an-lam-banh%201.jpg",
            list: [
                {
                    name: "Máy móc thiết bị",
                    image: "https://lh3.googleusercontent.com/proxy/YjrFqpvatBmLn6_hRg5MPq_JH1-JKcdCgsjXf1Bgi8Wq_X-EMKzi3NQq4lq0dWiFRW7hx9r0GChBVrrykQwKeCQ9PqvUw9DSR0C5yyJ9B_evDXDt6vKzN6CCCbvIHbGXI9pFhi2lnYSmutA7zr8d"
                },
                {
                    name: "Nguyên liệu nấu ăn",
                    image: "https://media.cooky.vn/images/blog-2016/ten-tieng-anh-cac-nguyen-lieu-dung-cu-trong-nau-an-lam-banh%201.jpg"
                },
                {
                    name: "Sản phẩm/ dịch vụ khác",
                    image: "https://www.vietguys.biz/wp-content/uploads/2017/11/icon-06-1.png"
                }
            ]
        }]
    },
    {
        id: 6,
        name: "Đồ nhà bếp",
        image: "https://giakedegon.com/wp-content/uploads/2018/03/1.png",
        list: [{
            name: "Nguyên liệu nấu ăn",
            image: "https://media.cooky.vn/images/blog-2016/ten-tieng-anh-cac-nguyen-lieu-dung-cu-trong-nau-an-lam-banh%201.jpg",
            list: [
                {
                    name: "Máy móc thiết bị",
                    image: "https://lh3.googleusercontent.com/proxy/YjrFqpvatBmLn6_hRg5MPq_JH1-JKcdCgsjXf1Bgi8Wq_X-EMKzi3NQq4lq0dWiFRW7hx9r0GChBVrrykQwKeCQ9PqvUw9DSR0C5yyJ9B_evDXDt6vKzN6CCCbvIHbGXI9pFhi2lnYSmutA7zr8d"
                },
                {
                    name: "Nguyên liệu nấu ăn",
                    image: "https://media.cooky.vn/images/blog-2016/ten-tieng-anh-cac-nguyen-lieu-dung-cu-trong-nau-an-lam-banh%201.jpg"
                },
                {
                    name: "Sản phẩm/ dịch vụ khác",
                    image: "https://www.vietguys.biz/wp-content/uploads/2017/11/icon-06-1.png"
                }
            ]
        }]
    },
    {
        id: 7,
        name: "Đồ pha chế",
        image: "https://salt.tikicdn.com/cache/280x280/ts/product/87/eb/f8/874642072236761db29239cefcc32f11.jpg",
        list: [{
            name: "Nguyên liệu nấu ăn",
            image: "https://media.cooky.vn/images/blog-2016/ten-tieng-anh-cac-nguyen-lieu-dung-cu-trong-nau-an-lam-banh%201.jpg",
            list: [
                {
                    name: "Máy móc thiết bị",
                    image: "https://lh3.googleusercontent.com/proxy/YjrFqpvatBmLn6_hRg5MPq_JH1-JKcdCgsjXf1Bgi8Wq_X-EMKzi3NQq4lq0dWiFRW7hx9r0GChBVrrykQwKeCQ9PqvUw9DSR0C5yyJ9B_evDXDt6vKzN6CCCbvIHbGXI9pFhi2lnYSmutA7zr8d"
                },
                {
                    name: "Nguyên liệu nấu ăn",
                    image: "https://media.cooky.vn/images/blog-2016/ten-tieng-anh-cac-nguyen-lieu-dung-cu-trong-nau-an-lam-banh%201.jpg"
                },
                {
                    name: "Sản phẩm/ dịch vụ khác",
                    image: "https://www.vietguys.biz/wp-content/uploads/2017/11/icon-06-1.png"
                }
            ]
        }]
    },
    {
        id: 8,
        name: "Túi, hộp đựng thực phẩm",
        image: "https://storage.googleapis.com/cdn_staless/Uploads/2018/11/5-2.jpg",
        list: [{
            name: "Nguyên liệu nấu ăn",
            image: "https://media.cooky.vn/images/blog-2016/ten-tieng-anh-cac-nguyen-lieu-dung-cu-trong-nau-an-lam-banh%201.jpg",
            list: [
                {
                    name: "Máy móc thiết bị",
                    image: "https://lh3.googleusercontent.com/proxy/YjrFqpvatBmLn6_hRg5MPq_JH1-JKcdCgsjXf1Bgi8Wq_X-EMKzi3NQq4lq0dWiFRW7hx9r0GChBVrrykQwKeCQ9PqvUw9DSR0C5yyJ9B_evDXDt6vKzN6CCCbvIHbGXI9pFhi2lnYSmutA7zr8d"
                },
                {
                    name: "Nguyên liệu nấu ăn",
                    image: "https://media.cooky.vn/images/blog-2016/ten-tieng-anh-cac-nguyen-lieu-dung-cu-trong-nau-an-lam-banh%201.jpg"
                },
                {
                    name: "Sản phẩm/ dịch vụ khác",
                    image: "https://www.vietguys.biz/wp-content/uploads/2017/11/icon-06-1.png"
                }
            ]
        }]
    },
    {
        id: 9,
        name: "Máy móc thiết bị",
        image: "https://lh3.googleusercontent.com/proxy/YjrFqpvatBmLn6_hRg5MPq_JH1-JKcdCgsjXf1Bgi8Wq_X-EMKzi3NQq4lq0dWiFRW7hx9r0GChBVrrykQwKeCQ9PqvUw9DSR0C5yyJ9B_evDXDt6vKzN6CCCbvIHbGXI9pFhi2lnYSmutA7zr8d",
        list: [{
            name: "Nguyên liệu nấu ăn",
            image: "https://media.cooky.vn/images/blog-2016/ten-tieng-anh-cac-nguyen-lieu-dung-cu-trong-nau-an-lam-banh%201.jpg",
            list: [
                {
                    name: "Máy móc thiết bị",
                    image: "https://lh3.googleusercontent.com/proxy/YjrFqpvatBmLn6_hRg5MPq_JH1-JKcdCgsjXf1Bgi8Wq_X-EMKzi3NQq4lq0dWiFRW7hx9r0GChBVrrykQwKeCQ9PqvUw9DSR0C5yyJ9B_evDXDt6vKzN6CCCbvIHbGXI9pFhi2lnYSmutA7zr8d"
                },
                {
                    name: "Nguyên liệu nấu ăn",
                    image: "https://media.cooky.vn/images/blog-2016/ten-tieng-anh-cac-nguyen-lieu-dung-cu-trong-nau-an-lam-banh%201.jpg"
                },
                {
                    name: "Sản phẩm/ dịch vụ khác",
                    image: "https://www.vietguys.biz/wp-content/uploads/2017/11/icon-06-1.png"
                }
            ]
        }]
    },
    {
        id: 10,
        name: "Nguyên liệu nấu ăn",
        image: "https://media.cooky.vn/images/blog-2016/ten-tieng-anh-cac-nguyen-lieu-dung-cu-trong-nau-an-lam-banh%201.jpg",
        list: [{
            name: "Nguyên liệu nấu ăn",
            image: "https://media.cooky.vn/images/blog-2016/ten-tieng-anh-cac-nguyen-lieu-dung-cu-trong-nau-an-lam-banh%201.jpg",
            list: [
                {
                    name: "Máy móc thiết bị",
                    image: "https://lh3.googleusercontent.com/proxy/YjrFqpvatBmLn6_hRg5MPq_JH1-JKcdCgsjXf1Bgi8Wq_X-EMKzi3NQq4lq0dWiFRW7hx9r0GChBVrrykQwKeCQ9PqvUw9DSR0C5yyJ9B_evDXDt6vKzN6CCCbvIHbGXI9pFhi2lnYSmutA7zr8d"
                },
                {
                    name: "Nguyên liệu nấu ăn",
                    image: "https://media.cooky.vn/images/blog-2016/ten-tieng-anh-cac-nguyen-lieu-dung-cu-trong-nau-an-lam-banh%201.jpg"
                },
                {
                    name: "Sản phẩm/ dịch vụ khác",
                    image: "https://www.vietguys.biz/wp-content/uploads/2017/11/icon-06-1.png"
                }
            ]
        }]
    },
    {
        id: 11,
        name: "Sản phẩm/ dịch vụ khác",
        image: "https://www.vietguys.biz/wp-content/uploads/2017/11/icon-06-1.png",
        list: [{
            name: "Nguyên liệu nấu ăn",
            image: "https://media.cooky.vn/images/blog-2016/ten-tieng-anh-cac-nguyen-lieu-dung-cu-trong-nau-an-lam-banh%201.jpg",
            list: [
                {
                    name: "Máy móc thiết bị",
                    image: "https://lh3.googleusercontent.com/proxy/YjrFqpvatBmLn6_hRg5MPq_JH1-JKcdCgsjXf1Bgi8Wq_X-EMKzi3NQq4lq0dWiFRW7hx9r0GChBVrrykQwKeCQ9PqvUw9DSR0C5yyJ9B_evDXDt6vKzN6CCCbvIHbGXI9pFhi2lnYSmutA7zr8d"
                },
                {
                    name: "Nguyên liệu nấu ăn",
                    image: "https://media.cooky.vn/images/blog-2016/ten-tieng-anh-cac-nguyen-lieu-dung-cu-trong-nau-an-lam-banh%201.jpg"
                },
                {
                    name: "Sản phẩm/ dịch vụ khác",
                    image: "https://www.vietguys.biz/wp-content/uploads/2017/11/icon-06-1.png"
                }
            ]
        }]
    }
];


class MultiLevelCategory extends React.Component<MultiLevelCategoryProps> {
    static defaultProps = {
        type: CATEGORY_TYPE.BEE_MART,
        siteId: store.store_id
    }

    state = {
        categories: [],
        selectedMainCategory: {
            id: -1,
            name: "",
            list: []
        },
        mainCategoryDataPosition: {},
        subCategoryDataPosition: {},
        isScrollByMainCategoryPressing: false,
        loading: true,
        refreshing: false,
        type: this.props.type
    };
    refMainCategory = React.createRef<any>();
    refSubCategory = React.createRef<any>();
    getMultiLevelCategoriesRequest = new APIRequest();
    requests = [this.getMultiLevelCategoriesRequest];

    shouldComponentUpdate(nextProps: MultiLevelCategoryProps, nextState: any) {
        if (nextProps.type !== this.props.type &&
            nextProps.type !== this.state.type) {
            this.setState({
                type: nextProps.type
            })
        }
        return true;
    }

    get isFullData() {
        return this.state.type === CATEGORY_TYPE.CLING_ME;
    }

    getFormattedCategoryIDForPositionData(categoryID) {
        return categoryID + " ";
    }

    get hasCategories() {
        return Array.isArray(this.state.categories)
    }

    get hasSelectedMainCategory() {
        return !!(this.state.selectedMainCategory)
    }

    componentDidMount() {
        this.getMultiLevelCategories();

        setTimeout(() => {
            Actions.refresh({
                right: this._renderRightButton()
            });
        });
        //@ts-ignore
        EventTracker.logEvent('multi_level_category');
    }

    _renderRightButton() {
        return (
            <View style={[styles.right_btn_box]}>
                {/* <RightButtonOrders tel={store.store_data.tel} /> */}
                <Button
                    onPress={() => {
                        Actions.push(appConfig.routes.searchStore, {
                            categories: this.state.categories,
                            category_id: this.state.selectedMainCategory.id,
                            category_name:
                                this.state.selectedMainCategory.id !== 0
                                    ? this.state.selectedMainCategory.name
                                    : ''
                        });
                    }}
                >
                    <IconFeather size={26} color={appConfig.colors.white} name="search" />
                </Button>
                <RightButtonChat tel={store.store_data.tel} />
            </View>
        );
    }

    async getMultiLevelCategories() {
        //@ts-ignore
        const { t } = this.props;
        try {
            this.getMultiLevelCategoriesRequest.data =
                APIHandler.site_get_tree_categories(this.props.siteId);

            const response: any = await this.getMultiLevelCategoriesRequest.promise();

            if (response) {
                //@ts-ignore
                if (response.status === STATUS_SUCCESS) {
                    const selectedMainCategory = { ...this.state.selectedMainCategory };
                    // this.setState({
                    //     categories: categories,
                    //     selectedMainCategory: categories[0]
                    // })
                    this.setState((prevState: any) => ({
                        type: response.data.type || prevState.type,
                        categories: response.data.categories,
                        selectedMainCategory: selectedMainCategory.id === -1
                            ? response.data.categories[0]
                            : selectedMainCategory
                    }))
                } else {
                    //@ts-ignore
                    flashShowMessage({
                        type: 'danger',
                        message: response.data || t('api.error.message')
                    })
                }
            } else {
                //@ts-ignore
                flashShowMessage({
                    type: 'danger',
                    message: t('api.error.message')
                })
            }

        } catch (err) {
            console.log('%cget_multi_level_categories', 'color: red', err);
        } finally {
            this.setState({
                loading: false,
                refreshing: false
            })
        }
    }

    onPressMainCategory(category) {
        this.setState({
            selectedMainCategory: category
        }, () => {
            this.scrollMainCategoryToIndex(category)
        })

        if (!this.isFullData) return;
        if (this.refSubCategory.current) {
            this.setState({
                isScrollByMainCategoryPressing: true
            }, () =>
                this.refSubCategory.current.scrollTo({
                    y: this.state.subCategoryDataPosition[
                        this.getFormattedCategoryIDForPositionData(category.id)
                    ]
                })
            )
        }
    }

    goToStore(category) {
        Actions.push(appConfig.routes.store, {
            title: category.name,
            categoryId: category.id,
            extraCategoryId: Array.isArray(category.list) && category.list.length !== 0 && category.id,
            extraCategoryName: category.name,
        })
    }

    handleMainCategoryScrolling(e) {

    }

    /**
     * @todo auto update main selected category by scrolling sub category screen
     * 
     * @description only support for CLING_ME mode. 
     * Not work if sub category scrolled by main category pressing.
     */
    handleSubCategoriesScrolling(e) {
        if (!this.isFullData) return;
        if (this.state.isScrollByMainCategoryPressing) return;
        const {
            contentOffset: { y },
            layoutMeasurement: { height: layoutHeight },
            contentSize: { height: contentHeight }
        } = e.nativeEvent;
        const dataMappingIDs = Object.keys(this.state.subCategoryDataPosition);
        const scrollOverCategoriesID = dataMappingIDs.filter(categoryID => {
            return this.state.subCategoryDataPosition[categoryID] <= y
        });

        if (scrollOverCategoriesID.length !== 0) {
            const nearestCategoryID = scrollOverCategoriesID[scrollOverCategoriesID.length - 1].trim();
            const nearestCategory = this.state.categories
                .find(cate => String(cate.id) === nearestCategoryID);
            const nearestCategoryIndex = this.state.categories
                .findIndex(cate => String(cate.id) === nearestCategoryID);
            const nextCategoryIndex = nearestCategoryIndex + 1;
            const nextCategory = this.state.categories[nextCategoryIndex];


            if (nextCategory) {
                const nearestCategoryPosition = this.state.subCategoryDataPosition[
                    this.getFormattedCategoryIDForPositionData(nearestCategoryID)];
                const nextCategoryPosition = this.state.subCategoryDataPosition[
                    this.getFormattedCategoryIDForPositionData(nextCategory.id)];
                if (y < (nextCategoryPosition - nearestCategoryPosition) / 2) {
                    return;
                }
            }

            // if (y + layoutHeight >= Math.floor(contentHeight)) {
            //     if (!nextCategory) return;
            //     if (this.state.selectedMainCategory.id !== nextCategory.id) {
            //         this.setState({
            //             selectedMainCategory: nextCategory,
            //         });
            //         this.scrollMainCategoryToIndex(nextCategory);
            //     }
            // } else 
            
            if (nearestCategoryID !== String(this.state.selectedMainCategory.id)) {

                this.setState({
                    selectedMainCategory: nearestCategory
                });
                this.scrollMainCategoryToIndex(nearestCategory);
            }
        }
    }

    scrollMainCategoryToIndex(category) {
        const offsetTarget = 2;
        if (this.refMainCategory.current) {
            const nextMainCategoryIndex = this.state.categories
                .findIndex(cate => cate.id === category.id)
            if (nextMainCategoryIndex !== -1) {
                let index = nextMainCategoryIndex - offsetTarget;
                if (index < 0) {
                    index = 0;
                }
                this.refMainCategory.current.scrollToIndex({ index })
            }
        }
    }

    handleMappingDataPosition(category, type, e) {
        const { y } = e.nativeEvent.layout;

        switch (type) {
            case CATEGORY_POSITION_TYPE.MAIN:
                this.mapMainCategoryPosition(category, y)
                break;
            case CATEGORY_POSITION_TYPE.SUB:
                this.mapSubCategoryPosition(category, y)
                break;
        }
    }

    mapMainCategoryPosition(category, y) {
        if (this.state.mainCategoryDataPosition[category.id] !== y) {
            this.setState((prevState: any) => ({
                mainCategoryDataPosition: {
                    ...prevState.mainCategoryDataPosition,
                    [category.id]: y
                }
            }))
        }
    }

    mapSubCategoryPosition(category, y) {
        if (this.state.subCategoryDataPosition[category.id] !== y) {
            const subCategoryDataPosition = {
                ...this.state.subCategoryDataPosition,
                [this.getFormattedCategoryIDForPositionData(category.id)]: y
            }

            const subCategoryDataPositionOrderedByValue = {};
            Object.keys(subCategoryDataPosition).sort(
                (a: any, b: any) => Number(subCategoryDataPosition[a]) - Number(subCategoryDataPosition[b]))
                .forEach((key: any) => {

                    // prevent auto ordering of JS obj
                    subCategoryDataPositionOrderedByValue[key] = subCategoryDataPosition[key];
                });
            this.setState({
                subCategoryDataPosition: subCategoryDataPositionOrderedByValue
            })
        }
    }

    onRefresh() {
        this.setState({ refreshing: true });
        this.getMultiLevelCategories();
    }

    handleSubCategoryMomentumScrollEnd(e) {
        if (!this.isFullData) return;
        if (this.state.isScrollByMainCategoryPressing) {
            this.setState({
                isScrollByMainCategoryPressing: false
            })
        }
    }

    renderMainCategory({ item: category }) {
        const isSelected = category.id === this.state.selectedMainCategory.id;
        return (
            <View onLayout={this.mapMainCategoryPosition.bind(this, category)}>
                <Category
                    isActive={isSelected}
                    image={category.image}
                    title={category.name}
                    onPress={this.onPressMainCategory.bind(this, category)}
                    containerStyle={{ borderTopColor: '#fff', borderTopWidth: .5 }}
                    titleStyle={{ fontWeight: '600' }}
                />
            </View>
        )
    }

    renderSubCategories() {
        const categories = this.hasSelectedMainCategory
            ? this.isFullData
                ? this.state.categories
                : this.state.selectedMainCategory.id !== -1
                    ? [this.state.selectedMainCategory]
                    : []
            : [];
        return (
            categories.map((category, index) => {
                return (
                    <View
                        key={index}
                        onLayout={this.handleMappingDataPosition.bind(this, category, CATEGORY_POSITION_TYPE.SUB)}>
                        <SubCategory
                            categories={category.list}
                            image={category.banner}
                            // image="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQLN3yGu2SdG8D0_HCgx_MBHGglHyaPoypdJA&usqp=CAU"
                            title={category.name}
                            fullData={this.isFullData}
                            onPressTitle={(cate) => this.goToStore(cate || category)}
                        />
                    </View>
                )
            })
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <SafeAreaView style={styles.mainContainer}>
                    <View style={styles.mainCategories}>
                        <FlatList
                            ref={this.refMainCategory}
                            scrollEventThrottle={16}
                            onScroll={this.handleMainCategoryScrolling.bind(this)}
                            extraData={this.state.selectedMainCategory.id}
                            showsVerticalScrollIndicator={false}
                            data={this.state.categories}
                            renderItem={this.renderMainCategory.bind(this)}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>

                    <ScrollView
                        ref={this.refSubCategory}
                        scrollEventThrottle={16}
                        onScroll={this.handleSubCategoriesScrolling.bind(this)}
                        onMomentumScrollEnd={this.handleSubCategoryMomentumScrollEnd.bind(this)}
                        refreshControl={<RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh.bind(this)}
                        />}
                    >
                        {this.renderSubCategories()}
                    </ScrollView>
                </SafeAreaView>
            </View>
        );
    }
}

//@ts-ignore
export default withTranslation()(MultiLevelCategory);
