import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
// configs
import store from 'app-store';
import appConfig from 'app-config';
// helpers
import {mergeStyles} from 'src/Themes/helper';
import {getTheme} from 'src/Themes/Theme.context';
// routing
import {push} from 'app-helper/routing';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {BundleIconSetName, TypographyType} from 'src/components/base';
// custom components
import {BaseButton, Icon, Container, Typography} from 'src/components/base';

class RightButtonChat extends Component {
  static contextType = ThemeContext;

  static defaultProps = {};

  onPress() {
    push(
      appConfig.routes.amazingChat,
      {
        titleStyle: {width: 220},
        phoneNumber: store.store_data.tel,
        title: store.store_data.name,
        site_id: this.props.store_id || store.store_id,
        user_id: store.user_info.id,
      },
      this.theme,
    );
  }

  get theme() {
    return getTheme(this);
  }

  get storesInfoActionNotifyStyle() {
    return mergeStyles(styles.stores_info_action_notify, {
      backgroundColor: this.theme.color.danger,
    });
  }

  get iconChatStyle() {
    return mergeStyles(styles.iconChat, {
      color: this.theme.color.onPrimary,
    });
  }

  render() {
    var store_id = this.props.store_id || store.store_id;
    var count_chat = parseInt(store.notify_chat[store_id]);

    return (
      <BaseButton onPress={this.onPress.bind(this)}>
        <View style={styles.right_btn_add_store}>
          <Icon
            bundle={BundleIconSetName.FONT_AWESOME}
            name="comments"
            style={this.iconChatStyle}
          />
          {count_chat > 0 && (
            <Container style={this.storesInfoActionNotifyStyle}>
              <Typography
                type={TypographyType.LABEL_TINY}
                onPrimary
                style={styles.stores_info_action_notify_value}>
                {count_chat}
              </Typography>
            </Container>
          )}
        </View>
      </BaseButton>
    );
  }
}

const styles = StyleSheet.create({
  right_btn_add_store: {
    paddingHorizontal: 15,
  },
  right_btn_box: {
    flexDirection: 'row',
  },
  stores_info_action_notify: {
    position: 'absolute',
    minWidth: 16,
    height: 16,
    top: isAndroid ? 0 : -4,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 8,
    paddingHorizontal: 2,
  },
  stores_info_action_notify_value: {
    fontSize: 10,
    fontWeight: '600',
  },
  iconChat: {
    fontSize: 26,
  },
});

export default observer(RightButtonChat);
