import React, {useCallback, useMemo} from 'react';
import {Keyboard, StyleSheet} from 'react-native';
// configs
import appConfig from 'app-config';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {BundleIconSetName, TypographyType} from 'src/components/base';
// custom components
import {Container, Icon, Input, IconButton} from 'src/components/base';
import DomainTag from '../DomainTag';

const styles = StyleSheet.create({
  inputContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  leftIcon: {
    marginLeft: 10,
    fontSize: 16,
  },
  textInput: {
    paddingVertical: appConfig.device.isIOS ? 15 : 7,
    paddingHorizontal: 10,
    flex: 1,
  },
  closeIconContainer: {
    marginRight: 10,
    padding: 5,
  },
  tag: {
    marginRight: 10,
  },
});

const DomainInput = ({
  innerRef,
  value,
  iconName,
  iconColor,
  tag,
  placeholder,
  containerStyle,
  onPressShowMore,
  onClearText = () => {},
  onChangeText = () => {},
  onSubmitEditing = () => {},
}) => {
  const {theme} = useTheme();

  const handlePressShowMore = useCallback(() => {
    Keyboard.dismiss();
    onPressShowMore();
  }, []);

  const inputContainerStyle = useMemo(() => {
    return mergeStyles(styles.inputContainer, {
      borderColor: theme.color.primaryHighlight,
      borderWidth: theme.layout.borderWidth,
      borderRadius: theme.layout.borderRadiusExtraSmall,
    });
  }, [theme]);

  const closeIconContainerStyle = useMemo(() => {
    return mergeStyles(styles.closeIconContainer, {
      borderRadius: theme.layout.borderRadiusHuge,
      backgroundColor: theme.color.background,
    });
  }, [theme]);

  return (
    <Container ref={innerRef} style={[inputContainerStyle, containerStyle]}>
      {!!iconName && (
        <Icon
          bundle={BundleIconSetName.MATERIAL_ICONS}
          name={iconName}
          style={[styles.leftIcon, {color: iconColor}]}
        />
      )}
      <Input
        type={TypographyType.LABEL_SEMI_MEDIUM}
        style={styles.textInput}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        value={value}
        placeholder={placeholder}
      />

      {!!tag?.label && (
        <DomainTag
          label={tag?.label}
          containerStyle={[
            styles.tag,
            {backgroundColor: tag?.color || undefined},
          ]}
        />
      )}

      {!!value && (
        <IconButton
          bundle={BundleIconSetName.MATERIAL_ICONS}
          name="close"
          onPress={onClearText}
          style={closeIconContainerStyle}
        />
      )}

      {!!onPressShowMore && (
        <IconButton
          bundle={BundleIconSetName.MATERIAL_ICONS}
          name="keyboard-arrow-down"
          hitSlop={HIT_SLOP}
          onPress={handlePressShowMore}
          style={closeIconContainerStyle}
        />
      )}
    </Container>
  );
};

export default React.memo(DomainInput);
