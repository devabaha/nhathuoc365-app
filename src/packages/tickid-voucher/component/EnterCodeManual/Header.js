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

  const title = props.title || t('modal.province.title');
  const closeTitle = props.closeTitle || t('modal.close');

  const btnCloseTypoProps = useMemo(() => {
    return {type: TypographyType.LABEL_MEDIUM};
  }, []);

  const closeTitleStyle = useMemo(() => {
    return mergeStyles(styles.closeTitle, {color: theme.color.textInactive});
  }, [theme]);

  const headerStyle = useMemo(() => {
    return mergeStyles(styles.header, {
      borderColor: theme.color.border,
      borderBottomWidth: theme.layout.borderWidth,
    });
  }, [theme]);

  return (
    <Container style={headerStyle}>
      <TextButton
        typoProps={btnCloseTypoProps}
        onPress={props.onClose}
        style={styles.btnClose}
        titleStyle={closeTitleStyle}>
        {closeTitle}
      </TextButton>
      <Typography
        type={TypographyType.TITLE_SEMI_LARGE}
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
