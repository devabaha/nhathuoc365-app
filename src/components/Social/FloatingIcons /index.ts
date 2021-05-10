import {StyleProp, TextProps, ViewProps} from 'react-native';

export {default} from './FloatingIcons';

export type Icon = {
  name: string;
  containerStyle?: StyleProp<ViewProps>;
  style?: StyleProp<TextProps>;
  bundle?:
    | 'AntDesign'
    | 'Entypo'
    | 'EvilIcons'
    | 'Feather'
    | 'FontAwesome'
    | 'FontAwesome5'
    | 'Fontisto'
    | 'Foundation'
    | 'Ionicons'
    | 'MaterialIcons'
    | 'MaterialCommunityIcons'
    | 'Octicons'
    | 'Zocial'
    | 'SimpleLineIcons';
};

export interface FloatingIconsProps {
  icons: Array<Icon> | Icon | string;
  prefixTitle: string,
  
  wrapperStyle?: StyleProp<ViewProps>;
  containerStyle?: StyleProp<ViewProps>;
  style?: StyleProp<ViewProps>;
  iconContainerStyle?: StyleProp<ViewProps>;
  iconStyle?: StyleProp<TextProps>;
}
