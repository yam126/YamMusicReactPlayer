import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  Alert,
  ScrollView,
} from 'react-native';
import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {GetPlayerData} from '../../utils/api';
import MiniLoading from '../../components/MiniLoading';
import {Image} from 'react-native-animatable';
import {formatDuration, convertBytesToSize} from '../../utils';
import {QRCodeImg} from 'qrcode-react-native';

export default class Index extends Component {
  constructor() {
    super();
    this.state = {
      songId: '',
      codeValue: 'null',
      isLoadComplete: false,
      songInfo: null,
      creater: null,
    };
  }
  gotoBack = () => {
    this.props.navigation.goBack();
  };
  loadData = (songId, userId) => {
    GetPlayerData({
      parm: {
        albumId: 'null',
        songId: songId,
        userId: 'null',
      },
      beforeCallBack: () => {},
      responseCallBack: res => {
        res.then(resData => {
          if (resData !== null && typeof resData !== 'undefined') {
            console.log('GetPlayerData resData', resData);
            const {status, msg, result} = resData;
            if (status !== 0) {
              Alert.alert('错误', `获取歌曲数据出错,原因[${msg}]`);
              this.gotoBack();
            } else {
              const {songinfo, creater, albuminfo, albumSongList} = result;
              let valueObj = {songId: songId, userId: userId};
              let codeValue = {
                Action: 'ShareMusic',
                Value: `${songId}-${userId}`,
              };
              console.log('GetPlayerData codeValue', JSON.stringify(codeValue));
              this.setState({
                songId: songId,
                codeValue: JSON.stringify(codeValue),
                isLoadComplete: true,
                songInfo: songinfo,
                creater: creater,
              });
            }
          }
        });
      },
      errorCallback: error => {
        Alert.alert('错误', `歌曲数据失败,原因[${error}]`);
        this.gotoBack();
      },
    });
  };
  componentDidMount() {
    let songId = this.props.route.params.songId;
    let userId = this.props.route.params.userId;
    console.log('ShareMusic componentDidMount', this.props);
    this.loadData(songId, userId);
  }
  render() {
    let containerWidth = styles.mainPanelCenter.width;
    let containerHeight = styles.mainPanelCenter.height;
    let loadingSize = 21;
    let songInfo = this.state.songInfo;
    let creater = this.state.creater;
    return (
      <ImageBackground
        source={require('../../images/ShareBG.png')}
        style={styles.container}>
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
          <View style={styles.AppBarTitleContainer}>
            <Text numberOfLines={1} style={styles.AppBarTitle}>
              分享歌曲
            </Text>
          </View>
        </View>
        {/*AppBar E*/}
        <View style={styles.mainContainer}>
          <View style={styles.mainPanel}>
            <View style={styles.mainPanelCenter}>
              {!this.state.isLoadComplete ? (
                <MiniLoading
                  Width={containerWidth}
                  Height={containerHeight}
                  Size={loadingSize}
                />
              ) : (
                <>
                  <ScrollView>
                    {/*歌曲封面B*/}
                    <View style={styles.songCoverContainer}>
                      <Image
                        style={styles.songCover}
                        source={{uri: songInfo.cover}}
                      />
                    </View>
                    {/*歌曲封面E*/}
                    {/*歌曲信息B*/}
                    <View style={styles.songInfoPanelContainer}>
                      <View style={styles.songInfoPanel}>
                        {/*歌曲名称B*/}
                        <View style={styles.songInfoPanelLine}>
                          <Text style={styles.songInfoName}>
                            歌曲名称:{songInfo.title}
                          </Text>
                        </View>
                        {/*歌曲名称E*/}
                        {/*歌手B*/}
                        <View style={styles.songInfoPanelLine}>
                          <Text style={styles.songInfoFontStyle}>
                            歌手:{songInfo.artist}
                          </Text>
                        </View>
                        {/*歌手E*/}
                        {/*时长B*/}
                        <View style={styles.songInfoPanelLine}>
                          <Text style={styles.songInfoFontStyle}>
                            时长:{formatDuration(songInfo.duration).hour}小时
                            {formatDuration(songInfo.duration).minute}分钟
                            {formatDuration(songInfo.duration).second}秒钟
                          </Text>
                        </View>
                        {/*时长E*/}
                        {/*文件大小B*/}
                        <View style={styles.songInfoPanelLine}>
                          <Text style={styles.songInfoFontStyle}>
                            文件大小:{convertBytesToSize(songInfo.fileSize)}
                          </Text>
                        </View>
                        {/*文件大小E*/}
                      </View>
                    </View>
                    {/*歌曲信息E*/}
                    {/*创建人信息B*/}
                    <View style={styles.createrPanelContainer}>
                      <View style={styles.createrPanel}>
                        <Image
                          style={styles.createrUserFace}
                          source={{uri: creater.userface}}
                        />
                        <View style={styles.createrUserInfoPanel}>
                          {/*用户名B*/}
                          <View style={styles.createrUserInfoPanelLine}>
                            <Text style={styles.createrUserInfoPaneFontStyle}>
                              {creater.username}
                            </Text>
                          </View>
                          {/*用户名E*/}
                          {/*签名B*/}
                          <View style={styles.createrUserInfoPanelLine}>
                            <Text
                              numberOfLines={3}
                              style={styles.createrUserInfoPaneFontStyle}>
                              {creater.signature}
                            </Text>
                          </View>
                          {/*签名E*/}
                        </View>
                      </View>
                    </View>
                    {/*创建人信息E*/}
                    {/*二维码B*/}
                    <View style={styles.qrCodeContainer}>
                      <QRCodeImg
                        codeValue={this.state.codeValue}
                        size={styles.qrCodeImage.width}
                        errorCorrectLevel="L"
                        fgColor={'#000000'}
                        bgColor={'#ffffff'}
                      />
                    </View>
                    {/*二维码E*/}
                  </ScrollView>
                </>
              )}
            </View>
          </View>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    alignItems: 'center',
  },
  mainContainer: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 55,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'stretch',
    borderColor: 'red',
    borderWidth: 0,
  },
  mainPanel: {
    width: Dimensions.get('window').width - 30,
    height: Dimensions.get('window').height - 137,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 15,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  mainPanelCenter: {
    width: Dimensions.get('window').width - 63,
    height: Dimensions.get('window').height - 173,
    flexDirection: 'column',
    alignItems: 'center',
    borderWidth: 0,
    borderColor: 'red',
  },
  songCoverContainer: {
    width: Dimensions.get('window').width - 63,
    height: 267,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  songCover: {
    width: Dimensions.get('window').width - 138,
    height: 237,
    marginVertical: 10,
    borderRadius: 10,
  },
  qrCodeContainer: {
    width: Dimensions.get('window').width - 63,
    height: 178,
    marginVertical: 25,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrCodeImage: {
    width: 185,
  },
  songInfoPanelContainer: {
    width: Dimensions.get('window').width - 63,
    marginVertical: 5,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 125,
    maxHeight: 265,
  },
  songInfoPanel: {
    width: Dimensions.get('window').width - 93,
    minHeight: 105,
    maxHeight: 235,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  createrPanelContainer: {
    width: Dimensions.get('window').width - 63,
    marginVertical: 5,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: 89,
  },
  createrPanel: {
    width: Dimensions.get('window').width - 93,
    height: 88,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  createrUserFace: {
    width: 78,
    height: 78,
    borderRadius: 180,
    marginVertical: 5,
    marginHorizontal: 5,
  },
  createrUserInfoPanel: {
    width: Dimensions.get('window').width - 176,
    height: 83,
    marginHorizontal: 3,
    marginVertical: 3,
    flexDirection: 'column',
    borderWidth: 0,
    borderColor: 'red',
  },
  createrUserInfoPanelLine: {
    width: Dimensions.get('window').width - 176,
    height: 21,
    marginVertical: 5,
  },
  createrUserInfoPaneFontStyle: {
    fontSize: 15,
    color: 'black',
    textAlign: 'left',
    marginHorizontal: 5,
  },
  songInfoPanelLine: {
    width: Dimensions.get('window').width - 97,
    minHeight: 12,
    maxHeight: 35,
  },
  songInfoName: {
    fontSize: 25,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'left',
    marginHorizontal: 5,
  },
  songInfoFontStyle: {
    fontSize: 16,
    color: 'black',
    textAlign: 'left',
    marginHorizontal: 5,
  },
  barHeader: {
    width: Dimensions.get('window').width,
    height: 55,
    flexDirection: 'row',
    //backgroundColor: 'rgba(8,112,113,0.7)',
    borderBottomColor: 'white',
    borderBottomWidth: 1,
  },
  AppBarTitleContainer: {
    width: Dimensions.get('window').width - 75,
    height: 37,
    marginVertical: 9,
    borderColor: 'red',
    borderWidth: 0,
  },
  AppBarTitle: {
    textAlign: 'center',
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    paddingTop: 5,
  },
  forwardBack: {
    color: 'white',
    marginVertical: 10,
    iconSize: 35,
  },
});
