import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {TypographyType} from 'src/components/base';
// custom components
import {Typography, Container, BaseButton} from 'src/components/base';
import Image from 'src/components/Image';
import {NotiBadge} from '../Badges';

class ChatRow extends Component {
  static contextType = ThemeContext;

  state = {};

  get theme() {
    return getTheme(this);
  }

  onPressChatRow() {
    this.props.onPress();
  }

  get separatorStyle() {
    return {
      borderColor: this.theme.color.border,
      borderBottomWidth: this.theme.layout.borderWidthSmall,
    };
  }

  render() {
    const textProps = {
      numberOfLines: 1,
    };

    return (
      <Container
        style={[
          styles.wrapper,
          !this.props.subTitle && styles.onlyTitleWrapper,
        ]}>
        <BaseButton
          useTouchableHighlight
          onPress={this.onPressChatRow.bind(this)}
          style={styles.container}>
          <Container flex noBackground row>
            <View style={styles.left}>
              <Image style={styles.img} source={{uri: this.props.img}} />
            </View>
            <View
              style={[
                styles.content,
                this.props.isSeparate && this.separatorStyle,
              ]}>
              <View style={[styles.row, styles.additionForRow]}>
                <Typography
                  type={TypographyType.LABEL_LARGE}
                  style={[
                    styles.title,
                    this.props.isUnread && styles.unreadText,
                    !this.props.subTitle && styles.onlyTitle,
                  ]}
                  {...textProps}>
                  {this.props.title}
                </Typography>
                <Typography
                  type={TypographyType.DESCRIPTION_SMALL}
                  style={[
                    styles.recentOnlineTime,
                    this.props.isUnread && styles.unreadText,
                  ]}>
                  {this.props.timeAgo}
                </Typography>
              </View>

              {!!this.props.subTitle && (
                <View
                  style={[styles.row, styles.additionForRow, {marginTop: 8}]}>
                  <View style={[styles.subTitleContainer]}>
                    <Typography
                      type={TypographyType.DESCRIPTION_MEDIUM_TERTIARY}
                      style={[this.props.isUnread && styles.unreadText]}
                      {...textProps}>
                      {this.props.subTitle}
                    </Typography>
                  </View>
                  <NotiBadge
                    show={!!this.props.unreadChat}
                    alert
                    animation
                    wrapperStyle={styles.badgeWrapper}
                    containerStyle={styles.badgeContainer}
                    label={this.props.unreadChat}
                  />
                </View>
              )}
            </View>
          </Container>
        </BaseButton>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  additionForRow: {
    justifyContent: 'space-between',
  },
  col: {
    flexDirection: 'column',
  },
  unreadText: {
    fontWeight: '600',
  },
  onlyTitleWrapper: {
    height: 80,
  },
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 90,
    width: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    height: '100%',
    padding: 15,
    paddingLeft: 0,
  },
  separator: {},
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
  },
  left: {
    flex: 0.25,
    maxWidth: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: {
    width: 50,
    height: 50,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  title: {
    flex: 0.9,
    maxWidth: 500,
    fontWeight: '500',
  },
  onlyTitle: {
    paddingLeft: 15,
  },
  subTitleContainer: {
    justifyContent: 'center',
    flex: 1,
  },
  subTitle: {},
  badgeWrapper: {
    maxWidth: 30,
    marginLeft: 15,
    justifyContent: 'center',
    alignItems: 'center',
    position: undefined,
  },
  badgeContainer: {
    top: 0,
  },
  recentOnlineTime: {
    justifyContent: 'center',
    alignSelf: 'center',
  },
});

export default ChatRow;
