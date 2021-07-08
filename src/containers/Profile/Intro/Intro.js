import React, { Component } from 'react';
import { StyleSheet, View, Text, Linking, Alert } from 'react-native';
import HorizontalInfoItem from 'src/components/account/HorizontalInfoItem';

class Intro extends Component {
  state = {
    footerData: this.footerData
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps !== this.props) {
      this.setState({ footerData: this.footerData });
      return true;
    }

    if (nextState !== this.state) {
      return true;
    }

    return false;
  }
  get footerData() {
    return this.props.data;
  }

  onPressFooterDataPress = ({ value: url }) => {
    if (url) {
      Linking.openURL(url).catch(err => {
        console.log('open link', err);
        Alert.alert('Không mở được link');
      });
    }
  };

  renderFooter() {
    const inputProps = {
      numberOfLines: 2
    };

    return this.state.footerData.map((item, index) => (
      <HorizontalInfoItem
        key={index}
        data={item}
        onSelectedValue={this.onPressFooterDataPress}
        detailTitleStyle={item.select && styles.link}
        inputProps={inputProps}
      />
    ));
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Giới thiệu</Text>
        </View>
        <View style={styles.contentContainer}>
          <Text style={!this.props.content && styles.noIntro}>
            {this.props.content || 'Chưa có lời giới thiệu'}
          </Text>
        </View>
        <View style={styles.footer}>{this.renderFooter()}</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15
    // flex: 1,
    // zIndex: 99
  },
  titleContainer: {
    backgroundColor: '#f1f1f1',
    padding: 15,
    borderBottomColor: '#ccc',
    borderBottomWidth: 0.5
  },
  title: {
    fontWeight: '600',
    color: '#444'
  },
  contentContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderBottomColor: '#ccc',
    borderBottomWidth: 0.5
  },
  footer: {},
  noIntro: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#666',
    fontWeight: '300',
    textAlign: 'center'
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline'
  }
});

export default Intro;
