import React, {useMemo} from 'react';

import {GRID_IMAGES_LAYOUT_TYPES} from 'src/constants/social';

import {
  GridH1,
  GridH2,
  GridS,
  GridV1,
  GridV2,
  GridV2o,
  GridH2o,
} from '../../components/Social';

export const getImageRatio = (image = {width: 1, height: 1}) => {
  return (image.width || 1) / (image.height || 1);
};

export const getPostGridImagesType = (images = []) => {
  if(!images.length) return null;
  
  const ratioFirstImage = getImageRatio(images[0]);
  const ratioSecondImage = getImageRatio(images[1]);

  let gridType = GRID_IMAGES_LAYOUT_TYPES.SINGLE;

  if (images.length === 2) {
    if (ratioFirstImage === ratioSecondImage) {
      if (ratioFirstImage <= 1) {
        gridType = GRID_IMAGES_LAYOUT_TYPES.HORIZONTAL_2_ONLY;
      } else {
        gridType = GRID_IMAGES_LAYOUT_TYPES.VERTICAL_2_ONLY;
      }
    } else if (ratioFirstImage <= 1) {
      gridType = GRID_IMAGES_LAYOUT_TYPES.HORIZONTAL_2_ONLY;
    } else {
      gridType = GRID_IMAGES_LAYOUT_TYPES.VERTICAL_2_ONLY;
    }
  } else if (images.length > 2) {
    if (ratioFirstImage === ratioSecondImage) {
      if (ratioFirstImage < 1) {
        gridType = GRID_IMAGES_LAYOUT_TYPES.HORIZONTAL_2_HIGHLIGHTS;
      } else if (ratioFirstImage === 1) {
        gridType = GRID_IMAGES_LAYOUT_TYPES.VERTICAL_2_HIGHLIGHTS;
      } else if (ratioFirstImage > 1) {
        gridType =
          images.length === 2
            ? GRID_IMAGES_LAYOUT_TYPES.VERTICAL_2_HIGHLIGHTS
            : GRID_IMAGES_LAYOUT_TYPES.HORIZONTAL_2_HIGHLIGHTS;
      }
    } else {
      if (ratioFirstImage >= 1) {
        gridType = GRID_IMAGES_LAYOUT_TYPES.HORIZONTAL_1_HIGHLIGHTS;
      } else {
        gridType = GRID_IMAGES_LAYOUT_TYPES.VERTICAL_1_HIGHLIGHTS;
      }
    }
  }

  return gridType;
};

export const renderGridImages = (images) => {
  const gridType = useMemo(() => {
    return getPostGridImagesType(images);
  }, [images]);
// console.log(images, gridType)
  switch (gridType) {
    case GRID_IMAGES_LAYOUT_TYPES.VERTICAL_2_ONLY:
      return <GridV2o images={images} />;
    case GRID_IMAGES_LAYOUT_TYPES.HORIZONTAL_2_ONLY:
      return <GridH2o images={images} />;
    case GRID_IMAGES_LAYOUT_TYPES.SINGLE:
      return <GridS images={images} />;
    case GRID_IMAGES_LAYOUT_TYPES.HORIZONTAL_1_HIGHLIGHTS:
      return <GridH1 images={images} />;
    case GRID_IMAGES_LAYOUT_TYPES.HORIZONTAL_2_HIGHLIGHTS:
      return <GridH2 images={images} />;
    case GRID_IMAGES_LAYOUT_TYPES.VERTICAL_1_HIGHLIGHTS:
      return <GridV1 images={images} />;
    case GRID_IMAGES_LAYOUT_TYPES.VERTICAL_2_HIGHLIGHTS:
      return <GridV2 images={images} />;
  }
};
