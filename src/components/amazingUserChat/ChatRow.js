import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableHighlight } from 'react-native';
import { CachedImage } from 'react-native-img-cache';
import appConfig from 'app-config';

class ChatRow extends Component {
  state = {};

  onPressChatRow() {
    this.props.onPress();
  }

  render() {
    const textProps = {
      numberOfLines: 1
    };

    return (
      <View
        style={[
          styles.wrapper,
          !this.props.subTitle && styles.onlyTitleWrapper
        ]}
      >
        <TouchableHighlight
          onPress={this.onPressChatRow.bind(this)}
          underlayColor="rgba(0,0,0,.1)"
          style={[styles.container, styles.row]}
        >
          <>
            <View style={styles.left}>
              <CachedImage
                style={styles.img}
                source={{ uri: this.props.img }}
              />
            </View>
            <View
              style={[
                styles.content,
                this.props.isSeparate && styles.separator
              ]}
            >
              <View style={[styles.row, styles.addtionForRow]}>
                <Text
                  style={[
                    styles.title,
                    this.props.isUnread && styles.unreadText,
                    !this.props.subTitle && styles.onlyTitle
                  ]}
                  {...textProps}
                >
                  {this.props.title}
                </Text>
                <Text
                  style={[
                    styles.recentOnlineTime,
                    this.props.isUnread && styles.unreadText
                  ]}
                >
                  {this.props.timeAgo}
                </Text>
              </View>

              {!!this.props.subTitle && (
                <View
                  style={[styles.row, styles.addtionForRow, { marginTop: 8 }]}
                >
                  <View style={[styles.subTitleContainer]}>
                    <Text
                      style={[
                        styles.subTitle,
                        this.props.isUnread && styles.unreadText
                      ]}
                      {...textProps}
                    >
                      {this.props.subTitle}
                    </Text>
                  </View>
                  {!!this.props.unreadChat && (
                    <View style={[styles.badge, { paddingHorizontal: 7 }]}>
                      <Text style={styles.notiMess}>
                        {this.props.unreadChat}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          </>
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row'
  },
  addtionForRow: {
    justifyContent: 'space-between'
  },
  col: {
    flexDirection: 'column'
  },
  unreadText: {
    fontWeight: appConfig.device.isIOS ? '600' : '500',
    color: '#404040'
  },
  onlyTitleWrapper: {
    height: 80
  },
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 90,
    width: '100%'
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    height: '100%',
    padding: 15,
    paddingLeft: 0
  },
  separator: {
    borderColor: '#d9d9d9',
    borderBottomWidth: 0.5
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0
  },
  left: {
    flex: 0.25,
    maxWidth: 150,
    justifyContent: 'center',
    alignItems: 'center'
  },
  img: {
    width: 50,
    height: 50,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25
  },
  title: {
    flex: 0.9,
    maxWidth: 500,
    color: '#353535',
    fontSize: 16,
    fontWeight: isIOS ? '500' : '400'
  },
  onlyTitle: {
    paddingLeft: 15
  },
  subTitleContainer: {
    justifyContent: 'center',
    flex: 1
  },
  subTitle: {
    fontSize: 14,
    color: '#404040'
  },
  iconWrapper: {
    marginRight: 5,
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex'
  },
  badge: {
    borderRadius: 13,
    maxWidth: 30,
    height: 19,
    marginLeft: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red'
  },
  notiMess: {
    color: 'white',
    fontSize: 10
  },
  right: {
    flex: 0.2,
    minWidth: 40,
    maxWidth: 60,
    paddingRight: 15,
    justifyContent: 'center',
    alignItems: 'flex-end',
    flexDirection: 'column'
  },
  recentOnlineTime: {
    justifyContent: 'center',
    alignSelf: 'center',
    fontSize: 12
  }
});

export default ChatRow;
