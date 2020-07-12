import React, { PureComponent } from 'react';
import {
  View,
  StyleSheet,
  TouchableHighlight,
  Text,
  TextInput
} from 'react-native';
import { default as ModalBox } from 'react-native-modalbox';
import appConfig from 'app-config';
import Icon from 'react-native-vector-icons/FontAwesome';
import Button from '../../../components/Button';
import Loading from '../../../components/Loading';

class MemberModal extends PureComponent {
  state = {
    text: '',
    addUserLoading: false
  };
  ref_modal = React.createRef();

  handleChangeText = text => {
    this.setState({ text: text.trim() });
  };

  searchMember = async () => {
    this.setState({ addUserLoading: true });

    const tel = this.state.text;
    const { t } = this.props;
    const data = { tel };
    this.loadingStoppable = true;
    try {
      const response = await APIHandler.site_search_user_room_by_phone(
        this.props.siteId,
        this.props.roomId,
        data
      );
      console.log(response);
      if (!this.unmounted && response) {
        if (response.status === STATUS_SUCCESS) {
          if (response.data) {
            this.loadingStoppable = false;
            this.addMember(response.data.user.id);
          }
        } else {
          flashShowMessage({
            type: 'danger',
            message: response.message || t('api.error.message')
          });
        }
      }
    } catch (error) {
      console.log('search_members', error);
      flashShowMessage({
        type: 'danger',
        message: t('api.error.message')
      });
    } finally {
      !this.unmounted &&
        this.loadingStoppable &&
        this.setState({
          addUserLoading: false
        });
    }
  };

  addMember = async member_id => {
    if (!this.state.addUserLoading) {
      this.setState({ addUserLoading: true });
    }
    const { t } = this.props;
    const data = { member_id };

    try {
      const response = await APIHandler.site_add_user_room(
        this.props.siteId,
        this.props.roomId,
        data
      );
      console.log(response);
      if (!this.unmounted && response) {
        if (response.status === STATUS_SUCCESS) {
          if (response.data) {
            this.onClose();
            this.props.onSuccess(response.data);
          }
        } else {
          flashShowMessage({
            type: 'danger',
            message: response.message || t('api.error.message')
          });
        }
      }
    } catch (error) {
      console.log('add_members', error);
      flashShowMessage({
        type: 'danger',
        message: t('api.error.message')
      });
    } finally {
      !this.unmounted &&
        this.setState({
          addUserLoading: false
        });
    }
  };

  onClose = () => {
    if (this.ref_modal.current) {
      this.ref_modal.current.close();
    }
  };

  render() {
    const disabled = !this.state.text || this.state.addUserLoading;
    return (
      <ModalBox
        entry="bottom"
        position="center"
        style={[styles.modal]}
        backButtonClose
        ref={this.ref_modal}
        isOpen
        onClosed={this.props.onCloseModal}
        useNativeDriver
      >
        <View style={[styles.container, this.props.containerStyle]}>
          <View style={styles.header}>
            <Text style={styles.title}>{this.props.title}</Text>
            {this.state.addUserLoading && <Loading style={styles.loading} />}
          </View>

          <View style={styles.body}>
            <TextInput
              autoFocus
              maxLength={10}
              onChangeText={this.handleChangeText}
              value={this.state.text}
              style={styles.input}
              placeholder={this.props.placeholder}
              keyboardType={appConfig.device.isIOS ? 'number-pad' : 'numeric'}
            />
          </View>

          <Button
            disabled={disabled}
            btnContainerStyle={disabled && styles.btnDisabled}
            title={this.props.btnTitle}
            iconLeft={this.props.iconLeft}
            onPress={this.searchMember}
          />
        </View>
      </ModalBox>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#fff'
  },
  modal: {
    height: null,
    padding: 15,
    backgroundColor: 'transparent'
  },
  loading: {
    height: '100%',
    alignSelf: 'flex-end'
  },
  header: {
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ddd',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  body: {
    paddingVertical: 20
  },
  input: {
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 10,
    fontSize: 18,
    color: '#444',
    fontWeight: 'bold',
    letterSpacing: 1,
    textAlign: 'center'
  },
  btnDisabled: {
    backgroundColor: hexToRgbA(appConfig.colors.primary, 0.3)
  }
});

export default withTranslation()(MemberModal);
