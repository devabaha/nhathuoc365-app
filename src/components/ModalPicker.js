import React, {PureComponent} from 'react';
import {View, Easing, StyleSheet, Platform} from 'react-native';
// 3-party libs
import Modal from 'react-native-modalbox';
import {Actions} from 'react-native-router-flux';
import LinearGradient from 'react-native-linear-gradient';
import {Picker} from '@react-native-picker/picker';
// helpers
import EventTracker from 'app-helper/EventTracker';
import {mergeStyles} from 'src/Themes/helper';
import {hexToRgba} from 'app-helper';
// context
import {getTheme, ThemeContext} from 'src/Themes/Theme.context';
// constants
import {TypographyType} from 'src/components/base';
// custom components
import {
  Container,
  Typography,
  ScrollView,
  TextButton,
} from 'src/components/base';

class ModalPicker extends PureComponent {
  static contextType = ThemeContext;
  static defaultProps = {
    onClose: () => {},
    swipeToClose: false,
  };

  state = {
    selectedValue:
      this.props.selectedValue !== undefined
        ? this.props.selectedValue
        : this.props.defaultValue || this.props.data[0]?.value,
    headerHeight: 0,
  };
  refModal = React.createRef();
  eventTracker = new EventTracker();

  componentDidMount() {
    this.eventTracker.logCurrentView();
  }

  componentWillUnmount() {
    this.eventTracker.clearTracking();
  }

  get theme() {
    return getTheme(this);
  }

  onHeaderLayout = (e) => {
    this.setState({headerHeight: e.nativeEvent.layout.height});
  };

  renderPicker() {
    const languagePickerItemStyle = mergeStyles(styles.languagePickerItem, {
      color: this.theme.color.textPrimary,
    });

    switch (Platform.OS) {
      case 'ios':
        return (
          <Container>
            <LinearGradient
              style={styles.pickerMask}
              colors={[
                this.theme.color.surface,
                hexToRgba(this.theme.color.surface, 0),
              ]}
              locations={[0.3, 1]}
            />
            <Picker
              selectedValue={this.state.selectedValue}
              style={styles.picker}
              itemStyle={languagePickerItemStyle}
              onValueChange={this.onValueChange}>
              {this.renderLanguages()}
            </Picker>
          </Container>
        );
      case 'android':
        return (
          <Container>
            <ScrollView
              safeLayout
              style={styles.picker}
              scrollEventThrottle={16}>
              <Container style={styles.androidPicker}>
                {this.props.data.map((item, index) =>
                  this.renderAndroidData({item, index}),
                )}
              </Container>
            </ScrollView>
          </Container>
        );
      default:
        return null;
    }
  }

  renderAndroidData({item, index}) {
    const isSelected = item.value === this.state.selectedValue;

    const androidDataRowSelected = mergeStyles(styles.androidDataRowSelected, {
      backgroundColor: this.theme.color.underlay,
    });
    const androidDataTextUnselectedStyle = {
      color: this.theme.color.textSecondary,
    };

    return (
      <TextButton
        key={index}
        useTouchableHighlight
        onPress={() => this.onValueChange(item.value, index)}
        style={[styles.androidDataRow, isSelected && androidDataRowSelected]}
        typoProps={{
          type: TypographyType.TITLE_SEMI_LARGE,
        }}
        titleStyle={[
          styles.androidDataTextSelected,
          styles.androidDataText,
          !isSelected && androidDataTextUnselectedStyle,
        ]}>
        {item.label}
      </TextButton>
    );
  }

  renderLanguages() {
    return this.props.data.map((lang, index) => (
      <Picker.Item key={index} label={lang.label} value={lang.value} />
    ));
  }

  onValueChange = (itemValue, indexValue) => {
    this.setState({selectedValue: itemValue});
  };

  onCancelPress = () => {
    if (this.refModal.current) {
      this.refModal.current.close();
    } else {
      Actions.pop();
    }
  };

  onClosed = () => {
    Actions.pop();
  };

  onSelectPress = () => {
    this.props.onSelect(this.state.selectedValue);
    this.onCancelPress();
  };

  cancelTypoProps = {
    type: TypographyType.TITLE_MEDIUM,
  };

  languagePickerHeaderContainerStyle = mergeStyles(
    styles.languagePickerHeaderContainer,
    {
      borderBottomColor: this.theme.color.border,
      borderBottomWidth: this.theme.layout.borderWidth,
    },
  );

  selectTypoProps = {
    type: TypographyType.TITLE_MEDIUM_PRIMARY,
  };

  modalStyle = mergeStyles(styles.modal, {
    borderTopLeftRadius: this.theme.layout.borderRadiusHuge,
    borderTopRightRadius: this.theme.layout.borderRadiusHuge,
  });

  render() {
    const confirmDisabled =
      this.props.selectedValue !== undefined &&
      this.state.selectedValue === this.props.selectedValue;

    const cancelTitle = this.props.cancelTitle || this.props.t('cancel');
    const selectTitle = this.props.selectTitle || this.props.t('select');

    return (
      <Modal
        ref={this.refModal}
        isOpen
        position="bottom"
        onClosed={this.onClosed}
        animationDuration={200}
        useNativeDriver
        swipeToClose={this.props.swipeToClose}
        style={this.modalStyle}
        easing={Easing.bezier(0.54, 0.96, 0.74, 1.01)}>
        <Container
          onLayout={this.onHeaderLayout}
          style={this.languagePickerHeaderContainerStyle}>
          <View style={styles.languagePickerHeader}>
            <TextButton
              hitSlop={HIT_SLOP}
              onPress={this.onCancelPress}
              style={styles.languagePickerCancel}
              title={cancelTitle}
              titleStyle={styles.languagePickerCancelText}
              typoProps={this.cancelTypoProps}
            />

            <Typography
              type={TypographyType.TITLE_LARGE}
              style={styles.languagePickerTitle}>
              {this.props.title}
            </Typography>

            <TextButton
              hitSlop={HIT_SLOP}
              onPress={this.onSelectPress}
              style={styles.languagePickerSelect}
              disabled={confirmDisabled}
              title={selectTitle}
              titleStyle={styles.languagePickerSelectText}
              typoProps={this.selectTypoProps}
            />
          </View>
          <Typography
            type={TypographyType.DESCRIPTION_MEDIUM}
            style={styles.languagePickerSubTitle}>
            {this.props.selectedLabel}
          </Typography>
        </Container>
        {this.renderPicker()}
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    overflow: 'hidden',
    height: undefined,
  },
  languagePickerHeaderContainer: {
    zIndex: 1,
    width: '100%',
    paddingVertical: 10,
  },
  languagePickerHeader: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  languagePickerCancel: {
    position: 'absolute',
    left: 15,
  },
  languagePickerCancelText: {
    fontWeight: 'bold',
  },
  languagePickerTitle: {
    fontWeight: '600',
    textAlign: 'center',
    alignSelf: 'center',
  },
  languagePickerSubTitle: {
    letterSpacing: 1.15,
    alignSelf: 'center',
    marginTop: Platform.select({
      ios: 5,
      android: 2,
    }),
  },
  languagePickerSelect: {
    position: 'absolute',
    right: 15,
  },
  languagePickerSelectText: {
    fontWeight: 'bold',
  },
  languagePickerSelectTextDisabled: {},
  languagePickerItem: {},
  pickerMask: {
    zIndex: 1,
    height: 30,
    width: '100%',
    position: 'absolute',
  },
  picker: {
    width: '100%',
    ...Platform.select({
      ios: {
        paddingVertical: 0,
      },
      android: {
        maxHeight: 220,
      },
    }),
  },
  androidPicker: {
    flexGrow: 1,
    paddingVertical: 15,
  },
  androidDataRow: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  androidDataRowSelected: {},
  androidDataText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  androidDataTextSelected: {
    fontWeight: 'bold',
  },
  checkIcon: {
    fontSize: 22,
  },
});

export default withTranslation()(ModalPicker);
