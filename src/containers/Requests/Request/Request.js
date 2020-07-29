import React, { Component } from 'react';
import Button from 'react-native-button';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
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
            <DiscountBadge
              containerStyle={styles.badge}
              tailSpace={4}
              right
              label={this.props.type}
            />
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
            <View style={[styles.container, this.props.containerStyle]}>
              <View style={styles.titleContainer}>
                {!!this.props.title && (
                  <Text numberOfLines={2} style={styles.title}>
                    {this.props.title}
                  </Text>
                )}
                {!!notiMess && (
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
                  <Icon name="clock-o" /> {this.props.description}
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
    borderRadius: 4
  },
  extraWrapper: {
    backgroundColor: '#f7f6d5',
    borderRadius: 4,
    padding: 15,
    paddingTop: 0,
    paddingLeft: 8,
    ...elevationShadowStyle(3)
  },
  badge: {
    position: 'absolute',
    width: null,
    zIndex: 1
  },
  container: {
    width: 205
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
  description: {
    fontSize: 12,
    textAlign: 'right',
    color: '#666',
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
  status: {
    fontSize: 11,
    color: '#fff'
  },
  notiMess: {
    right: -10
  }
});

export default Request;
