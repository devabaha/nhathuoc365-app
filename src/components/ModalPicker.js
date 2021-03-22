import React, {PureComponent} from 'react';
import {
  TouchableOpacity,
  TouchableHighlight,
  View,
  Text,
  Easing,
  StyleSheet,
  Platform,
  Picker,
  ScrollView,
} from 'react-native';
import Modal from 'react-native-modalbox';
import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import EventTracker from '../helper/EventTracker';

class ModalPicker extends PureComponent {
  static defaultProps = {
    cancelTitle: 'Hủy',
    selectTitle: 'Chọn',
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

  onHeaderLayout = (e) => {
    this.setState({headerHeight: e.nativeEvent.layout.height});
  };

  renderPicker() {
    switch (Platform.OS) {
      case 'ios':
        return (
          <View>
            <LinearGradient
              style={styles.pickerMask}
              colors={['rgba(255,255,255,1)', 'rgba(255,255,255,0)']}
              locations={[0.3, 1]}
            />
            <Picker
              selectedValue={this.state.selectedValue}
              style={styles.picker}
              itemStyle={styles.languagePickerItem}
              onValueChange={this.onValueChange}>
              {this.renderLanguages()}
            </Picker>
          </View>
        );
      case 'android':
        return (
          <ScrollView
            style={styles.picker}
            scrollEventThrottle={16}
            contentContainerStyle={styles.androidPicker}>
            {this.props.data.map((item, index) =>
              this.renderAndroidData({item, index}),
            )}
          </ScrollView>
        );
      default:
        return null;
    }
  }

  renderAndroidData({item, index}) {
    const isSelected = item.value === this.state.selectedValue;

    return (
      <TouchableHighlight
        onPress={() => this.onValueChange(item.value, index)}
        underlayColor={'rgba(0,0,0,.02)'}>
        <View
          style={[
            styles.androidDataRow,
            isSelected && styles.androidDataRowSelected,
          ]}>
          <Text
            style={[
              styles.androidDataText,
              isSelected && styles.androidDataTextSelected,
            ]}>
            {item.label}
          </Text>
          {/* {isSelected && <Icon name="check" style={styles.checkIcon} />} */}
        </View>
      </TouchableHighlight>
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

  render() {
    const confirmDisabled =
      this.props.selectedValue !== undefined &&
      this.state.selectedValue === this.props.selectedValue;
    return (
      <Modal
        ref={this.refModal}
        isOpen
        position="bottom"
        onClosed={this.onClosed}
        animationDuration={200}
        useNativeDriver
        swipeToClose={this.props.swipeToClose}
        style={[styles.modal]}
        easing={Easing.bezier(0.54, 0.96, 0.74, 1.01)}>
        <View
          onLayout={this.onHeaderLayout}
          style={styles.languagePickerHeaderContainer}>
          <View style={styles.languagePickerHeader}>
            <TouchableOpacity
              hitSlop={HIT_SLOP}
              onPress={this.onCancelPress}
              style={styles.languagePickerCancel}>
              <Text style={styles.languagePickerCancelText}>
                {this.props.cancelTitle}
              </Text>
            </TouchableOpacity>

            <Text style={styles.languagePickerTitle}>{this.props.title}</Text>

            <TouchableOpacity
              hitSlop={HIT_SLOP}
              onPress={this.onSelectPress}
              style={styles.languagePickerSelect}
              disabled={confirmDisabled}>
              <Text
                style={[
                  styles.languagePickerSelectText,
                  confirmDisabled && styles.languagePickerSelectTextDisabled,
                ]}>
                {this.props.selectTitle}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.languagePickerSubTitle}>
            {this.props.selectedLabel}
          </Text>
        </View>
        {this.renderPicker()}
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    overflow: 'hidden',
    height: undefined,
  },
  languagePickerHeaderContainer: {
    zIndex: 1,
    width: '100%',
    paddingVertical: 10,
    backgroundColor: '#fafafa',
    borderBottomColor: '#eee',
    borderBottomWidth: 0.8,
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
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
  languagePickerTitle: {
    color: '#2a2a2a',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 24,
    alignSelf: 'center',
  },
  languagePickerSubTitle: {
    letterSpacing: 1.15,
    color: '#999',
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
    fontSize: 16,
    color: DEFAULT_COLOR,
    fontWeight: 'bold',
  },
  languagePickerSelectTextDisabled: {
    color: '#bababa',
  },
  languagePickerItem: {
    color: '#333',
  },
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
  androidDataRowSelected: {
    backgroundColor: '#f5f5f5',
  },
  androidDataText: {
    fontSize: 18,
    textAlign: 'center',
  },
  androidDataTextSelected: {
    fontWeight: 'bold',
    color: '#333',
  },
  checkIcon: {
    fontSize: 22,
    color: DEFAULT_COLOR,
  },
});

export default ModalPicker;
