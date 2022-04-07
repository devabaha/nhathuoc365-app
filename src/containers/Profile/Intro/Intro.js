import React, {Component, Fragment} from 'react';
import {StyleSheet, View} from 'react-native';
// helpers
import {mergeStyles} from 'src/Themes/helper';
import {getTheme} from 'src/Themes/Theme.context';
import {openLink} from 'app-helper';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {TypographyType} from 'src/components/base';
// custom components
import HorizontalInfoItem from 'src/components/account/HorizontalInfoItem';
import {Container, Typography} from 'src/components/base';

class Intro extends Component {
  static contextType = ThemeContext;

  state = {
    footerData: this.footerData,
  };

  get theme() {
    return getTheme(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps !== this.props) {
      this.setState({footerData: this.footerData});
      return true;
    }

    if (nextState !== this.state) {
      return true;
    }

    return false;
  }
  get footerData() {
    return this.props.data;
  }

  onPressFooterDataPress = ({value: url}) => {
    openLink(url);
  };

  renderFooter() {
    const inputProps = {
      numberOfLines: 2,
    };

    return this.state.footerData.map(
      (item, index) =>
        !!item.value && (
          <Fragment key={index}>
            <View style={this.separatorStyle} />
            <HorizontalInfoItem
              data={item}
              onSelectedValue={this.onPressFooterDataPress}
              inputProps={inputProps}
              containerStyle={styles.horizontalInfoContainer}
            />
          </Fragment>
        ),
    );
  }

  get separatorStyle() {
    return mergeStyles(styles.separator, {
      backgroundColor: this.theme.color.border,
      height: this.theme.layout.borderWidth,
    });
  }

  get titleContainerStyle() {
    return mergeStyles(styles.titleContainer, {
      borderColor: this.theme.color.border,
      borderTopWidth: this.theme.layout.borderWidthSmall,
    });
  }

  render() {
    return (
      <View>
        <Container style={this.titleContainerStyle}>
          <Typography type={TypographyType.LABEL_LARGE} style={styles.title}>
            {this.props.t('aboutLabel')}
          </Typography>
        </Container>
        {!!this.props.content && (
          <>
            <View style={this.separatorStyle} />
            <Container style={styles.contentContainer}>
              <Typography
                type={
                  !!this.props.content
                    ? TypographyType.LABEL_MEDIUM
                    : TypographyType.LABEL_MEDIUM_TERTIARY
                }
                style={!this.props.content && styles.noIntro}>
                {this.props.content}
              </Typography>
            </Container>
          </>
        )}

        <View style={styles.footer}>{this.renderFooter()}</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  titleContainer: {
    padding: 15,
  },
  title: {
    fontWeight: '600',
    letterSpacing: 1,
  },
  contentContainer: {
    padding: 15,
  },

  footer: {},
  noIntro: {
    fontStyle: 'italic',
    fontWeight: '300',
    textAlign: 'center',
  },
  horizontalInfoContainer: {
    paddingHorizontal: 15,
  },
  separator: {
    width: '100%',
    left: 15,
  },
});

export default withTranslation('profileDetail')(Intro);
