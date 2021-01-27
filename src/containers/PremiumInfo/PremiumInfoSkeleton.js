import React, { Component } from 'react';
import { View, StyleSheet, Easing, Animated } from 'react-native';
import Container from '../../components/Layout/Container';
import SkeletonLoading from '../../components/SkeletonLoading';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1
  },
  container: {
    flex: 1,
    position: 'absolute',
    height: '100%'
  },
  premiumContainer: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: '#fff',
    width: '100%',
    justifyContent: 'space-around'
  },
  premium: {
    borderRadius: 8
  },
  benefit: {
    backgroundColor: '#fff',
    marginTop: 15,
    padding: 15
  },
  iconContainer: {
    borderRadius: 30
  },
  benefitContainer: {
    flex: 1,
    marginLeft: 15
  },
  benefitTitle: {
    marginBottom: 5,
    borderRadius: 8
  },
  benefitDescription: {
    marginTop: 10,
    borderRadius: 5
  },
  loyaltyContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginTop: 15,
    justifyContent: 'space-between'
  }
});

class PremiumInfoSkeleton extends Component {
  state = {
    loading: this.props.loading
  };
  animatedOpacity = new Animated.Value(1);

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.loading !== this.props.loading) {
      Animated.timing(this.animatedOpacity, {
        toValue: nextProps.loading ? 1 : 0,
        duration: 200,
        easing: Easing.quad,
        useNativeDriver: true
      }).start(({ finished }) => {
        if (finished) {
          this.setState({
            loading: nextProps.loading
          });
        }
      });
    }

    return true;
  }

  renderPremium() {
    return [1, 2, 3, 4].map((premium, index) => (
      <SkeletonLoading
        key={index}
        style={styles.premium}
        width="22%"
        height={30}
      />
    ));
  }

  renderBenefits() {
    return [1, 2, 3].map((benefit, index) => (
      <Container key={index} row style={styles.benefit}>
        <SkeletonLoading style={styles.iconContainer} width={60} height={60} />
        <View style={styles.benefitContainer}>
          <SkeletonLoading
            style={styles.benefitTitle}
            width="50%"
            height={15}
          />
          <SkeletonLoading
            style={styles.benefitDescription}
            width="100%"
            height={10}
          />
          <SkeletonLoading
            style={styles.benefitDescription}
            width="100%"
            height={10}
          />
        </View>
      </Container>
    ));
  }

  render() {
    return (
      <View style={styles.wrapper}>
        <Animated.View
          style={[
            {
              flex: 1,
              opacity: this.animatedOpacity.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0]
              })
            }
          ]}
        >
          {this.props.children}
        </Animated.View>

        <Animated.View
          pointerEvents="none"
          style={[styles.container, { opacity: this.animatedOpacity }]}
        >
          <Container row style={styles.premiumContainer}>
            {this.renderPremium()}
          </Container>
          {this.renderBenefits()}

          <Container row style={styles.loyaltyContainer}>
            <SkeletonLoading width="80%" height={15} style={styles.premium} />
            <SkeletonLoading width="10%" height={15} style={styles.premium} />
          </Container>
        </Animated.View>
      </View>
    );
  }
}

export default PremiumInfoSkeleton;
