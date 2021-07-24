import React from 'react';
import {TouchableOpacity} from 'react-native';
import {StyleSheet, Text, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {Container} from 'src/components/Layout';
import SectionContainer from 'src/components/payment/Confirm/components/SectionContainer';
import {SlotGridView} from 'src/components/Schedule/SlotPicker/GridView';

const SLOTS = [
  '1:00',
  '2:00',
  '3:00',
  '4:00',
  '5:00',
  '6:00',
  '7:00',
  '8:00',
  '9:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
];

const styles = StyleSheet.create({
  icon: {
    fontSize: 14,
    color: '#333',
  },

  slotGridViewContainer: {
    marginHorizontal: -15,
    marginTop: 15,
    marginBottom: -10,
  },
  slotGridViewContentContainer: {
    paddingHorizontal: 15,
    paddingBottom: 5,
  },
});

const ScheduleSection = () => {
  return (
    <>
      <SectionContainer
        marginTop
        iconName="calendar-alt"
        title="Chọn ngày"
        actionBtnTitle="Thay đổi">
        <Text style={{marginTop: 12, paddingLeft: 22, paddingRight: 15}}>
          23/07/2021
        </Text>
      </SectionContainer>
      <SectionContainer
        marginTop
        iconName="clock"
        title="Chọn giờ">
        <SlotGridView
          horizontal
          slots={SLOTS}
          containerStyle={styles.slotGridViewContainer}
          contentContainerStyle={styles.slotGridViewContentContainer}
        />
      </SectionContainer>
    </>
  );
};

export default React.memo(ScheduleSection);
