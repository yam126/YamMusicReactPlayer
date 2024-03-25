import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {Image} from 'react-native-animatable';

let styleJson = {
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#18A4FD',
  },
  barHeader: {
    width: Dimensions.get('window').width,
    height: 55,
    flexDirection: 'row',
    borderTopColor: '#ccc',
    borderTopWidth: 1,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  forwardBack: {
    marginVertical: 10,
    iconSize: 35,
    color: 'white',
  },
  barHeaderTitle: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    paddingTop: 5,
    color: 'white',
  },
  barHeaderTitleContainer: {
    width: Dimensions.get('window').width - 75,
    height: 37,
    marginVertical: 9,
    borderColor: 'red',
    borderWidth: 0,
  },
  lineContainer: {
    width: Dimensions.get('window').width,
    height: (Dimensions.get('window').height - 55) / 2,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'red',
    borderWidth: 0,
    imageContainer: {
      width: Dimensions.get('window').width - 175,
      height: (Dimensions.get('window').height - 55) / 2 - 125,
      backgroundColor: 'rgba(255,255,255,0.8)',
      borderRadius: 7,
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      imageIcon: {
        width: Dimensions.get('window').width - 175 - 125,
        height: (Dimensions.get('window').height - 55) / 2 - 125 - 125,
        marginVertical: 12,
        borderRadius: 6,
        resizeMode: 'stretch',
        borderColor: 'red',
        borderWidth: 0,
      },
      textStyle: {
        width: Dimensions.get('window').width - 175,
        height: 63,
        marginVertical: 7,
        borderColor: 'red',
        borderWidth: 0,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        text: {
          fontSize: 35,
          textAlign: 'center',
          fontWeight: 'bold',
          color: '#0080FF',
        },
      },
    },
  },
};

function resizeMode() {
  let screenWidth = Dimensions.get('window').width.toFixed();
  let screenHeight = Dimensions.get('window').height.toFixed();
  console.log('resizeMode screenWidth', screenWidth);
  console.log('resizeMode screenHeight', screenHeight);
  if (parseInt(screenWidth, 10) <= 674 && parseInt(screenHeight, 10) <= 793) {
    styleJson.lineContainer.imageContainer.imageIcon.width = 89;
    styleJson.lineContainer.imageContainer.imageIcon.height = 99;
    styleJson.lineContainer.imageContainer.imageIcon.marginVertical = 21;
    styleJson.lineContainer.imageContainer.width = 285;
    styleJson.lineContainer.imageContainer.height = 256;
  }
  if (parseInt(screenWidth, 10) <= 384 && parseInt(screenHeight, 10) <= 592) {
    styleJson.lineContainer.imageContainer.textStyle.text.fontSize = 25;
    styleJson.lineContainer.imageContainer.height = 210;
    styleJson.lineContainer.imageContainer.imageIcon.marginVertical = 10;
  }
  if (parseInt(screenWidth, 10) <= 768 && parseInt(screenHeight, 10) <= 976) {
    styleJson.lineContainer.imageContainer.imageIcon.width = 89;
    styleJson.lineContainer.imageContainer.imageIcon.height = 99;
    styleJson.lineContainer.imageContainer.imageIcon.marginVertical = 21;
    styleJson.lineContainer.imageContainer.width = 285;
    styleJson.lineContainer.imageContainer.height = 256;
  }
  if (parseInt(screenWidth, 10) <= 393 && parseInt(screenHeight, 10) <= 803) {
    styleJson.lineContainer.imageContainer.textStyle.text.fontSize = 25;
  }
  return styleJson;
}

const styles = StyleSheet.create(resizeMode());

export default class Index extends Component {
  constructor() {
    super();
    this.state = {
      albums: null,
    };
  }
  componentDidMount() {
    let albums = null;
    if (
      this.props.route.params !== null &&
      typeof this.props.route.params !== 'undefined'
    ) {
      albums = this.props.route.params.albums;
      this.setState({albums: albums});
    }
    console.log('SelectMethod componentDidMount albums', albums);
  }
  /**
   * 返回上一页
   */
  gotoBack = () => {
    console.log(' gotoBack props ', this.props);
    this.props.navigation.goBack();
  };
  gotoPageNormal = PageRoute => {
    let albums = this.state.albums;
    this.props.navigation.navigate(PageRoute, {albums: albums});
  };
  render() {
    let screenWidth = Dimensions.get('window').width.toFixed();
    let screenHeight = Dimensions.get('window').height.toFixed();
    console.log('render screenWidth', screenWidth);
    console.log('render screenHeight', screenHeight);
    return (
      <View style={styles.container}>
        {/*AppBar B*/}
        <View style={styles.barHeader}>
          <TouchableOpacity
            onPress={() => {
              this.gotoBack();
            }}>
            <Icon
              style={styles.forwardBack}
              name="chevron-back-outline"
              size={styles.forwardBack.iconSize}
            />
          </TouchableOpacity>
          <View style={styles.barHeaderTitleContainer}>
            <Text numberOfLines={1} style={styles.barHeaderTitle}>
              选择导入方式
            </Text>
          </View>
        </View>
        {/*AppBar E*/}
        {/*本地导入B*/}
        <TouchableOpacity
          onPress={() => {
            this.gotoPageNormal('ScanFile');
          }}>
          <View style={styles.lineContainer}>
            <View style={styles.lineContainer.imageContainer}>
              <Image
                style={styles.lineContainer.imageContainer.imageIcon}
                source={require('../../../images/mobileMusic.png')}
              />
              <View style={styles.lineContainer.imageContainer.textStyle}>
                <Text
                  style={styles.lineContainer.imageContainer.textStyle.text}>
                  从手机本地导入
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
        {/*本地导入E*/}
        {/*网络导入B*/}
        <TouchableOpacity
          onPress={() => {
            this.gotoPageNormal('NetworkImport');
          }}>
          <View style={styles.lineContainer}>
            <View style={styles.lineContainer.imageContainer}>
              <Image
                style={styles.lineContainer.imageContainer.imageIcon}
                source={require('../../../images/cloudImport.png')}
              />
              <View style={styles.lineContainer.imageContainer.textStyle}>
                <Text
                  style={styles.lineContainer.imageContainer.textStyle.text}>
                  从网络导入
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
        {/*网络导入E*/}
      </View>
    );
  }
}
