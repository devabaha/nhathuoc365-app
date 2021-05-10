import React, {useCallback, useRef} from 'react';
import {StatusBar, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {default as ModalBox} from 'react-native-modalbox';
import { Actions } from 'react-native-router-flux';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';

import Container from 'src/components/Layout/Container';

import appConfig from 'app-config';

import Comment from '../Comment';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modal: {
    // height: '95%',
    // borderTopLeftRadius: 15,
    // borderTopRightRadius: 15,
    overflow: 'hidden'
  },
  header: {
    borderBottomWidth: .5,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    zIndex: 1
  },
  title: {
    position: 'absolute',
    textAlign: 'center',
    width: '100%',
    fontWeight: '600',
    fontSize: 18
  },
  iconContainer: {
    padding: 15
  },
  icon: {
    // marginLeft: 15,
    fontSize: 28,
    color: '#333'
  },
});

const ModalComment = ({title, modalStyle}) => {
  const refModal = useRef();

  const handleCloseModal = useCallback(() => {
    if (refModal.current) {
      refModal.current.close();
    }
  }, []);

  const onClosedModal = () => {
    Actions.pop();
  };

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
      <Comment />
    // </ModalBox>
  );
};

export default ModalComment;
