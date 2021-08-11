import React, { Component } from 'react';
import { View, StyleSheet, Text, Keyboard } from 'react-native';
import { Message, Bubble } from 'react-native-gifted-chat';
import appConfig from 'app-config';
import Icon from 'react-native-vector-icons/FontAwesome';

class Comment extends Component {
  state = {};

  renderBubble = () => {
    const bubbleWrapperStyle = {
      left: { backgroundColor: '#fff' },
      right: { backgroundColor: appConfig.colors.primary }
    };

    return (
      <Bubble
        wrapperStyle={bubbleWrapperStyle}
        renderTime={this.renderTime}
        currentMessage={this.props.message}
        position={this.props.position}
        onLongPress={() => {}}
      />
    );
  };

  renderTime = () => {
    return (
      <Text style={[styles.subInfo, styles.time, this.props.timeStyle]}>
        {this.props.message.hour}
      </Text>
    );
  };

  renderDay = () => {
    return this.props.day ? (
      <Text style={[styles.subInfo, styles.day]}>{this.props.day}</Text>
    ) : null;
  };

  renderAvatar = () => {
    if (!this.props.iconName) {
      return null;
    }

    return (
      <View style={styles.iconContainer}>
        <Icon name={this.props.iconName} style={styles.icon} />
      </View>
    );
  };

  render() {
    return (
      <View onResponderStart={Keyboard.dismiss} style={styles.container}>
        <Message
          currentMessage={this.props.message}
          position={this.props.position}
          renderBubble={this.renderBubble}
          renderDay={this.renderDay}
          renderAvatar={this.renderAvatar}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10
  },
  subInfo: {},
  day: {
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 12
  },
  time: {
    paddingHorizontal: 12,
    paddingBottom: 5
  },
  iconContainer: {
    marginRight: 5
  },
  icon: {
    fontSize: 20,
    color: '#333'
  }
});

export default Comment;
