import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {TypographyType} from 'src/components/base';
// custom components
import {Typography, FlatList, TextButton} from 'src/components/base';

class HomeCardList extends Component {
  static contextType = ThemeContext;

  get theme() {
    return getTheme(this);
  }

  get showAllTitleStyle() {
    return {color: this.theme.color.accent2};
  }

  render() {
    const props = this.props;
    const {t} = props;

    const contentContainerStyle = [
      styles.listContentContainer,
      this.props.contentContainerStyle,
    ];

    return (
      <View style={[styles.container, props.containerStyle]}>
        <View style={styles.content}>
          {!!props.title && (
            <Typography
              type={TypographyType.TITLE_LARGE}
              style={[styles.title, this.props.titleStyle]}>
              {props.title}
            </Typography>
          )}

          {props.onShowAll ? (
            <TextButton
              style={styles.showAllBtn}
              titleStyle={[
                this.showAllTitleStyle,
                this.props.showAllTitleStyle,
              ]}
              onPress={props.onShowAll}>
              {t('viewAll')}
            </TextButton>
          ) : (
            <View style={styles.showAllBtn} />
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
    flex: 1,
    marginRight: 20,
  },
  viewAll: {},
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
  children: defaultListener,
};

export default withTranslation('home')(HomeCardList);
