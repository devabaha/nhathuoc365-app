import React, {useEffect} from 'react';
// routing
import {pop} from 'app-helper/routing';
// custom components
import PopupConfirm from './PopupConfirm';
import Modal from './account/Transfer/Payment/Modal';

const ModalConfirm = ({
  type,
  yesTitle,
  noTitle,
  headingStyle,
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

  titleStyle,
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
      pop();
    }
  };

  const handleRef = (ref) => {
    _refModal = ref;
    refModal(ref);
  };

  const handleClosed = () => {
    onClosed();
    pop();
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
      titleStyle={headingStyle}
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
      titleStyle={headingStyle}
      noConfirm={handleNoConfirm}
      yesConfirm={handleYesConfirm}
      onClosed={handleClosed}
      {...props}
    />
  );
};

export default ModalConfirm;
