export { default } from "./Item";
import { ViewProps } from 'react-native';

export interface ItemProps extends ViewProps{
    flex: boolean
}