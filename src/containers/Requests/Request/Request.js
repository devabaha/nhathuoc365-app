import React, {Component} from 'react';
import Button from 'react-native-button';
import {View, Text, StyleSheet} from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {NotiBadge} from '../../../components/Badges';
import {Container} from 'src/components/Layout';

import appConfig from 'app-config';
import RequestTagTitle from './RequestTagTitle';

class Request extends Component {
  state = {};
  render() {
    const statusStyle = this.props.textColor && {
      color: this.props.textColor,
    };
    const notiMess = this.props.noti ? normalizeNotify(this.props.noti) : '';

    return (
      <Button
        onPress={this.props.onPress}
        activeOpacity={0.8}
        containerStyle={[styles.containerBtn, this.props.wrapperStyle]}>
        <View style={[styles.contentContainer, this.props.containerStyle]}>
          <View style={styles.block}>
            <View style={styles.typeContainer}>
              <Text numberOfLines={1} style={styles.type}>
                {this.props.type}
              </Text>
            </View>

            <RequestTagTitle
              containerStyle={styles.tagContainer}
              code={this.props.tagCode}
              name={this.props.tagName}
            />

            {!!this.props.tagTitle && (
              <Text numberOfLines={1} style={styles.tagTitle}>
                {this.props.tagTitle}
              </Text>
            )}
            {!!this.props.title && (
              <Text numberOfLines={2} style={styles.title}>
                {this.props.title}
              </Text>
            )}

            {!!this.props.description && (
              <Text style={styles.description}>
                <FontAwesome5Icon name="clock" /> {this.props.description}
              </Text>
            )}

            <NotiBadge
              label={notiMess}
              containerStyle={styles.notiMessContainer}
              labelStyle={styles.notiMess}
              show={!!notiMess && notiMess !== '0'}
              animation
            />
          </View>

          <Container row style={styles.block}>
            {!!this.props.adminName && (
              <View style={[styles.statusContainer, styles.adminContainer]}>
                <FontAwesome5Icon
                  name="user-tie"
                  style={[styles.admin, styles.adminIcon]}
                />
                <Text numberOfLines={1} style={[styles.status, styles.admin]}>
                  {this.props.adminName}
                </Text>
              </View>
            )}
            {!!this.props.status && (
              <View
                style={[
                  styles.statusContainer,
                  {backgroundColor: this.props.bgColor || 'transparent'},
                ]}>
                <Text style={[styles.status, statusStyle]}>
                  {this.props.status}
                </Text>
              </View>
            )}
          </Container>

          {!!this.props.subTitle && (
            <View style={styles.subTitleContainer}>
              <Text numberOfLines={2} style={styles.subTitle}>
                {this.props.subTitle}
              </Text>
            </View>
          )}
        </View>
      </Button>
    );
  }
}

const styles = StyleSheet.create({
  containerBtn: {
    marginLeft: 15,
    marginVertical: 5,
    borderRadius: 4,
    width: 280,
    backgroundColor: '#fff',
    // ...elevationShadowStyle(5),
  },
  tagContainer: {
    marginBottom: 10,
  },
  title: {
    ...appConfig.styles.typography.heading1,
    fontWeight: 'bold',
    flex: 1,
    fontSize: 18,
  },
  subTitleContainer: {
    paddingTop: 15,
    borderTopWidth: 0.5,
    borderColor: appConfig.colors.border,
  },
  subTitle: {
    ...appConfig.styles.typography.text,
  },
  description: {
    fontSize: 12,
    color: '#888',
    marginTop: 7,
  },
  statusContainer: {
    borderRadius: 4,
    marginRight: 5,
    padding: 5,
    paddingHorizontal: 7,
  },
  adminContainer: {
    borderBottomLeftRadius: 4,
    borderColor: appConfig.colors.text,
    borderWidth: 0.5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  admin: {
    color: appConfig.colors.text,
  },
  status: {
    fontSize: 12,
    color: '#fff',
  },
  notiMessContainer: {
    right: -15,
    top: -15,
    borderTopRightRadius: 4,
    width: 25,
    height: 20,
  },
  notiMess: {
    fontSize: 12,
  },

  contentContainer: {
    padding: 15,
  },

  block: {
    marginBottom: 15,
  },
  adminIcon: {
    fontSize: 10,
    marginRight: 5,
  },

  typeContainer: {
    backgroundColor: appConfig.colors.primary,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 30,
    alignSelf: 'flex-start',
    marginLeft: -15,
    marginRight: 15,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    marginBottom: 10,
  },
  type: {
    color: appConfig.colors.white,
    fontWeight: '500',
    fontSize: 13,
  },
});

export default Request;
