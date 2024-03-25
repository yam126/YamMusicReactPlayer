/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable radix */
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import Swiper from 'react-native-swiper';
import {numberImage} from '../../constant';
import WaterfallFlow from 'react-native-waterfall-flow';
import DrawerMenu from '../../components/DrawerMenu';
import {useSelector} from 'react-redux';
import {
  focusImage,
  recentlylistened,
  recentlylistenedAlbum,
} from '../../utils/api';
import {CustomCachedImage} from 'react-native-img-cache';
//import ImageProgress from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';
import MiniLoading from '../../components/MiniLoading';
import Storage from '../../utils/storage';

let styleJson = {
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    flexDirection: 'column',
  },
  albumsTitle: {
    fontSize: 25,
    color: 'black',
  },
  albumsIcon: {
    marginVertical: 3,
    marginHorizontal: 3,
  },
  albumsListHeader: {
    width: Dimensions.get('window').width - 10,
    height: 35,
    marginVertical: 5,
    marginHorizontal: 2.5,
    backgroundColor: '#fff',
    flexDirection: 'row',
    borderRadius: 6,
  },
  WaterfallFlowContainer: {
    width: Dimensions.get('window').width - 10,
    height: 350,
    backgroundColor: '#fff',
    marginHorizontal: 2.5,
  },
  WaterfallFlowItemFont: {
    fontSize: 15,
  },
  WaterfallFlowItem: {
    width: (Dimensions.get('window').width - 20) / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 2,
    marginVertical: 3,
    paddingRight: 3,
    borderRadius: 5,
  },
  WaterfallFlowImage: {
    width: (Dimensions.get('window').width - 35) / 2,
    height: Math.floor(Math.random() * (420 - 380 + 1)) + 380,
    marginBottom: 3,
    borderRadius: 5,
  },
  miniCover: {
    width: 97,
    height: 97,
    marginVertical: 13,
    marginHorizontal: 7,
    borderRadius: 10,
  },
  miniSongName: {
    fontSize: 15,
    color: 'black',
    marginVertical: 2,
    textAlign: 'center',
  },
  listeningRecentlyItemSongName: {
    width: 117,
    height: 35,
    borderWidth: 0,
    borderColor: 'red',
  },
  listeningRecentlyItem: {
    width: 117,
    height: 199,
    marginHorizontal: 1,
    flexDirection: 'column',
  },
  listeningRecentlyListContainer: {
    width: Dimensions.get('window').width,
    height: 157,
    borderWidth: 0,
    borderColor: 'red',
  },
  listeningRecentlyTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'left',
    marginVertical: 3,
  },
  listeningRecentlyTitleContainer: {
    width: Dimensions.get('window').width - 20,
    height: 43,
    borderBottomWidth: 1,
    textAlign: 'left',
    borderBottomColor: '#CCC',
    marginHorizontal: 8,
  },
  listeningRecentlyContainer: {
    width: Dimensions.get('window').width,
    height: 195,
    backgroundColor: 'white',
    borderTopColor: '#ccc',
    borderTopWidth: 1,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    marginVertical: 6,
    flexDirection: 'column',
  },
  borderShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  userContainer: {
    width: Dimensions.get('window').width - 10,
    height: 125,
    marginVertical: 5,
    marginHorizontal: 2.5,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    iconSize: 85,
    center: {
      width: Dimensions.get('window').width - 15,
      height: 120,
      flexDirection: 'row',
      borderColor: 'red',
      borderWidth: 0,
    },
  },
  userFaceIcon: {
    marginVertical: 16,
    marginHorizontal: 16,
  },
  userInfoContainer: {
    width: Dimensions.get('window').width - 150,
    height: 115,
    marginVertical: 5,
    flexDirection: 'column',
    borderColor: 'red',
    borderWidth: 0,
  },
  userText: {
    fontSize: 13,
    color: '#000',
    marginVertical: 8,
    fontWeight: 'bold',
  },
  timeContainer: {
    width: Dimensions.get('window').width - 150,
    height: 67,
    marginVertical: 2,
    flexDirection: 'row',
  },
  timeText: {
    fontSize: 35,
    color: 'black',
    marginVertical: 5,
    marginHorizontal: 2,
  },
  timeImage: {
    width: 31,
    height: 55,
    marginHorizontal: 7,
    marginVertical: 5,
  },
  focusImage: {
    width: Dimensions.get('window').width - 20,
    height: 170,
    borderWidth: 0,
    borderColor: 'red',
    marginVertical: 2.5,
    marginHorizontal: 8.5,
    borderRadius: 10,
  },
  focusImageCenter: {
    width: Dimensions.get('window').width - 20,
    height: 170,
    position: 'absolute',
    backgroundColor: 'transparent',
    top: 0,
    left: 0,
    borderRadius: 10,
  },
  focusImageTitle: {
    width: Dimensions.get('window').width - 20,
    height: 27,
    position: 'absolute',
    top: 0,
    left: 0,
    borderWidth: 0,
    borderColor: 'red',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10,
  },
  focusImageTitleCenter: {
    fontSize: 13,
    color: 'red',
    textAlign: 'left',
    marginVertical: 3,
    marginHorizontal: 5,
  },
  focusSwiper: {
    // 这里不能加宽度，否则轮播图会失效
    height: 175,
    marginVertical: 5,
  },
  focusSwiperContainer: {
    width: Dimensions.get('window').width - 20,
    height: 170,
    marginVertical: 2.5,
    marginHorizontal: 8.5,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 2,
    borderRadius: 10,
  },
  title: {
    fontSize: 17,
    textAlign: 'center',
    textAlignVertical: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    color: 'white',
  },
  titleContainer: {
    width: Dimensions.get('window').width - 95,
    height: 35,
    marginVertical: 9,
    borderRadius: 5,
  },
  headerContainer: {
    width: Dimensions.get('window').width,
    height: 55,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
  },
  menuIcon: {
    width: 25,
    height: 25,
    marginVertical: 12,
    marginHorizontal: 12,
  },
};

function resizeMode() {
  let screenWidth = Dimensions.get('window').width.toFixed();
  let screenHeight = Dimensions.get('window').height.toFixed();
  //console.log('screenWidth', screenWidth);
  //console.log('screenHeight', screenHeight);
  styleJson.focusImageTitle.top =
    styleJson.focusImageCenter.height - styleJson.focusImageTitle.height;
  if (parseInt(screenWidth, 10) <= 360 && parseInt(screenHeight, 10) <= 732) {
    styleJson.userContainer.iconSize = 61;
    styleJson.userText.fontSize = 11;
    styleJson.userText.marginVertical = 17;
    styleJson.userContainer.height = 89;
    styleJson.timeText.marginVertical = -5;
    styleJson.userContainer.marginHorizontal = 5;
    styleJson.timeImage.width = 17;
    styleJson.timeImage.height = 32;
    styleJson.userFaceIcon.marginHorizontal = 18;
    styleJson.userInfoContainer.marginHorizontal = -8;
  } else if (screenWidth === 360 && screenHeight === 592) {
    styleJson.userContainer.iconSize = 61;
    styleJson.userText.fontSize = 11;
    styleJson.userContainer.height = 89;
    styleJson.timeText.marginVertical = -5;
    styleJson.timeImage.width = 17;
    styleJson.timeImage.height = 32;
  } else if (screenWidth <= 384 || screenHeight <= 592) {
    //console.log('resizeMode screenWidth', screenWidth);
    //console.log('resizeMode screenHeight', screenHeight);
    styleJson.userContainer.iconSize = 61;
    styleJson.userText.fontSize = 12;
    styleJson.userContainer.height = 89;
    styleJson.userContainer.center.height = styleJson.userContainer.height - 10;
    styleJson.timeText.marginVertical = -5;
    styleJson.timeImage.width = 17;
    styleJson.timeImage.height = 32;
  } else if (screenWidth <= 392 || parseInt(screenHeight, 10) <= 753) {
    //console.log('resizeMode screenWidth', screenWidth);
    //console.log('resizeMode screenHeight', screenHeight);
    styleJson.userContainer.center.borderWidth = 0;
    styleJson.userContainer.borderWidth = 0;
    styleJson.userContainer.center.height = styleJson.userContainer.height - 20;
    styleJson.userContainer.iconSize = 61;
    styleJson.userText.fontSize = 12;
    styleJson.userContainer.height = 89;
    styleJson.timeText.marginVertical = -5;
    styleJson.timeImage.width = 17;
    styleJson.timeImage.height = 32;
  } else if (
    parseInt(screenWidth, 10) >= 673 ||
    parseInt(screenHeight) >= 793
  ) {
    styleJson.userContainer.center.width = 456;
  }
  if (parseInt(screenWidth, 10) <= 393 && parseInt(screenHeight, 10) <= 803) {
    styleJson.userContainer.iconSize = 78;
    styleJson.userContainer.marginVertical = 3;
  }
  if (parseInt(screenWidth, 10) <= 411 && parseInt(screenHeight, 10) <= 842) {
    styleJson.userContainer.iconSize = 78;
    styleJson.userFaceIcon.marginHorizontal = 28;
  }
  return styleJson;
}

const styles = StyleSheet.create(resizeMode());

//焦点图组件
class FocusImageWidget extends React.Component {
  getFocusImage = () => {
    focusImage({
      parm: null,
      beforeCallBack: () => {},
      responseCallBack: res => {
        //console.log('getFocusImage res data', res);
        res.then(resData => {
          if (resData !== null && typeof resData !== 'undefined') {
            console.log('getFocusImage response data', resData);
            const {status, result, msg} = resData;
            if (status !== 0) {
              Alert.alert('错误', `获取焦点图出错,原因[${msg}]`);
              this.setState({errMsg: `获取焦点图出错,原因[${msg}]`});
            } else {
              console.log('getFocusImage response result', result);
              this.setState({isLoadComplete: true, imageData: result});
            }
          }
        });
      },
      errorCallback: error => {
        Alert.alert('错误', `获取焦点数据出错,原因[${error}]`);
      },
    });
  };
  constructor() {
    super();
    this.state = {
      isLoadComplete: false,
      errMsg: '',
      imageData: null,
    };
  }
  componentDidMount() {
    this.getFocusImage();
  }

  gotoPlay = songId => {
    this.props.navigation.navigate('PlayPage', {songId: songId});
  };

  render() {
    return (
      <>
        {!this.state.isLoadComplete ? (
          this.state.errMsg !== '' ? (
            <TouchableOpacity onPress={() => this.getFocusImage}>
              <View style={[styles.focusSwiperContainer, styles.borderShadow]}>
                <Text>{`${this.state.errMsg}点击刷新`}</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <View style={[styles.focusSwiperContainer, styles.borderShadow]}>
              <ActivityIndicator size={'large'} color={'#CCC'} />
            </View>
          )
        ) : (
          <Swiper
            autoplay={true}
            showsButtons={false}
            showsPagination={false}
            horizontal={true}
            style={styles.focusSwiper}>
            {this.state.imageData === null ? (
              <TouchableOpacity onPress={() => this.getFocusImage}>
                <View
                  style={[styles.focusSwiperContainer, styles.borderShadow]}>
                  <Text>没有数据点击刷新</Text>
                </View>
              </TouchableOpacity>
            ) : (
              this.state.imageData.map((item, index) => {
                return (
                  <View style={styles.focusImage}>
                    <TouchableOpacity
                      onPress={() => {
                        this.gotoPlay(item.focusImageID);
                      }}>
                      <Image
                        //component={Image}
                        source={{
                          uri: item.focusImageURL,
                        }}
                        //indicator={ProgressBar}
                        style={styles.focusImageCenter}
                      />
                      <View style={styles.focusImageTitle}>
                        <Text style={styles.focusImageTitleCenter}>
                          {item.focusImageName}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              })
            )}
          </Swiper>
        )}
      </>
    );
  }
}

//最近播放
class RecentlyListened extends React.Component {
  getRecentlyListened = () => {
    recentlylistened({
      parm: {limit: 10, userId: ''},
      beforeCallBack: () => {},
      responseCallBack: res => {
        res.then(resData => {
          //console.log('getRecentlyListened resData', resData);
          if (resData !== null && typeof resData !== 'undefined') {
            const {status, result, msg} = resData;
            if (status !== 0) {
              Alert.alert('错误', `获取焦点图出错,原因[${msg}]`);
              this.setState({
                errMsg: `获取焦点图出错,原因[${msg}]`,
                isLoadComplete: true,
              });
            } else {
              this.setState({
                errMsg: '',
                isLoadComplete: true,
                apiData: result,
              });
            }
          }
        });
      },
      errorCallback: error => {
        Alert.alert('错误', `获取焦点数据出错,原因[${error}]`);
      },
    });
  };
  constructor() {
    super();
    let ContainerWidth = styleJson.listeningRecentlyListContainer.width;
    let ContainerHeight = styleJson.listeningRecentlyListContainer.height;
    this.state = {
      isLoadComplete: false,
      errMsg: '',
      apiData: null,
      Width: ContainerWidth,
      Height: ContainerHeight,
      Size: 35,
    };
  }
  gotoPlay = songId => {
    this.props.navigation.navigate('PlayPage', {songId: songId});
  };
  renderItem = ({index, item}) => {
    return (
      <View style={styles.listeningRecentlyItem}>
        <TouchableOpacity
          onPress={() => {
            this.gotoPlay(item.songId);
          }}>
          <Image style={styles.miniCover} source={{uri: item.cover}} />
          <View style={styles.listeningRecentlyItemSongName}>
            <Text style={styles.miniSongName} numberOfLines={1}>
              {item.title}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  componentDidMount() {
    this.getRecentlyListened();
  }
  render() {
    //console.log('RecentlyListened this.state', this.state);
    return !this.state.isLoadComplete ? (
      <MiniLoading
        Width={this.state.Width}
        Height={this.state.Height}
        Size={this.state.Size}
      />
    ) : this.state.errMsg === '' ? (
      <View style={styles.listeningRecentlyListContainer}>
        <FlatList
          data={this.state.apiData}
          horizontal={true}
          renderItem={this.renderItem}
          keyExtractor={item => item.songId}
        />
      </View>
    ) : (
      <View style={styles.listeningRecentlyListContainer}>
        <Text>{this.state.errMsg}</Text>
      </View>
    );
  }
}

//常听专辑
class RecentlylistenedAlbum extends React.Component {
  getRecentlylistenedAlbum = () => {
    recentlylistenedAlbum({
      parm: {limit: 17, userId: ''},
      beforeCallBack: () => {},
      responseCallBack: res => {
        //console.log('getRecentlylistenedAlbum res data', res);
        res.then(resData => {
          if (resData !== null && typeof resData !== 'undefined') {
            const {status, result, msg} = resData;
            let resultAry = null;
            if (status !== 0) {
              Alert.alert('错误', `获取焦点图出错,原因[${msg}]`);
              this.setState({
                errMsg: `获取焦点图出错,原因[${msg}]`,
                isLoadComplete: true,
              });
            } else {
              if (result !== null && typeof result !== 'undefined') {
                if (result.length > 0) {
                  resultAry = result.map(item => {
                    //随机高度
                    item.albumCoverHeight =
                      Math.floor(Math.random() * (520 - 280 + 1)) + 280;
                    return item;
                  });
                }
              }
              this.setState({
                errMsg: '',
                isLoadComplete: true,
                apiData: resultAry,
              });
            }
          }
        });
      },
    });
  };
  constructor() {
    super();
    let ContainerWidth = styleJson.albumsListHeader.width;
    let ContainerHeight = 575;
    this.state = {
      apiData: null,
      isLoadComplete: false,
      errMsg: '',
      Width: ContainerWidth,
      Height: ContainerHeight,
      Size: 55,
    };
  }
  componentDidMount() {
    this.getRecentlylistenedAlbum();
  }
  gotoPlay = albumId => {
    this.props.navigation.navigate('PlayPage', {albumId: albumId});
  };
  render() {
    return !this.state.isLoadComplete ? (
      <MiniLoading
        Width={this.state.Width}
        Height={this.state.Height}
        Size={this.state.Size}
      />
    ) : this.state.errMsg === '' ? (
      <WaterfallFlow
        data={this.state.apiData}
        style={{flex: 1}}
        numColumns={2}
        ListHeaderComponent={
          <View style={[styles.albumsListHeader, styles.borderShadow]}>
            <Icon
              style={styles.albumsIcon}
              name="invert-mode-sharp"
              size={25}
            />
            <Text style={styles.albumsTitle}>常听专辑</Text>
          </View>
        }
        renderItem={({item, index, columnIndex}) => {
          //console.log('getRecentlylistenedAlbum item', item);
          return (
            <TouchableOpacity
              onPress={() => {
                this.gotoPlay(item.albumId);
              }}>
              <View
                style={[
                  styles.WaterfallFlowItem,
                  {
                    paddingTop: 1,
                    paddingBottom: 1,
                  },
                  styles.borderShadow,
                ]}>
                <Image
                  //component={Image}
                  source={{
                    uri: item.albumCover,
                  }}
                  //indicator={ProgressBar}
                  style={[
                    styles.WaterfallFlowImage,
                    {height: item.albumCoverHeight},
                  ]}
                />
                <View style={{height: 20, width: 'auto'}}>
                  <Text numberOfLines={1}>{item.albumName}</Text>
                </View>
              </View>
              <View
                style={{
                  width: (Dimensions.get('window').width - 20) / 2,
                  height: 60,
                }}
              />
            </TouchableOpacity>
          );
        }}
      />
    ) : (
      <View style={{width: this.state.Width, height: this.state.Height}}>
        <Text>{this.state.errMsg}</Text>
      </View>
    );
  }
}

//首页主要代码
function Home(props) {
  let {showDrawer} = props;
  let screenWidth = Dimensions.get('window').width;
  let screenHeight = Dimensions.get('window').height;
  let userInfo = useSelector(state => state.user.userInfo);
  let userName = '';
  let userFace = '';
  const [data, setData] = React.useState({
    UserName: '',
    timeAry: [],
    dateStr: '',
    dateWelcome: '',
    imageData: null,
    isLoadComplete: false,
    errMsg: '',
    userInfo: null,
    recentlyData: [
      {
        id: 0,
        title: '测试歌曲标题11111',
        cover: require('../../images/cover/1695741904395833344.jpg'),
      },
      {
        id: 1,
        title: '测试歌曲标题2',
        cover: require('../../images/cover/1695741940487819264.jpg'),
      },
      {
        id: 2,
        title: '测试歌曲标题3',
        cover: require('../../images/cover/1695741940487819264.jpg'),
      },
      {
        id: 3,
        title: '测试歌曲标题4',
        cover: require('../../images/cover/1695741958422663168.jpg'),
      },
      {
        id: 4,
        title: '测试歌曲标题5',
        cover: require('../../images/cover/1695742008041279488.jpg'),
      },
      {
        id: 5,
        title: '测试歌曲标题6',
        cover: require('../../images/cover/1695742026517188608.jpg'),
      },
      {
        id: 6,
        title: '测试歌曲标题7',
        cover: require('../../images/cover/1695742030841516032.jpg'),
      },
    ],
  });
  if (userInfo === null || typeof userInfo === 'undefined') {
    userInfo = data.userInfo;
  }
  /**
   * 获得日期字符串
   * @returns 日期字符串
   */
  const getDateStr = () => {
    let nowDate = new Date();
    let dateStr = `${nowDate.getFullYear()}年${
      nowDate.getMonth() + 1
    }月${nowDate.getDate()}日`;
    return dateStr;
  };

  /**
   * 填充时间数组
   * @param {时间数字} timeNum
   * @param {时间数组} timeAry
   * @returns
   */
  const pushTimeAry = (timeNum, timeAry) => {
    ////console.log('timeNum', timeNum);
    if (timeNum.toString().length < 2) {
      timeAry.push(0);
      timeAry.push(timeNum);
    } else {
      timeAry.push(parseInt(Array.from(timeNum.toString())[0]));
      timeAry.push(parseInt(Array.from(timeNum.toString())[1]));
    }
    return timeAry;
  };
  const loadCurrentUser = () => {
    Storage.get('userInfo').then(storageUserInfo => {
      //console.log('loadCurrentUser userInfo', userInfo);
      userInfo = storageUserInfo.payload;
      console.log('loadCurrentUser userInfo', userInfo);
      if (userInfo !== null && typeof userInfo !== 'undefined') {
        userName = userInfo.userName;
        userFace = userInfo.userFace;
      }
    });
    if (userInfo !== null && typeof userInfo !== 'undefined') {
      userName = userInfo.userName;
      userFace = userInfo.userFace;
    }
  };
  loadCurrentUser();
  const getTimeAry = () => {
    let nowDate = new Date();
    let hour = nowDate.getHours();
    let minutes = nowDate.getMinutes();
    let second = nowDate.getSeconds();
    let timeAry = [];
    let returnAry = [];
    let dateWelcome = '';
    ////console.log('hour', hour);
    timeAry = pushTimeAry(hour, timeAry);
    timeAry = pushTimeAry(minutes, timeAry);
    timeAry = pushTimeAry(second, timeAry);
    ////console.log('timeAry', timeAry);
    dateWelcome = hour <= 12 ? '上午好' : '下午好';
    for (let i = 0; i < timeAry.length; i++) {
      let itime = timeAry[i];
      returnAry.push(numberImage[itime]);
    }
    setData({
      ...data,
      timeAry: returnAry,
      dateWelcome: dateWelcome,
      dateStr: getDateStr(),
    });
  };
  React.useEffect(() => {
    //console.log('screenWidth', screenWidth);
    //console.log('screenHeight', screenHeight);
    getTimeAry();
    let timer = setInterval(() => {
      getTimeAry();
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  /**
   * 跳转页面
   * @param {跳转页面名} route
   * @param {参数} args
   */
  const gotoPage = (route, args) => {
    if (args === null && typeof args === 'undefined') {
      props.navigation.navigate(route);
    } else {
      props.navigation.navigate(route, args);
    }
  };

  //打开侧滑菜单
  const openDrawer = () => {
    //console.log('showDrawer', showDrawer);
    showDrawer();
  };
  //console.log('Home userInfo', userInfo);
  if (userInfo !== null && typeof userInfo !== 'undefined') {
    userName = userInfo.userName;
    userFace = userInfo.userFace;
  }
  return (
    <View style={styles.container}>
      {/*首页标题开始*/}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => openDrawer()}>
          <Icon
            style={styles.menuIcon}
            name="grid-outline"
            size={25}
            color={'grey'}
          />
        </TouchableOpacity>
        <LinearGradient
          colors={['#84fab0', '#8fd3f4']}
          start={{x: 0, y: 5}}
          end={{x: 2, y: 7}}
          style={styles.titleContainer}>
          <Text style={styles.title}>Yam Music Player</Text>
        </LinearGradient>
        <TouchableOpacity
          onPress={() => {
            gotoPage('CameraScanner', null);
          }}>
          <Icon
            style={styles.menuIcon}
            name="scan-outline"
            size={25}
            color={'grey'}
          />
        </TouchableOpacity>
      </View>
      {/*首页标题结束*/}
      <ScrollView>
        {/*焦点图B*/}
        <FocusImageWidget navigation={props.navigation} />
        {/*焦点图E*/}
        {/*用户层B*/}
        <View style={[styles.userContainer, styles.borderShadow]}>
          <View style={styles.userContainer.center}>
            {userFace === '' ? (
              <Icon
                name="person-circle"
                style={styles.userFaceIcon}
                color={'#A880F2'}
                size={styleJson.userContainer.iconSize}
              />
            ) : (
              <Image
                style={[
                  styles.userFaceIcon,
                  {
                    width: styleJson.userContainer.iconSize,
                    height: styleJson.userContainer.iconSize,
                    resizeMode: 'stretch',
                  },
                ]}
                source={{uri: userFace}}
              />
            )}
            <View style={styles.userInfoContainer}>
              <Text numberOfLines={1} style={styles.userText}>
                {data.dateWelcome},{userName}现在是:{data.dateStr}
              </Text>
              <View style={styles.timeContainer}>
                <Image style={styles.timeImage} source={data.timeAry[0]} />
                <Image style={styles.timeImage} source={data.timeAry[1]} />
                <Text style={styles.timeText}>:</Text>
                <Image style={styles.timeImage} source={data.timeAry[2]} />
                <Image style={styles.timeImage} source={data.timeAry[3]} />
                <Text style={styles.timeText}>:</Text>
                <Image style={styles.timeImage} source={data.timeAry[4]} />
                <Image style={styles.timeImage} source={data.timeAry[5]} />
              </View>
            </View>
          </View>
        </View>
        {/*用户层E*/}
        {/*最近在听B*/}
        <View style={[styles.listeningRecentlyContainer, styles.borderShadow]}>
          <View style={styles.listeningRecentlyTitleContainer}>
            <Text style={styles.listeningRecentlyTitle}>最近播放</Text>
          </View>
          <RecentlyListened navigation={props.navigation} />
        </View>
        {/*最近在听E*/}
        {/*专辑列表B*/}
        <RecentlylistenedAlbum navigation={props.navigation} />
        {/*专辑列表E*/}
      </ScrollView>
    </View>
  );
}

export default class Index extends Component {
  render() {
    //console.log('Home Index props', this.props);
    return (
      <DrawerMenu
        navigation={this.props.navigation}
        childComponent={openDrawer => (
          <Home navigation={this.props.navigation} showDrawer={openDrawer} />
        )}
      />
    );
  }
}
