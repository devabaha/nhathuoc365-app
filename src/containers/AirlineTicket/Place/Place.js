import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import PropTypes from 'prop-types';
// configs
import store from 'app-store';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
import {mergeStyles} from 'src/Themes/helper';
// routing
import {pop, refresh} from 'app-helper/routing';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {TypographyType} from 'src/components/base';
// custom components
import {
  Container,
  ScreenWrapper,
  Typography,
  SectionList,
  BaseButton,
} from 'src/components/base';
import NoResult from 'src/components/NoResult';

class Place extends Component {
  static contextType = ThemeContext;

  static propTypes = {
    onSelected: PropTypes.func,
  };

  static defaultProps = {
    onSelected: (value) => value,
  };

  static onEnter = () => {};

  static onExit = () => {
    action(() => {
      store.setPlaceData(store.place_data_static);
    })();
  };

  get theme() {
    return getTheme(this);
  }

  componentDidMount() {
    setTimeout(() =>
      refresh({
        onChangeText: this._onChangeText,
      }),
    );
  }

  _onChangeText = (value) => {
    clearTimeout(this._timerSearch);
    if (value) {
      this._timerSearch = setTimeout(() => {
        store.getAirportData({
          query: value,
        });
      }, 300);
    } else {
      action(() => {
        store.setPlaceData(store.place_data_static);
      })();
    }
  };

  _onSelected(item) {
    this.props.onSelected(item);
    pop();
  }

  _renderItem = ({item, index}) => {
    return (
      <Container style={this.itemStyle}>
        <BaseButton
          useTouchableHighlight
          style={styles.itemContent}
          onPress={this._onSelected.bind(this, item)}>
          <>
            <Typography type={TypographyType.LABEL_LARGE}>
              {`${item.city_name_vi}, ${item.country_name_vi}`}
            </Typography>
            <Typography type={TypographyType.LABEL_SMALL_TERTIARY}>
              {`${item.code} - ${item.name_vi}`}
            </Typography>
          </>
        </BaseButton>
      </Container>
    );
  };

  renderSectionHeader = ({section}) => {
    return (
      <Container style={this.sectionHeaderContainerStyle}>
        <Typography
          type={TypographyType.LABEL_LARGE_TERTIARY}
          style={styles.sectionHeaderContent}>
          {section.title}
        </Typography>
      </Container>
    );
  };

  get sectionHeaderContainerStyle() {
    return mergeStyles(styles.sectionHeaderContainer, {
      borderBottomWidth: this.theme.layout.borderWidthPixel,
      borderColor: this.theme.color.border,
      backgroundColor: this.theme.color.background,
    });
  }

  get itemStyle() {
    return mergeStyles(styles.item, {
      borderBottomWidth: this.theme.layout.borderWidthPixel,
      borderColor: this.theme.color.border,
    });
  }

  render() {
    var {place_data, formattedList} = store;

    return (
      <ScreenWrapper style={styles.container}>
        {place_data ? (
          <SectionList
            safeLayout={!store.keyboardTop}
            keyboardShouldPersistTaps="always"
            style={{
              marginBottom: store.keyboardTop,
            }}
            renderItem={this._renderItem}
            renderSectionHeader={this.renderSectionHeader}
            sections={formattedList}
            keyExtractor={(item) => item.id}
          />
        ) : (
          <NoResult
            iconName="airplane-off"
            message={this.props.t('noResult')}
          />
        )}
      </ScreenWrapper>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  sectionHeaderContainer: {
    justifyContent: 'center',
    paddingHorizontal: 15,
    height: 36,
  },
  sectionHeaderContent: {
    fontWeight: '500',
  },
  item: {},
  itemContent: {
    paddingHorizontal: 15,
    justifyContent: 'center',
    height: 60,
  },
});
export default withTranslation('airlineTicket')(observer(Place));
