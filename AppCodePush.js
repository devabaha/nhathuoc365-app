import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import ProgressBar from './src/components/ProgressBar';
import appConfig from 'app-config';
import Button from './src/components/Button';
import SVGRocket from './src/images/rocket.svg';

const styles = StyleSheet.create({
  container: {
    // maxWidth: appConfig.device.width * 0.7,
    padding: 15,
    marginBottom: -20,
    overflow: 'hidden'
  },
  titleContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: '#ddd',
    borderBottomWidth: 0.5,
    paddingBottom: 10,
    marginBottom: 20,
    overflow: 'hidden'
  },
  title: {
    textTransform: 'uppercase',
    fontWeight: '600',
    fontSize: 18,
    textAlign: 'center',
    color: '#666'
  },
  description: {
    textAlign: 'center',
    color: '#242424'
  },
  progressBar: {
    marginTop: 25,
    marginHorizontal: -15
  },
  btnContainer: {
    paddingHorizontal: 0,
    marginTop: 20
  },
  rocketContainer: {
    top: 0,
    left: 0,
    marginHorizontal: 10,
    width: 25,
    height: 25
  }
});

class AppCodePush extends Component {
  state = {};
  render() {
    return (
      <View style={styles.container}>
        {!!this.props.title && (
          <View style={styles.titleContainer}>
            <View style={styles.rocketContainer}>
              <SVGRocket width="100%" height="100%" />
            </View>
            <Text style={styles.title}>{this.props.title}</Text>
          </View>
        )}

        {!!this.props.description && (
          <Text style={styles.description}>{this.props.description}</Text>
        )}

        {!!this.props.progress && (
          <View style={styles.progressBar}>
            <ProgressBar
              progress={this.props.progress}
              height={7}
              backgroundColor={appConfig.colors.primary}
              onCompletion={this.props.onProgressComplete}
            />
          </View>
        )}

        {this.props.showConfirmBtn && (
          <View>
            <Button
              title={this.props.btnTitle}
              containerStyle={styles.btnContainer}
              onPress={this.props.onPressConfirm}
            />
          </View>
        )}
      </View>
    );
  }
}

export default AppCodePush;
