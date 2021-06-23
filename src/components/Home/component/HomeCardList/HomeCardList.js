import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Button from 'react-native-button';
import {View, Text, StyleSheet, Animated} from 'react-native';

import appConfig from 'app-config';

function HomeCardList({horizontal = true, ...props}) {
  const {t} = useTranslation('home');
  return (
    <View
      onLayout={props.onLayout}
      style={[styles.container, props.containerStyle]}>
      {!!props.title && (
        <View style={[styles.content, props.headerStyle]}>
          <Text style={styles.title}>{props.title}</Text>

          {props.onShowAll ? (
            <Button
              containerStyle={styles.showAllBtn}
              underlayColor="transparent"
              onPress={props.onShowAll}>
              <Text style={styles.viewAll}>{t('viewAll')}</Text>
            </Button>
          ) : (
            <View style={[styles.showAllBtn, styles.showAllBtnEmpty]} />
          )}
        </View>
      )}

      <Animated.FlatList
        horizontal={horizontal}
        data={props.data}
        showsHorizontalScrollIndicator={false}
        renderItem={props.children}
        keyExtractor={(item, index) => index.toString()}
        refreshControl={props.refreshControl}
        style={[appConfig.device.isIOS && styles.listContainer]}
        contentContainerStyle={[
          styles.listContentContainer,
          props.contentContainerStyle,
        ]}
        {...props.flatListProps}
      />
      {props.extraComponent}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
  },
  content: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  showAllBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...appConfig.styles.typography.heading1,
    flex: 1,
    marginRight: 20,
  },
  viewAll: {
    ...appConfig.styles.typography.text,
    color: '#0084ff',
  },
  listContainer: {
    overflow: 'visible',
  },
  listContentContainer: {
    paddingHorizontal: 7.5,
    paddingVertical: 15,
  },
});

const defaultListener = () => null;

HomeCardList.propTypes = {
  data: PropTypes.array,
  onShowAll: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  children: PropTypes.func.isRequired,
};

HomeCardList.defaultProps = {
  data: [],
  onShowAll: defaultListener,
  children: defaultListener,
};

export default withTranslation('home')(HomeCardList);
