import React, {
  Component,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {default as ModalBox} from 'react-native-modalbox';
import {Actions} from 'react-native-router-flux';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import Container from 'src/components/Layout/Container';

import appConfig from 'app-config';

import Comment from '../Comment';
import store from 'app-store';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modal: {
    // height: '95%',
    // borderTopLeftRadius: 15,
    // borderTopRightRadius: 15,
    overflow: 'hidden',
  },
  header: {
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    zIndex: 1,
  },
  title: {
    position: 'absolute',
    textAlign: 'center',
    width: '100%',
    fontWeight: '600',
    fontSize: 18,
  },
  iconContainer: {
    padding: 15,
  },
  icon: {
    // marginLeft: 15,
    fontSize: 28,
    color: '#333',
  },

  reloadContainer: {
    padding: 8, 
    marginHorizontal: 4
  },
  reloadIcon: {
    fontSize: 24,
    color: appConfig.colors.primary
  }
});

class ModalComment extends Component {
  refModal = React.createRef();
  refComment = React.createRef();

  componentDidMount() {
    setTimeout(() =>
      Actions.refresh({
        right: () => (
          <TouchableOpacity
            onPress={this.handleReload}
            hitSlop={HIT_SLOP}
            style={styles.reloadContainer}>
            <MaterialCommunityIcon
              style={styles.reloadIcon}
              name="lightning-bolt"
            />
          </TouchableOpacity>
        ),
      }),
    );
  }

  handleReload = () => {
    if (this.refComment.current) {
      this.refComment.current._getMessages();
    }
  };

  handleCloseModal = () => {
    if (this.refModal.current) {
      this.refModal.current.close();
    }
  };

  onClosedModal = () => {
    Actions.pop();
  };

  render() {
    return (
      // <ModalBox
      //   entry="bottom"
      //   position="bottom"
      //   style={[styles.modal, modalStyle]}
      //   backButtonClose
      //   ref={refModal}
      //   isOpen
      //   onClosed={onClosedModal}
      //   useNativeDriver>
      //   <Container row style={styles.header}>
      //     <Text style={styles.title}>{title}</Text>
      //     <TouchableOpacity style={styles.iconContainer} onPress={handleCloseModal}>
      //       <AntDesignIcon name="close" style={styles.icon} />
      //     </TouchableOpacity>
      //   </Container>
      <Comment
        ref={this.refComment}
        site_id={this.props.site_id}
        object={this.props.object}
        object_id={this.props.object_id}
      />
      // </ModalBox>
    );
  }
}

export default ModalComment;
