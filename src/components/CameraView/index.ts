import { TFunction } from "i18next";
import { RNCameraProps } from "react-native-camera/types";

export { default } from "./CameraView";

type Orientation = Readonly<{
  auto: any;
  landscapeLeft: any;
  landscapeRight: any;
  portrait: any;
  portraitUpsideDown: any;
}>;
type OrientationNumber = 1 | 2 | 3 | 4;

export interface TakePictureOptions {
  quality?: number;
  orientation?: string;
  base64?: boolean;
  exif?: boolean;
  width?: number;
  mirrorImage?: boolean;
  doNotSave?: boolean;
  pauseAfterCapture?: boolean;

  /** Android only */
  skipProcessing?: boolean;
  fixOrientation?: boolean;
  writeExif?: boolean | { [name: string]: any };

  /** iOS only */
  forceUpOrientation?: boolean;
}

export interface CameraViewProps extends RNCameraProps {
  t?: TFunction;

  options?: TakePictureOptions;
  prefixImageCapture?: string;
  onCaptured?: Function;
}
