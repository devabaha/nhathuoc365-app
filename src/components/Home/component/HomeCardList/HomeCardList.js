import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Button from 'react-native-button';
import {View, Text, StyleSheet, FlatList} from 'react-native';

import appConfig from 'app-config';
import {getTheme, ThemeContext} from 'src/Themes/Theme.context';
import {Typography} from 'src/components/base';
import {TypographyType} from 'src/components/base/Typography/constants';
class HomeCardList extends Component {
  static contextType = ThemeContext;
  render() {
    const theme = getTheme(this);
    const props = this.props;
    const {t} = props;

    const contentContainerStyle = [
      styles.listContentContainer,
      this.props.contentContainerStyle,
    ];

    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Typography type={TypographyType.TITLE_LARGE} style={styles.title}>
            {props.title}
          </Typography>

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

        {typeof this.props.renderContent === 'function' ? (
          <View style={contentContainerStyle}>
            {this.props.renderContent()}
          </View>
        ) : (
          <FlatList
            horizontal
            data={props.data}
            showsHorizontalScrollIndicator={false}
            renderItem={props.children}
            keyExtractor={(item, index) => index.toString()}
            style={styles.listContainer}
            contentContainerStyle={contentContainerStyle}
          />
        )}
      </View>
    );
  }
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
    // ...appConfig.styles.typography.heading1,
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
