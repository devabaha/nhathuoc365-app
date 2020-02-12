import React, { Component } from 'react';
import { View, StyleSheet, FlatList, Image, Animated } from 'react-native';
import store from 'app-store';
import Loading from '@tickid/tickid-rn-loading';
import appConfig from 'app-config';
import {
  CardWallet,
  ComboHeaderButton,
  Search,
  SearchInput
} from '../../components/customerCardWallet';
import { servicesHandler, SERVICES_TYPE } from '../../helper/servicesHandler';

const BUTTONS = [
  {
    showModal: true,
    title: 'Thêm thẻ',
    iconName: 'plus'
  },
  {
    title: 'Tìm kiếm thẻ',
    iconName: 'search'
  }
];

class CustomerCardWallet extends Component {
  state = {
    cards: [],
    searchCards: [],
    loading: false,
    animatedModal: new Animated.Value(0)
  };
  unmounted = false;
  btnHeaderLayout = { height: 0 };
  bodyLayout = { height: appConfig.device.height };
  modalHeight = appConfig.device.height;
  refSearchInput = React.createRef();

  componentDidMount() {
    this.getFavors();
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  getFavors = async () => {
    this.setState({ loading: true });
    try {
      const response = await APIHandler.user_get_favor_sites();
      console.log(response);
      if (response.status === STATUS_SUCCESS && response.data) {
        setStater(this, this.unmounted, {
          cards: response.data.sites
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
    if (btn.showModal) {
      Animated.spring(this.state.animatedModal, {
        toValue: 1
      }).start();
    } else {
      if (this.refSearchInput.current) {
        this.refSearchInput.current.refInput &&
          this.refSearchInput.current.refInput.focus();
      }
    }
  };

  handleCloseModal = () => {
    Animated.spring(this.state.animatedModal, {
      toValue: 0
    }).start();
  };

  onButtonHeaderLayout = e => {
    this.btnHeaderLayout = e.nativeEvent.layout;
    this.updateModalHeight();
  };

  onBodyLayout = e => {
    this.bodyLayout = e.nativeEvent.layout;
    this.updateModalHeight();
  };

  updateModalHeight() {
    this.modalHeight = this.bodyLayout.height + this.btnHeaderLayout.height * 2;
  }

  renderCard = ({ item: card, index }) => {
    return (
      <CardWallet
        style={index === 0 ? styles.cardWallet : {}}
        logoImage={card.logo_url}
        image={card.image_url}
        title={card.title}
        onPress={() => this.handlePressCard(card)}
        last={index === this.state.cards.length - 1}
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
            outputRange: [this.modalHeight, -this.btnHeaderLayout.height]
          })
        }
      ]
    };

    return (
      <View style={styles.container}>
        <Loading loading={this.state.loading} />

        <View style={styles.headerBackground}>
          <Image
            source={require('../../images/card-wallet.png')}
            style={styles.image}
          />
        </View>

        <ComboHeaderButton
          containerStyle={styles.comboHeaderBtn}
          data={BUTTONS}
          onPress={this.handleHeaderButtonPress}
          onCloseInput={this.handleCloseModal}
          onContainerLayout={this.onButtonHeaderLayout}
          secretComponent={<SearchInput ref={this.refSearchInput} />}
        />
        <View onLayout={this.onBodyLayout} style={styles.container}>
          {/* <FlatList
                        data={this.state.cards}
                        renderItem={this.renderCard}
                        keyExtractor={item => item.id}
                    /> */}
          <Animated.View
            style={[styles.searchModal, styles.modalShadow, modalStyle]}
          >
            <Search data={this.state.cards} />
          </Animated.View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerBackground: {
    backgroundColor: appConfig.colors.primary,
    width: '100%',
    height: 1000,
    borderRadius: 500,
    position: 'absolute',
    transform: [
      {
        scaleX: 1.8
      }
    ],
    top: -920,
    overflow: 'hidden'
  },
  image: {
    transform: [
      {
        scaleX: 1 / 1.8
      },
      {
        rotate: '-25deg'
      }
    ],
    width: 60,
    maxHeight: 100,
    position: 'absolute',
    bottom: 0,
    right: 95,
    resizeMode: 'contain'
  },
  comboHeaderBtn: {
    marginTop: 30,
    zIndex: 1
  },
  cardWallet: {
    paddingTop: 20
  },
  searchModal: {
    backgroundColor: '#fff',
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 0
  },
  modalShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -5
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5
  }
});

export default CustomerCardWallet;
