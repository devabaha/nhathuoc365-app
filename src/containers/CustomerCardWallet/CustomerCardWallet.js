import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  Animated,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  RefreshControl
} from 'react-native';
import store from 'app-store';
import Loading from '../../components/Loading';
import appConfig from 'app-config';
import {
  CardWallet,
  ComboHeaderButton,
  Search,
  SearchInput
} from '../../components/customerCardWallet';
import { debounce } from 'lodash';
import NoResult from '../../components/NoResult';
import { servicesHandler, SERVICES_TYPE } from '../../helper/servicesHandler';
import Icon from 'react-native-vector-icons/MaterialIcons';

const MIN_CHARACTER = 3;
const BUTTON_TYPE = {
  SERVER: 'add',
  LOCAL: 'local'
};
const BUTTONS = [
  {
    type: BUTTON_TYPE.SERVER,
    showModal: true,
    title: 'Thêm thẻ',
    iconName: 'plus'
  },
  {
    type: BUTTON_TYPE.LOCAL,
    title: 'Tìm kiếm thẻ',
    iconName: 'search'
  }
];

class CustomerCardWallet extends Component {
  state = {
    cards: [],
    searchCards: [],
    searchMyCards: [],
    loading: false,
    isTyping: false,
    refreshing: false,
    searchValue: '',
    selectedType: null,
    animatedModal: new Animated.Value(0),
    animatedScaling: new Animated.Value(0)
  };
  unmounted = false;
  gotInfo = false;
  btnHeaderLayout = { height: 0 };
  bodyLayout = { height: appConfig.device.height };
  modalHeight = appConfig.device.height;
  refSearchInput = React.createRef();
  refComboHeaderButton = React.createRef();
  refCards = [];
  refShakingCards = [];

  componentDidMount() {
    this.setState({ loading: true });
    this.getFavors();
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  handlePressShortcutSearch = () => {
    if (this.refComboHeaderButton.current) {
      this.refComboHeaderButton.current.handleOnPress(BUTTONS[0], 0);
    }
  };

  getFavors = async (keyword = '') => {
    try {
      const response = await APIHandler.user_get_favor_sites(keyword);
      if (response.status === STATUS_SUCCESS && response.data) {
        setStater(this, this.unmounted, {
          cards: response.data.sites || []
        });
      } else {
        flashShowMessage({
          type: 'danger',
          message: response.message
        });
      }
    } catch (error) {
      console.log('customer_card_wallet', error);
      store.addApiQueue('customer_card_wallet', this.getFavors);
    } finally {
      setStater(this, this.unmounted, {
        loading: false,
        refreshing: false
      });
    }
  };

  searchFavorsSite = debounce(async (keyword = '') => {
    if (keyword.length >= MIN_CHARACTER) {
      const data = { keyword };
      setStater(this, this.unmounted, {
        loading: true
      });

      try {
        const response = await APIHandler.user_search_favor_sites(data);
        if (response.status === STATUS_SUCCESS && response.data) {
          setStater(
            this,
            this.unmounted,
            {
              searchCards: response.data.sites || []
            },
            () =>
              Animated.spring(this.state.animatedScaling, {
                toValue: 1,
                useNativeDriver: true
              }).start()
          );
        } else {
          flashShowMessage({
            type: 'danger',
            message: response.message
          });
        }
      } catch (error) {
        console.log('search_customer_card_wallet', error);
        store.addApiQueue('search_customer_card_wallet', this.searchFavorsSite);
      } finally {
        setStater(this, this.unmounted, {
          loading: false,
          isTyping: false
        });
      }
    } else {
      setStater(this, this.unmounted, {
        loading: false,
        isTyping: false
      });
    }
  }, 500);

  searchMyFavors = debounce(async (keyword = '') => {
    if (keyword) {
      const data = { keyword };
      setStater(this, this.unmounted, {
        loading: true
      });

      try {
        const response = await APIHandler.user_search_my_favor_sites(data);
        if (response.status === STATUS_SUCCESS && response.data) {
          setStater(
            this,
            this.unmounted,
            {
              searchMyCards: response.data.sites || []
            },
            () =>
              Animated.spring(this.state.animatedScaling, {
                toValue: 1,
                useNativeDriver: true
              }).start()
          );
        } else {
          flashShowMessage({
            type: 'danger',
            message: response.message
          });
        }
      } catch (error) {
        console.log('search_my_customer_card_wallet', error);
        store.addApiQueue(
          'search_my_customer_card_wallet',
          this.searchMyFavors
        );
      } finally {
        setStater(this, this.unmounted, {
          loading: false,
          isTyping: false
        });
      }
    } else {
      setStater(this, this.unmounted, {
        loading: false,
        isTyping: false
      });
    }
  }, 500);

  handleSearch = searchValue => {
    this.setState({ searchValue, isTyping: true });

    switch (this.state.selectedType) {
      case BUTTON_TYPE.SERVER:
        this.searchFavorsSite(searchValue);
        break;
      case BUTTON_TYPE.LOCAL:
        this.searchMyFavors(searchValue);
        break;
    }

    if (!searchValue) {
      this.setState({ searchCards: [], searchMyCards: [] });
    }
  };

  handleUpdateMyCard = async (card, type) => {
    const siteId = card.id;
    this.setState({ loading: true });

    try {
      const response = await APIHandler.user_update_favor_site(siteId, type);
      if (response.status === STATUS_SUCCESS) {
        flashShowMessage({
          type: 'success',
          message: response.message
        });
        this.refComboHeaderButton.current &&
          this.refComboHeaderButton.current.handleClose();
        if (response.data) {
          setStater(this, this.unmounted, {
            cards: response.data.sites || []
          });
        }
      } else {
        flashShowMessage({
          type: 'danger',
          message: response.message
        });
      }
    } catch (error) {
      console.log('update_customer_card_wallet', error);
      store.addApiQueue(
        'update_customer_card_wallet',
        this.handleUpdateMyCard(card, type)
      );
    } finally {
      setStater(this, this.unmounted, {
        loading: false
      });
    }
  };

  handlePressCard = card => {
    servicesHandler({
      ...card,
      siteId: card.id,
      type: SERVICES_TYPE.OPEN_SHOP
    });
  };

  handleHeaderButtonPress = btn => {
    this.setState({
      selectedType: btn.type
    });

    if (btn.showModal) {
      Animated.spring(this.state.animatedModal, {
        useNativeDriver: true,
        toValue: 1
      }).start();
    }

    this.refSearchInput.current.refInput &&
      this.refSearchInput.current.refInput.focus();
  };

  handleCloseModal = () => {
    this.setState({ searchValue: '', searchCards: [], searchMyCards: [] });
    Animated.parallel([
      Animated.spring(this.state.animatedScaling, {
        toValue: 0,
        useNativeDriver: true
      }),
      Animated.spring(this.state.animatedModal, {
        useNativeDriver: true,
        toValue: 0
      })
    ]).start();
  };

  onButtonHeaderLayout = e => {
    this.btnHeaderLayout = e.nativeEvent.layout;
    this.updateModalHeight();
  };

  onBodyLayout = e => {
    if (!this.gotInfo) {
      this.gotInfo = true;
      this.bodyLayout = e.nativeEvent.layout;
      this.updateModalHeight();
    }
  };

  updateModalHeight() {
    this.modalHeight = this.bodyLayout.height + this.btnHeaderLayout.height * 2;
  }

  handleRefreshMyCards = () => {
    this.setState({ refreshing: true });
    this.getFavors();
  };

  handleAddRefCards = (inst, card) => {
    const refCard = this.refCards.find(ref => ref.id === card.id);
    if (!refCard) {
      this.refCards.push({ id: card.id, ref: inst });
    }
  };

  handleLongPressCard = card => {
    const refCard = this.refCards.find(ref => ref.id === card.id);
    if (refCard) {
      this.refShakingCards.push(refCard);
    }
  };

  handleCancelLongPressCard = card => {
    this.refShakingCards.forEach((refCard, index) => {
      if (refCard.id === card.id) {
        this.refShakingCards.splice(index, 1);
      }
    });
  };

  handleOnPressContainer = () => {
    const refTemp = [...this.refShakingCards];
    refTemp.forEach(refCard => {
      refCard.ref.handleCancelLongPress(true);
    });
  };

  renderCard = ({ item: card, index }) => {
    return (
      <CardWallet
        ref={inst => this.handleAddRefCards(inst, card)}
        longPress
        logoImage={card.logo_url}
        image={card.image_url}
        title={card.title}
        onLongPress={() => this.handleLongPressCard(card)}
        onCancelLongPress={() => this.handleCancelLongPressCard(card)}
        onPress={() => this.handlePressCard(card)}
        onDelete={() => {
          this.handleUpdateMyCard(card, 0);
          this.handleCancelLongPressCard(card);
        }}
        last={index === this.state.cards.length - 1}
        first={index === 0}
      />
    );
  };

  render() {
    const modalStyle = {
      height: this.modalHeight,
      paddingVertical: this.btnHeaderLayout.height,
      transform: [
        {
          translateY: this.state.animatedModal.interpolate({
            inputRange: [0, 1],
            outputRange: [this.modalHeight + 50, -this.btnHeaderLayout.height]
          })
        }
      ]
    };
    const resultStyle = {
      ...styles.resultStyle,
      transform: [
        {
          scale: this.state.animatedScaling
        }
      ],
      opacity: this.state.animatedScaling.interpolate({
        inputRange: [0, 0.7, 1],
        outputRange: [0, 0, 1]
      })
    };

    const data =
      this.state.selectedType === BUTTON_TYPE.LOCAL &&
      this.state.searchMyCards.length !== 0
        ? this.state.searchMyCards
        : this.state.cards;

    const count =
      this.state.searchMyCards.length !== 0
        ? this.state.searchMyCards.length
        : this.state.searchCards.length !== 0
        ? this.state.searchCards.length
        : 0;

    return (
      <TouchableWithoutFeedback
        onPress={this.handleOnPressContainer}
        style={[styles.container]}
      >
        <View style={styles.container}>
          {this.state.loading && (
            <Loading center style={styles.loading} color={'#fff'} />
          )}

          <View style={styles.headerBackground}>
            <Image
              source={require('../../images/card-wallet.png')}
              style={styles.image}
            />
          </View>

          <ComboHeaderButton
            ref={this.refComboHeaderButton}
            containerStyle={styles.comboHeaderBtn}
            data={BUTTONS}
            onPress={this.handleHeaderButtonPress}
            onCloseInput={this.handleCloseModal}
            onContainerLayout={this.onButtonHeaderLayout}
            secretComponent={
              <SearchInput
                ref={this.refSearchInput}
                value={this.state.searchValue}
                onChangeText={this.handleSearch}
              />
            }
          />
          <View onLayout={this.onBodyLayout} style={styles.container}>
            <Header text={count} style={[resultStyle]} />
            <FlatList
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this.handleRefreshMyCards}
                />
              }
              data={data}
              contentContainerStyle={{ flex: data.length === 0 ? 1 : 0 }}
              keyboardShouldPersistTaps="always"
              keyboardDismissMode="on-drag"
              renderItem={this.renderCard}
              keyExtractor={item => item.id}
              ListEmptyComponent={
                !this.state.loading && (
                  <NoResult
                    icon={
                      <Icon
                        name={'playlist-add'}
                        size={72}
                        color={DEFAULT_COLOR}
                        onPress={this.handlePressShortcutSearch}
                      />
                    }
                    message="Chưa có thẻ? Hãy thêm ngay"
                  />
                )
              }
            />
            <Animated.View
              style={[styles.searchModal, styles.modalShadow, modalStyle]}
            >
              <Search
                compareData={this.state.cards}
                data={this.state.searchCards}
                onPressData={card => this.handleUpdateMyCard(card, 1)}
                listEmptyComponent={
                  <Empty
                    isSearch={this.state.searchValue.length >= MIN_CHARACTER}
                    isTyping={this.state.isTyping}
                  />
                }
              />
            </Animated.View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerBackground: {
    backgroundColor: appConfig.colors.primary,
    width: 1100,
    height: 1000,
    borderRadius: 500,
    position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
    top: -920,
    overflow: 'hidden'
  },
  image: {
    transform: [
      {
        rotate: '-25deg'
      }
    ],
    width: 60,
    maxHeight: 100,
    borderRadius: 15,
    position: 'absolute',
    bottom: 0,
    right: '35%',
    resizeMode: 'contain'
  },
  comboHeaderBtn: {
    marginTop: 30,
    zIndex: 1
  },
  searchModal: {
    backgroundColor: '#fff',
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 0,
    position: 'absolute'
  },
  modalShadow: {
    ...elevationShadowStyle(8, 0, -5)
  },
  noResultContainer: {
    flex: 1
  },
  loading: {
    backgroundColor: 'rgba(0,0,0,.6)',
    borderRadius: 4
  },
  resultStyle: {
    marginBottom: 10,
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,.8)',
    paddingHorizontal: 0,
    marginLeft: 20,
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 4,
    zIndex: 9
  }
});

export default CustomerCardWallet;

const Header = props => (
  <Animated.View
    style={[{ marginTop: 10, paddingHorizontal: 15 }, props.style]}
  >
    <Text>
      Có{' '}
      <Text style={[{ fontWeight: 'bold', color: appConfig.colors.primary }]}>
        {props.text}
      </Text>{' '}
      kết quả
    </Text>
  </Animated.View>
);

const Empty = props => (
  <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss}>
    <View style={styles.noResultContainer}>
      {!props.isSearch ? (
        <NoResult
          iconName="file-search"
          message="Nhập ít nhất 3 ký tự để tìm kiếm..."
        />
      ) : (
        !props.isTyping && (
          <NoResult iconName="magnify-close" message="Không tìm thấy dữ liệu" />
        )
      )}
    </View>
  </TouchableWithoutFeedback>
);
