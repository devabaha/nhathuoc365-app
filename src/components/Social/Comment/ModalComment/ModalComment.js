import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Actions} from 'react-native-router-flux';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import appConfig from 'app-config';

import Comment from '../Comment';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modal: {
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
    marginHorizontal: 4,
  },
  reloadIcon: {
    fontSize: 24,
    color: appConfig.colors.primary,
  },
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
      this.refComment.current._getMessages(true);
    }
  };

  render() {
    return (
      <Comment
        ref={this.refComment}
        site_id={this.props.site_id}
        object={this.props.object}
        object_id={this.props.object_id}
        autoFocus={this.props.autoFocus}
      />
    );
  }
}

export default ModalComment;
