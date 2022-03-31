import * as React from 'react';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

import { ProgressTrackerProps, ProgressData } from '.';
import CheckPoint from './CheckPoint';
import { DEFAULT_ACTIVE_COLOR, DEFAULT_ACTIVE_LINK_COLOR, DEFAULT_UNACTIVE_COLOR, DEFAULT_UNACTIVE_LINK_COLOR } from './constants';

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    }
})

const { View } = Animated;

const ProgressTracker: React.FunctionComponent<ProgressTrackerProps> = ({
    data,
    checkPointDimensions = { width: 30, height: 30 },
    activeIcon,
    activeIconName = "check",
    activeColor = DEFAULT_ACTIVE_COLOR,
    unActiveColor = DEFAULT_UNACTIVE_COLOR,
    activeLinkColor = DEFAULT_ACTIVE_LINK_COLOR,
    unActiveLinkColor = DEFAULT_UNACTIVE_LINK_COLOR,
    containerStyle,
    checkPointContainerStyle,
    checkPointLabelStyle,
    checkPointIconStyle,
    renderCheckPoint,
    renderCheckPointIcon,
    renderCheckPointLabel
}) => {

    function renderCheckPoints() {
        return data.map((progressData: ProgressData, index: number) => {
            return (
                typeof renderCheckPoint === "function"
                    ? renderCheckPoint(progressData, index)
                    : <CheckPoint
                        key={index}
                        containerStyle={index === 0 && { flex: .49 }}
                        checkPointContainerStyle={checkPointContainerStyle}
                        checkPointDimensions={checkPointDimensions}
                        markLabel={progressData.markLabel}
                        label={progressData.label}
                        labelStyle={checkPointLabelStyle}
                        iconName={activeIconName}
                        iconStyle={checkPointIconStyle}
                        isActive={progressData.active}
                        activeColor={activeColor}
                        unActiveColor={unActiveColor}
                        activeLinkColor={activeLinkColor}
                        unActiveLinkColor={unActiveLinkColor}
                        hasLink={index !== 0}
                        renderCustomIcon={activeIcon ||
                            (typeof renderCheckPointIcon === "function"
                                ? () => renderCheckPointIcon(progressData, index)
                                : undefined)}
                        renderCustomLabel={
                            typeof renderCheckPointLabel === "function"
                                ? () => renderCheckPointLabel(progressData, index)
                                : undefined}
                    />
            )
        })
    }

    return (
        <View style={[styles.container, containerStyle]}>
            {renderCheckPoints()}
        </View>
    );
}

export default ProgressTracker;