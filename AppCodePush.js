import React, {Component} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import ProgressBar from './src/components/ProgressBar';
import appConfig from 'app-config';
import Button from './src/components/Button';
import SVGRocket from './src/images/rocket.svg';

const styles = StyleSheet.create({
  container: {
    // maxWidth: appConfig.device.width * 0.7,
    padding: 15,
    marginBottom: -20,
    overflow: 'hidden',
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
    overflow: 'hidden',
  },
  title: {
    textTransform: 'uppercase',
    fontWeight: '600',
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
  },
  description: {
    textAlign: 'center',
    color: '#242424',
  },
  progressBar: {
    marginTop: 25,
    marginHorizontal: -15,
  },
  btnContainer: {
    paddingHorizontal: 0,
    marginTop: 10,
  },
  rocketContainer: {
    top: 0,
    left: 0,
    marginHorizontal: 10,
    width: 25,
    height: 25,
  },
  footerContainer: {
    marginTop: 20,
  },
  suggest: {
    color: '#333',
    fontSize: 13,
    fontWeight: '300',
    lineHeight: 18,
  },
  noteContainer: {
    marginTop: 20,
    marginHorizontal: -15,
    padding: 15,
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 4
  },
  note: {
    color: '#242424',
    fontSize: 12,
    fontWeight: '300',
    fontStyle: 'italic',
  },
});

class AppCodePush extends Component {
  state = {
    remainingTime: 5,
  };
  counter = null;

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState !== this.state) {
      return true;
    }

    if (
      nextProps.title !== this.props.title ||
      nextProps.description !== this.props.description ||
      nextProps.progress !== this.props.progress ||
      nextProps.btnTitle !== this.props.btnTitle ||
      nextProps.t !== this.props.t
    ) {
      return true;
    }

    return false;
  }

  componentDidMount() {
    this.counter = setInterval(() => {
      this.setState((prevState) => {
        if (!prevState.remainingTime) {
          clearInterval(this.counter);
          return;
        }

        return {
          remainingTime: prevState.remainingTime - 1,
        };
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.counter);
  }

  render() {
    const confirmBtnTitle =
      this.props.confirmBtnTitle || this.props.t('codePush.runInBackground');
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

        <View style={styles.footerContainer}>
          <Text style={styles.suggest}>
            {this.props.t('codePush.alert.suggestMessage', {
              btnTitle: confirmBtnTitle,
            })}
          </Text>
          <View style={styles.noteContainer}>
            <Text style={styles.note}>
              {this.props.t('codePush.alert.noteMessage')}
            </Text>
          </View>
          <Button
            disabled={!!this.state.remainingTime}
            title={
              confirmBtnTitle +
              (this.state.remainingTime ? ` (${this.state.remainingTime})` : '')
            }
            containerStyle={styles.btnContainer}
            onPress={this.props.onPressConfirm}
          />
        </View>
      </View>
    );
  }
}

export default withTranslation()(AppCodePush);
