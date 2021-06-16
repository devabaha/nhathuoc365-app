import DrawerManager from './DrawerManager';
import Drawer, {showDrawer, hideDrawer, clearDrawerContent} from './Drawer';
import { StyleProp, ViewStyle } from 'react-native';

export {DrawerManager, showDrawer, hideDrawer, clearDrawerContent};

export default Drawer;

export type DrawerPositionType = 'left' | 'right';

export interface DrawerProps {
    width?: number,
    position?: DrawerPositionType
    contentContainerStyle?: StyleProp<ViewStyle>
}