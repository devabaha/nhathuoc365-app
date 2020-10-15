import * as React from "react";
import { ScrollView } from "react-native";
import { SafeAreaView, View, StyleSheet, FlatList } from "react-native";
import Category from "./Category";
import SubCategory from "./SubCategory";
//@ts-ignore
import appConfig from 'app-config';
import { VerticalCategoryProps } from ".";

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
    }
})

const CATEGORY_TYPE = {
    MAIN: 0,
    SUB: 1
}

const categories = [
    {
        id: 1,
        name: "Kem, bơ, sữa, phomai",
        image: "https://imgs.vietnamnet.vn/Images/2017/09/07/09/20170907092930-pho-mai-2.jpg",
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


class VerticalCategory extends React.Component<VerticalCategoryProps> {
    static defaultProps = {
        fullData: true
    }

    state = {
        categories: categories,
        selectedMainCategory: categories[0],
        mainCategoryDataPosition: {},
        subCategoryDataPosition: {},
        isScrollByMainCategoryPressing: false
    };
    refMainCategory = React.createRef<any>();
    refSubCategory = React.createRef<any>();

    isFinishSetStateWhileScrolling = true;

    onPressMainCategory(category) {
        if (!this.props.fullData) return;
        this.setState({
            selectedMainCategory: category
        }, () => {
            this.scrollMainCategoryToIndex(category)
        })

        if (this.refSubCategory.current) {
            this.setState({
                isScrollByMainCategoryPressing: true
            }, () =>
                this.refSubCategory.current.scrollTo({
                    y: this.state.subCategoryDataPosition[category.id]
                })
            )
        }
    }

    handleMainCategoryScrolling(e) {

    }

    handleSubCategoriesScrolling(e) {
        if (!this.props.fullData) return;
        if (this.state.isScrollByMainCategoryPressing) return;
        const {
            contentOffset: { y },
            layoutMeasurement: { height: layoutHeight },
            contentSize: { height: contentHeight }
        } = e.nativeEvent;
        const dataMappingIDs = Object.keys(this.state.subCategoryDataPosition);
        const scrollOverCategoriesID = dataMappingIDs.filter(categoryID => {
            return this.state.subCategoryDataPosition[categoryID] <= y + 15
        });

        if (scrollOverCategoriesID.length !== 0) {
            const nearestCategoryID = scrollOverCategoriesID[scrollOverCategoriesID.length - 1];
            const nearestCategory = this.state.categories
                .find(cate => String(cate.id) === nearestCategoryID);
            const lastCategory = this.state.categories[this.state.categories.length - 1];

            if (y + layoutHeight >= Math.floor(contentHeight)) {
                if (this.state.selectedMainCategory.id !== lastCategory.id) {
                    this.setState({
                        selectedMainCategory: lastCategory,
                    });
                    this.scrollMainCategoryToIndex(lastCategory);
                }
            } else if (nearestCategoryID !== String(this.state.selectedMainCategory.id)) {
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
            case CATEGORY_TYPE.MAIN:
                this.mapMainCategoryPosition(category, y)
                break;
            case CATEGORY_TYPE.SUB:
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
            this.setState((prevState: any) => ({
                subCategoryDataPosition: {
                    ...prevState.subCategoryDataPosition,
                    [category.id]: y
                }
            }))
        }
    }

    handleSubCategoryMomentumScrollEnd(e) {
        if (!this.props.fullData) return;
        if (this.state.isScrollByMainCategoryPressing) {
            this.setState({
                isScrollByMainCategoryPressing: false
            })
        }
    }

    renderMainCategory({ item: category }) {
        const isSelected = category.id === this.state.selectedMainCategory.id;
        const extraStyle = isSelected
            //@ts-ignore
            ? { backgroundColor: hexToRgbA(appConfig.colors.primary, .9) }
            : {};
        const extraTitleStyle = isSelected ? { color: "#fff" } : {};
        return (
            <View onLayout={this.mapMainCategoryPosition.bind(this, category)}>
                <Category
                    image={category.image}
                    title={category.name}
                    onPress={this.onPressMainCategory.bind(this, category)}
                    containerStyle={extraStyle}
                    titleStyle={[extraTitleStyle, { fontWeight: '600' }]}
                />
            </View>
        )
    }

    renderSubCategories() {
        return (
            this.state.categories.map((category, index) => {
                return (
                    <View
                        key={index}
                        onLayout={this.handleMappingDataPosition.bind(this, category, CATEGORY_TYPE.SUB)}>
                        <SubCategory
                            categories={category.list}
                            image="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQLN3yGu2SdG8D0_HCgx_MBHGglHyaPoypdJA&usqp=CAU"
                            title={category.name}
                            fullData={this.props.fullData}
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
                        />
                    </View>

                    <ScrollView
                        ref={this.refSubCategory}
                        scrollEventThrottle={16}
                        onScroll={this.handleSubCategoriesScrolling.bind(this)}
                        onMomentumScrollEnd={this.handleSubCategoryMomentumScrollEnd.bind(this)}
                    >
                        {this.renderSubCategories()}
                        {/* <SubCategory
                            categories={this.state.selectedMainCategory.list}
                            image="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQLN3yGu2SdG8D0_HCgx_MBHGglHyaPoypdJA&usqp=CAU"
                            title="Danh mục"
                        /> */}
                    </ScrollView>


                </SafeAreaView>
            </View>
        );
    }
}

export default VerticalCategory;
