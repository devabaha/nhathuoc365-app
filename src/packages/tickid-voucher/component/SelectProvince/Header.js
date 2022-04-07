import React, {useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
// 3-party libs
import {useTranslation} from 'react-i18next';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {TypographyType} from 'src/components/base';
// custom components
import {TextButton, Typography} from 'src/components/base';

function Header(props) {
  const {theme} = useTheme();

  const {t} = useTranslation('voucher');

  const title = props.title || t('modal.province.title');
  const closeTitle = props.closeTitle || t('modal.close');

  const headerStyle = useMemo(() => {
    return mergeStyles(styles.header, {
      borderBottomWidth: theme.layout.borderWidth,
      borderColor: theme.color.border,
    });
  });

  return (
    <View style={headerStyle}>
      <TextButton
        onPress={props.onClose}
        style={styles.btnClose}
        neutral
        titleStyle={styles.closeTitle}>
        {closeTitle}
      </TextButton>
      <Typography
        type={TypographyType.LABEL_SEMI_LARGE}
        style={styles.headerTitle}>
        {title}
      </Typography>
    </View>
  );
}

Header.propTypes = {
  title: PropTypes.string,
  closeTitle: PropTypes.string,
  onClose: PropTypes.func,
};

Header.defaultProps = {
  title: '',
  closeTitle: '',
  onClose: () => {},
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
