import React from 'react';
import {
  SafeAreaView,
  ImageBackground,
  StyleSheet,
  Image,
  Dimensions,
  Alert,
} from 'react-native';

import {QRCodeImg} from 'qrcode-react-native';
import {View} from 'react-native-animatable';

let styleJson = {
  userFaceImage: {
    width: 98,
    height: 98,
    position: 'absolute',
    top: 115,
    left: 115,
  },
  QrCodeImageBG: {
    width: 450,
    height: 470,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'red',
    borderWidth: 0,
  },
  QrCodeContainer: {
    width: 330,
    height: 330,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'red',
    borderWidth: 0,
    marginVertical: 61,
    marginHorizontal: 57,
  },
  QrCodeImageSize: 328,
};

function resizeMode() {
  let screenWidth = Dimensions.get('window').width.toFixed();
  let screenHeight = Dimensions.get('window').height.toFixed();
  console.log('resizeMode screenWidth', screenWidth);
  console.log('resizeMode screenHeight', screenHeight);
  if (parseInt(screenWidth, 10) <= 411 && parseInt(screenHeight, 10) <= 842) {
    styleJson.QrCodeImageBG.width = screenWidth - 37;
    styleJson.QrCodeImageBG.height = screenHeight - 377;
    styleJson.QrCodeImageBG.marginVertical = 5;
    styleJson.QrCodeContainer.marginVertical = 53;
    styleJson.QrCodeContainer.width = styleJson.QrCodeImageBG.width - 10;
    styleJson.QrCodeContainer.height = styleJson.QrCodeImageBG.height - 20;
    styleJson.QrCodeImageSize = styleJson.QrCodeContainer.width - 57;
    styleJson.userFaceImage.width = 76;
    styleJson.userFaceImage.height = 76;
    styleJson.userFaceImage.left =
      (styleJson.QrCodeImageBG.width - styleJson.userFaceImage.width) / 2;
    styleJson.userFaceImage.top =
      (styleJson.QrCodeImageBG.height - styleJson.userFaceImage.height) / 2;
  } else if (
    parseInt(screenWidth, 10) <= 320 ||
    parseInt(screenHeight, 10) <= 426
  ) {
    styleJson.QrCodeImageBG.width = 95;
    styleJson.QrCodeImageBG.height = 95;
    styleJson.QrCodeImageSize = 76;
    styleJson.userFaceImage.width = 0;
    styleJson.userFaceImage.height = 0;
    styleJson.QrCodeImageBG.marginHorizontal = 96;
    styleJson.userFaceImage.left =
      (styleJson.QrCodeImageBG.width - styleJson.userFaceImage.width) / 2;
    styleJson.userFaceImage.top =
      (styleJson.QrCodeImageBG.height - styleJson.userFaceImage.height) / 2;
  } else if (screenWidth === 360 && screenHeight === 592) {
    styleJson.QrCodeImageBG.width = screenWidth - 57;
    styleJson.QrCodeImageBG.height = screenHeight - 317;
    styleJson.QrCodeContainer.marginVertical = 31;
    styleJson.QrCodeContainer.width = styleJson.QrCodeImageBG.width - 10;
    styleJson.QrCodeContainer.height = styleJson.QrCodeImageBG.height - 20;
    styleJson.QrCodeImageSize = styleJson.QrCodeContainer.width - 100;
    styleJson.userFaceImage.width = 56;
    styleJson.userFaceImage.height = 56;
    styleJson.userFaceImage.left =
      (styleJson.QrCodeImageBG.width - styleJson.userFaceImage.width) / 2;
    styleJson.userFaceImage.top =
      (styleJson.QrCodeImageBG.height - styleJson.userFaceImage.height) / 2;
  } else if (
    parseInt(screenWidth, 10) === 360 &&
    parseInt(screenHeight, 10) === 732
  ) {
    styleJson.QrCodeImageBG.width = screenWidth - 17;
    styleJson.QrCodeImageBG.height = screenHeight - 317;
    styleJson.QrCodeContainer.marginVertical = 31;
    styleJson.QrCodeContainer.width = styleJson.QrCodeImageBG.width - 10;
    styleJson.QrCodeContainer.height = styleJson.QrCodeImageBG.height - 20;
    styleJson.QrCodeImageSize = styleJson.QrCodeContainer.width - 100;
    styleJson.userFaceImage.width = 56;
    styleJson.userFaceImage.height = 56;
    styleJson.userFaceImage.left =
      (styleJson.QrCodeImageBG.width - styleJson.userFaceImage.width) / 2;
    styleJson.userFaceImage.top =
      (styleJson.QrCodeImageBG.height - styleJson.userFaceImage.height) / 2;
  } else if (screenWidth <= 384 || screenHeight <= 592) {
    styleJson.QrCodeImageBG.width = screenWidth - 17;
    styleJson.QrCodeImageBG.height = screenHeight - 317;
    styleJson.QrCodeContainer.marginVertical = 31;
    styleJson.QrCodeContainer.width = styleJson.QrCodeImageBG.width - 10;
    styleJson.QrCodeContainer.height = styleJson.QrCodeImageBG.height - 20;
    styleJson.QrCodeImageSize = styleJson.QrCodeContainer.width - 143;
    styleJson.userFaceImage.width = 56;
    styleJson.userFaceImage.height = 56;
    styleJson.userFaceImage.left =
      (styleJson.QrCodeImageBG.width - styleJson.userFaceImage.width) / 2;
    styleJson.userFaceImage.top =
      (styleJson.QrCodeImageBG.height - styleJson.userFaceImage.height) / 2;
  } else if (screenWidth <= 392 || screenHeight <= 753) {
    styleJson.QrCodeImageBG.width = screenWidth - 57;
    styleJson.QrCodeImageBG.height = screenHeight - 317;
    styleJson.QrCodeContainer.marginVertical = 31;
    styleJson.QrCodeContainer.width = styleJson.QrCodeImageBG.width - 10;
    styleJson.QrCodeContainer.height = styleJson.QrCodeImageBG.height - 20;
    styleJson.QrCodeImageSize = styleJson.QrCodeContainer.width - 30;
    styleJson.userFaceImage.width = 96;
    styleJson.userFaceImage.height = 96;
    styleJson.userFaceImage.left =
      (styleJson.QrCodeImageBG.width - styleJson.userFaceImage.width) / 2;
    styleJson.userFaceImage.top =
      (styleJson.QrCodeImageBG.height - styleJson.userFaceImage.height) / 2;
  } else if (
    parseInt(screenWidth, 10) <= 480 &&
    parseInt(screenHeight, 10) <= 854
  ) {
    return styleJson;
  } else if (
    parseInt(screenWidth, 10) >= 673 ||
    parseInt(screenHeight, 10) >= 793
  ) {
    styleJson.QrCodeImageBG.width = screenWidth - 57;
    styleJson.QrCodeImageBG.height = screenHeight - 377;
    styleJson.QrCodeImageBG.marginVertical = 5;
    styleJson.QrCodeContainer.marginVertical = 53;
    styleJson.QrCodeContainer.width = styleJson.QrCodeImageBG.width - 10;
    styleJson.QrCodeContainer.height = styleJson.QrCodeImageBG.height - 20;
    styleJson.QrCodeImageSize = styleJson.QrCodeContainer.width - 257;
    styleJson.userFaceImage.width = 96;
    styleJson.userFaceImage.height = 96;
    styleJson.userFaceImage.left =
      (styleJson.QrCodeImageBG.width - styleJson.userFaceImage.width) / 2;
    styleJson.userFaceImage.top =
      (styleJson.QrCodeImageBG.height - styleJson.userFaceImage.height) / 2;
  }
  return styleJson;
}

const styles = StyleSheet.create(resizeMode());

export default class Index extends React.Component {
  constructor() {
    super();
    this.state = {
      codeValue: '',
      fgColor: '#000000',
      bgColor: '#ffffff',
    };
  }

  componentDidMount() {
    let QRCodeObject = {
      Action: 'AddFriend',
      Value: this.props.UserId,
    };
    this.setState({codeValue: JSON.stringify(QRCodeObject)});
  }

  render() {
    let userFace = require('../../../images/userFace.png');
    let QrCodeImageSize = styleJson.QrCodeImageSize;
    let QRCodeObject = {
      Action: 'AddFriend',
      Value: this.props.UserId,
    };
    this.state.codeValue = JSON.stringify(QRCodeObject);
    if (
      this.props.userFaceUrl !== null &&
      typeof this.props.userFaceUrl !== 'undefined'
    ) {
      userFace = this.props.userFaceUrl;
    }
    console.log('QrCodeImageSize', QrCodeImageSize);
    console.log('this.state.codeValue', this.state.codeValue);
    return (
      <SafeAreaView>
        <ImageBackground
          style={styles.QrCodeImageBG}
          source={require('../../../images/QRCodeBG.png')}>
          <View style={styles.QrCodeContainer}>
            <QRCodeImg
              codeValue={this.state.codeValue}
              size={parseInt(QrCodeImageSize, 10)}
              errorCorrectLevel="L"
              fgColor={this.state.fgColor}
              bgColor={this.state.bgColor}
            />
            {/*<Image style={styles.userFaceImage} source={userFace} />*/}
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }
}
