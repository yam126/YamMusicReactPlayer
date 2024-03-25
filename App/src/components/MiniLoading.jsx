import {StyleSheet, View, ActivityIndicator} from 'react-native';
import React, {Component} from 'react';

//微型Loading组件
export default class MiniLoading extends Component {
  constructor() {
    super();
    this.state = {
      Width: 0,
      Height: 0,
      Top: 0,
      Left: 0,
      Color: '',
      Size: 0,
    };
  }
  componentDidMount() {
    console.log('MiniLoading this.props', this.props);
    let propsWidth = this.props.Width;
    let propsHeight = this.props.Height;
    let loadingWidgetSize = this.props.Size;
    let MarginTop = parseInt((propsHeight - loadingWidgetSize) / 2, 10);
    let MarginLeft = parseInt((propsWidth - loadingWidgetSize) / 2, 10);
    let LoadingColor =
      this.props.Color === null && typeof this.props.Color === 'undefined'
        ? ''
        : this.props.Color;
    this.setState({
      Width: propsWidth,
      Height: propsHeight,
      Top: MarginTop,
      Left: MarginLeft,
      Color: LoadingColor,
      Size: loadingWidgetSize,
    });
  }
  render() {
    return (
      <View style={{width: this.state.Width, height: this.state.Height}}>
        <ActivityIndicator
          style={{
            marginVertical: this.state.Top,
            marginHorizontal: this.state.Left,
          }}
          size={this.state.Size}
          color={this.state.Color}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({});
