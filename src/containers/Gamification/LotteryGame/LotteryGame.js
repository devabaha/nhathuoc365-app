import React, {Component} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  KeyboardAvoidingView,
} from 'react-native';
import Animated from 'react-native-reanimated';
import store from 'app-store';
import appConfig from 'app-config';
import {APIRequest} from '../../../network/Entity';
import Loading from '../../../components/Loading';
import Header from './Header';
import Body from './Body';
import Footer from './Footer';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

class LotteryGame extends Component {
  state = {
    loading: true,
    refreshing: false,
    gameInfo: null,
  };
  gameInfoRequest = new APIRequest();
  gameJoiningRequest = new APIRequest();
  requests = [this.gameInfoRequest, this.gameJoiningRequest];
  paddingAnimation = new Animated.Value(0);

  get results() {
    let listResult = this.state.gameInfo.my_turn_selected.split(',');
    if (Array.isArray(listResult)) {
      listResult = listResult.map((result) => result.trim());
    }
    return listResult || [];
  }

  componentDidMount() {
    this.getGameInfo();
    if (!this.props.title) {
      setTimeout(() =>
        Actions.refresh({
          title: this.props.t('screen.lotteryGame.mainTitle'),
        }),
      );
    }
  }

  componentWillUnmount() {
    cancelRequests(this.requests);
  }

  handleCollapsing = (isCollapsing, animatedConfig) => {
    Animated.timing(this.paddingAnimation, animatedConfig).start();
  };

  async getGameInfo() {
    const {t} = this.props;
    this.gameInfoRequest.cancel();
    try {
      this.gameInfoRequest.data = APIHandler.lottery_index(store.store_id);
      const response = await this.gameInfoRequest.promise();
      console.log(response);
      if (response) {
        if (response && response.status === STATUS_SUCCESS) {
          this.setState({
            gameInfo: response.data,
          });
        } else {
          flashShowMessage({
            type: 'danger',
            message: response.message || t('api.error.message'),
          });
        }
      } else {
        flashShowMessage({
          type: 'danger',
          message: t('api.error.message'),
        });
      }
    } catch (err) {
      console.log('join_game', err);
      flashShowMessage({
        type: 'danger',
        message: t('api.error.message'),
      });
    } finally {
      this.setState({
        loading: false,
        refreshing: false,
      });
    }
  }

  submit = async (prediction_number) => {
    this.setState({loading: true});
    const {t} = this.props;
    this.gameJoiningRequest.cancel();
    const data = {prediction_number};
    try {
      this.gameJoiningRequest.data = APIHandler.lottery_turn(
        store.store_id,
        this.state.gameInfo.id,
        data,
      );
      const response = await this.gameJoiningRequest.promise();
      if (response) {
        if (response.status === STATUS_SUCCESS && response.data) {
          this.setState({
            gameInfo: response.data,
          });
        }
        flashShowMessage({
          type: response.status === STATUS_SUCCESS ? 'success' : 'danger',
          message: response.message || t('api.error.message'),
        });
      } else {
        flashShowMessage({
          type: 'danger',
          message: t('api.error.message'),
        });
      }
    } catch (err) {
      console.log('get_game_info', err);
      flashShowMessage({
        type: 'danger',
        message: t('api.error.message'),
      });
    } finally {
      this.setState({
        loading: false,
      });
    }
  };

  onRefresh = () => {
    this.setState({refreshing: true});
    this.getGameInfo();
  };

  render() {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={appConfig.device.isIOS ? 'padding' : null}>
        {this.state.loading && <Loading center />}
        <SafeAreaView style={styles.container}>
          <ScrollView
            refreshControl={
              <RefreshControl
                onRefresh={this.onRefresh}
                refreshing={this.state.refreshing}
              />
            }>
            {!!this.state.gameInfo && (
              <Animated.View style={{paddingBottom: this.paddingAnimation}}>
                <Header image={this.state.gameInfo.image} />
                <Body
                  rules={this.state.gameInfo.rules}
                  prize={this.state.gameInfo.prize}
                />
              </Animated.View>
            )}
          </ScrollView>
          {!!this.state.gameInfo && (
            <Footer
              title="Chọn số nhanh"
              submitTitle="Gửi số"
              resultsSubmittedTitle="Số bạn đã chọn"
              moreTitle="Xem thêm"
              results={this.results}
              maxLengthInput={this.state.gameInfo.max_length_input}
              maxTurn={this.state.gameInfo.max_turn}
              totalPoint={
                this.state.gameInfo.my_wallet
                  ? this.state.gameInfo.my_wallet.balance_view || null
                  : null
              }
              feePoint={this.state.gameInfo.point_count_view}
              isActive={this.state.gameInfo.is_active}
              message={this.state.gameInfo.message}
              onSubmit={this.submit}
              collapsing={this.handleCollapsing}
              hasResults={this.state.gameInfo.my_turn.length !== 0}
            />
          )}
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }
}

export default withTranslation()(LotteryGame);
