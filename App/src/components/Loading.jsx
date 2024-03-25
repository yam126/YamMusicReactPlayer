import {
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import React, {Component} from 'react';

let styleJson = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    left: 0,
    zIndex: 1000,
    backgroundColor: 'rgba(204, 204, 204, 0.9)',
    position: 'absolute',
  },
  loading: {
    backgroundColor: '#999',
    height: 100,
    width: 150,
    borderRadius: 20,
    padding: 20,
  },
  loadingTitle: {
    textAlign: 'center',
    color: 'white',
    marginTop: 20,
  },
};

function resizeMode() {
  let screenWidth = Dimensions.get('window').width.toFixed();
  let screenHeight = Dimensions.get('window').height.toFixed();
  let scaleX =
    parseInt(styleJson.loading.width, 10) / parseInt(screenWidth, 10);
  let scaleY =
    parseInt(styleJson.loading.height, 10) / parseInt(screenHeight, 10);
  styleJson.loading.width = parseInt(styleJson.loading.width * scaleX, 10);
  styleJson.loading.height = parseInt(styleJson.loading.height * scaleY, 10);
  return styleJson;
}

const styles = StyleSheet.create(resizeMode());

export default class Loading extends Component {
  constructor(props) {
    super(props);
    let containerWidth = Dimensions.get('window').width;
    let containerHeight = Dimensions.get('window').height;
    let Visibility = false;
    this.props = props;
    console.log('props', props);
    if (
      typeof props.Width !== 'undefined' &&
      props.Width !== null &&
      typeof props.Height !== 'undefined' &&
      props.Height !== null
    ) {
      containerWidth = props.Width;
      containerHeight = props.Height;
    }
    if (typeof props.Visibility !== 'undefined' && props.Visibility !== null) {
      Visibility = props.Visibility;
      if (props.Visibility === false) {
        containerWidth = 0;
        containerHeight = 0;
        styleJson.loading.width = 0;
        styleJson.loading.height = 0;
      }
    }
    this.state = {
      containerWidth: containerWidth,
      containerHeight: containerHeight,
      Visibility,
    };
  }
  initContainerSize = props => {
    let containerWidth = Dimensions.get('window').width;
    let containerHeight = Dimensions.get('window').height;
    console.log('props', props);
    if (
      typeof props.Width !== 'undefined' &&
      props.Width !== null &&
      typeof props.Height !== 'undefined' &&
      props.Height !== null
    ) {
      containerWidth = props.Width;
      containerHeight = props.Height;
    }
    this.setState({
      containerWidth: containerWidth,
      containerHeight: containerHeight,
      Visibility: true,
    });
  };
  showLoading = () => {
    this.initContainerSize(this.props);
  };
  hideLoading = () => {
    this.setState({
      containerWidth: 0,
      containerHeight: 0,
      Visibility: false,
    });
  };
  componentDidMount() {
    if (
      this.props.loadingWidth !== null &&
      typeof this.props.loadingWidth !== 'undefined'
    ) {
      styleJson.loading.width = this.props.loadingWidth;
    }
    if (
      this.props.loadingHeight !== null &&
      typeof this.props.loadingHeight !== 'undefined'
    ) {
      styleJson.loading.height = this.props.loadingHeight;
    }
  }
  render() {
    return (
      <View
        style={[
          styles.container,
          {
            width: this.state.containerWidth,
            height: this.state.containerHeight,
          },
        ]}>
        {this.state.Visibility ? (
          <View
            style={[
              styles.loading,
              {
                width: styleJson.loading.width,
                height: styleJson.loading.height,
              },
            ]}>
            <ActivityIndicator color={'white'} />
            <Text style={[styles.loadingTitle]}>加载中...</Text>
          </View>
        ) : (
          <></>
        )}
      </View>
    );
  }
}
