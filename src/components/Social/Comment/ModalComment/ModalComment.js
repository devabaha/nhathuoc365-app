import React, {Component} from 'react';
import {StatusBar, StyleSheet} from 'react-native';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
import {updateNavbarTheme} from 'src/Themes/helper/updateNavBarTheme';
import {mergeStyles} from 'src/Themes/helper';
// routing
import {refresh} from 'app-helper/routing';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {BundleIconSetName} from 'src/components/base';
// custom components
import Comment from '../Comment';
import {IconButton} from 'src/components/base';

const styles = StyleSheet.create({
  reloadContainer: {
    padding: 8,
    marginHorizontal: 4,
  },
  reloadIcon: {
    fontSize: 24,
  },
});

class ModalComment extends Component {
  static contextType = ThemeContext;

  refModal = React.createRef();
  refComment = React.createRef();

  updateNavBarDisposer = () => {};

  get theme() {
    return getTheme(this);
  }

  componentDidMount() {
    setTimeout(() =>
      refresh({
        title: this.props.title || this.props.t('comment'),
        right: () => (
          <IconButton
            bundle={BundleIconSetName.MATERIAL_COMMUNITY_ICONS}
            name="lightning-bolt"
            onPress={this.handleReload}
            hitSlop={HIT_SLOP}
            style={styles.reloadContainer}
            iconStyle={this.reloadIconStyle}
          />
        ),
      }),
    );

    this.updateNavBarDisposer = updateNavbarTheme(
      this.props.navigation,
      this.theme,
    );
  }

  componentWillUnmount() {
    this.updateNavBarDisposer();
  }

  componentDidUpdate(prevProps, prevState) {
    setTimeout(() => StatusBar.setBarStyle('dark-content', true), 800);
  }

  handleReload = () => {
    if (this.refComment.current) {
      this.refComment.current._getMessages(true);
    }
  };

  get reloadIconStyle() {
    return mergeStyles(styles.reloadIcon, {
      color: this.theme.color.persistPrimary,
    });
  }

  render() {
    return (
      <Comment
        ref={this.refComment}
        site_id={this.props.site_id}
        object={this.props.object}
        object_id={this.props.object_id}
        autoFocus={this.props.autoFocus}
        accessoryTypes={this.props.accessoryTypes}
        placeholder={this.props.placeholder}
        disableEditComment={this.props.disableEditComment}
      />
    );
  }
}

export default withTranslation('social')(ModalComment);
