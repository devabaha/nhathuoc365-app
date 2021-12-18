import React, {useMemo} from 'react';
import {StyleSheet} from 'react-native';
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
import {Container, TextButton, Typography} from 'src/components/base';

function Header(props) {
  const {theme} = useTheme();

  const {t} = useTranslation('voucher');

  const title = props.title || t('modal.noTitle');
  const closeTitle = props.closeTitle;

  const headerStyle = useMemo(() => {
    return mergeStyles(styles.header, {
      borderBottomWidth: theme.layout.borderWidth,
      borderColor: theme.color.border,
    });
  });

  return (
    <Container style={headerStyle}>
      {!props.hideCloseTitle && (
        <TextButton neutral onPress={props.onClose} style={styles.btnClose}>
          {closeTitle}
        </TextButton>
      )}
      <Typography
        type={TypographyType.LABEL_SEMI_LARGE}
        style={styles.headerTitle}>
        {title}
      </Typography>
    </Container>
  );
}

Header.propTypes = {
  title: PropTypes.string,
  closeTitle: PropTypes.string,
  onClose: PropTypes.func,
  hideCloseTitle: PropTypes.bool,
};

Header.defaultProps = {
  title: '',
  closeTitle: '',
  onClose: () => {},
  hideCloseTitle: false,
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
});

export default Header;
