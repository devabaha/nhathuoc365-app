import React, { PureComponent } from 'react';
import {
  FlatList,
  View,
  StyleSheet,
  TouchableHighlight,
  Text,
  TouchableOpacity
} from 'react-native';
import { default as ModalBox } from 'react-native-modalbox';
import Icon from 'react-native-vector-icons/FontAwesome';

class Modal extends PureComponent {
  state = {};
  ref_modal = React.createRef();

  onClose = () => {
    if (this.ref_modal.current) {
      this.ref_modal.current.close();
    }
  };

  renderItem({ item }) {
    return (
      <TouchableHighlight
        underlayColor="rgba(0,0,0,.1)"
        onPress={() => this.props.onPressItem(item)}
        style={styles.container}
      >
        <View style={styles.itemContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    return (
      <ModalBox
        entry="bottom"
        position="bottom"
        style={[styles.modal]}
        backButtonClose
        ref={this.ref_modal}
        isOpen
        onClosed={this.props.onCloseModal}
        useNativeDriver
      >
        <View style={styles.headingContainer}>
          <TouchableOpacity onPress={this.onClose} style={styles.iconContainer}>
            <Icon name="close" style={styles.icon} />
          </TouchableOpacity>
          <Text style={styles.heading}>{this.props.heading}</Text>
        </View>
        <FlatList
          data={this.props.data}
          renderItem={this.renderItem.bind(this)}
          keyExtractor={(item, index) => index.toString()}
        />
      </ModalBox>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  modal: {
    height: '80%',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15
  },
  iconContainer: {
    position: 'absolute',
    zIndex: 1,
    width: 30,
    height: 30,
    left: 15,
    top: 15
  },
  icon: {
    fontSize: 22,
    color: '#666'
  },
  headingContainer: {
    padding: 30,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderBottomColor: '#ccc'
  },
  heading: {
    fontSize: 30,
    fontWeight: '800',
    color: '#555',
    letterSpacing: 1.6,
    textAlign: 'right'
  },
  itemContainer: {
    width: '100%',
    padding: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee'
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
    letterSpacing: 1.15
  },
  description: {
    fontSize: 13,
    color: '#666',
    marginTop: 2
  }
});

export default Modal;
