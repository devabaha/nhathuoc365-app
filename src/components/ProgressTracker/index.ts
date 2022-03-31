import { StyleProp, ViewStyle, TextStyle } from 'react-native';
export { default } from './ProgressTracker';

export type ProgressData = {
    markLabel: string | number,
    label: string | number,
    active: boolean
};

export type CheckPointDimensions = {
    width: number,
    height: number
};

export interface ProgressTrackerProps {
    data: ProgressData[]
    checkPointDimensions?: CheckPointDimensions
    activeIcon?: JSX.Element
    activeIconName?: string
    activeColor?: string,
    unActiveColor?: string,
    unActiveLinkColor?: string,
    activeLinkColor?: string,
    containerStyle?: StyleProp<ViewStyle>
    checkPointContainerStyle?: StyleProp<ViewStyle>
    checkPointLabelStyle?: StyleProp<TextStyle>
    checkPointIconStyle?: StyleProp<TextStyle>
    renderCheckPoint?: (progressData: ProgressData, index: number) => JSX.Element
    renderCheckPointIcon?: (progressData: ProgressData, index: number) => JSX.Element
    renderCheckPointLabel?: (progressData: ProgressData, index: number) => JSX.Element
}