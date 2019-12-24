import React from 'react';
import PropTypes from 'prop-types';
import { stringHelper } from 'app-util';
import Button from 'react-native-button';
import { View, Text, StyleSheet, Image } from 'react-native';

function HomeCardItem(props) {
  return (
    <Button
      onPress={props.onPress}
      containerStyle={[
        styles.containerBtn,
        {
          marginRight: props.last ? 16 : 0
        }
      ]}
    >
      <View style={styles.container}>
        <Image style={styles.image} source={{ uri: props.imageUrl }} />
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>
            {stringHelper.shorten(props.title, 48)}
          </Text>
          {!!props.isShowSubTitle && (
            <Text style={styles.subTitle}>
              <Text style={styles.specialSubTitle}>
                {props.specialSubTitle}
              </Text>
              {props.subTitle}
            </Text>
          )}
        </View>
      </View>
    </Button>
  );
}

const styles = StyleSheet.create({
  containerBtn: {
    marginLeft: 16
  },
  container: {
    width: 205
  },
  image: {
    backgroundColor: '#ebebeb',
    width: '100%',
    height: 116,
    borderRadius: 8
  },
  titleWrapper: {
    marginTop: 10
  },
  title: {
    fontSize: 14,
    fontWeight: '500'
  },
  specialSubTitle: {
    fontWeight: '600',
    color: '#00b140'
  },
  subTitle: {
    fontSize: 14,
    marginTop: 3
  }
});

HomeCardItem.propTypes = {
  title: PropTypes.string,
  imageUrl: PropTypes.string,
  last: PropTypes.bool
};

HomeCardItem.defaultProps = {
  title: '',
  imageUrl: '',
  last: false
};

export default HomeCardItem;
