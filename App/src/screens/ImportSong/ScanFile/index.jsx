import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  PermissionsAndroid,
  Alert,
  Platform,
  ScrollView,
} from 'react-native';
import React, {Component} from 'react';
import {HcdWaveView} from '../../../components/HcdWaveView';
import Icon from 'react-native-vector-icons/Ionicons';
import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import RNFS from 'react-native-fs';
import {UploadSongFile} from '../../../utils/api';
import LinearGradient from 'react-native-linear-gradient';
import {ListItem} from '@rneui/themed';

/**
 * 找到的歌曲列表
 */
class TabMusicList extends Component {
  /**
   * 构造函数
   */
  constructor() {
    super();
    this.state = {
      isCheckedAll: false,
      checkedStateAry: [],
    };
  }

  /**
   * 组件挂载方法
   */
  componentDidMount() {
    let musicFileList = this.props.filesList;
    let checkedStateAry = [];
    for (var i = 0; i < musicFileList.length; i++) {
      checkedStateAry.push(false);
    }
    this.setState({checkedStateAry: checkedStateAry});
  }

  /**
   * 设置是否选中
   * @param {选中数组索引} index
   */
  setChecked = index => {
    console.log('setChecked index', index);
    let checkedStateAry = this.state.checkedStateAry;
    for (var i = 0; i < checkedStateAry.length; i++) {
      if (i === index) {
        checkedStateAry[i] = !checkedStateAry[i];
      } else {
        checkedStateAry[i] = checkedStateAry[i];
      }
    }
    this.setState({checkedStateAry: checkedStateAry});
    console.log('setChecked checkedStateAry', checkedStateAry);
  };

  /**
   * 全选点击事件
   */
  clickCheckedAll = () => {
    let isCheckedAll = !this.state.isCheckedAll;
    let checkedStateAry = this.state.checkedStateAry;
    for (var i = 0; i < checkedStateAry.length; i++) {
      checkedStateAry[i] = isCheckedAll;
    }
    this.setState({
      checkedStateAry: checkedStateAry,
      isCheckedAll: isCheckedAll,
    });
  };

  gotoUploadFile = () => {
    let filesList = this.props.filesList;
    let selectedFiles = [];
    let checkedStateAry = this.state.checkedStateAry;
    let albums = this.props.albums;
    if (
      filesList === null ||
      typeof filesList === 'undefined' ||
      filesList.length <= 0
    ) {
      Alert.alert('错误', '没有文件不能导入');
      return false;
    }
    for (var i = 0; i < checkedStateAry.length; i++) {
      if (checkedStateAry[i]) {
        selectedFiles.push(filesList[i]);
      }
    }
    if (selectedFiles.length <= 0) {
      Alert.alert('错误', '没有选择歌曲不能导入');
      return false;
    }
    this.props.navigation.navigate('UploaddFile', {
      selectedFiles: selectedFiles,
      albums: albums,
    });
  };

  /**
   * 主要渲染方法
   * @returns
   */
  render() {
    let musicFileList = this.props.filesList;
    let checkedStateAry = this.state.checkedStateAry;
    console.log('TabMusicList musicFileList', musicFileList);
    return (
      <View style={styles.musicListContainer}>
        <View style={styles.musicListControlContainer}>
          <View style={styles.musicListControlContainer.left}>
            <TouchableOpacity
              onPress={() => {
                this.clickCheckedAll();
              }}>
              <Text>{this.state.isCheckedAll ? '取消全选' : '全选'}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.musicListControlContainer.right}>
            <TouchableOpacity
              onPress={() => {
                this.gotoUploadFile();
              }}>
              <LinearGradient
                colors={['#02AAB0', '#00CDAC', '#02AAB0']}
                style={styles.playAlbumsButton}>
                <Icon
                  style={styles.playAlbumsButton.Icon}
                  name="download"
                  size={styles.playAlbumsButton.Icon.iconSize}
                />
                <Text numberOfLines={1} style={styles.playAlbumsButton.Text}>
                  导入歌曲
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView>
          {musicFileList.map((item, index) => {
            return (
              <ListItem
                containerStyle={{backgroundColor: 'rgba(255,255,255,0.0)'}}
                key={index}
                bottomDivider>
                <ListItem.CheckBox
                  iconType="material-community"
                  checkedIcon="checkbox-marked"
                  uncheckedIcon="checkbox-blank-outline"
                  checked={checkedStateAry[index]}
                  onPress={() => {
                    this.setChecked(index);
                  }}
                />
                <ListItem.Content
                  style={{backgroundColor: 'rgba(255,255,255,0.0)'}}>
                  <ListItem.Title>{item.name}</ListItem.Title>
                  <ListItem.Subtitle>{item.path}</ListItem.Subtitle>
                </ListItem.Content>
                <ListItem.Chevron />
              </ListItem>
            );
          })}
        </ScrollView>
      </View>
    );
  }
}

/**
 * 标签组件容器
 */
class TabContainer extends Component {
  render() {
    console.log('TabContainer this.props.filesList', this.props.filesList);
    return this.props.TabName === 'messageTab' ? (
      <ScrollView horizontal={false}>
        {/*消息提示框B*/}
        <TextInput
          multiline={true}
          placeholder="  消息提示"
          placeholderTextColor={'white'}
          readOnly={true}
          value={this.props.message}
          style={styles.messageTipsContainer}
        />
        {/*消息提示框E*/}
      </ScrollView>
    ) : (
      <TabMusicList
        albums={this.props.albums}
        navigation={this.props.navigation}
        filesList={this.props.filesList}
      />
    );
  }
}

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
  HcdWaveView: {
    width: 230,
    height: 230,
    backgroundColor: '#FF7800',
    IconSize: 95,
    IconTop: 62,
    IconLeft: 62,
    IconZIndex: 100,
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
  tabContainer: {
    width: Dimensions.get('window').width - 15,
    height: 63,
    marginHorizontal:
      (Dimensions.get('window').width - (Dimensions.get('window').width - 15)) /
      2,
    marginVertical: 3,
    borderRadius: 7,
    backgroundColor: 'rgba(255,255,255,0.5)',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderColor: '#ccc',
    borderWidth: 0,
  },
  tabActive: {
    width: (Dimensions.get('window').width - 15) / 2 - 15,
    height: 58,
    borderRadius: 7,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    borderBottomColor: 'blue',
    borderBottomWidth: 3,
    textStyle: {
      fontSize: 27,
      color: 'blue',
      fontWeight: 'bold',
      textAlign: 'left',
      marginHorizontal: 5,
      textAlignVertical: 'center',
    },
  },
  tabNormal: {
    width: (Dimensions.get('window').width - 15) / 2 - 15,
    height: 58,
    borderRadius: 7,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    borderBottomColor: 'blue',
    borderBottomWidth: 0,
    textStyle: {
      fontSize: 25,
      color: '#ccc',
      fontWeight: 'bold',
      textAlign: 'center',
      textAlignVertical: 'center',
    },
  },
  scrollContainer: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 518,
    marginVertical: 3,
    borderColor: 'red',
    borderWidth: 0,
  },
  musicListContainer: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 555,
    marginVertical: 0,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderColor: 'red',
    borderWidth: 0,
  },
  musicListControlContainer: {
    width: Dimensions.get('window').width - 2,
    height: 70,
    marginHorizontal: 1,
    borderColor: 'red',
    borderWidth: 0,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    left: {
      width: (Dimensions.get('window').width - 2) / 2,
      height: 69,
      borderColor: 'red',
      borderWidth: 0,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      text: {
        fontSize: 37,
        fontWeight: 'bold',
        color: 'blue',
        marginHorizontal: 27,
        textAlign: 'left',
      },
    },
    right: {
      width: (Dimensions.get('window').width - 2) / 2,
      height: 69,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: 'red',
      borderWidth: 0,
    },
  },
  playAlbumsButton: {
    width: 138,
    height: 36,
    marginVertical: 17,
    marginHorizontal: 5,
    borderRadius: 25,
    flexDirection: 'row',
    Icon: {
      color: 'white',
      marginHorizontal: 15,
      marginVertical: 6,
      iconSize: 17,
    },
    Text: {
      fontSize: 17,
      fontWeight: 'bold',
      color: 'white',
      marginHorizontal: -10,
      marginVertical: 7,
    },
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
};

function resizeMode() {
  let screenWidth = Dimensions.get('window').width.toFixed();
  let screenHeight = Dimensions.get('window').height.toFixed();
  console.log('resizeMode screenWidth', screenWidth);
  console.log('resizeMode screenHeight', screenHeight);
  if (parseInt(screenWidth, 10) <= 384 && parseInt(screenHeight, 10) <= 592) {
    styleJson.HcdWaveView.width = 170;
    styleJson.HcdWaveView.height = 170;
    styleJson.HcdWaveView.IconSize = 43;
    styleJson.HcdWaveViewContainer.height = 190;
    styleJson.messageTipsContainer.height = screenHeight - 360;
    styleJson.scrollContainer.height = screenHeight - 353;
    styleJson.musicListContainer.height = screenHeight - 360;
  }
  return styleJson;
}

const styles = StyleSheet.create(resizeMode());

/**
 * 主要组件
 */
export default class Index extends Component {
  constructor() {
    super();
    this.state = {
      progressPercent: 0,
      fileIndex: 0,
      fileCount: 0, //找到的文件数量
      isPermissionsed: false, //是否授权
      filesList: [], //文件列表
      directoryList: [], //文件夹列表
      message: '', //文本框消息
      //rootDirectory: RNFS.ExternalStorageDirectoryPath,
      rootDirectory: '/storage',
      //rootDirectory: '/storage/emulated/0', //手机可访问目录路径
      //rootDirectory: '/sdcard/Music', //手机可访问目录路径
      findFileTimeHandle: null,
      TabName: 'messageTab', //消息标签
      TabIndex: 0, //标签切换索引
      albums: null, //专辑信息
      sourceLists: null,
      sourceListsIndex: 0,
      isPause: false,
    };
  }

  /**
   * 获取指定路径下的所有文件及子文件夹列表
   * @param {指定文件目录} directoryPath
   * @returns
   */
  getFilesInDirectory = async directoryPath => {
    try {
      const filesList = await RNFS.readDir(directoryPath); // 返回Promise对象
      console.log('getFilesInDirectory filesList1', filesList);
      return filesList;
    } catch (error) {
      console.log('Error reading directory', error);
      //throw new Error(`Failed to read directory ${directoryPath}`);
      let message = this.state.message;
      message += `查找目录[${directoryPath}]下的文件出错,原因\n${
        message + error
      }`;
      this.setState({message: message});
    }
  };

  /**
   * 返回上一页
   */
  gotoBack = () => {
    console.log(' gotoBack props ', this.props);
    this.props.navigation.goBack();
  };

  /**
   * 验证权限
   */
  checkPermissions = async () => {
    try {
      switch (Platform.OS) {
        case 'android':
          const grantedReadStorage = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            {
              title: '申请读取文件权限',
              message: '需要申请读取文件权限',
              buttonPositive: 'OK',
            },
          );
          if (grantedReadStorage !== PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert('没有文件读取授权无法进行后续操作');
            this.setState({isPermissionsed: false});
          } else {
            this.setState({isPermissionsed: true});
          }
          break;
      }
    } catch (exp) {
      Alert.alert('错误', `申请权限出错,原因[${exp}]`);
    }
  };

  /**
   * 循环上传文件
   * @param {要上传的文件路径} filePath
   */
  batchSetTimeUploadFile = () => {
    let fileIndex = this.state.fileIndex;
    let fileCount = this.state.filesList.length;
    let filesList = this.state.filesList;
    console.log('准备上传分析文件');
    UploadSongFile({
      parm: {userid: 'null', fileIndex: fileIndex, fileCount: fileCount},
      filePath: filesList[fileIndex],
      beforeCallBack: () => {},
      responseCallBack: res => {
        console.log('batchSetTimeUploadFile res', res);
        res.then(resData => {
          if (resData !== null && typeof resData !== 'undefined') {
            const {status, msg} = resData;
            console.log('batchSetTimeUploadFile status', status);
            console.log('batchSetTimeUploadFile msg', msg);
          }
        });
      },
    });
  };

  //生成随机ID：GUID
  genId = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
      .replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      })
      .toUpperCase();
  };

  /**
   * 递归扫描手机里的mp3
   * @param {扫描文件夹} rootDirectory
   */
  recursionFilesInDirectory = rootDirectory => {
    let result = false;
    this.getFilesInDirectory(rootDirectory).then(sourceLists => {
      console.log('sourceLists', sourceLists);
      if (!this.state.isPause) {
        if (
          sourceLists !== null &&
          typeof sourceLists !== 'undefined' &&
          sourceLists.length > 0
        ) {
          let filesList = this.state.filesList;
          let fileCount = this.state.fileCount;
          let currentFileCount = 0;
          console.log('sourceLists', sourceLists);
          sourceLists.map((item, index) => {
            //console.log('item', item);
            //console.log('item.isFile()', item.isFile());
            //console.log('item.isDirectory()', item.isDirectory());
            if (item.isDirectory()) {
              this.recursionFilesInDirectory(item.path);
            } else if (item.isFile()) {
              let extenston = item.path.split('').reverse().join('');
              extenston = extenston.substring(0, 3);
              extenston = extenston.split('').reverse().join('');
              console.log('extenston', extenston);
              if (extenston.toLocaleLowerCase().indexOf('mp3') !== -1) {
                let fileListIndex =
                  filesList.length <= 0 ? 1 : filesList.length + 1;
                if (
                  filesList.findIndex(
                    fileitem => fileitem.path === item.path,
                  ) === -1
                ) {
                  filesList.push({
                    id: fileListIndex,
                    path: item.path,
                    name: item.name,
                    size: item.size,
                    ctime: item.ctime,
                    mtime: item.mtime,
                  });
                }
                currentFileCount += 1;
              }
            }
          });
          if (fileCount === filesList.length - currentFileCount) {
            console.log('已相等');
          }
          console.log(' recursionFilesInDirectory filesList', filesList);
          this.setState(
            {
              filesList: filesList,
              fileCount: filesList.length,
              message: `已经找到了[${filesList.length}]首音乐文件`,
            },
            () => {},
          );
        }
      }
    });
  };

  batchFindFileTime = () => {
    this.state.findFileTimeHandle = setInterval(() => {
      let sourceLists = this.state.sourceLists;
      let sourceListsIndex = this.state.sourceListsIndex;
      let findFileTimeHandle = this.state.findFileTimeHandle;
      clearInterval(findFileTimeHandle);
      this.setState({findFileTimeHandle: findFileTimeHandle});
      if (!this.state.isPause && sourceListsIndex <= sourceLists.length - 1) {
        let item = sourceLists[sourceListsIndex];
        this.recursionFilesInDirectory(item.path);
        if (sourceListsIndex === sourceLists.length - 1) {
          let filesList = this.state.filesList;
          if (filesList != null && filesList.length > 0) {
            this.setState({
              message: `已经找到了[${filesList.length}]首音乐文件,end`,
            });
          }
        }
        if (sourceListsIndex <= sourceLists.length - 1) {
          this.setState({sourceListsIndex: sourceListsIndex + 1});
          this.batchFindFileTime();
        }
      } else {
        clearInterval(findFileTimeHandle);
        this.setState({findFileTimeHandle: findFileTimeHandle});
      }
    }, 500);
  };

  batchFindFile = rootDirectory => {
    this.getFilesInDirectory(rootDirectory).then(sourceLists => {
      try {
        if (
          sourceLists !== null &&
          typeof sourceLists !== 'undefined' &&
          sourceLists.length > 0
        ) {
          /*sourceLists.map((item, index) => {
            if (!this.state.isPause) {
              this.recursionFilesInDirectory(item.path);
              if (index === sourceLists.length - 1) {
                let filesList = this.state.filesList;
                if (filesList != null && filesList.length > 0) {
                  this.setState({
                    message: `已经找到了[${filesList.length}]首音乐文件,end`,
                  });
                }
              }
            } else {
              throw new Error('已暂停查找');
            }
          });*/
          this.setState({sourceLists: sourceLists, sourceListsIndex: 0}, () => {
            this.batchFindFileTime();
          });
        }
      } catch (error) {
        this.setState({message: this.state.message + `\n${error}`});
      }
    });
  };

  /**
   * 组件挂载方法
   */
  componentDidMount() {
    console.log('ScanFile props', this.props);
    let albums = this.props.route.params.albums;
    let rootDirectory = this.state.rootDirectory;
    this.setState({albums: albums});
    this.checkPermissions().then(() => {
      this.setState({message: '开始扫描手机音乐文件'});
      if (Platform.OS === 'android') {
        rootDirectory = RNFS.ExternalStorageDirectoryPath;
        console.log(
          'ExternalStorageDirectoryPath',
          RNFS.ExternalStorageDirectoryPath,
        );
        this.setState({rootDirectory: rootDirectory});
      }
      this.batchFindFile(rootDirectory);
    });
  }

  /**
   * 标签切换方法
   * @param {标签索引} tabIndex
   */
  changeTab = tabIndex => {
    if (tabIndex === 0) {
      this.setState({TabName: 'messageTab', TabIndex: 0, isPause: false});
      this.batchFindFileTime();
    } else if (tabIndex === 1) {
      let findFileTimeHandle = this.state.findFileTimeHandle;
      clearInterval(findFileTimeHandle);
      this.setState({
        TabName: 'musicTab',
        TabIndex: 1,
        findFileTimeHandle: findFileTimeHandle,
        isPause: true,
      });
      console.log('changeTab pause', this.state);
    }
  };

  /**
   * 标签渲染方法
   * @returns
   */
  render() {
    return (
      <LinearGradient colors={['#18A4FD', '#FFFFFF']} style={styles.container}>
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
              扫描手机音乐文件
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
            type="ac"
            style={styles.HcdWaveView}
            IconSize={styles.HcdWaveView.IconSize}
            IconTop={styles.HcdWaveView.IconTop}
            IconLeft={styles.HcdWaveView.IconLeft}
            IconZIndex={styles.HcdWaveView.IconZIndex}
            tips="扫描手机音乐文件"
          />
        </View>
        {/*水波浪进度条E*/}
        {/*切换层B*/}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            onPress={() => {
              this.changeTab(0);
            }}>
            <View
              style={
                this.state.TabIndex === 0 ? styles.tabActive : styles.tabNormal
              }>
              <Text
                style={
                  this.state.TabIndex === 0
                    ? styles.tabActive.textStyle
                    : styles.tabNormal.textStyle
                }>
                日志信息
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.changeTab(1);
            }}>
            <View
              style={
                this.state.TabIndex === 1 ? styles.tabActive : styles.tabNormal
              }>
              <Text
                style={
                  this.state.TabIndex === 1
                    ? styles.tabActive.textStyle
                    : styles.tabNormal.textStyle
                }>
                歌曲列表
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        {/*切换层E*/}
        <View style={styles.scrollContainer}>
          <TabContainer
            albums={this.state.albums}
            navigation={this.props.navigation}
            TabName={this.state.TabName}
            filesList={this.state.filesList}
            message={this.state.message}
          />
        </View>
      </LinearGradient>
    );
  }
}
