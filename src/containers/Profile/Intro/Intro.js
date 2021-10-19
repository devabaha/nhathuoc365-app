import React, {Component, Fragment} from 'react';
import {StyleSheet, View, Text, Linking, Alert} from 'react-native';

import appConfig from 'app-config';

import HorizontalInfoItem from 'src/components/account/HorizontalInfoItem';

class Intro extends Component {
  state = {
    footerData: this.footerData,
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps !== this.props) {
      this.setState({footerData: this.footerData});
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

  onPressFooterDataPress = ({value: url}) => {
    if (url) {
      Linking.openURL(url).catch((err) => {
        console.log('open link', err);
        Alert.alert('Không mở được link');
      });
    }
  };

  renderFooter() {
    const inputProps = {
      numberOfLines: 2,
    };

    return this.state.footerData.map(
      (item, index) =>
        !!item.value && (
          <Fragment key={index}>
            <View style={styles.separator} />
            <HorizontalInfoItem
              data={item}
              onSelectedValue={this.onPressFooterDataPress}
              inputProps={inputProps}
              containerStyle={styles.horizontalInfoContainer}
            />
          </Fragment>
        ),
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Giới thiệu</Text>
        </View>
        {!!this.props.content && (
          <>
            <View style={styles.separator} />
            <View style={styles.contentContainer}>
              <Text style={styles.content, !this.props.content && styles.noIntro}>
                {this.props.content}
              </Text>
            </View>
          </>
        )}

        <View style={styles.footer}>{this.renderFooter()}</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // marginBottom: 15
    // flex: 1,
    // zIndex: 99
  },
  titleContainer: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderTopColor: appConfig.colors.border,
    borderTopWidth: 0.5,
  },
  title: {
    fontWeight: '600',
    color: '#333',
    fontSize: 16,
    letterSpacing: 1,
  },
  contentContainer: {
    backgroundColor: '#fff',
    padding: 15,
  },
  content: {
    color: '#333'
  },
  footer: {},
  noIntro: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#666',
    fontWeight: '300',
    textAlign: 'center',
  },
  horizontalInfoContainer: {
    paddingHorizontal: 15,
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: '#fafafa',
    left: 15,
  },
});

export default Intro;
