import React, { PureComponent } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableHighlight,
  Text,
  SafeAreaView,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import appConfig from 'app-config';
import PropTypes from 'prop-types';
import Svg, { Circle } from 'react-native-svg';
import { Actions } from 'react-native-router-flux';

const NUM_COLUMS = 3;
const LIST_BANK = [
  {
    id: 0,
    name: 'MBBank',
    image: 'https://upload.wikimedia.org/wikipedia/commons/2/25/Logo_MB_new.png'
  },
  {
    id: 1,
    name: 'Agribank',
    image:
      'https://seeklogo.net/wp-content/uploads/2016/07/Agribank-logo-400x400.png'
  },
  {
    id: 2,
    name: 'Vietcombank',
    image:
      'https://seeklogo.net/wp-content/uploads/2016/07/vietcombank-vector-logo.png'
  },
  {
    id: 3,
    name: 'BIDV',
    image:
      'https://seeklogo.net/wp-content/uploads/2016/07/BIDV-logo-400x400.png'
  },
  {
    id: 4,
    name: 'Vietinbank',
    image:
      'https://seeklogo.net/wp-content/uploads/2016/01/vietinbank-logo-vector-download-400x400.jpg'
  },
  {
    id: 5,
    name: 'Techcombank',
    image:
      'https://seeklogo.net/wp-content/uploads/2016/11/techcombank-logo-preview-400x400.png'
  },
  {
    id: 6,
    name: 'ACB',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Asia_Commercial_Bank_logo.svg/1200px-Asia_Commercial_Bank_logo.svg.png'
  },
  {
    id: 7,
    name: 'VPBank',
    image:
      'https://vignette.wikia.nocookie.net/logopedia/images/4/44/VPBank_Ng%C3%A2n_H%C3%A0ng_Vi%E1%BB%87t_Nam_Th%E1%BB%8Bnh_V%C6%B0%E1%BB%A3ng.png/revision/latest?cb=20170204083549'
  }
];

class InternetBankingModal extends PureComponent {
  static propTypes = {
    data: PropTypes.array
  };

  static defaultProps = {
    data: LIST_BANK
  };

  state = {
    text: '',
    searchData: null
  };

  onChangeText = text => {
    this.setState({ text });
    this.searchBank(text);
  };

  searchBank = (searchValue = '') => {
    if (searchValue) {
      const searchData = this.props.data.filter(bank =>
        bank.name.toLowerCase().includes(searchValue.toLowerCase())
      );
      this.setState({ searchData });
    } else {
      this.setState({ searchData: null });
    }
  };

  onPressBank = item => {
    this.props.onPressBank(item);
    Actions.pop();
  };

  renderBank(data, { item, index }) {
    const isRightOutermost = (index + 1) % NUM_COLUMS === 0;
    const isLastRow =
      index >= (data.length % NUM_COLUMS) * NUM_COLUMS ||
      data.length < NUM_COLUMS;

    return (
      <TouchableHighlight
        underlayColor="#bababa"
        onPress={() => this.onPressBank(item)}
        style={styles.bankContainer}
      >
        <View style={styles.bankWrapper}>
          {!isRightOutermost && <View style={styles.borderRight} />}
          <View style={[styles.bankInnerWrapper]}>
            <CachedImage source={{ uri: item.image }} style={styles.image} />
            <Text>{item.name}</Text>
          </View>
          {!isLastRow && <View style={styles.borderBottom} />}
          {!isLastRow && !isRightOutermost && (
            <View style={styles.dot}>
              <Svg width={2} height={2}>
                <Circle stroke="#888" cx={1} cy={1} r={0.5} />
              </Svg>
            </View>
          )}
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    const data = this.state.searchData
      ? this.state.searchData
      : this.props.data;
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>
          <View style={styles.searchContainer}>
            <Icon name="search" style={styles.searchIcon} />
            <TextInput
              placeholder="Tìm kiếm..."
              placeholderTextColor={appConfig.colors.placeholder}
              style={styles.input}
              onChangeText={this.onChangeText}
              value={this.state.text}
              clearButtonMode="while-editing"
            />
          </View>
          <FlatList
            data={data}
            keyExtractor={(item, index) => index.toString()}
            numColumns={NUM_COLUMS}
            renderItem={({ item, index }) =>
              this.renderBank(data, { item, index })
            }
            keyboardShouldPersistTaps="always"
            keyboardDismissMode="on-drag"
            style={styles.banksContainer}
          />
        </SafeAreaView>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 7,
    margin: 15,
    borderRadius: 4
  },
  searchIcon: {
    marginHorizontal: 10,
    fontSize: 22,
    color: appConfig.colors.placeholder
  },
  input: {
    flex: 1,
    fontSize: 18
  },
  banksContainer: {
    backgroundColor: '#fff'
  },
  bankContainer: {
    width: appConfig.device.width / NUM_COLUMS
  },
  bankWrapper: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center'
  },
  bankInnerWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingVertical: 7.5,
    paddingHorizontal: 7.5
  },
  image: {
    width: '100%',
    height: 70,
    resizeMode: 'contain',
    marginBottom: 10
  },
  borderRight: {
    position: 'absolute',
    height: '80%',
    right: -0.25,
    width: 0.5,
    backgroundColor: '#ccc'
  },
  borderBottom: {
    position: 'absolute',
    width: '80%',
    height: 0.5,
    bottom: -0.25,
    backgroundColor: '#ccc',
    alignSelf: 'center'
  },
  dot: {
    position: 'absolute',
    bottom: -1,
    right: -1
  }
});

export default InternetBankingModal;
