import React, {PureComponent} from 'react';
import {View, StyleSheet, Image} from 'react-native';
// 3-party libs
import {default as ModalBox} from 'react-native-modalbox';
// configs
import {mergeStyles} from 'src/Themes/helper';
import {getTheme} from 'src/Themes/Theme.context';
// helpers
import EventTracker from 'app-helper/EventTracker';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {BundleIconSetName, TypographyType} from 'src/components/base';
// custom components
import {
  Icon,
  FlatList,
  Container,
  Typography,
  BaseButton,
} from 'src/components/base';

class Modal extends PureComponent {
  static contextType = ThemeContext;
  static defaultProps = {
    entry: 'bottom',
    position: 'bottom',
    footerComponent: () => {},
    ref_modal: () => {},
  };
  state = {};
  ref_modal = null;
  eventTracker = new EventTracker();

  get theme() {
    return getTheme(this);
  }

  componentDidMount() {
    this.eventTracker.logCurrentView();
  }

  componentWillUnmount() {
    this.eventTracker.clearTracking();
  }

  onClose = () => {
    if (this.ref_modal) {
      this.ref_modal.close();
    }
  };

  renderItem({item}) {
    if (!item) return;
    const isSelected =
      this.props.selectedItem && item.id === this.props.selectedItem.id;
    const extraStyle = isSelected && {
      backgroundColor: this.theme.color.underlay,
    };

    const contentContainerStyle = mergeStyles(
      [
        styles.itemContainer,
        {
          borderBottomColor: this.theme.color.border,
          borderBottomWidth: this.theme.layout.borderWidthSmall,
        },
      ],
      extraStyle,
    );

    const descriptionStyle = mergeStyles(
      styles.description,
      this.theme.typography[TypographyType.DESCRIPTION_SEMI_MEDIUM],
    );

    const selectedIconStyle = mergeStyles(styles.selectedIcon, {
      color: this.theme.color.primaryHighlight,
    });

    return (
      <Container>
        <BaseButton
          useTouchableHighlight
          underlayColor={this.theme.color.underlay}
          onPress={() => this.props.onPressItem(item, this.onClose)}
          style={styles.container}>
          <View style={contentContainerStyle}>
            {!!item.image && (
              <View style={styles.itemImageContainer}>
                <Image
                  style={[styles.itemImage, this.imageStyle]}
                  source={{uri: item.image}}
                />
              </View>
            )}
            <View style={styles.itemInfoContainer}>
              <Typography
                type={TypographyType.TITLE_MEDIUM}
                style={[styles.title, this.props.labelStyle]}>
                {item.title}
              </Typography>
              {!!item.renderDescription
                ? item.renderDescription(descriptionStyle)
                : !!item.description && (
                    <Typography
                      type={TypographyType.DESCRIPTION_MEDIUM}
                      style={descriptionStyle}>
                      {item.description}
                    </Typography>
                  )}
            </View>

            {isSelected && (
              <Icon
                bundle={BundleIconSetName.FONT_AWESOME}
                name="dot-circle-o"
                style={selectedIconStyle}
              />
            )}
          </View>
        </BaseButton>
      </Container>
    );
  }

  get modalStyle() {
    return {
      borderTopLeftRadius: this.theme.layout.borderRadiusHuge,
      borderTopRightRadius: this.theme.layout.borderRadiusHuge,
    };
  }

  get imageStyle() {
    return {
      borderRadius: this.theme.layout.borderRadiusMedium,
    };
  }

  render() {
    const headingStyle = mergeStyles(
      [
        styles.headingContainer,
        {
          borderBottomColor: this.theme.color.border,
          borderBottomWidth: this.theme.layout.borderWidth,
        },
      ],
      this.props.headingContainerStyle,
    );

    const iconStyle = mergeStyles(styles.icon, {
      color: this.theme.color.iconInactive,
    });

    return (
      <ModalBox
        entry={this.props.entry}
        position={this.props.position}
        style={[styles.modal, this.modalStyle, this.props.modalStyle]}
        backButtonClose
        ref={(inst) => {
          this.props.ref_modal(inst);
          this.ref_modal = inst;
        }}
        isOpen
        onClosed={this.props.onCloseModal}
        useNativeDriver>
        <Container>
          <View style={headingStyle}>
            <BaseButton onPress={this.onClose} style={styles.iconContainer}>
              <Icon
                bundle={BundleIconSetName.FONT_AWESOME}
                name="close"
                style={iconStyle}
              />
            </BaseButton>
            <Typography
              type={TypographyType.DISPLAY_SMALL}
              style={styles.heading}>
              {this.props.heading}
            </Typography>
          </View>
          <FlatList
            safeLayout
            data={this.props.data}
            renderItem={this.renderItem.bind(this)}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={this.props.ListEmptyComponent}
            {...this.props.listProps}
          />
          {this.props.footerComponent()}
        </Container>
      </ModalBox>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modal: {
    height: '80%',
    overflow: 'hidden',
  },
  iconContainer: {
    position: 'absolute',
    zIndex: 1,
    width: 30,
    height: 30,
    left: 15,
    top: 15,
  },
  icon: {
    fontSize: 22,
  },
  headingContainer: {
    padding: 30,
    borderStyle: 'solid',
  },
  heading: {
    fontWeight: 'bold',
    letterSpacing: 1.6,
    textAlign: 'right',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: 15,
  },
  selectedItemContainer: {},
  itemImageContainer: {
    width: 55,
    height: 55,
    overflow: 'hidden',
    marginRight: 15,
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemInfoContainer: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    letterSpacing: 1.15,
  },
  description: {
    marginTop: 2,
  },
  selectedIcon: {
    fontSize: 20,
    marginLeft: 15,
  },
});

export default Modal;
