/* eslint-disable react-native/no-inline-styles */
import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  TextInput,
  DeviceEventEmitter,
  NativeModules,
} from 'react-native';
import React, {Component} from 'react';
import {HcdWaveView} from '../../..//components/HcdWaveView';
import Icon from 'react-native-vector-icons/Ionicons';
import {UploadSongFile, UploadAxiosSongFile, host} from '../../../utils/api';
import Storage from '../../../utils/storage';
import * as Progress from 'react-native-progress';
import {ScrollView} from 'react-native-gesture-handler';

const RNUploader = NativeModules.RNUploader;

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
  HcdWaveViewContainer: {
    width: Dimensions.get('window').width,
    height: 350,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 7,
    borderColor: 'red',
    borderWidth: 0,
  },
  HcdWaveView: {
    width: 230,
    height: 230,
    backgroundColor: '#FF7800',
  },
  messageTipsContainer: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 555,
    marginVertical: 0,
    textAlign: 'left',
    fontSize: 21,
    color: 'white',
    textAlignVertical: 'top',
    borderColor: 'red',
    borderWidth: 0,
    text: {
      textAlign: 'left',
      fontSize: 21,
      color: 'white',
      textAlignVertical: 'top',
    },
  },
};

function resizeMode() {
  let screenWidth = Dimensions.get('window').width.toFixed();
  let screenHeight = Dimensions.get('window').height.toFixed();
  console.log('resizeMode screenWidth', screenWidth);
  console.log('resizeMode screenHeight', screenHeight);
  if (parseInt(screenWidth, 10) <= 384 && parseInt(screenHeight, 10) <= 592) {
    styleJson.HcdWaveView.width = 170;
    styleJson.HcdWaveView.height = 170;
    styleJson.HcdWaveViewContainer.height = 190;
    styleJson.messageTipsContainer.height = screenHeight - 360;
  }
  return styleJson;
}

const styles = StyleSheet.create(resizeMode());

export default class index extends Component {
  /**
   * 构造函数
   */
  constructor() {
    super();
    this.state = {
      progressPercent: 0,
      uploadPercent: 0,
      filesList: [],
      uploadTimer: null,
      currentIndex: 0,
      message: '',
      albums: null,
    };
  }

  /**
   * 循环上传文件
   * @param {时间句柄} uploadTimer
   */
  UploadFile = uploadTimer => {
    console.log('准备上传分析文件');
    let userId = 'null';
    let currentIndex = this.state.currentIndex;
    let filesList = this.state.filesList;
    let progressPercent = this.state.progressPercent;
    let albums = this.state.albums;
    let albumId =
      albums === null || typeof albums === 'undefined' ? '' : albums.albumId;
    let filePath = filesList[currentIndex].path;
    Storage.get('userInfo').then(userInfo => {
      console.log('UploadFile userInfo', userInfo);
      if (
        userInfo.payload !== null &&
        typeof userInfo.payload !== 'undefined'
      ) {
        userId = userInfo.payload.userId;
        console.log('UploadFile userId', userId);
      }
      UploadAxiosSongFile({
        parm: {userid: userId, albumId: albumId},
        filePath: filePath,
        beforeCallBack: () => {},
        progressCallBack: percentProgress => {
          this.setState({uploadPercent: percentProgress});
        },
        responseCallBack: resData => {
          console.log('UploadAxiosSongFile res', resData);
          if (resData !== null && typeof resData !== 'undefined') {
            const {status, msg} = resData.data;
            let message = this.state.message;
            console.log('UploadAxiosSongFile status', status);
            console.log('UploadAxiosSongFile msg', msg);
            if (status !== 0) {
              message += `文件[${filePath}]上传出错,原因[${msg}]\n`;
            } else {
              message += `文件[${filePath}]上传成功\n`;
            }
            currentIndex += 1;
            progressPercent = Math.round(
              (currentIndex / (filesList.length - 1)) * 100,
              10,
            );
            if (progressPercent > 100) {
              progressPercent = 100;
            }
            console.log('UploadAxiosSongFile message', message);
            console.log('UploadAxiosSongFile currentIndex', currentIndex);
            console.log(
              'UploadAxiosSongFile filesList.length',
              filesList.length,
            );
            if (currentIndex <= filesList.length - 1) {
              this.setState({uploadPercent: 0}, () => {
                this.batchSetTimeUploadFile();
              });
            } else {
              clearInterval(uploadTimer);
              message += '所有文件上传完成';
            }
            this.setState({
              message: message,
              currentIndex: currentIndex,
              progressPercent: progressPercent,
            });
          }
        },
      });
    });
  };

  doUpload = async uploadTimer => {
    let files = [];
    let userId = 'null';
    let currentIndex = this.state.currentIndex;
    let progressPercent = this.state.progressPercent;
    let filesList = this.state.filesList;
    let message = this.state.message;
    let fileInfo = null;
    console.log('doUpload NativeModules', NativeModules);
    currentIndex += 1;
    progressPercent = Math.round(
      (currentIndex / (filesList.length - 1)) * 100,
      10,
    );
    currentIndex += 1;
    if (currentIndex >= filesList.length - 1) {
      clearInterval(uploadTimer);
      message += '所有文件上传完成';
      this.setState({
        message: message,
        currentIndex: currentIndex,
        progressPercent: progressPercent,
      });
      return true;
    }
    fileInfo = filesList[currentIndex];
    files.push({
      name: 'file',
      filename: fileInfo.name,
      filepath: `file://${fileInfo.path}`,
      filetype: 'audio/mp3',
    });
    let userInfo = await Storage.get('userInfo');
    if (userInfo.payload !== null && typeof userInfo.payload !== 'undefined') {
      userId = userInfo.payload.userId;
      console.log('doUpload userId', userId);
    }
    let url = `${host}api/SongInfo/Upload/Song?userId=${userId}`;
    let opts = {
      url: url,
      files: files,
      method: 'POST', // optional: POST or PUT
      headers: {Accept: 'application/json'}, // optional
      params: '',
    };
    console.log('doUpload url', url);
    console.log('opts', opts);
    console.log('RNUploader', RNUploader);
    RNUploader.upload(opts, (err, response) => {
      if (err) {
        console.log(err);
        return false;
      }
      let status = response.status;
      let responseString = response.data;
      let json = JSON.parse(responseString);
      console.log('doUpload status', json.status);
      console.log('doUpload msg', json.msg);
      console.log('upload complete with status ' + status);
      if (json.status !== 0) {
        message += `文件[${fileInfo.name}]上传出错,原因[${json.msg}]\n`;
      } else {
        message += `文件[${fileInfo.name}]上传成功\n`;
      }
      if (json.status === 0 && currentIndex <= filesList.length - 1) {
        this.batchSetTimeUploadFile();
      }
      this.setState({
        message: message,
        currentIndex: currentIndex,
        progressPercent: progressPercent,
      });
      return true;
    });
  };

  batchSetTimeUploadFile = () => {
    let uploadTimer = setInterval(() => {
      this.setState({uploadTimer: uploadTimer});
      clearInterval(uploadTimer);
      this.UploadFile(uploadTimer);
    }, 30);
  };

  /**
   * 组件挂载方法
   */
  componentDidMount() {
    console.log('UploadFile props', this.props);
    let filesList = this.props.route.params.selectedFiles;
    let albums = null;
    if (
      this.props.route.params !== null &&
      typeof this.props.route.params !== 'undefined'
    ) {
      albums = this.props.route.params.albums;
    }
    this.setState(
      {filesList: filesList, albums: albums, currentIndex: 0},
      () => {
        this.batchSetTimeUploadFile();
      },
    );
    /*DeviceEventEmitter.addListener('RNUploaderProgress', data => {
      let bytesWritten = data.totalBytesWritten;
      let bytesTotal = data.totalBytesExpectedToWrite;
      let progress = data.progress;
      console.log('upload progress: ' + progress + '%');
      this.setState({uploadPercent: progress});
    });*/
  }

  /**
   * 返回上一页
   */
  gotoBack = () => {
    console.log(' gotoBack props ', this.props);
    let uploadTimer = this.state.uploadTimer;
    clearInterval(uploadTimer);
    this.props.navigation.goBack();
  };

  render() {
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
              上传选择的音乐文件
            </Text>
          </View>
        </View>
        {/*AppBar E*/}
        {/*水波浪进度条B*/}
        <View style={styles.HcdWaveViewContainer}>
          <HcdWaveView
            surfaceWidth={styles.HcdWaveView.width}
            surfaceHeigth={styles.HcdWaveView.height}
            powerPercent={this.state.progressPercent}
            type="dc"
            style={styles.HcdWaveView}
            tips="上传选中的歌曲"
          />
        </View>
        {/*水波浪进度条E*/}
        <View
          style={{
            width: Dimensions.get('window').width,
            height: 50,
            //backgroundColor: 'rgba(255,255,255,0.5)',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 0,
          }}>
          <Progress.Bar
            progress={this.state.uploadPercent}
            width={Dimensions.get('window').width - 30}
          />
        </View>
        {/*消息提示框B
        {/*<TextInput
          multiline={true}
          placeholder="  消息提示"
          placeholderTextColor={'white'}
          readOnly={true}
          scrollEnabled={true}
          value={this.state.message}
          style={styles.messageTipsContainer}
        />*/}
        <View style={styles.messageTipsContainer}>
          <ScrollView horizontal={false}>
            <Text
              style={styles.messageTipsContainer.text}
              numberOfLines={9999999}>
              {this.state.message}
            </Text>
          </ScrollView>
        </View>
        {/*消息提示框E*/}
      </View>
    );
  }
}
