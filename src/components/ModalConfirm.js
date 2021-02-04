import React, {useEffect} from 'react';
import PopupConfirm from './PopupConfirm';
import {Actions} from 'react-native-router-flux';

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

  return (
    <PopupConfirm
      ref_popup={handleRef}
      title={message}
      otherClose={otherClose}
      type={type}
      isConfirm={isConfirm}
      yesTitle={yesTitle}
      titleStyle={titleStyle}
      noConfirm={handleNoConfirm}
      yesConfirm={handleYesConfirm}
      onClosed={handleClosed}
      {...props}
    />
  );
};

export default ModalConfirm;
