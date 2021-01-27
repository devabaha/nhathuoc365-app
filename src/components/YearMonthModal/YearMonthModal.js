import React, {useEffect, useState} from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TouchableHighlight,
  FlatList,
} from 'react-native';
import Animated, {
  Easing,
  useValue,
} from 'react-native-reanimated';
import Container from '../Layout/Container';
import AntDesign from 'react-native-vector-icons/AntDesign';
import appConfig from 'app-config';

const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'rgba(0,0,0,.6)',
  },
  container: {
    width: '80%',
    backgroundColor: '#fff',

    borderRadius: 7,
    overflow: 'hidden',
  },
  headingContainer: {
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 30,
    paddingBottom: 15,
    borderBottomWidth: 0.5,
    borderColor: '#e5e5e5',
  },
  heading: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 5,
    color: '#999',
  },
  yearHeadingContainer: {
    justifyContent: 'space-between',
  },
  selectedHeadingYear: {
    fontSize: 18,
    fontWeight: '500',
    letterSpacing: 3,
  },
  title: {
    position: 'absolute',
    color: '#f3f3f3',
    fontSize: 26,
    fontFamily: 'SairaStencilOne-Regular',
    letterSpacing: 10,
  },
  yearTitle: {
    top: -15,
    left: -5,
  },
  monthTitle: {
    top: 30,
    right: 0,
  },
  selectedYear: {
    fontWeight: '500',
  },
  monthContainer: {
    marginTop: 15,
  },
  yearContainer: {
    position: 'absolute',
    zIndex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'red',
    padding: 0,
  },
  selectedYearContainer: {
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 3,
  },
  monthBtnWrapper: {
    width: '100%',
    flex: 1,
    borderRadius: 15,
    padding: 3,
    paddingVertical: 7,
    marginBottom: 10,
  },
  monthBtnContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  month: {
    textAlign: 'center',
    color: '#333',
    fontSize: 16,
    fontWeight: '300',
  },
  selectedMonth: {
    fontWeight: 'bold',
  },
  selectedDot: {
    position: 'absolute',
    width: 4,
    height: 4,
    backgroundColor: 'red',
    borderRadius: 2,
    // top: 0,
    bottom: -5,
  },

  listContent: {
    paddingHorizontal: 15,
  },
});

const YearMonthModal = ({
  data = [
    {2020: [1, 3, 5, 9, 10, 12]},
    {2019: ''},
    {1990: ''},
    {2021: [4, 6, 9, 10, 12]},
  ],
  onSelect = () => {},
  onClose = () => {},
  visible,
  heading,
  selectedYear = 2021,
  selectedMonth = 6,
  onPressYear = () => {},
  onPressMonth = () => {},
  ...props
}) => {
  const animatedToggleYearModal = useValue(0);

  const [openYearsModal, setOpenYearsModal] = useState(false);
  const animatedArrowOpacity = animatedToggleYearModal.interpolate({
    inputRange: [0, 0.4],
    outputRange: [1, 0],
  });
  const animatedArrowTransition = animatedToggleYearModal.interpolate({
    inputRange: [0, 1],
    outputRange: [1, -40],
  });

  useEffect(() => {
    Animated.timing(animatedToggleYearModal, {
      toValue: openYearsModal ? 1 : 0,
      duration: 300,
      easing: Easing.quad,
      useNativeDriver: false,
    }).start();
  }, [openYearsModal]);

  const prevYear = (prevYearIndex) => {
    onPressYear(data[prevYearIndex]);
  };

  const nextYear = (nextYearIndex) => {
    onPressYear(data[nextYearIndex]);
  };

  const handlePressYearHeading = () => {
    setOpenYearsModal(!openYearsModal);
  };

  const handlePressYear = (year) => {
    setOpenYearsModal(false);
    onPressYear(year);
  };

  const handlePressMonth = (month) => {

  }

  const getMonthsFromYear = () => {
    const selectedYearData = data.find(
      (item) => Object.keys(item) == selectedYear,
    );

    return selectedYearData[selectedYear] || [];
  };

  const renderHeadingSelector = () => {
    const selectedYearIndex = data.findIndex(
      (item) => Object.keys(item) == selectedYear,
    );
    const prevIndex = selectedYearIndex - 1;
    const nextIndex = selectedYearIndex + 1;
    const isActivePrev = prevIndex > -1;
    const isActiveNext = nextIndex !== -1 && nextIndex <= data.length - 1;
    return (
      <Container row style={styles.yearHeadingContainer}>
        <Text style={[styles.title, styles.yearTitle]}>NĂM</Text>

        <Animated.View
          style={{
            left: animatedArrowTransition,
            opacity: animatedArrowOpacity,
          }}>
          <TouchableOpacity
            hitSlop={HIT_SLOP}
            disabled={!isActivePrev}
            onPress={() => prevYear(prevIndex)}>
            <AntDesign name="left" style={{opacity: isActivePrev?1:.3}} />
          </TouchableOpacity>
        </Animated.View>

        <Container flex>
          <TouchableHighlight
            underlayColor="#eee"
            onPress={handlePressYearHeading}
            style={styles.selectedYearContainer}>
            <Text style={styles.selectedHeadingYear}>{selectedYear}</Text>
          </TouchableHighlight>
        </Container>

        <Animated.View
          style={{
            right: animatedArrowTransition,
            opacity: animatedArrowOpacity,
          }}>
          <TouchableOpacity
            hitSlop={HIT_SLOP}
            disabled={!isActiveNext}
            onPress={() => nextYear(nextIndex)}>
            <AntDesign name="right" style={{opacity: isActiveNext?1:.3}}/>
          </TouchableOpacity>
        </Animated.View>
      </Container>
    );
  };

  const renderMonth = ({item: month, index}) => {
    const isActive = getMonthsFromYear().find((m) => m == month);
    const isSelected = isActive && month == selectedMonth ;
    const extraStyle = isSelected && styles.selectedMonth;
    return (
      <Container flex>
        <TouchableHighlight
          underlayColor="#f6f6f6"
          style={styles.monthBtnWrapper}
          onPress={() => handlePressMonth(month)}>
          <View style={styles.monthBtnContainer}>
            <Text
              style={[
                styles.month,
                extraStyle,
                !isActive && {textDecorationLine: 'line-through', color: '#ccc'},
              ]}>
              {month}
            </Text>
            {isSelected && <View style={styles.selectedDot} />}
          </View>
        </TouchableHighlight>
      </Container>
    );
  };

  const renderMonths = () => {
    return (
      <View style={styles.monthContainer}>
        <Animated.Text
          style={[
            styles.title,
            styles.monthTitle,
            {
              opacity: animatedToggleYearModal.interpolate({
                inputRange: [0, 0.8],
                outputRange: [1, 0],
              }),
            },
          ]}>
          THÁNG
        </Animated.Text>
        <Animated.View
          style={[
            {
              transform: [
                {
                  scale: animatedToggleYearModal.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.2],
                  }),
                },
                {
                    skewX: animatedToggleYearModal.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, .1],
                    }),
                  },
                  {
                    skewY: animatedToggleYearModal.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -.3],
                    }),
                  },
              ],
              opacity: animatedToggleYearModal.interpolate({
                inputRange: [0, 0.8],
                outputRange: [1, 0],
              }),
            },
          ]}>
          <FlatList
            data={MONTHS}
            contentContainerStyle={styles.listContent}
            renderItem={renderMonth}
            keyExtractor={(item, index) => index.toString()}
            numColumns={3}
          />
        </Animated.View>
      </View>
    );
  };

  const renderYear = ({item}) => {
    const year = Object.keys(item);
    const isSelected = year == selectedYear;
    const extraStyle = isSelected && styles.selectedYear;
    return (
      <Container flex style={{maxWidth: '33.333%', marginBottom: 10}}>
        <TouchableHighlight
          underlayColor="#f6f6f6"
          style={styles.monthBtnWrapper}
          onPress={() => handlePressYear(year)}>
          <View style={styles.monthBtnContainer}>
            <Text style={[styles.month, extraStyle]}>{year}</Text>
            {isSelected && <View style={styles.selectedDot} />}
          </View>
        </TouchableHighlight>
      </Container>
    );
  };

  const renderYears = () => {
    return (
      <Animated.View
        pointerEvents={openYearsModal ? 'auto' : 'none'}
        style={[
          styles.monthContainer,
          styles.yearContainer,
          {
            transform: [
              {
                scale: animatedToggleYearModal.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1.2, 1],
                }),
              },
              {
                skewX: animatedToggleYearModal.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-.1, 0],
                }),
              },
              {
                skewY: animatedToggleYearModal.interpolate({
                  inputRange: [0, 1],
                  outputRange: [.3, 0],
                }),
              },
            ],
            opacity: animatedToggleYearModal.interpolate({
              inputRange: [0.4, 1],
              outputRange: [0, 1],
            }),
          },
        ]}>
        <FlatList
          style={{backgroundColor: '#fff'}}
          contentContainerStyle={styles.listContent}
          data={data}
          renderItem={renderYear}
          keyExtractor={(item, index) => index.toString()}
          numColumns={3}
        />
      </Animated.View>
    );
  };

  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <Container flex center style={styles.wrapper}>
        <View onTouchStart={onClose} style={StyleSheet.absoluteFill}></View>

        <Container centerVertical={false} style={styles.container}>
          <Container row style={styles.headingContainer}>
            {!!heading && <Text style={styles.heading}>{heading}</Text>}
            <TouchableOpacity hitSlop={HIT_SLOP} onPress={onClose}>
              <AntDesign name="close" />
            </TouchableOpacity>
          </Container>

          <Container centerVertical={false} padding={15}>
            {renderHeadingSelector()}
            <Container
              centerVertical={false}
              style={{
                maxHeight: appConfig.device.width * 0.6,
                marginHorizontal: -15,
                overflow: 'hidden',
              }}>
              {renderMonths()}
              {renderYears()}
            </Container>
          </Container>
        </Container>
      </Container>
    </Modal>
  );
};

export default YearMonthModal;
