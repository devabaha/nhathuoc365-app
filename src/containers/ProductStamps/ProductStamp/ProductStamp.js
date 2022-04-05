import React, {useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
// 3-party libs
import FastImage from 'react-native-fast-image';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {TypographyType} from 'src/components/base';
// custom components
import {BaseButton, Container, Typography} from 'src/components/base';
import Image from 'src/components/Image';

const styles = StyleSheet.create({
  container: {
    marginBottom: 5,
  },
  contentContainer: {
    padding: 15,
  },
  image: {
    width: 75,
    height: 75,
  },
  infoContainer: {
    flex: 1,
    paddingLeft: 15,
    justifyContent: 'space-between',
  },
  titleContainer: {
    marginTop: -15,
    paddingTop: 15,
    marginRight: -15,
    paddingRight: 15,
    paddingBottom: 7,
    paddingLeft: 10,
  },
  title: {
    fontWeight: '500',
  },
  label: {
    justifyContent: 'center',
  },
  valueContainer: {
    marginLeft: 10,
    paddingVertical: 3,
    paddingHorizontal: 5,
  },
  value: {
    fontWeight: '500',
  },
  footer: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    alignSelf: 'flex-end',
    width: '100%',
  },
  timeContainer: {
    justifyContent: 'flex-end',
  },
  timeValueContainer: {
    paddingHorizontal: 7,
    marginLeft: 7,
  },
  timeValue: {},

  decor: {
    position: 'absolute',
    borderWidth: 7,
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
    right: 0,
  },
});

const ProductStamp = ({image, name, qrcode, activeTime, onPress}) => {
  const {theme} = useTheme();
  const {t} = useTranslation();

  const imageStyle = useMemo(() => {
    return mergeStyles(styles.image, {
      borderRadius: theme.layout.borderRadiusExtraSmall,
    });
  });

  const titleContainerStyle = useMemo(() => {
    return mergeStyles(styles.titleContainer, {
      backgroundColor: theme.color.contentBackgroundWeak,
      borderColor: theme.color.border,
      borderBottomLeftRadius: theme.layout.borderRadiusMedium,
    });
  });

  const timeValueContainerStyle = useMemo(() => {
    return mergeStyles(styles.timeValueContainer, {
      borderColor: theme.color.border,
      borderLeftWidth: theme.layout.borderWidthSmall,
    });
  });

  const valueContainerStyle = useMemo(() => {
    return mergeStyles(styles.valueContainer, {
      borderColor: theme.color.primaryHighlight,
      borderWidth: theme.layout.borderWidth,
      borderRadius: theme.layout.borderRadiusExtraSmall,
    });
  });

  const valueStyle = useMemo(() => {
    return mergeStyles(styles.value, {
      color: theme.color.primaryHighlight,
    });
  });

  const footerStyle = useMemo(() => {
    return mergeStyles(styles.footer, {
      borderColor: theme.color.border,
      borderTopWidth: theme.layout.borderWidthSmall,
    });
  });

  const decorStyle = useMemo(() => {
    return mergeStyles(styles.decor, {
      borderTopColor: theme.color.background,
      borderRightColor: theme.color.background,
    });
  });

  return (
    <BaseButton onPress={onPress}>
      <Container style={styles.container}>
        <Container
          noBackground
          row
          centerVertical={false}
          style={styles.contentContainer}>
          <Image style={imageStyle} source={{uri: image}} />
          <View style={styles.infoContainer}>
            <Container noBackground style={titleContainerStyle}>
              <Typography
                type={TypographyType.LABEL_MEDIUM}
                style={styles.title}
                numberOfLines={2}>
                {name}
              </Typography>
            </Container>
            <Container row>
              <Typography
                type={TypographyType.LABEL_SMALL_TERTIARY}
                style={styles.label}>
                {t('productStamp:qrCode')}
              </Typography>
              <View style={valueContainerStyle}>
                <Typography
                  type={TypographyType.LABEL_MEDIUM_TERTIARY}
                  style={valueStyle}>
                  {qrcode}
                </Typography>
              </View>
            </Container>
          </View>
        </Container>
        <View style={footerStyle}>
          <Container row style={styles.timeContainer}>
            <Typography
              type={TypographyType.LABEL_SMALL_SECONDARY}
              style={styles.label}>
              {t('productStamp:receivedDate')}
            </Typography>
            <View style={timeValueContainerStyle}>
              <Typography
                type={TypographyType.LABEL_SMALL_TERTIARY}
                style={styles.timeValue}>
                {activeTime}
              </Typography>
            </View>
          </Container>
        </View>
        <View style={decorStyle} />
      </Container>
    </BaseButton>
  );
};

export default withTranslation('productStamp')(ProductStamp);
