export const willUpdateState = (unmounted, callback) => {
  if (!unmounted) {
    callback();
  }
};

export const setStater = (context, isUnmounted, state) => {
  if (!isUnmounted) {
    context.setState({ ...state });
  }
};
