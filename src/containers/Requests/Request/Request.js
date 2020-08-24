import React, { Component } from 'react';
import Button from 'react-native-button';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { DiscountBadge, NotiBadge } from '../../../components/Badges';

class Request extends Component {
  state = {};
  render() {
    const extraStyle = this.props.bgColor && {
      borderLeftWidth: 3,
      borderLeftColor: this.props.bgColor
    };
    const statusStyle = this.props.textColor && {
      color: this.props.textColor
    };
    const notiMess = this.props.noti ? normalizeNotify(this.props.noti) : '';
    return (
      <>
        <Button
          onPress={this.props.onPress}
          containerStyle={[
            styles.containerBtn,
            {
              marginRight: this.props.last ? 16 : 0
            },
            this.props.wrapperStyle
          ]}
        >
          <View style={[styles.extraWrapper, extraStyle]}>
            <View style={styles.headerContainer}>
              {!!this.props.status && (
                <View
                  style={[
                    styles.statusContainer,
                    { backgroundColor: this.props.bgColor || 'transparent' }
                  ]}
                >
                  <Text style={[styles.status, statusStyle]}>
                    {this.props.status}
                  </Text>
                </View>
              )}
              {!!this.props.adminName && (
                <View style={styles.adminWrapper}>
                  <View style={[styles.statusContainer, styles.adminContainer]}>
                    <Text
                      numberOfLines={1}
                      style={[styles.status, styles.admin]}
                    >
                      <Icon name="user-tie" style={styles.user} />{' '}
                      {this.props.adminName}
                    </Text>
                  </View>
                </View>
              )}
              <DiscountBadge
                containerStyle={styles.badge}
                tailSpace={4}
                right
                label={this.props.type}
              />
            </View>
            <View style={[styles.container, this.props.containerStyle]}>
              <View style={styles.titleContainer}>
                {!!this.props.title && (
                  <Text numberOfLines={2} style={styles.title}>
                    {this.props.title}
                  </Text>
                )}
                {!!notiMess && notiMess !== '0' && (
                  <NotiBadge
                    label={notiMess}
                    containerStyle={styles.notiMess}
                  />
                )}
              </View>
              {!!this.props.subTitle && (
                <Text numberOfLines={2} style={styles.subTitle}>
                  {this.props.subTitle}
                </Text>
              )}

              {!!this.props.description && (
                <Text style={styles.description}>
                  <Icon name="clock" /> {this.props.description}
                </Text>
              )}
            </View>
          </View>
        </Button>
      </>
    );
  }
}

const styles = StyleSheet.create({
  containerBtn: {
    marginLeft: 16,
    marginVertical: 5,
    borderRadius: 4,
    width: 280
  },
  extraWrapper: {
    backgroundColor: '#f7f6d5',
    borderRadius: 4,
    paddingHorizontal: 15,
    paddingBottom: 15,
    paddingLeft: 8,
    ...elevationShadowStyle(3)
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: -15,
    marginBottom: 10,
    flexWrap: 'wrap'
  },
  badge: {
    width: null,
    right: -4
  },
  container: {
    // width: 205,
  },
  titleContainer: {
    borderBottomWidth: 0.5,
    marginBottom: 5,
    borderBottomColor: '#ddd',
    backgroundColor: '#f7f6d5'
  },
  title: {
    color: '#333',
    fontWeight: '500',
    marginBottom: 5,
    flex: 1,
    fontSize: 15
  },
  subTitle: {
    fontSize: 13,
    textDecorationStyle: 'dotted',
    textDecorationColor: '#ddd',
    textDecorationLine: 'underline',
    lineHeight: 20
  },
  subDescription: {
    letterSpacing: 0.1,
    fontSize: 11,
    color: '#555',
    fontWeight: '500',
    marginBottom: 3
  },
  description: {
    fontSize: 11,
    color: '#666',
    flex: 1,
    textAlign: 'right',
    marginTop: 10
  },
  statusContainer: {
    borderBottomRightRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 10,
    marginLeft: -8,
    padding: 5,
    paddingLeft: 8
  },
  adminWrapper: {
    flex: 1,
    marginLeft: 16,
    marginRight: 5
  },
  adminContainer: {
    borderBottomLeftRadius: 4,
    backgroundColor: '#9c9c9c'
  },
  admin: {},
  status: {
    fontSize: 11,
    color: '#fff'
  },
  notiMess: {
    right: -10
  }
});

export default Request;
