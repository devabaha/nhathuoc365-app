import React, {useEffect} from 'react';
import PopupConfirm from './PopupConfirm';
import {Actions} from 'react-native-router-flux';
import Modal from './account/Transfer/Payment/Modal';

const ModalConfirm = ({
  type,
  yesTitle,
  noTitle,
  titleStyle,
  yesConfirm = () => {},
  noConfirm = () => {},
  refModal = () => {},
  onClosed = () => {},
  message = '',
  otherClose = false,
  isConfirm = false,

  momo, // use MOMO styled modal.

  title,
  content,
  contentStyle,
  ...props
}) => {
  let _refModal = null;

  useEffect(() => {
    if (_refModal) {
      _refModal.open();
    }
  }, []);

  const handleBack = () => {
    if (_refModal) {
      _refModal.close();
    } else {
      Actions.pop();
    }
  };

  const handleRef = (ref) => {
    _refModal = ref;
    refModal(ref);
  };

  const handleClosed = () => {
    onClosed();
    Actions.pop();
  };

  const handleNoConfirm = () => {
    handleBack();
    noConfirm();
  };

  const handleYesConfirm = () => {
    handleBack();
    yesConfirm();
  };

  return momo ? (
    <Modal
      visible
      titleStyle={titleStyle}
      contentStyle={contentStyle}
      title={title}
      content={content}
      okText={yesTitle}
      cancelText={noTitle}
      onRequestClose={handleClosed}
      onCancel={handleNoConfirm}
      onOk={handleYesConfirm}
      otherClose={otherClose}
      {...props}
    />
  ) : (
    <PopupConfirm
      ref_popup={handleRef}
      title={message}
      otherClose={otherClose}
      type={type}
      isConfirm={isConfirm}
      yesTitle={yesTitle}
      noTitle={noTitle}
      titleStyle={titleStyle}
      noConfirm={handleNoConfirm}
      yesConfirm={handleYesConfirm}
      onClosed={handleClosed}
      {...props}
    />
  );
};

export default ModalConfirm;
