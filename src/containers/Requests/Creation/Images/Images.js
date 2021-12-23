import React, {useState, useEffect, useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
// configs
import appConfig from 'app-config';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// routing
import {pop, push} from 'app-helper/routing';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {TypographyType, BundleIconSetName} from 'src/components/base';
// custom component
import Loading from 'src/components/Loading';
import {Container, ImageButton, TextButton, Icon} from 'src/components/base';

const PADDING = 15;
const IMAGE_SPACE = 10;
const Images = ({
  images = [],
  max = 4,
  onOpenImageSelector,
  onDelete = () => {},
  uploadImageLoading = false,
  ...props
}) => {
  const {theme} = useTheme();

  const {t} = useTranslation(['common']);

  const IMAGE_SIZE =
    (appConfig.device.width - PADDING * 2 - IMAGE_SPACE * (max - 1)) / max;

  const [gallery, setGallery] = useState(images);

  const [moreActions] = useState([t('delete'), t('cancel')]);
  const destructiveButtonIndex = moreActions.length - 2; // index of delete action.

  useEffect(() => {
    let temp = [...images];
    if (images.length < max) {
      temp.push({btn: true});
    } else {
      temp = temp.filter((t) => !t.btn);
    }
    setGallery(temp);
  }, [images]);

  function handleDeleteImage(image) {
    onDelete(image);
  }

  function handlePressAction(image, actionIndex) {
    switch (actionIndex) {
      case destructiveButtonIndex:
        pop();
        handleDeleteImage(image);
        break;
    }
  }

  function handlePressImage(image, index) {
    push(appConfig.routes.itemImageViewer, {
      images: gallery.slice(0, gallery.length - 1),
      index,
      moreActionSheetOptions: {
        options: moreActions,
        destructiveButtonIndex,
        onPress: (actionIndex) => handlePressAction(image, actionIndex),
      },
    });
  }

  const imageBorderContainerStyle = useMemo(() => {
    return mergeStyles(styles.imageContainer, {
      borderColor: theme.color.onSurface,
      borderWidth: theme.layout.borderWidth,
      borderRadius: theme.layout.borderRadiusExtraSmall,
    });
  }, theme);

  function renderImages() {
    return gallery.map((image, index) => {
      const addImageBtnContainerStyle = [
        imageBorderContainerStyle,
        {
          marginLeft: index !== 0 ? IMAGE_SPACE : 0,
          width: IMAGE_SIZE,
          height: IMAGE_SIZE,
        },
      ];

      const imageContainerStyle = [
        imageBorderContainerStyle,
        {
          marginRight: index !== images.length - 1 ? IMAGE_SPACE : 0,
          width: IMAGE_SIZE,
          height: IMAGE_SIZE,
        },
      ];

      if (image.btn) {
        const btnTypoProps = {type: TypographyType.LABEL_SMALL};
        const renderIconLeft = (iconStyle) => {
          return (
            <Icon
              bundle={BundleIconSetName.FONT_AWESOME}
              name="photo"
              style={[iconStyle, styles.icon]}
            />
          );
        };

        return (
          <View key={index} style={addImageBtnContainerStyle}>
            {uploadImageLoading ? (
              <Loading style={styles.loading} />
            ) : (
              <TextButton
                style={styles.addImageBtnContainer}
                onPress={onOpenImageSelector}
                typoProps={btnTypoProps}
                renderIconLeft={renderIconLeft}>
                {t('addImages')}
              </TextButton>
            )}
          </View>
        );
      }

      return (
        <Container key={index} style={imageContainerStyle}>
          <ImageButton
            useTouchableHighlight
            onPress={() => handlePressImage(image, index)}
            style={styles.image}
            source={{uri: image.url}}
          />
        </Container>
      );
    });
  }

  return <View style={styles.container}>{renderImages()}</View>;
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    flexDirection: 'row',
    paddingHorizontal: PADDING,
    flex: 1,
  },
  imageContainer: {
    borderStyle: 'dashed',
  },
  addImageBtnContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  icon: {
    fontSize: 20,
    marginBottom: 7,
  },
  text: {
    fontSize: 12,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loading: {
    height: '100%',
  },
});

export default Images;
