import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, StyleSheet} from 'react-native';
// configs
import store from 'app-store';
import appConfig from 'app-config';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {BundleIconSetName, TypographyType} from 'src/components/base';
// custom components
import {
  Typography,
  Icon,
  BaseButton,
  FlatList,
  Container,
} from 'src/components/base';

class SelectionList extends Component {
  static contextType = ThemeContext;

  static defaultProps = {
    useList: true,
  };

  get theme() {
    return getTheme(this);
  }

  renderItem({item, index}) {
    if (item.isHidden) {
      return null;
    }

    if (typeof item.render === 'function') {
      return item.render();
    }

    var notifyCount = 0;
    if (item.notify) {
      notifyCount = parseInt(store.notify[item.notify]);
    }

    let iconBundle = BundleIconSetName.FONT_AWESOME;
    switch (item.iconType) {
      case 'MaterialCommunityIcons':
        iconBundle = BundleIconSetName.MATERIAL_COMMUNITY_ICONS;
        break;
    }

    return (
      <React.Fragment key={index}>
        <Container
          style={[
            {
              marginTop: item.marginTop ? 8 : 0,
              borderTopWidth: item.marginTop ? appConfig.device.pixel : 0,
            },
            this.profileListContainerExtraStyle,
            item.wrapperStyle,
          ]}>
          <BaseButton
            useTouchableHighlight
            disabled={item.disabled}
            onPress={item.onPress}>
            <>
              <View style={[styles.profile_list_opt_btn, item.containerStyle]}>
                <View style={[styles.profile_list_icon_box, item.boxIconStyle]}>
                  {item.leftIcon || (
                    <Icon
                      bundle={iconBundle}
                      name={item.icon}
                      style={{
                        color: item.iconColor || this.leftIconDefaultColor,
                        fontSize: item.iconSize || 16,
                      }}
                    />
                  )}
                </View>

                <View style={styles.labelContainer}>
                  <Typography
                    {...item.labelProps}
                    type={TypographyType.LABEL_LARGE}
                    style={[styles.profile_list_label, item.labelStyle]}>
                    {item.label}
                  </Typography>
                  {!!item.desc && (
                    <Typography
                      {...item.desProps}
                      type={TypographyType.DESCRIPTION_SMALL_TERTIARY}
                      style={[styles.profile_list_small_label, item.descStyle]}>
                      {item.desc}
                    </Typography>
                  )}
                </View>

                {!item.hideAngle && (
                  <View
                    style={[
                      styles.profile_list_icon_box,
                      styles.profile_list_icon_box_angle,
                    ]}>
                    {item.rightIcon || (
                      <Icon
                        bundle={iconBundle}
                        name="angle-right"
                        style={styles.rightIcon}
                        neutral
                      />
                    )}
                  </View>
                )}

                {notifyCount > 0 && (
                  <View style={styles.stores_info_action_notify}>
                    <Typography
                      type={TypographyType.LABEL_EXTRA_SMALL}
                      style={this.notifyTextStyles}>
                      {notifyCount}
                    </Typography>
                  </View>
                )}
              </View>

              {typeof item.renderAfter === 'function' && item.renderAfter()}
            </>
          </BaseButton>
        </Container>
        <View style={[this.separatorStyle, item.separatorStyle]} />
      </React.Fragment>
    );
  }

  renderList() {
    const {data, containerStyle} = this.props;
    return (
      <FlatList
        data={data}
        style={[styles.profile_list_opt, containerStyle]}
        renderItem={this.renderItem.bind(this)}
      />
    );
  }

  renderFakeList() {
    const {data, containerStyle} = this.props;
    return (
      <View style={[styles.profile_list_opt, containerStyle]}>
        {data.map((item, index) => this.renderItem({item, index}))}
      </View>
    );
  }

  renderData() {
    if (this.props.useList) {
      return this.renderList();
    } else {
      return this.renderFakeList();
    }
  }

  get profileListContainerExtraStyle() {
    return {
      borderColor: this.theme.color.border,
    };
  }

  get leftIconDefaultColor() {
    return this.theme.color.neutral;
  }

  get notifyContainerStyle() {
    return [
      styles.stores_info_action_notify,
      {
        backgroundColor: this.theme.color.danger,
        borderRadius: this.theme.layout.borderRadiusMedium,
      },
    ];
  }
  get notifyTextStyles() {
    return [
      styles.stores_info_action_notify_value,
      {color: this.theme.color.surface},
    ];
  }

  get separatorStyle() {
    return [
      styles.separator,
      {
        height: this.theme.layout.borderWidthPixel,
        backgroundColor: this.theme.color.border,
      },
    ];
  }

  render() {
    return this.renderData();
  }
}

SelectionList.propTypes = {
  data: PropTypes.array.isRequired,
};

const styles = StyleSheet.create({
  profile_list_opt: {},
  profile_list_opt_btn: {
    width: appConfig.device.width,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  profile_list_icon_box: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
    marginLeft: 4,
    marginRight: 4,
  },
  labelContainer: {
    flex: 1,
  },
  profile_list_icon_box_angle: {
    paddingRight: 7,
    width: undefined,
    height: '100%',
  },
  rightIcon: {
    fontSize: 26,
  },
  profile_list_label: {
    fontWeight: '400',
  },
  profile_list_small_label: {
    marginTop: 2,
  },
  separator: {
    width: '100%',
  },

  stores_info_action_notify: {
    position: 'absolute',
    minWidth: 16,
    paddingHorizontal: 2,
    height: 16,
    top: 4,
    left: 30,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  stores_info_action_notify_value: {
    fontWeight: '600',
  },
});

export default observer(SelectionList);
