import React, {Component} from 'react';
import {View, StyleSheet, Easing, Animated} from 'react-native';
import {ScreenWrapper, Container} from 'src/components/base';
import {getTheme, ThemeContext} from 'src/Themes/Theme.context';
import SkeletonLoading from '../../components/SkeletonLoading';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    position: 'absolute',
    height: '100%',
  },
  premiumContainer: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    width: '100%',
    justifyContent: 'space-around',
  },
  premium: {
    borderRadius: 8,
  },
  benefit: {
    marginTop: 15,
    padding: 15,
  },
  iconContainer: {
    borderRadius: 30,
  },
  benefitContainer: {
    flex: 1,
    marginLeft: 15,
  },
  benefitTitle: {
    marginBottom: 5,
    borderRadius: 8,
  },
  benefitDescription: {
    marginTop: 10,
    borderRadius: 5,
  },
  loyaltyContainer: {
    padding: 15,
    marginTop: 15,
    justifyContent: 'space-between',
  },
});

class PremiumInfoSkeleton extends Component {
  static contextType = ThemeContext;

  state = {
    loading: this.props.loading,
  };
  animatedOpacity = new Animated.Value(1);

  get theme() {
    return getTheme(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.loading !== this.props.loading) {
      Animated.timing(this.animatedOpacity, {
        toValue: nextProps.loading ? 1 : 0,
        duration: 200,
        easing: Easing.quad,
        useNativeDriver: true,
      }).start(({finished}) => {
        if (finished) {
          this.setState({
            loading: nextProps.loading,
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
      <>
        <Container
          noBackground
          animated
          flex
          style={[
            {
              opacity: this.animatedOpacity.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0],
              }),
            },
          ]}>
          {this.props.children}
        </Container>

        <Container
          noBackground
          animated
          pointerEvents="none"
          style={[styles.container, {opacity: this.animatedOpacity}]}>
          <Container row style={[styles.premiumContainer]}>
            {this.renderPremium()}
          </Container>
          {this.renderBenefits()}

          <Container row style={styles.loyaltyContainer}>
            <SkeletonLoading width="80%" height={15} style={styles.premium} />
            <SkeletonLoading width="10%" height={15} style={styles.premium} />
          </Container>
        </Container>
      </>
    );
  }
}

export default PremiumInfoSkeleton;
