import React from 'react';
import {StyleSheet, View} from 'react-native';
// configs
import appConfig from 'app-config';
// constants
import {TypographyType} from 'src/components/base';
// custom components
import {Container, ScrollView, Typography} from 'src/components/base';

const Info = (props) => {
  return (
    <Container flex>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="always"
        // refreshControl={
        //     <RefreshControl
        //         refreshing={loadingHistory || loadingHistoryWithdraw}
        //         onRefresh={this._getData.bind(this)}
        //     />
        // }
      >
        {!props.loading && (
          <View style={styles.descriptionContainer}>
            <Typography
              type={TypographyType.DESCRIPTION_MEDIUM_TERTIARY}
              style={styles.description}>
              {props.content ? props.content : props.t('info.content')}
            </Typography>
          </View>
        )}
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    width: appConfig.device.width,
  },
  descriptionContainer: {
    padding: 15,
  },
  description: {
    marginBottom: 2,
  },
});

export default withTranslation('affiliate')(Info);
