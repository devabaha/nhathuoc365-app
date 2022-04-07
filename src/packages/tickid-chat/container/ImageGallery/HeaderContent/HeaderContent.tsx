import React, {Component} from 'react';
import {StyleSheet, Animated} from 'react-native';
// constants
import {WIDTH} from 'app-packages/tickid-chat/constants';
// custom components
import {Container, FlatList} from 'src/components/base';
import LoadMore from '../LoadMore';
import AlbumItem from 'app-packages/tickid-chat/component/AlbumItem';

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  albumContainer: {
    zIndex: 990,
    width: WIDTH,
    height: '100%',
    position: 'absolute',
  },
});

class HeaderContent extends Component<any> {
  state = {
    animatedLoading: new Animated.Value(0),
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.loading !== this.props.loading) {
      Animated.spring(this.state.animatedLoading, {
        toValue: nextProps.loading ? 25 : 0,
        useNativeDriver: true,
      }).start();
    }
    if (nextProps !== this.props) {
      return true;
    }
  }

  render() {
    const flatListStyle = {
      flex: 1,
      transform: [{translateY: this.state.animatedLoading}],
    };

    return (
      <Container
        animated
        style={[
          styles.center,
          styles.albumContainer,
          {
            transform: [{translateY: this.props.translateY}],
          },
        ]}>
        <LoadMore top loading={this.props.loading} />
        <Animated.View style={flatListStyle}>
          <FlatList
            onStartShouldSetResponderCapture={() => !this.props.visible}
            data={this.props.albums}
            renderItem={({item, index}) => (
              <AlbumItem
                title={item.name}
                coverSource={{uri: item.cover}}
                subTitle={item.count}
                onPress={() => this.props.onSelectAlbum(item)}
                leftStyle={{width: WIDTH / 6}}
                rightComponent={
                  item.name === this.props.chosenAlbumTitle &&
                  this.props.iconSelectedAlbum
                }
              />
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </Animated.View>
      </Container>
    );
  }
}

export default HeaderContent;
