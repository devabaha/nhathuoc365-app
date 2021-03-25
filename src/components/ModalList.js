import React, {PureComponent} from 'react';
import {
  FlatList,
  View,
  StyleSheet,
  TouchableHighlight,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import {default as ModalBox} from 'react-native-modalbox';
import Icon from 'react-native-vector-icons/FontAwesome';
import EventTracker from '../helper/EventTracker';
import appConfig from 'app-config';

class Modal extends PureComponent {
  static defaultProps = {
    entry: 'bottom',
    position: 'bottom',
    footerComponent: () => {},
    ref_modal: () => {}
  };
  state = {};
  ref_modal = null;
  eventTracker = new EventTracker();

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
    if(!item) return;
    const isSelected =
      this.props.selectedItem && item.id === this.props.selectedItem.id;
    const extraStyle = isSelected && styles.selectedItemContainer;
    return (
      <TouchableHighlight
        underlayColor="rgba(0,0,0,.1)"
        onPress={() => this.props.onPressItem(item, this.onClose)}
        style={styles.container}>
        <View style={[styles.itemContainer, extraStyle]}>
          {!!item.image && (
            <View style={styles.itemImageContainer}>
              <Image style={styles.itemImage} source={{uri: item.image}} />
            </View>
          )}
          <View style={styles.itemInfoContainer}>
            <Text style={[styles.title, this.props.titleStyle]}>
              {item.title}
            </Text>
            {!!item.renderDescription
              ? item.renderDescription(styles.description)
              : !!item.description && (
                  <Text style={styles.description}>{item.description}</Text>
                )}
          </View>

          {isSelected && (
            <Icon name="dot-circle-o" style={styles.selectedIcon} />
          )}
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    return (
      <ModalBox
        entry={this.props.entry}
        position={this.props.position}
        style={[styles.modal, this.props.modalStyle]}
        backButtonClose
        ref={inst => {
          this.props.ref_modal(inst);
          this.ref_modal = inst;
        }}
        isOpen
        onClosed={this.props.onCloseModal}
        useNativeDriver>
        <View style={[styles.headingContainer, this.props.headingContainerStyle]}>
          <TouchableOpacity onPress={this.onClose} style={styles.iconContainer}>
            <Icon name="close" style={styles.icon} />
          </TouchableOpacity>
          <Text style={styles.heading}>{this.props.heading}</Text>
        </View>
        <FlatList
          data={this.props.data}
          renderItem={this.renderItem.bind(this)}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={this.props.ListEmptyComponent}
          {...this.props.listProps}
        />
        {this.props.footerComponent()}
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
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
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
    color: '#666',
  },
  headingContainer: {
    padding: 30,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderBottomColor: '#ccc',
  },
  heading: {
    fontSize: 30,
    fontWeight: '800',
    color: '#555',
    letterSpacing: 1.6,
    textAlign: 'right',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
  },
  selectedItemContainer: {
    backgroundColor: '#f5f5f5',
  },
  itemImageContainer: {
    width: 55,
    height: 55,
    borderRadius: 8,
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
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
    letterSpacing: 1.15,
  },
  description: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  selectedIcon: {
    fontSize: 20,
    color: appConfig.colors.primary,
    marginLeft: 15,
  },
});

export default Modal;
