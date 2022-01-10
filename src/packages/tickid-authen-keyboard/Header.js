import React, {useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
// 3-party libs
import {useTranslation} from 'react-i18next';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {TypographyType} from 'src/components/base';
// custom components
import {TextButton, Typography} from 'src/components/base';

function Header(props) {
  const {theme} = useTheme();

  const {t} = useTranslation();

  const closeTitle = props.closeTitle || t('close');

  const headerStyle = useMemo(() => {
    return {
      borderBottomWidth: theme.layout.borderWidth,
      borderColor: theme.color.border,
    };
  }, [theme]);

  return (
    <View style={[styles.header, headerStyle]}>
      {!props.hideClose && (
        <TextButton
          neutral
          style={styles.btnClose}
          titleStyle={styles.closeTitle}
          onPress={props.onClose}>
          {closeTitle}
        </TextButton>
      )}
      <Typography
        type={TypographyType.TITLE_SEMI_LARGE}
        style={styles.headerTitle}>
        {props.title}
      </Typography>
    </View>
  );
}

Header.propTypes = {
  title: PropTypes.string,
  closeTitle: PropTypes.string,
  onClose: PropTypes.func,
  hideClose: PropTypes.bool,
};

Header.defaultProps = {
  onClose: () => {},
  hideClose: false,
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'relative',
    paddingVertical: 14,
  },
  headerTitle: {
    fontWeight: '600',
  },
  btnClose: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  closeTitle: {
    fontWeight: '600',
  },
});

export default Header;
