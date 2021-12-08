import appConfig from 'app-config';

export const navBarConfig = {
  navigationBarStyle: {
    backgroundColor: appConfig.colors.primary,
    borderBottomWidth: 0,
  },
  titleStyle: {
    color: appConfig.colors.white,
    alignSelf: 'center',
    paddingHorizontal: 5,
    fontSize: 18,
    fontWeight: 'bold',
  },
  navBarButtonColor: appConfig.colors.white,
  backButtonTextStyle: {
    color: appConfig.colors.white,
  },
};

export const whiteNavBarConfig = {
  surfaceMode: true,
  navigationBarStyle: {
    backgroundColor: appConfig.colors.white,
  },
  titleStyle: {
    color: appConfig.colors.text,
    alignSelf: 'center',
  },
  navBarButtonColor: appConfig.colors.text,
  backButtonTextStyle: {
    color: appConfig.colors.text,
  },
};

export const routerConfig = {
  sceneStyle: {
    backgroundColor: appConfig.colors.sceneBackground,
  },
};
