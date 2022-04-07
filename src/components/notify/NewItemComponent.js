import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
// configs
import appConfig from 'app-config';
// helpers
import {mergeStyles} from 'src/Themes/helper';
import {getTheme} from 'src/Themes/Theme.context';
// routing
import {push} from 'app-helper/routing';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {TypographyType, BundleIconSetName} from 'src/components/base';
import {BaseButton, Container, Typography, Icon} from 'src/components/base';
import Image from 'src/components/Image';

export default class NewItemComponent extends Component {
  static contextType = ThemeContext;

  get theme() {
    return getTheme(this);
  }

  _goDetail(item) {
    push(
      appConfig.routes.notifyDetail,
      {
        title: item.title,
        data: item,
      },
      this.theme,
    );
  }

  renderMapIcon = (titleStyle) => {
    return (
      <Icon
        bundle={BundleIconSetName.FONT_AWESOME}
        name="map-marker"
        style={[titleStyle, styles.icon]}
      />
    );
  };

  renderClockIcon = (titleStyle) => {
    return (
      <Icon
        bundle={BundleIconSetName.FONT_AWESOME}
        name="clock-o"
        style={[titleStyle, styles.icon]}
      />
    );
  };

  get notifyItemContainerStyle() {
    return mergeStyles(styles.notify_item, {
      borderColor: this.theme.color.border,
      borderBottomWidth: this.theme.layout.borderWidthPixel,
    });
  }

  get iconStyle() {
    return mergeStyles(styles.icon, {color: this.theme.color.textTertiary});
  }

  get notifyItemImageStyle() {
    return mergeStyles(styles.notify_item_image, {
      borderRadius: this.theme.layout.borderRadiusExtraSmall,
    });
  }

  render() {
    const {item} = this.props;

    return (
      <BaseButton onPress={this._goDetail.bind(this, item)}>
        <Container style={styles.notify_item}>
          <Container noBackground style={styles.notify_item_image_box}>
            <Image
              style={this.notifyItemImageStyle}
              source={{uri: item.image_url}}
            />
          </Container>

          <View style={styles.notify_item_content}>
            <View style={styles.notify_item_content_box}>
              <Typography
                type={TypographyType.LABEL_MEDIUM}
                style={styles.notify_item_title}>
                {sub_string(item.title, 60)}
              </Typography>
              <View style={styles.notify_item_time_box}>
                <Typography
                  type={TypographyType.LABEL_TINY_TERTIARY}
                  style={styles.notify_item_time}
                  renderIconBefore={this.renderMapIcon}>
                  {' ' + item.shop_name + '    '}
                </Typography>
                <Typography
                  type={TypographyType.LABEL_TINY_TERTIARY}
                  style={styles.notify_item_time}
                  renderIconBefore={this.renderClockIcon}>
                  {' ' + item.created}
                </Typography>
              </View>
              <Typography
                type={TypographyType.LABEL_SMALL}
                style={styles.notify_item_desc}>
                {sub_string(item.short_content, 60)}
              </Typography>
            </View>
          </View>
        </Container>
      </BaseButton>
    );
  }
}

const styles = StyleSheet.create({
  notify_item: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    flexDirection: 'row',
    height: isIOS ? 116 : 124,
    marginBottom: 2,
  },
  notify_item_image_box: {
    width: 80,
    height: 80,
    marginTop: 8,
  },
  notify_item_image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  notify_item_content: {
    flex: 1,
  },
  notify_item_content_box: {
    flex: 1,
    paddingLeft: 15,
  },
  notify_item_title: {
    fontWeight: '500',
    lineHeight: isIOS ? 16 : 18,
    marginTop: 8,
  },
  notify_item_desc: {
    marginTop: 8,
    lineHeight: isIOS ? 16 : 18,
  },
  notify_item_time_box: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  notify_item_time: {},
  icon: {
    fontSize: 10,
  },
});
