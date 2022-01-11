import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
// helpers
import {mergeStyles} from 'src/Themes/helper';
import {getTheme} from 'src/Themes/Theme.context';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {TypographyType, BundleIconSetName} from 'src/components/base';
// custom components
import {NotiBadge} from 'src/components/Badges';
import RequestTagTitle from './RequestTagTitle';
import {
  BaseButton,
  Container,
  Typography,
  Icon,
} from 'src/components/base';

class Request extends Component {
  static contextType = ThemeContext;

  state = {};

  get theme() {
    return getTheme(this);
  }

  renderIconClock = (titleStyle) => {
    return (
      <Icon
        bundle={BundleIconSetName.FONT_AWESOME_5}
        name="clock"
        style={[titleStyle, styles.iconClock]}
      />
    );
  };

  renderIconAdmin = (titleStyle) => {
    return (
      <Icon
        bundle={BundleIconSetName.FONT_AWESOME_5}
        name="user-tie"
        style={[titleStyle, styles.admin, styles.adminIcon]}
      />
    );
  };

  get typeContainerStyle() {
    return mergeStyles(styles.typeContainer, {
      backgroundColor: this.theme.color.primaryHighlight,
    });
  }

  get typeStyle() {
    return mergeStyles(styles.type, {
      color: this.theme.color.onPrimaryHighlight,
    });
  }

  get statusContainerStyle() {
    return mergeStyles(styles.statusContainer, {
      borderRadius: this.theme.layout.borderRadiusExtraSmall,
    });
  }

  get adminContainerStyle() {
    return mergeStyles(styles.adminContainer, {
      borderWidth: this.theme.layout.borderWidth,
      borderColor: this.theme.color.border,
    });
  }

  get subTitleContainerStyle() {
    return {
      borderTopWidth: this.theme.layout.borderWidthSmall,
      borderColor: this.theme.color.border,
    };
  }

  get containerBtnStyle() {
    return {
      backgroundColor: this.theme.color.surface,
      borderRadius: this.theme.layout.borderRadiusMedium,
      shadowColor: this.theme.color.shadow,
      ...this.theme.layout.shadow,
    };
  }

  render() {
    const statusStyle = {
      color: this.props.textColor || this.theme.color.white,
    };
    const notiMess = this.props.noti ? normalizeNotify(this.props.noti) : '';

    return (
      <BaseButton
        onPress={this.props.onPress}
        style={[
          styles.containerBtn,
          this.containerBtnStyle,
          this.props.wrapperStyle,
        ]}>
        <View style={[styles.contentContainer, this.props.containerStyle]}>
          <View style={styles.block}>
            <View style={this.typeContainerStyle}>
              <Typography
                type={TypographyType.LABEL_SEMI_MEDIUM}
                numberOfLines={1}
                style={this.typeStyle}>
                {this.props.type}
              </Typography>
            </View>

            <RequestTagTitle
              containerStyle={styles.tagContainer}
              code={this.props.tagCode}
              name={this.props.tagName}
            />

            {!!this.props.tagTitle && (
              <Typography
                type={TypographyType.LABEL_MEDIUM}
                numberOfLines={1}
                style={styles.tagTitle}>
                {this.props.tagTitle}
              </Typography>
            )}
            {!!this.props.title && (
              <Typography
                type={TypographyType.LABEL_SEMI_HUGE}
                numberOfLines={2}
                style={styles.title}>
                {this.props.title}
              </Typography>
            )}

            {!!this.props.description && (
              <Container noBackground row>
                <Typography
                  type={TypographyType.DESCRIPTION_SMALL_TERTIARY}
                  style={styles.description}
                  renderIconBefore={this.renderIconClock}>
                  {this.props.description}
                </Typography>
              </Container>
            )}

            <NotiBadge
              label={notiMess}
              containerStyle={styles.notiMessContainer}
              labelStyle={styles.notiMess}
              show={!!notiMess && notiMess !== '0'}
              animation
            />
          </View>

          <Container
            noBackground
            row
            style={[styles.block, styles.statusWrapper]}>
            {!!this.props.adminName && (
              <View
                style={[this.statusContainerStyle, this.adminContainerStyle]}>
                <Typography
                  type={TypographyType.LABEL_SMALL}
                  style={[styles.status, styles.admin]}
                  renderIconBefore={this.renderIconAdmin}>
                  {this.props.adminName}
                </Typography>
              </View>
            )}
            {!!this.props.status && (
              <View
                style={[
                  this.statusContainerStyle,
                  {backgroundColor: this.props.bgColor || 'transparent'},
                ]}>
                <Typography
                  type={TypographyType.LABEL_SMALL}
                  style={[styles.status, statusStyle]}>
                  {this.props.status}
                </Typography>
              </View>
            )}
          </Container>

          {!!this.props.subTitle && (
            <View
              style={[styles.subTitleContainer, this.subTitleContainerStyle]}>
              <Typography
                type={TypographyType.LABEL_MEDIUM}
                numberOfLines={2}
                style={styles.subTitle}>
                {this.props.subTitle}
              </Typography>
            </View>
          )}
        </View>
      </BaseButton>
    );
  }
}

const styles = StyleSheet.create({
  containerBtn: {
    marginLeft: 15,
    marginVertical: 5,
    width: 280,
    backgroundColor: '#fff',
    elevation: 5,
  },
  tagContainer: {
    marginBottom: 10,
  },
  title: {
    fontWeight: 'bold',
    flex: 1,
  },
  subTitleContainer: {
    paddingTop: 15,
  },
  subTitle: {},
  description: {
    marginTop: 7,
  },
  statusWrapper: {
    flexWrap: 'wrap',
    marginTop: -5,
  },
  statusContainer: {
    marginTop: 5,
    marginRight: 5,
    padding: 5,
    paddingHorizontal: 7,
  },
  adminContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  admin: {alignSelf: 'flex-start'},
  status: {},
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
    alignSelf: 'center',
  },

  typeContainer: {
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
    fontWeight: '700',
  },
  iconClock: {
    marginRight: 5,
  },
});

export default Request;
