/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Dimensions,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
  Alert,
  RefreshControl,
} from 'react-native';
import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';
import {QRCodeImg} from 'qrcode-react-native';
import {
  GetRecentlyListenedPage,
  GetUserInfoById,
  QueryRecentlyListenedAlbumPage,
  queryAlbumSongData,
} from '../../utils/api';
import MiniLoading from '../../components/MiniLoading';

let styleJson = {
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  bgImage: {
    flex: 1,
    resizeMode: 'cover',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  mainContainer: {
    width: Dimensions.get('window').width - 55,
    height: Dimensions.get('window').height - 218,
    marginVertical: 95,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 17,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    center: {
      width: Dimensions.get('window').width - 95,
      height: Dimensions.get('window').height - 278,
      borderColor: 'red',
      borderWidth: 0,
      userName: {
        marginVertical: 85,
        width: Dimensions.get('window').width - 95,
        height: 55,
        borderColor: 'red',
        borderWidth: 0,
        Text: {
          fontSize: 27,
          textAlign: 'center',
          marginVertical: 5,
          textAlignVertical: 'center',
          color: 'rgba(82, 82, 82, 0.8)',
          fontWeight: 'bold',
        },
      },
      registedTime: {
        width: Dimensions.get('window').width - 95,
        height: 32,
        marginVertical: -92,
        borderColor: 'red',
        borderWidth: 0,
        Text: {
          fontSize: 16,
          textAlign: 'center',
          marginVertical: 5,
          textAlignVertical: 'center',
          color: 'rgba(82, 82, 82, 0.8)',
        },
      },
      detail: {
        width: Dimensions.get('window').width - 95,
        height: 394,
        marginVertical: 105,
        borderColor: 'red',
        borderWidth: 0,
        detailTab: {
          width: Dimensions.get('window').width - 95,
          height: 65,
          flexDirection: 'row',
          borderColor: 'red',
          borderWidth: 0,
        },
        detailTabContainer: {
          width: Dimensions.get('window').width - 95,
          height: 328,
          flexDirection: 'column',
          borderColor: 'red',
          borderWidth: 0,
        },
      },
    },
  },
  detailTabActive: {
    width: 135,
    height: 65,
    borderBottomColor: '#4A79EB',
    borderBottomWidth: 3,
    Text: {
      fontSize: 23,
      color: '#4A79EB',
      fontWeight: 'bold',
      marginVertical: 12,
      textAlign: 'center',
      textAlignVertical: 'center',
    },
  },
  detailTabNormarl: {
    width: 135,
    height: 65,
    borderColor: 'red',
    borderWidth: 0,
    Text: {
      fontSize: 23,
      color: 'rgba(82, 82, 82, 0.8)',
      fontWeight: 'bold',
      marginVertical: 12,
      textAlign: 'center',
      textAlignVertical: 'center',
    },
  },
  userFace: {
    width: 186,
    height: 186,
    borderColor: 'red',
    borderWidth: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 95,
    left: (Dimensions.get('window').width - 186) / 2,
    top: 75,
    zIndex: 200,
    position: 'absolute',
  },
  appBar: {
    width: Dimensions.get('window').width,
    height: 55,
    flexDirection: 'row',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    appBarTitleContainer: {
      width: Dimensions.get('window').width - 85,
      height: 55,
      borderColor: 'red',
      borderWidth: 0,
    },
    appBarTitle: {
      fontSize: 25,
      fontWeight: 'bold',
      textAlign: 'center',
      marginVertical: 9,
      textAlignVertical: 'center',
      color: 'rgba(82, 82, 82, 0.8)',
    },
  },
  forwardBack: {
    marginVertical: 10,
    iconSize: 35,
  },
  scrollView: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 55,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

function resizeMode() {
  let screenWidth = Dimensions.get('window').width.toFixed();
  let screenHeight = Dimensions.get('window').height.toFixed();
  console.log('screenWidth', screenWidth);
  console.log('screenHeight', screenHeight);
  if (screenWidth <= 360 || screenHeight <= 732) {
    console.log('360x732');
    styleJson.appBar.height = 43;
    styleJson.appBar.appBarTitleContainer.height = 43;
    styleJson.appBar.appBarTitle.fontSize = 21;
    styleJson.forwardBack.iconSize = 23;
    styleJson.userFace.width = 118;
    styleJson.userFace.height = 118;
    styleJson.userFace.top = 10;
    styleJson.userFace.left = (screenWidth - styleJson.userFace.width) / 2;
    styleJson.mainContainer.borderWidth = 1;
    styleJson.mainContainer.marginVertical = 350;
    styleJson.mainContainer.width = screenWidth - 35;
    styleJson.mainContainer.height = screenHeight - 238;
    styleJson.mainContainer.center.marginVertical = 75;
    styleJson.mainContainer.center.width = styleJson.mainContainer.width - 10;
    let centerWidth = styleJson.mainContainer.center.width;
    styleJson.mainContainer.center.height = styleJson.mainContainer.height - 50;
    styleJson.mainContainer.center.userName.width = centerWidth;
    styleJson.mainContainer.center.userName.height = 37;
    styleJson.mainContainer.center.userName.Text.fontSize = 21;
    styleJson.mainContainer.center.userName.marginVertical = 10;
    styleJson.mainContainer.center.registedTime.width = centerWidth;
    styleJson.mainContainer.center.registedTime.marginVertical = 2;
    styleJson.mainContainer.center.detail.width = centerWidth;
    styleJson.mainContainer.center.detail.marginVertical = 3;
    styleJson.mainContainer.center.detail.detailTab.width = centerWidth;
    styleJson.mainContainer.center.detail.detailTab.height = 39;
    styleJson.mainContainer.center.detail.detailTabContainer.width =
      centerWidth;
    styleJson.mainContainer.center.detail.detailTabContainer.height = 365;
    styleJson.detailTabActive.width = 105;
    styleJson.detailTabActive.height = 37;
    styleJson.detailTabActive.Text.marginVertical = 3;
    styleJson.detailTabActive.Text.fontSize = 15;
    styleJson.detailTabNormarl.width = 105;
    styleJson.detailTabNormarl.height = 37;
    styleJson.detailTabNormarl.Text.marginVertical = 3;
    styleJson.detailTabNormarl.Text.fontSize = 15;
  } else if (screenWidth <= 360 || screenHeight <= 592) {
    styleJson.appBar.height = 43;
    styleJson.appBar.appBarTitleContainer.height = 43;
    styleJson.appBar.appBarTitle.fontSize = 21;
    styleJson.forwardBack.iconSize = 23;
    styleJson.userFace.width = 98;
    styleJson.userFace.height = 98;
    styleJson.userFace.left = (screenWidth - styleJson.userFace.width) / 2;
    styleJson.mainContainer.width = screenWidth - 35;
    styleJson.mainContainer.height = screenHeight - 198;
    styleJson.mainContainer.center.width = styleJson.mainContainer.width - 10;
    let centerWidth = styleJson.mainContainer.center.width;
    styleJson.mainContainer.center.height = styleJson.mainContainer.height - 50;
    styleJson.mainContainer.center.userName.width = centerWidth;
    styleJson.mainContainer.center.userName.height = 37;
    styleJson.mainContainer.center.userName.Text.fontSize = 21;
    styleJson.mainContainer.center.userName.marginVertical = 10;
    styleJson.mainContainer.center.registedTime.width = centerWidth;
    styleJson.mainContainer.center.registedTime.marginVertical = 2;
    styleJson.mainContainer.center.detail.width = centerWidth;
    styleJson.mainContainer.center.detail.marginVertical = 3;
    styleJson.mainContainer.center.detail.detailTab.width = centerWidth;
    styleJson.mainContainer.center.detail.detailTab.height = 39;
    styleJson.mainContainer.center.detail.detailTabContainer.width =
      centerWidth;
    styleJson.mainContainer.center.detail.detailTabContainer.height = 195;
    styleJson.detailTabActive.width = 105;
    styleJson.detailTabActive.height = 37;
    styleJson.detailTabActive.Text.marginVertical = 3;
    styleJson.detailTabActive.Text.fontSize = 15;
    styleJson.detailTabNormarl.width = 105;
    styleJson.detailTabNormarl.height = 37;
    styleJson.detailTabNormarl.Text.marginVertical = 3;
    styleJson.detailTabNormarl.Text.fontSize = 15;
  } else if (screenWidth <= 384 || screenHeight <= 592) {
    styleJson.appBar.height = 43;
    styleJson.appBar.appBarTitleContainer.height = 43;
    styleJson.appBar.appBarTitle.fontSize = 21;
    styleJson.forwardBack.iconSize = 23;
    styleJson.userFace.width = 98;
    styleJson.userFace.height = 98;
    styleJson.userFace.left = (screenWidth - styleJson.userFace.width) / 2;
    styleJson.mainContainer.width = screenWidth - 35;
    styleJson.mainContainer.height = screenHeight - 198;
    styleJson.mainContainer.center.width = styleJson.mainContainer.width - 10;
    let centerWidth = styleJson.mainContainer.center.width;
    styleJson.mainContainer.center.height = styleJson.mainContainer.height - 50;
    styleJson.mainContainer.center.userName.width = centerWidth;
    styleJson.mainContainer.center.userName.height = 37;
    styleJson.mainContainer.center.userName.Text.fontSize = 21;
    styleJson.mainContainer.center.userName.marginVertical = 10;
    styleJson.mainContainer.center.registedTime.width = centerWidth;
    styleJson.mainContainer.center.registedTime.marginVertical = 2;
    styleJson.mainContainer.center.detail.width = centerWidth;
    styleJson.mainContainer.center.detail.marginVertical = 3;
    styleJson.mainContainer.center.detail.detailTab.width = centerWidth;
    styleJson.mainContainer.center.detail.detailTab.height = 39;
    styleJson.mainContainer.center.detail.detailTabContainer.width =
      centerWidth;
    styleJson.mainContainer.center.detail.detailTabContainer.height = 195;
    styleJson.detailTabActive.width = 105;
    styleJson.detailTabActive.height = 37;
    styleJson.detailTabActive.Text.marginVertical = 3;
    styleJson.detailTabActive.Text.fontSize = 15;
    styleJson.detailTabNormarl.width = 105;
    styleJson.detailTabNormarl.height = 37;
    styleJson.detailTabNormarl.Text.marginVertical = 3;
    styleJson.detailTabNormarl.Text.fontSize = 15;
  } else if (screenWidth <= 393 || screenHeight <= 753) {
    styleJson.appBar.height = 43;
    styleJson.appBar.appBarTitleContainer.height = 43;
    styleJson.appBar.appBarTitle.fontSize = 21;
    styleJson.forwardBack.iconSize = 23;
    styleJson.userFace.width = 98;
    styleJson.userFace.height = 98;
    styleJson.userFace.top = 5;
    styleJson.userFace.left = (screenWidth - styleJson.userFace.width) / 2;
    styleJson.mainContainer.width = screenWidth - 35;
    styleJson.mainContainer.height = screenHeight - 198;
    styleJson.mainContainer.center.width = styleJson.mainContainer.width - 10;
    let centerWidth = styleJson.mainContainer.center.width;
    styleJson.mainContainer.center.height = styleJson.mainContainer.height - 50;
    styleJson.mainContainer.center.userName.width = centerWidth;
    styleJson.mainContainer.center.userName.height = 37;
    styleJson.mainContainer.center.userName.Text.fontSize = 21;
    styleJson.mainContainer.center.userName.marginVertical = 10;
    styleJson.mainContainer.center.registedTime.width = centerWidth;
    styleJson.mainContainer.center.registedTime.marginVertical = 2;
    styleJson.mainContainer.center.detail.width = centerWidth;
    styleJson.mainContainer.center.detail.marginVertical = 3;
    styleJson.mainContainer.center.detail.detailTab.width = centerWidth;
    styleJson.mainContainer.center.detail.detailTab.height = 39;
    styleJson.mainContainer.center.detail.detailTabContainer.width =
      centerWidth;
    styleJson.mainContainer.center.detail.detailTabContainer.height = 385;
    //styleJson.mainContainer.center.detail.detailTabContainer.height =detailHeight;
    styleJson.detailTabActive.width = 105;
    styleJson.detailTabActive.height = 37;
    styleJson.detailTabActive.Text.marginVertical = 3;
    styleJson.detailTabActive.Text.fontSize = 15;
    styleJson.detailTabNormarl.width = 105;
    styleJson.detailTabNormarl.height = 37;
    styleJson.detailTabNormarl.Text.marginVertical = 3;
    styleJson.detailTabNormarl.Text.fontSize = 15;
  } else if (
    parseInt(screenWidth, 10) <= 320 ||
    parseInt(screenHeight, 10) <= 426
  ) {
    styleJson.forwardBack.iconSize = 15;
    styleJson.appBar.height = 39;
    styleJson.appBar.appBarTitleContainer.width =
      screenWidth - styleJson.forwardBack.iconSize;
    styleJson.appBar.appBarTitleContainer.height = 37;
    styleJson.appBar.appBarTitle.fontSize = 15;
    styleJson.userFace.width = 0;
    styleJson.userFace.height = 0;
    styleJson.userFace.top = 19;
    styleJson.userFace.left = (screenWidth - styleJson.userFace.width) / 2;
    styleJson.mainContainer.center.borderWidth = 0;
    styleJson.mainContainer.center.userName.borderWidth = 0;
    styleJson.mainContainer.width = screenWidth - 15;
    styleJson.mainContainer.marginVertical = 1795;
    styleJson.mainContainer.center.height = 333;
    styleJson.mainContainer.height = 335;
    styleJson.mainContainer.center.width = styleJson.mainContainer.width - 5;
    let centerWidth = styleJson.mainContainer.center.width;
    styleJson.mainContainer.center.userName.width = centerWidth;
    styleJson.mainContainer.center.userName.Text.fontSize = 17;
    styleJson.mainContainer.center.userName.height = 37;
    styleJson.mainContainer.center.userName.marginVertical = 10;
    styleJson.mainContainer.center.registedTime.marginVertical = 3;
    styleJson.mainContainer.center.detail.width = centerWidth;
    styleJson.mainContainer.center.detail.detailTab.width = centerWidth;
    styleJson.mainContainer.center.detail.marginVertical = 3;
    styleJson.mainContainer.center.detail.detailTab.height = 37;
    styleJson.mainContainer.center.detail.detailTabContainer.width =
      centerWidth;
    styleJson.detailTabActive.width = 105;
    styleJson.detailTabActive.height = 37;
    styleJson.detailTabActive.Text.marginVertical = 3;
    styleJson.detailTabActive.Text.fontSize = 15;
    styleJson.detailTabNormarl.width = 105;
    styleJson.detailTabNormarl.height = 37;
    styleJson.detailTabNormarl.Text.marginVertical = 3;
    styleJson.detailTabNormarl.Text.fontSize = 15;
  } else if (
    parseInt(screenWidth, 10) <= 480 ||
    parseInt(screenHeight, 10) <= 854
  ) {
    console.log('480x854');
    styleJson.userFace = {
      width: 176,
      height: 176,
      borderColor: 'red',
      borderWidth: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderRadius: 95,
      left: (Dimensions.get('window').width - 186) / 2,
      top: 5,
      zIndex: 200,
      position: 'absolute',
    };
  } else if (
    parseInt(screenWidth, 10) <= 673 ||
    parseInt(screenHeight, 10) <= 793
  ) {
    styleJson.mainContainer.center.detail.height = 375;
    styleJson.mainContainer.center.detail.detailTabContainer.height = 295;
  }
  return styleJson;
}

const styles = StyleSheet.create(resizeMode());

let signStyleJson = {
  alignCenter: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signatureContainer: {
    width: Dimensions.get('window').width - 105,
    height: 318,
    backgroundColor: 'rgba(204, 204, 204, 0.8)',
    borderRadius: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    signatureText: {
      width: Dimensions.get('window').width - 132,
      height: 267,
      fontSize: 17,
      color: 'black',
      fontWeight: 'bold',
      textAlign: 'left',
      textAlignVertical: 'top',
      borderColor: 'red',
      borderWidth: 0,
    },
  },
};

function resizeModeSignature() {
  let screenWidth = Dimensions.get('window').width.toFixed();
  let screenHeight = Dimensions.get('window').height.toFixed();
  if (screenWidth <= 360 || screenHeight <= 732) {
    let containerWidth =
      styleJson.mainContainer.center.detail.detailTabContainer.width;
    signStyleJson.signatureContainer.width = containerWidth - 20;
    signStyleJson.signatureContainer.marginVertical = -50;
    signStyleJson.signatureContainer.height = 270;
    let signatureContainerWidth = signStyleJson.signatureContainer.width;
    let signatureContainerHeight = signStyleJson.signatureContainer.height;
    signStyleJson.signatureContainer.signatureText.width =
      signatureContainerWidth - 10;
    signStyleJson.signatureContainer.signatureText.height =
      signatureContainerHeight - 10;
  } else if (screenWidth === 360 && screenHeight === 592) {
    let containerWidth =
      styleJson.mainContainer.center.detail.detailTabContainer.width;
    signStyleJson.signatureContainer.width = containerWidth - 20;
    signStyleJson.signatureContainer.height = 150;
    let signatureContainerWidth = signStyleJson.signatureContainer.width;
    let signatureContainerHeight = signStyleJson.signatureContainer.height;
    signStyleJson.signatureContainer.signatureText.width =
      signatureContainerWidth - 10;
    signStyleJson.signatureContainer.signatureText.height =
      signatureContainerHeight - 10;
  } else if (screenWidth <= 384 || screenHeight <= 592) {
    let containerWidth =
      styleJson.mainContainer.center.detail.detailTabContainer.width;
    signStyleJson.signatureContainer.width = containerWidth - 20;
    signStyleJson.signatureContainer.height = 180;
    let signatureContainerWidth = signStyleJson.signatureContainer.width;
    let signatureContainerHeight = signStyleJson.signatureContainer.height;
    signStyleJson.signatureContainer.signatureText.width =
      signatureContainerWidth - 10;
    signStyleJson.signatureContainer.signatureText.height =
      signatureContainerHeight - 10;
  } else if (screenWidth <= 392 || screenHeight <= 753) {
    let containerWidth =
      styleJson.mainContainer.center.detail.detailTabContainer.width;
    signStyleJson.signatureContainer.width = containerWidth - 20;
    signStyleJson.signatureContainer.height = 350;
    let signatureContainerWidth = signStyleJson.signatureContainer.width;
    let signatureContainerHeight = signStyleJson.signatureContainer.height;
    signStyleJson.signatureContainer.signatureText.width =
      signatureContainerWidth - 10;
    signStyleJson.signatureContainer.signatureText.height =
      signatureContainerHeight - 10;
  } else if (
    parseInt(screenWidth, 10) >= 480 ||
    parseInt(screenHeight, 10) >= 854
  ) {
  } else if (
    parseInt(screenWidth, 10) >= 673 ||
    parseInt(screenHeight, 10) >= 793
  ) {
    let containerWidth =
      styleJson.mainContainer.center.detail.detailTabContainer.width;
    signStyleJson.signatureContainer.width = containerWidth - 20;
    signStyleJson.signatureContainer.height = 265;
    signStyleJson.signatureContainer.marginVertical = -115;
    let signatureContainerWidth = signStyleJson.signatureContainer.width;
    let signatureContainerHeight = signStyleJson.signatureContainer.height;
    signStyleJson.signatureContainer.signatureText.width =
      signatureContainerWidth - 10;
    signStyleJson.signatureContainer.signatureText.height =
      signatureContainerHeight - 10;
  } else if (
    parseInt(screenWidth, 10) <= 320 ||
    parseInt(screenHeight, 10) <= 426
  ) {
    let containerWidth =
      styleJson.mainContainer.center.detail.detailTabContainer.width;
    signStyleJson.signatureContainer.borderWidth = 0;
    signStyleJson.signatureContainer.width = containerWidth - 3;
    signStyleJson.signatureContainer.height = 0;
    signStyleJson.signatureContainer.marginVertical = -515;
  }
  return signStyleJson;
}

const signatureStyles = StyleSheet.create(resizeModeSignature());

function Signature(props) {
  console.log('Signature props', props);
  let userObject = props.userObject;
  let signatureText = '';
  if (userObject !== null && typeof userObject !== 'undefined') {
    signatureText = userObject.signature;
  }
  return (
    <View
      style={[
        styles.mainContainer.center.detail.detailTabContainer,
        signatureStyles.alignCenter,
      ]}>
      <View style={signatureStyles.signatureContainer}>
        <TextInput
          multiline={true}
          editable={false}
          style={signatureStyles.signatureContainer.signatureText}>
          {signatureText}
        </TextInput>
      </View>
    </View>
  );
}

let csStylesJson = {
  alignCenter: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  songItemContainer: {
    width: Dimensions.get('window').width - 125,
    height: 87,
    marginVertical: 10,
    borderRadius: 6,
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    cover: {
      width: 76,
      height: 76,
      marginHorizontal: 5,
      marginVertical: 5,
      borderRadius: 6,
    },
    info: {
      width: Dimensions.get('window').width - 235,
      height: 76,
      marginHorizontal: 5,
      marginVertical: 5,
      borderColor: 'red',
      flexDirection: 'column',
      borderWidth: 0,
      songName: {
        fontSize: 21,
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'left',
        marginHorizontal: 5,
        marginVertical: 5,
      },
      author: {
        fontSize: 15,
        color: 'black',
        textAlign: 'left',
        marginHorizontal: 5,
        marginVertical: 5,
      },
    },
  },
};

function resizeModeConstantSong() {
  let screenWidth = Dimensions.get('window').width.toFixed();
  let screenHeight = Dimensions.get('window').height.toFixed();
  if (screenWidth === 360 && screenHeight === 592) {
    let containerWidth =
      styleJson.mainContainer.center.detail.detailTabContainer.width;
    csStylesJson.songItemContainer.width = containerWidth - 10;
    let itemContainerWidth = csStylesJson.songItemContainer.width;
    let itemCoverWidth = csStylesJson.songItemContainer.cover.width;
    csStylesJson.songItemContainer.info.width =
      itemContainerWidth - itemCoverWidth - 5;
  } else if (
    parseInt(screenWidth, 10) <= 360 &&
    parseInt(screenHeight, 10) <= 732
  ) {
    styleJson.mainContainer.center.detail.detailTabContainer.borderWidth = 0;
    let containerWidth =
      styleJson.mainContainer.center.detail.detailTabContainer.width;
    let detailTabHeight =
      styleJson.mainContainer.center.detail.detailTab.height;
    styleJson.mainContainer.center.detail.detailTabContainer.height =
      styleJson.mainContainer.center.detail.height - detailTabHeight - 33;
    csStylesJson.songItemContainer.width = containerWidth - 10;
    let itemContainerWidth = csStylesJson.songItemContainer.width;
    let itemCoverWidth = csStylesJson.songItemContainer.cover.width;
    csStylesJson.songItemContainer.info.width =
      itemContainerWidth - itemCoverWidth - 5;
  } else if (screenWidth <= 392 || screenHeight <= 753) {
    styleJson.mainContainer.center.detail.detailTabContainer.borderWidth = 0;
    let containerWidth =
      styleJson.mainContainer.center.detail.detailTabContainer.width;
    let detailTabHeight =
      styleJson.mainContainer.center.detail.detailTab.height;
    styleJson.mainContainer.center.detail.detailTabContainer.height =
      styleJson.mainContainer.center.detail.height - detailTabHeight - 3;
    csStylesJson.songItemContainer.width = containerWidth - 10;
    let itemContainerWidth = csStylesJson.songItemContainer.width;
    let itemCoverWidth = csStylesJson.songItemContainer.cover.width;
    csStylesJson.songItemContainer.info.width =
      itemContainerWidth - itemCoverWidth - 5;
  } else if (
    parseInt(screenWidth, 10) >= 673 ||
    parseInt(screenHeight, 10) >= 793
  ) {
    let containerWidth =
      styleJson.mainContainer.center.detail.detailTabContainer.width;
    csStylesJson.songItemContainer.width = containerWidth - 10;
    let itemContainerWidth = csStylesJson.songItemContainer.width;
    let itemCoverWidth = csStylesJson.songItemContainer.cover.width;
    csStylesJson.songItemContainer.info.width =
      itemContainerWidth - itemCoverWidth - 5;
  }
  return csStylesJson;
}

const csStyles = StyleSheet.create(resizeModeConstantSong());

/**
 * 常听歌曲信息
 */
class ConstantSong extends Component {
  constructor() {
    super();
    this.state = {
      PageSize: 10,
      CurPage: 1,
      UserId: '',
      isLoadComplete: false,
      isLoadUpComplate: false,
      nomore: false,
      PageData: null,
      DataCount: 0,
      PageCount: 0,
      SortField: 'CreatedDataTime',
      SortMethod: 'DESC',
      refreshing: false, // 是否刷新标识
      errMsg: '',
    };
  }

  //获得每页数据
  getPageData = UserId => {
    console.log('getPageData state', this.state);
    GetRecentlyListenedPage({
      parm: {
        UserId: UserId,
        SortField: this.state.SortField,
        SortMethod: this.state.SortMethod,
        PageSize: this.state.PageSize,
        CurPage: this.state.CurPage,
      },
      beforeCallBack: () => {},
      responseCallBack: res => {
        console.log('GetRecentlyListenedPage res', res);
        res.then(resData => {
          if (resData !== null && typeof resData !== 'undefined') {
            console.log('GetRecentlyListenedPage response data', resData);
            const {status, result, msg, pageCount, recordCount} = resData;
            let PageData = this.state.PageData;
            let CurPage = this.state.CurPage;
            let PageSize = this.state.PageSize;
            let nomore = this.state.nomore;
            if (status !== 0) {
              Alert.alert('错误', `获取分页数据出错,原因[${msg}]`);
              this.setState({errMsg: `获取分页数据出错,原因[${msg}]`});
            } else {
              console.log('GetRecentlyListenedPage response result', result);
              if (recordCount > 0) {
                if (result !== null && typeof result !== 'undefined') {
                  if (CurPage === 1) {
                    PageData = result;
                  } else if (
                    CurPage <= pageCount &&
                    PageData.length <= PageSize * CurPage
                  ) {
                    for (var i = 0; i < result.length; i++) {
                      PageData.push(result[i]);
                    }
                  } else {
                    nomore = true;
                  }
                }
              }
            }
            console.log('GetRecentlyListenedPage response PageData', PageData);
            console.log(
              'GetRecentlyListenedPage response pageCount',
              pageCount,
            );
            console.log(
              'GetRecentlyListenedPage response recordCount',
              recordCount,
            );
            this.setState({
              UserId: UserId,
              isLoadComplete: true,
              PageData: PageData,
              DataCount: recordCount,
              PageCount: pageCount,
              nomore: nomore,
            });
          }
        });
      },
      errorCallback: error => {
        Alert.alert('错误', `获取分页数据出错,原因[${error}]`);
      },
    });
  };

  /**
   * 组件挂载方法
   */
  componentDidMount() {
    let userId = '-1';
    if (
      this.props.UserId !== null &&
      typeof this.props.UserId !== 'undefined'
    ) {
      userId = this.props.UserId;
      console.log('userId', userId);
      this.getPageData(userId);
    }
  }

  //空数据组件
  ListEmptyComponent = () => {
    let containerWidth =
      styleJson.mainContainer.center.detail.detailTabContainer.width;
    let containerHeight =
      styleJson.mainContainer.center.detail.detailTabContainer.height;
    let tipsHeight = 50;
    let tipsFontSize = tipsHeight - 20;
    return (
      <TouchableOpacity
        onPress={() => {
          let UserId = this.props.UserId;
          if (UserId !== '' && typeof UserId !== 'undefined') {
            this.getPageData(UserId);
          }
        }}>
        <View
          style={{
            width: containerWidth,
            height: containerHeight,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: 'black',
              fontSize: tipsFontSize,
              textAlign: 'center',
            }}>
            没有数据点击刷新
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  //列表结尾组件
  ListFooterComponent = () => {
    let containerWidth = csStyles.songItemContainer.width;
    let containerHeight = csStyles.songItemContainer.height;
    let loadingSize = 21;
    let nomore = this.state.nomore;
    console.log('ListFooterComponent');
    return !nomore ? (
      <MiniLoading
        Width={containerWidth}
        Height={containerHeight}
        Size={loadingSize}
      />
    ) : (
      <View style={{width: containerWidth, height: containerHeight}}>
        <Text
          style={{color: '#ccc', fontSize: loadingSize, textAlign: 'center'}}>
          已经加载全部
        </Text>
      </View>
    );
  };

  //上拉加载事件
  _onEndReached = () => {
    console.log('_onEndReached');
    let CurPage = this.state.CurPage;
    let PageCount = this.state.PageCount;
    let nomore = this.state.nomore;
    CurPage += 1;
    console.log('_onEndReached CurPage', CurPage);
    console.log('_onEndReached PageCount', PageCount);
    if (CurPage >= PageCount) {
      CurPage = PageCount;
      nomore = true;
      this.setState({CurPage: CurPage, nomore: nomore});
    } else {
      this.setState({CurPage: CurPage});
    }
    this.getPageData(this.state.UserId);
  };

  //下拉刷新事件
  onRefresh = () => {
    this.setState(
      {
        CurPage: 1,
        nomore: false,
        isLoadComplete: false,
        isLoadUpComplate: false,
      },
      () => {
        this.getPageData(this.props.UserId);
      },
    );
  };

  gotoPlay = songId => {
    this.props.navigation.navigate('PlayPage', {songId: songId});
  };

  renderItem = ({index, item}) => {
    return (
      <View style={csStyles.songItemContainer}>
        <TouchableOpacity
          style={csStyles.songItemContainer}
          onPress={() => {
            let songId = item.songId;
            this.gotoPlay(songId);
          }}>
          <Image
            source={{uri: item.cover}}
            style={csStyles.songItemContainer.cover}
          />
          <View style={csStyles.songItemContainer.info}>
            <Text
              numberOfLines={1}
              style={csStyles.songItemContainer.info.songName}>
              {item.title}
            </Text>
            <Text
              numberOfLines={1}
              style={csStyles.songItemContainer.info.author}>
              {item.artist}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  render() {
    return (
      <View
        style={[
          styles.mainContainer.center.detail.detailTabContainer,
          csStyles.alignCenter,
          {backgroundColor: 'rgba(204, 204, 204, 0.3)'},
        ]}>
        {!this.state.isLoadComplete ? (
          <MiniLoading
            Width={styles.mainContainer.center.detail.detailTabContainer.width}
            Height={
              styles.mainContainer.center.detail.detailTabContainer.height
            }
            Size={65}
          />
        ) : (
          <FlatList
            nestedScrollEnabled={true}
            data={this.state.PageData}
            renderItem={this.renderItem}
            keyExtractor={item => item.recordID}
            ListFooterComponent={this.ListFooterComponent}
            ListEmptyComponent={this.ListEmptyComponent}
            onEndReached={this._onEndReached}
            onEndReachedThreshold={0.1}
            refreshing={true}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                colors={['#ff0000', '#00ff00', '#0000ff']}
                progressBackgroundColor={'#ffffff'}
                onRefresh={() => {
                  this.onRefresh();
                }}
              />
            }
            horizontal={false} //是否水平布局模式
          />
        )}
      </View>
    );
  }
}

const aslStyles = StyleSheet.create({
  coverItem: {
    width: 78,
    height: 78,
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 5,
  },
});

/**
 * 专辑歌曲列表
 * */
class AlbumSongList extends Component {
  constructor() {
    super();
    this.state = {
      albumId: '-1',
      isLoadComplete: false,
      songData: null,
    };
  }
  gotoPlay = songId => {
    this.props.navigation.navigate('PlayPage', {songId: songId});
  };
  renderItem = ({index, item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.gotoPlay(item.songId);
        }}>
        <Image style={aslStyles.coverItem} source={{uri: item.cover}} />
      </TouchableOpacity>
    );
  };
  GetAlbumSongData = albumId => {
    queryAlbumSongData({
      parm: {
        albumId: albumId,
        limit: 10,
      },
      beforeCallBack: () => {},
      responseCallBack: res => {
        res.then(resData => {
          const {status, msg, result} = resData;
          if (status !== 0) {
            Alert.alert('错误', `读取专辑歌曲信息出错,原因[${msg}]`);
          }
          this.setState({
            albumId: albumId,
            isLoadComplete: true,
            songData: result,
          });
        });
      },
    });
  };
  componentDidMount() {
    let albumId = this.props.albumId;
    this.GetAlbumSongData(albumId);
  }
  render() {
    const {songData} = this.props;
    let loadingSize = 21;
    return !this.state.isLoadComplete ? (
      <MiniLoading
        Width={this.props.Width}
        Height={this.props.Height}
        Size={loadingSize}
      />
    ) : (
      <FlatList
        nestedScrollEnabled={true}
        data={this.state.songData}
        renderItem={this.renderItem}
        keyExtractor={item => item.songId}
        horizontal={true}
      />
    );
  }
}

let caStylesJson = {
  alignCenter: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  albumsInfoItem: {
    width: Dimensions.get('window').width - 125,
    height: 187,
    marginVertical: 10,
    borderRadius: 6,
    flexDirection: 'column',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    albumsInfo: {
      width: Dimensions.get('window').width - 152,
      height: 86,
      borderBottomColor: '#ccc',
      borderBottomWidth: 1,
      borderStyle: 'dotted',
      flexDirection: 'row',
      cover: {
        width: 78,
        height: 78,
        marginHorizontal: 5,
        marginVertical: 5,
        borderRadius: 10,
      },
      info: {
        width: Dimensions.get('window').width - 242,
        height: 71,
        marginHorizontal: 5,
        marginVertical: 5,
        borderColor: 'red',
        borderWidth: 0,
        albumName: {
          fontSize: 18,
          color: 'black',
          fontWeight: 'bold',
          textAlign: 'left',
          marginHorizontal: 5,
          marginVertical: 2,
        },
        author: {
          fontSize: 13,
          color: 'black',
          textAlign: 'left',
          marginHorizontal: 5,
          marginVertical: 2,
        },
        createTime: {
          fontSize: 13,
          color: '#ccc',
          textAlign: 'left',
          marginHorizontal: 5,
          marginVertical: 2,
        },
      },
    },
    songList: {
      width: Dimensions.get('window').width - 152,
      height: 85,
      marginVertical: 5,
      borderColor: 'red',
      borderWidth: 0,
    },
  },
};

function resizeCAMode() {
  let screenWidth = Dimensions.get('window').width.toFixed();
  let screenHeight = Dimensions.get('window').height.toFixed();
  //console.log('screenWidth', screenWidth);
  //console.log('screenHeight', screenHeight);
  if (screenWidth === 360 || screenHeight === 592) {
    let containerWidth =
      styleJson.mainContainer.center.detail.detailTabContainer.width;
    caStylesJson.albumsInfoItem.width = containerWidth - 10;
    let albumsInfoItemWidth = caStylesJson.albumsInfoItem.width;
    caStylesJson.albumsInfoItem.albumsInfo.width = albumsInfoItemWidth - 5;
    let albumsInfoWidth = caStylesJson.albumsInfoItem.albumsInfo.width;
    let coverWidth = caStylesJson.albumsInfoItem.albumsInfo.cover.width;
    caStylesJson.albumsInfoItem.albumsInfo.info.width =
      albumsInfoWidth - coverWidth - 3;
    caStylesJson.albumsInfoItem.songList.width = albumsInfoItemWidth;
    let detailTabHeight =
      styleJson.mainContainer.center.detail.detailTab.height;
    styleJson.mainContainer.center.detail.detailTabContainer.height =
      styleJson.mainContainer.center.detail.height - detailTabHeight - 53;
  } else if (screenWidth <= 392 || screenHeight <= 753) {
    let containerWidth =
      styleJson.mainContainer.center.detail.detailTabContainer.width;
    caStylesJson.albumsInfoItem.width = containerWidth - 10;
    let albumsInfoItemWidth = caStylesJson.albumsInfoItem.width;
    caStylesJson.albumsInfoItem.albumsInfo.width = albumsInfoItemWidth - 5;
    let albumsInfoWidth = caStylesJson.albumsInfoItem.albumsInfo.width;
    let coverWidth = caStylesJson.albumsInfoItem.albumsInfo.cover.width;
    caStylesJson.albumsInfoItem.albumsInfo.info.width =
      albumsInfoWidth - coverWidth - 3;
    caStylesJson.albumsInfoItem.songList.width = albumsInfoItemWidth;
  }
  return caStylesJson;
}

const caStyles = StyleSheet.create(resizeCAMode());

/**
 * 常听专辑列表
 */
class ConstantAlbums extends Component {
  //构造函数
  constructor() {
    super();
    this.state = {
      PageSize: 10,
      CurPage: 1,
      UserId: '',
      isLoadComplete: false,
      isLoadUpComplate: false,
      nomore: false,
      PageData: null,
      DataCount: 0,
      PageCount: 0,
      SortField: 'createdatetime',
      SortMethod: 'DESC',
      refreshing: false, // 是否刷新标识
      errMsg: '',
    };
  }

  //获得每页数据
  getPageData = UserId => {
    console.log('getPageData state', this.state);
    QueryRecentlyListenedAlbumPage({
      parm: {
        UserId: UserId,
        SortField: this.state.SortField,
        SortMethod: this.state.SortMethod,
        PageSize: this.state.PageSize,
        CurPage: this.state.CurPage,
      },
      beforeCallBack: () => {},
      responseCallBack: res => {
        console.log('QueryRecentlyListenedAlbumPage res', res);
        res.then(resData => {
          if (resData !== null && typeof resData !== 'undefined') {
            console.log(
              'QueryRecentlyListenedAlbumPage response data',
              resData,
            );
            const {status, result, msg, pageCount, recordCount} = resData;
            let PageData = this.state.PageData;
            let CurPage = this.state.CurPage;
            let PageSize = this.state.PageSize;
            let nomore = this.state.nomore;
            if (status !== 0) {
              Alert.alert('错误', `获取分页数据出错,原因[${msg}]`);
              this.setState({errMsg: `获取分页数据出错,原因[${msg}]`});
            } else {
              console.log(
                'QueryRecentlyListenedAlbumPage response result',
                result,
              );
              if (recordCount > 0) {
                if (result !== null && typeof result !== 'undefined') {
                  if (CurPage === 1) {
                    PageData = result;
                  } else if (
                    CurPage <= pageCount &&
                    PageData.length <= PageSize * CurPage
                  ) {
                    for (var i = 0; i < result.length; i++) {
                      PageData.push(result[i]);
                    }
                  } else {
                    nomore = true;
                  }
                }
              }
            }
            console.log(
              'QueryRecentlyListenedAlbumPage response PageData',
              PageData,
            );
            console.log(
              'QueryRecentlyListenedAlbumPage response pageCount',
              pageCount,
            );
            console.log(
              'QueryRecentlyListenedAlbumPage response recordCount',
              recordCount,
            );
            this.setState({
              UserId: UserId,
              isLoadComplete: true,
              PageData: PageData,
              DataCount: recordCount,
              PageCount: pageCount,
              nomore: nomore,
            });
          }
        });
      },
      errorCallback: error => {
        Alert.alert('错误', `获取分页数据出错,原因[${error}]`);
      },
    });
  };

  //空数据组件
  ListEmptyComponent = () => {
    let containerWidth =
      styleJson.mainContainer.center.detail.detailTabContainer.width;
    let containerHeight =
      styleJson.mainContainer.center.detail.detailTabContainer.height;
    let tipsHeight = 50;
    let tipsFontSize = tipsHeight - 20;
    return (
      <TouchableOpacity
        onPress={() => {
          let UserId = this.props.UserId;
          if (UserId !== '' && typeof UserId !== 'undefined') {
            this.getPageData(UserId);
          }
        }}>
        <View
          style={{
            width: containerWidth,
            height: containerHeight,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: 'black',
              fontSize: tipsFontSize,
              textAlign: 'center',
            }}>
            没有数据点击刷新
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  //列表结尾组件
  ListFooterComponent = () => {
    let containerWidth = caStylesJson.albumsInfoItem.width;
    let containerHeight = caStylesJson.albumsInfoItem.height;
    let loadingSize = 21;
    let nomore = this.state.nomore;
    console.log('ListFooterComponent');
    return !nomore ? (
      <MiniLoading
        Width={containerWidth}
        Height={containerHeight}
        Size={loadingSize}
      />
    ) : (
      <View style={{width: containerWidth, height: containerHeight}}>
        <Text
          style={{color: '#ccc', fontSize: loadingSize, textAlign: 'center'}}>
          已经加载全部
        </Text>
      </View>
    );
  };

  //上拉加载事件
  _onEndReached = () => {
    console.log('_onEndReached');
    let CurPage = this.state.CurPage;
    let PageCount = this.state.PageCount;
    let nomore = this.state.nomore;
    CurPage += 1;
    console.log('_onEndReached CurPage', CurPage);
    console.log('_onEndReached PageCount', PageCount);
    if (CurPage >= PageCount) {
      CurPage = PageCount;
      nomore = true;
      this.setState({CurPage: CurPage, nomore: nomore});
    } else {
      this.setState({CurPage: CurPage});
    }
    this.getPageData(this.state.UserId);
  };

  //下拉刷新事件
  onRefresh = () => {
    this.setState(
      {
        CurPage: 1,
        nomore: false,
        isLoadComplete: false,
        isLoadUpComplate: false,
      },
      () => {
        this.getPageData(this.props.UserId);
      },
    );
  };

  /**
   * 组件挂载方法
   */
  componentDidMount() {
    let userId = '-1';
    if (
      this.props.UserId !== null &&
      typeof this.props.UserId !== 'undefined'
    ) {
      userId = this.props.UserId;
      console.log('userId', userId);
      this.getPageData(userId);
    }
  }

  gotoPlay = albumId => {
    this.props.navigation.navigate('PlayPage', {albumId: albumId});
  };

  //单个专辑项渲染
  renderItem = ({index, item}) => {
    const {songData, albumsData} = this.props;
    return (
      <View style={caStyles.albumsInfoItem}>
        {/*专辑信息B*/}
        <View style={caStyles.albumsInfoItem.albumsInfo}>
          <TouchableOpacity
            onPress={() => {
              this.gotoPlay(item.albumId);
            }}>
            <Image
              style={caStyles.albumsInfoItem.albumsInfo.cover}
              source={{uri: item.albumCover}}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.gotoPlay(item.albumId);
            }}>
            <View style={caStyles.albumsInfoItem.albumsInfo.info}>
              <Text
                numberOfLines={1}
                style={caStyles.albumsInfoItem.albumsInfo.info.albumName}>
                {item.albumName}
              </Text>
              <Text
                numberOfLines={1}
                style={caStyles.albumsInfoItem.albumsInfo.info.author}>
                {item.albumAuthor}
              </Text>
              <Text
                numberOfLines={1}
                style={caStyles.albumsInfoItem.albumsInfo.info.author}>
                创建时间:{item.createdatetime}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        {/*专辑信息E*/}
        {/*专辑歌曲列表B*/}
        <View style={caStyles.albumsInfoItem.songList}>
          <AlbumSongList
            navigation={this.props.navigation}
            albumId={item.albumId}
            Width={caStylesJson.albumsInfoItem.songList.width}
            Height={caStylesJson.albumsInfoItem.songList.height}
            songData={songData}
          />
        </View>
        {/*专辑歌曲列表E*/}
      </View>
    );
  };

  //渲染方法
  render() {
    const {songData, albumsData} = this.props;
    return (
      <View
        style={[
          styles.mainContainer.center.detail.detailTabContainer,
          caStyles.alignCenter,
          {backgroundColor: 'rgba(204, 204, 204, 0.3)'},
        ]}>
        {!this.state.isLoadComplete ? (
          <MiniLoading
            Width={styles.mainContainer.center.detail.detailTabContainer.width}
            Height={
              styles.mainContainer.center.detail.detailTabContainer.height
            }
            Size={65}
          />
        ) : (
          <FlatList
            data={this.state.PageData}
            renderItem={this.renderItem}
            keyExtractor={item => item.albumId}
            ListFooterComponent={this.ListFooterComponent}
            ListEmptyComponent={this.ListEmptyComponent}
            onEndReached={this._onEndReached}
            onEndReachedThreshold={0.1}
            refreshing={true}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                colors={['#ff0000', '#00ff00', '#0000ff']}
                progressBackgroundColor={'#ffffff'}
                onRefresh={() => {
                  this.onRefresh();
                }}
              />
            }
            horizontal={false} //是否水平布局模式
          />
        )}
      </View>
    );
  }
}

let qrStyleJson = {
  alignCenter: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    QrCodeSize: Dimensions.get('window').width - 237,
    marginVertical: 0,
  },
};

function resizeQRMode() {
  let screenWidth = Dimensions.get('window').width.toFixed();
  let screenHeight = Dimensions.get('window').height.toFixed();
  if (parseInt(screenWidth, 10) <= 320 || parseInt(screenHeight, 10) <= 426) {
    qrStyleJson.alignCenter.justifyContent = 'flex-start';
    qrStyleJson.alignCenter.marginVertical = 25;
    qrStyleJson.QrCodeSize = screenWidth - 89;
  }
  return qrStyleJson;
}

const qrStyles = StyleSheet.create(resizeQRMode());

function QRCodeWidget(props) {
  const {userObject} = props;
  let QrCodeString = '';
  const fgColor = '#000000';
  const bgColor = '#ffffff';
  console.log(' QRCodeWidget userObject ', userObject);
  if (
    userObject.username === null ||
    typeof userObject.username === 'undefined'
  ) {
    QrCodeString = 'none';
  } else {
    let QRCodeObject = {
      Action: 'AddFriend',
      Value: userObject.userid,
    };
    QrCodeString = JSON.stringify(QRCodeObject);
  }
  return (
    <View
      style={[
        styles.mainContainer.center.detail.detailTabContainer,
        qrStyles.alignCenter,
        {borderColor: 'red', borderWidth: 0},
      ]}>
      <QRCodeImg
        codeValue={QrCodeString}
        size={qrStyles.QrCodeSize}
        errorCorrectLevel="L"
        fgColor={fgColor}
        bgColor={bgColor}
      />
    </View>
  );
}

function TabWidget(props) {
  //console.log('TabWidget props', props);
  const {tabIndex, userObject, songData, albumsData, signatureText, UserId} =
    props;
  let returnWidget = (
    <Signature signatureText={signatureText} userObject={userObject} />
  );
  switch (tabIndex) {
    case 1:
      returnWidget = (
        <Signature signatureText={signatureText} userObject={userObject} />
      );
      break;
    case 2:
      returnWidget = (
        <ConstantSong
          navigation={props.navigation}
          UserId={UserId}
          userObject={userObject}
        />
      );
      break;
    case 3:
      returnWidget = (
        <ConstantAlbums
          navigation={props.navigation}
          UserId={UserId}
          songData={songData}
          albumsData={albumsData}
          userObject={userObject}
        />
      );
      break;
    case 4:
      returnWidget = <QRCodeWidget userObject={userObject} />;
      break;
    default:
      returnWidget = (
        <Signature signatureText={signatureText} userObject={userObject} />
      );
      break;
  }
  return returnWidget;
}

export default class Index extends Component {
  constructor() {
    super();
    this.state = {
      isLoadComplete: false,
      userObject: null,
      tabIndex: 1,
      UserId: '-1',
      songData: [
        {
          id: 0,
          title: '测试歌曲标题11111',
          author: '测试作者01',
          cover: require('../../images/cover/1695741904395833344.jpg'),
        },
        {
          id: 1,
          title: '测试歌曲标题2',
          author: '测试作者02',
          cover: require('../../images/cover/1695741940487819264.jpg'),
        },
        {
          id: 2,
          title: '测试歌曲标题3',
          author: '测试作者03',
          cover: require('../../images/cover/1695741958422663168.jpg'),
        },
        {
          id: 3,
          title: '测试歌曲标题4',
          author: '测试作者04',
          cover: require('../../images/cover/1695742008041279488.jpg'),
        },
        {
          id: 4,
          title: '测试歌曲标题5',
          author: '测试作者05',
          cover: require('../../images/cover/1695742026517188608.jpg'),
        },
        {
          id: 5,
          title: '测试歌曲标题6',
          author: '测试作者06',
          cover: require('../../images/cover/1695742030841516032.jpg'),
        },
        {
          id: 6,
          title: '测试歌曲标题7',
          author: '测试作者07',
          cover: require('../../images/cover/1695742035321032704.jpg'),
        },
        {
          id: 7,
          title: '测试歌曲标题8',
          author: '测试作者08',
          cover: require('../../images/cover/1695742039779577856.jpg'),
        },
        {
          id: 8,
          title: '测试歌曲标题9',
          author: '测试作者09',
          cover: require('../../images/cover/1695742053641752576.jpg'),
        },
        {
          id: 9,
          title: '测试歌曲标题10',
          author: '测试作者10',
          cover: require('../../images/cover/1695742058142240768.jpg'),
        },
        {
          id: 10,
          title: '测试歌曲标题11',
          author: '测试作者11',
          cover: require('../../images/cover/1695742062508511232.jpg'),
        },
        {
          id: 11,
          title: '测试歌曲标题12',
          author: '测试作者12',
          cover: require('../../images/cover/1695742066962862080.jpg'),
        },
        {
          id: 12,
          title: '测试歌曲标题13',
          author: '测试作者13',
          cover: require('../../images/cover/1695742076173553664.jpg'),
        },
        {
          id: 13,
          title: '测试歌曲标题14',
          author: '测试作者14',
          cover: require('../../images/cover/1695783514454233088.jpg'),
        },
        {
          id: 14,
          title: '测试歌曲标题15',
          author: '测试作者15',
          cover: require('../../images/cover/1695783520129126400.jpg'),
        },
        {
          id: 15,
          title: '测试歌曲标题16',
          author: '测试作者16',
          cover: require('../../images/cover/1695783545483694080.jpg'),
        },
        {
          id: 16,
          title: '测试歌曲标题17',
          author: '测试作者17',
          cover: require('../../images/cover/1695783554316898304.jpg'),
        },
        {
          id: 17,
          title: '测试歌曲标题18',
          author: '测试作者18',
          cover: require('../../images/cover/1695783558888689664.jpg'),
        },
        {
          id: 18,
          title: '测试歌曲标题19',
          author: '测试作者19',
          cover: require('../../images/cover/1695783567780614144.jpg'),
        },
        {
          id: 19,
          title: '测试歌曲标题20',
          author: '测试作者20',
          cover: require('../../images/cover/1695783572234964992.jpg'),
        },
        {
          id: 20,
          title: '测试歌曲标题21',
          author: '测试作者21',
          cover: require('../../images/cover/1695783581017837568.jpg'),
        },
        {
          id: 21,
          title: '测试歌曲标题22',
          author: '测试作者22',
          cover: require('../../images/cover/1695783585522520064.jpg'),
        },
        {
          id: 22,
          title: '测试歌曲标题23',
          author: '测试作者23',
          cover: require('../../images/cover/1695783589922344960.jpg'),
        },
        {
          id: 23,
          title: '测试歌曲标题24',
          author: '测试作者24',
          cover: require('../../images/cover/1695783594464776192.jpg'),
        },
        {
          id: 24,
          title: '测试歌曲标题25',
          author: '测试作者25',
          cover: require('../../images/cover/1695783598839435264.jpg'),
        },
        {
          id: 25,
          title: '测试歌曲标题26',
          author: '测试作者26',
          cover: require('../../images/cover/1695783603440586752.jpg'),
        },
        {
          id: 26,
          title: '测试歌曲标题27',
          author: '测试作者27',
          cover: require('../../images/cover/1695783608335339520.jpg'),
        },
        {
          id: 27,
          title: '测试歌曲标题28',
          author: '测试作者28',
          cover: require('../../images/cover/1695783612873576448.jpg'),
        },
        {
          id: 28,
          title: '测试歌曲标题29',
          author: '测试作者29',
          cover: require('../../images/cover/1695783626291154944.jpg'),
        },
        {
          id: 29,
          title: '测试歌曲标题30',
          author: '测试作者30',
          cover: require('../../images/cover/1695783630825197568.jpg'),
        },
        {
          id: 30,
          title: '测试歌曲标题31',
          author: '测试作者31',
          cover: require('../../images/cover/1695783635589926912.jpg'),
        },
      ],
      albumsData: [
        {
          id: 0,
          title: '测试专辑标题1',
          author: '测试作者01',
          cover: require('../../images/cover/1695741904395833344.jpg'),
        },
        {
          id: 1,
          title: '测试专辑标题2',
          author: '测试作者02',
          cover: require('../../images/cover/1695741940487819264.jpg'),
        },
        {
          id: 2,
          title: '测试专辑标题3',
          author: '测试作者03',
          cover: require('../../images/cover/1695741958422663168.jpg'),
        },
        {
          id: 3,
          title: '测试专辑标题4',
          author: '测试作者04',
          cover: require('../../images/cover/1695742008041279488.jpg'),
        },
        {
          id: 4,
          title: '测试专辑标题5',
          author: '测试作者05',
          cover: require('../../images/cover/1695742026517188608.jpg'),
        },
        {
          id: 5,
          title: '测试专辑标题6',
          author: '测试作者06',
          cover: require('../../images/cover/1695742030841516032.jpg'),
        },
        {
          id: 6,
          title: '测试专辑标题7',
          author: '测试作者07',
          cover: require('../../images/cover/1695742035321032704.jpg'),
        },
        {
          id: 7,
          title: '测试专辑标题8',
          author: '测试作者08',
          cover: require('../../images/cover/1695742039779577856.jpg'),
        },
        {
          id: 8,
          title: '测试专辑标题9',
          author: '测试作者09',
          cover: require('../../images/cover/1695742053641752576.jpg'),
        },
        {
          id: 9,
          title: '测试专辑标题10',
          author: '测试作者10',
          cover: require('../../images/cover/1695742058142240768.jpg'),
        },
        {
          id: 10,
          title: '测试专辑标题11',
          author: '测试作者11',
          cover: require('../../images/cover/1695742062508511232.jpg'),
        },
        {
          id: 11,
          title: '测试专辑标题12',
          author: '测试作者12',
          cover: require('../../images/cover/1695742066962862080.jpg'),
        },
        {
          id: 12,
          title: '测试专辑标题13',
          author: '测试作者13',
          cover: require('../../images/cover/1695742076173553664.jpg'),
        },
        {
          id: 13,
          title: '测试专辑标题14',
          author: '测试作者14',
          cover: require('../../images/cover/1695783514454233088.jpg'),
        },
        {
          id: 14,
          title: '测试专辑标题15',
          author: '测试作者15',
          cover: require('../../images/cover/1695783520129126400.jpg'),
        },
        {
          id: 15,
          title: '测试专辑标题16',
          author: '测试作者16',
          cover: require('../../images/cover/1695783545483694080.jpg'),
        },
        {
          id: 16,
          title: '测试专辑标题17',
          author: '测试作者17',
          cover: require('../../images/cover/1695783554316898304.jpg'),
        },
        {
          id: 17,
          title: '测试专辑标题18',
          author: '测试作者18',
          cover: require('../../images/cover/1695783558888689664.jpg'),
        },
        {
          id: 18,
          title: '测试专辑标题19',
          author: '测试作者19',
          cover: require('../../images/cover/1695783567780614144.jpg'),
        },
        {
          id: 19,
          title: '测试专辑标题20',
          author: '测试作者20',
          cover: require('../../images/cover/1695783572234964992.jpg'),
        },
        {
          id: 20,
          title: '测试专辑标题21',
          author: '测试作者21',
          cover: require('../../images/cover/1695783581017837568.jpg'),
        },
        {
          id: 21,
          title: '测试专辑标题22',
          author: '测试作者22',
          cover: require('../../images/cover/1695783585522520064.jpg'),
        },
        {
          id: 22,
          title: '测试专辑标题23',
          author: '测试作者23',
          cover: require('../../images/cover/1695783589922344960.jpg'),
        },
        {
          id: 23,
          title: '测试专辑标题24',
          author: '测试作者24',
          cover: require('../../images/cover/1695783594464776192.jpg'),
        },
        {
          id: 24,
          title: '测试专辑标题25',
          author: '测试作者25',
          cover: require('../../images/cover/1695783598839435264.jpg'),
        },
        {
          id: 25,
          title: '测试专辑标题26',
          author: '测试作者26',
          cover: require('../../images/cover/1695783603440586752.jpg'),
        },
        {
          id: 26,
          title: '测试专辑标题27',
          author: '测试作者27',
          cover: require('../../images/cover/1695783608335339520.jpg'),
        },
        {
          id: 27,
          title: '测试专辑标题28',
          author: '测试作者28',
          cover: require('../../images/cover/1695783612873576448.jpg'),
        },
        {
          id: 28,
          title: '测试专辑标题29',
          author: '测试作者29',
          cover: require('../../images/cover/1695783626291154944.jpg'),
        },
        {
          id: 29,
          title: '测试专辑标题30',
          author: '测试作者30',
          cover: require('../../images/cover/1695783630825197568.jpg'),
        },
        {
          id: 30,
          title: '测试专辑标题31',
          author: '测试作者31',
          cover: require('../../images/cover/1695783635589926912.jpg'),
        },
      ],
    };
  }

  readUserId = UserId => {
    GetUserInfoById({
      parm: {UserId: UserId},
      beforeCallBack: () => {},
      responseCallBack: res => {
        res.then(resData => {
          console.log('GetUserInfoById resData', resData);
          if (resData.status !== 0) {
            Alert.alert('错误', `获取用户信息出错,原因${resData.msg}`);
            this.goBack();
          } else {
            this.setState({
              userObject: resData.result,
              UserId: UserId,
              isLoadComplete: true,
            });
          }
        });
      },
      errorCallback: error => {
        Alert.alert('错误', `获取用户数据出错,原因[${error}]`);
        this.goBack();
      },
    });
  };

  goBack = () => {
    if (
      this.props.navigation != null &&
      typeof this.props.navigation !== 'undefined'
    ) {
      this.props.navigation.goBack();
    }
  };
  changeTab = curTabIndex => {
    //console.log('changeTab data', data);
    this.setState({tabIndex: curTabIndex});
  };
  componentDidMount() {
    let {userId} = this.props.route.params;
    this.readUserId(userId);
  }
  render() {
    let userObject = this.state.userObject;
    let userName = '';
    let UserId = '-1';
    let userface = require('../../images/userfaces/useface01.png');
    if (userObject !== null && typeof userObject !== 'undefined') {
      if (
        userObject.userface !== '' &&
        typeof userObject.userface !== 'undefined'
      ) {
        userface = {uri: userObject.userface};
        userName = userObject.username;
        UserId = userObject.userid;
      }
    }
    return !this.state.isLoadComplete ? (
      <MiniLoading
        Width={Dimensions.get('window').width}
        Height={Dimensions.get('window').height}
        Size={65}
      />
    ) : (
      <View style={styles.container}>
        <ImageBackground
          style={styles.bgImage}
          source={require('../../images/UserPanelBG.png')}>
          {/*appBar B*/}
          <View style={styles.appBar}>
            <TouchableOpacity
              onPress={() => {
                this.goBack();
              }}>
              <Icon
                style={styles.forwardBack}
                name="chevron-back-outline"
                size={styleJson.forwardBack.iconSize}
              />
            </TouchableOpacity>
            <View style={styles.appBar.appBarTitleContainer}>
              <Text style={styles.appBar.appBarTitle}>{userName}</Text>
            </View>
          </View>
          {/*appBar E*/}
          <View style={styles.scrollView}>
            {/*主要层B*/}
            <Image style={styles.userFace} source={userface} />
            <Animatable.View
              animation={'fadeInUp'}
              style={styles.mainContainer}>
              <View style={styles.mainContainer.center}>
                {/*用户名B*/}
                <View style={styles.mainContainer.center.userName}>
                  <Text
                    numberOfLines={1}
                    style={styles.mainContainer.center.userName.Text}>
                    {userName}
                  </Text>
                </View>
                {/*用户名E*/}
                {/*注册时间 B*/}
                <View style={styles.mainContainer.center.registedTime}>
                  <Text style={styles.mainContainer.center.registedTime.Text}>
                    注册时间:{userObject.createdatetime}
                  </Text>
                </View>
                {/*注册时间 E*/}
                {/*详细内容B*/}
                <View style={styles.mainContainer.center.detail}>
                  {/*标签切换B*/}
                  <View style={styles.mainContainer.center.detail.detailTab}>
                    <ScrollView nestedScrollEnabled={true} horizontal={true}>
                      <TouchableOpacity
                        onPress={() => {
                          this.changeTab(1);
                        }}>
                        <View
                          style={
                            this.state.tabIndex === 1
                              ? styles.detailTabActive
                              : styles.detailTabNormarl
                          }>
                          <Text
                            style={
                              this.state.tabIndex === 1
                                ? styles.detailTabActive.Text
                                : styles.detailTabNormarl.Text
                            }>
                            签名
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          this.changeTab(2);
                        }}>
                        <View
                          style={
                            this.state.tabIndex === 2
                              ? styles.detailTabActive
                              : styles.detailTabNormarl
                          }>
                          <Text
                            style={
                              this.state.tabIndex === 2
                                ? styles.detailTabActive.Text
                                : styles.detailTabNormarl.Text
                            }>
                            常听歌曲
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          this.changeTab(3);
                        }}>
                        <View
                          style={
                            this.state.tabIndex === 3
                              ? styles.detailTabActive
                              : styles.detailTabNormarl
                          }>
                          <Text
                            style={
                              this.state.tabIndex === 3
                                ? styles.detailTabActive.Text
                                : styles.detailTabNormarl.Text
                            }>
                            常听歌单
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          this.changeTab(4);
                        }}>
                        <View
                          style={
                            this.state.tabIndex === 4
                              ? styles.detailTabActive
                              : styles.detailTabNormarl
                          }>
                          <Text
                            style={
                              this.state.tabIndex === 4
                                ? styles.detailTabActive.Text
                                : styles.detailTabNormarl.Text
                            }>
                            二维码
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </ScrollView>
                  </View>
                  {/*标签切换E*/}
                  {/*标签内容B*/}
                  <TabWidget
                    UserId={UserId}
                    navigation={this.props.navigation}
                    tabIndex={this.state.tabIndex}
                    songData={this.state.songData}
                    albumsData={this.state.albumsData}
                    userObject={userObject}
                  />
                  {/*标签内容E*/}
                </View>
                {/*详细内容E*/}
              </View>
            </Animatable.View>
            {/*主要层E*/}
          </View>
        </ImageBackground>
      </View>
    );
  }
}
