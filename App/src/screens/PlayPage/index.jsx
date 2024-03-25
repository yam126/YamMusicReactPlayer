/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  Animated,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Alert,
  RefreshControl,
  FlatList,
} from 'react-native';
import React, {useState, useCallback, Component} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Slider from '@react-native-community/slider';
import {ScrollTabView, ScrollView} from 'react-native-scroll-head-tab-view';
import SoundPlayer from 'react-native-sound-player';
import Loading from '../../components/Loading';
import {
  GetPlayerData,
  GetSongCommentPage,
  PublisherSongComment,
} from '../../utils/api';
import {formatDuration, getRandomInt} from '../../utils';
import Toast, {DURATION} from 'react-native-easy-toast';
import MiniLoading from '../../components/MiniLoading';
import Storage from '../../utils/storage';
import CustomPopupMenu from '../../components/CustomPopupMenu';

let styleJson = {
  container: {
    flex: 1,
  },
  commentEnd: {
    width: Dimensions.get('window').width,
    height: 137,
  },
  commentItem: {
    width: Dimensions.get('window').width,
    minHeight: 176,
    maxHeight: 576,
    marginVertical: 7,
    flexDirection: 'row',
    borderColor: 'red',
    borderWidth: 0,
    userFaceContainer: {
      width: 75,
      height: 138,
      flexDirection: 'column',
      borderColor: 'red',
      borderWidth: 0,
      alignItems: 'center',
      justifyContent: 'center',
      userFace: {
        marginVertical: 25,
        width: 65,
        height: 65,
      },
      userName: {
        width: 75,
        height: 55,
        fontSize: 13,
        textAlign: 'center',
      },
    },
    contentContainer: {
      width: Dimensions.get('window').width - 98,
      minHeight: 138,
      maxHeight: 567,
      backgroundColor: '#12fff7',
      borderRadius: 15,
      title: {
        width: Dimensions.get('window').width - 98,
        height: 27,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        font: {
          fontWeight: 'bold',
          fontSize: 16,
          color: 'black',
          marginVertical: 3,
          marginHorizontal: 15,
          textAlign: 'left',
        },
      },
      content: {
        width: Dimensions.get('window').width - 112,
        minHeight: 135,
        maxHeight: 367,
        marginHorizontal: 9,
        borderColor: 'red',
        borderWidth: 0,
        text: {
          fontSize: 12,
          color: 'black',
          textAlign: 'left',
        },
      },
    },
    bubbleCorner: {
      width: 0,
      height: 0,
      marginVertical: 43,
      borderTopWidth: 10,
      borderTopColor: 'transparent',
      borderRightWidth: 10,
      borderRightColor: '#12fff7',
      borderLeftWidth: 5,
      borderLeftColor: 'transparent',
      borderBottomWidth: 10,
      borderBottomColor: 'transparent',
    },
  },
  commentContainer: {
    width: Dimensions.get('window').width - 20,
    minHeight: 275,
    maxHeight: 397,
    marginVertical: 7,
    marginHorizontal: 9,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    linearGradientBackground: {
      width: Dimensions.get('window').width - 23,
      minHeight: 272,
      maxHeight: 397,
      opacity: 0.5,
      justifyContent: 'flex-start',
      alignItems: 'center',
      borderRadius: 10,
      inputContainer: {
        width: Dimensions.get('window').width - 53,
        height: 150,
        //marginHorizontal: 12,
        marginVertical: 12,
        backgroundColor: 'white',
        borderColor: '#ccc',
        borderRadius: 10,
      },
      submitButton: {
        width: Dimensions.get('window').width - 280,
        height: 35,
        //marginHorizontal: 123,
        marginVertical: 5,
        borderColor: '#ccc',
        borderRadius: 35,
        backGrondLinearGradient: {
          width: Dimensions.get('window').width - 280,
          height: 35,
          borderColor: '#ccc',
          borderRadius: 35,
        },
        text: {
          fontSize: 21,
          color: 'black',
          textAlign: 'center',
        },
      },
      titleContainer: {
        width: Dimensions.get('window').width - 53,
        height: 47,
        flexDirection: 'row',
        marginHorizontal: 12,
        borderBottomColor: '#CCC',
        borderBottomWidth: 2,
      },
      title: {
        fontSize: 21,
        color: 'black',
        marginHorizontal: 6,
        marginVertical: 7,
      },
      Icon: {
        marginVertical: 5,
        marginHorizontal: 5,
      },
    },
  },
  songInfoItem: {
    width: Dimensions.get('window').width - 35,
    height: 25,
    borderRadius: 5,
    marginHorizontal: 15,
    marginVertical: 5,
    flexDirection: 'row',
    songName: {
      fontSize: 19,
      color: 'gray',
    },
  },
  borderShadow: {
    shadowColor: '#CCC',
    shadowOffset: {
      width: 16,
      height: 23,
    },
    shadowOpacity: 0.3,
    shadowRadius: 0,
    elevation: 20,
  },
  lyricText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'gray',
    marginHorizontal: 10,
    marginVertical: 21,
  },
  playButton: {
    marginHorizontal: 10,
    marginVertical: 3,
    iconSize: 65,
  },
  previousIcon: {
    marginHorizontal: 10,
    marginVertical: 21,
    iconSize: 32,
  },
  skipFirstIcon: {
    marginHorizontal: 10,
    marginVertical: 21,
    iconSize: 32,
  },
  playOrderIcon: {
    marginHorizontal: 32,
    marginVertical: 21,
    iconSize: 25,
  },
  controlButton: {
    width: Dimensions.get('window').width,
    height: 78,
    //flexDirection: 'row',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    center: {
      width: Dimensions.get('window').width - 10,
      height: 76,
      flexDirection: 'row',
      borderColor: 'red',
      borderWidth: 0,
    },
  },
  sliderContainer: {
    width: Dimensions.get('window').width,
    height: 40,
    borderColor: 'red',
    borderWidth: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    center: {
      flexDirection: 'row',
      width: Dimensions.get('window').width,
      height: 40,
      borderColor: 'red',
      borderWidth: 0,
    },
    timeLabel: {
      paddingTop: 6,
      paddingLeft: 9,
      fontSize: 18,
      fontWeight: 'bold',
      color: '#ccc',
    },
    slider: {
      width: Dimensions.get('window').width - 180,
      height: 40,
    },
  },
  linearGradient: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 170,
    marginBottom: 70,
    flex: 1,
  },
  coverImage: {
    width: 198,
    height: 198,
    borderRadius: 180,
    marginVertical: 35,
    marginHorizontal: 35,
  },
  discBackGroundContainer: {
    width: 265,
    height: 265,
    marginHorizontal: (Dimensions.get('window').width - 265) / 2,
    marginVertical: 56,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'red',
    borderWidth: 0,
  },
  discBackGround: {
    width: 265,
    height: 265,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: (Dimensions.get('window').width - 265) / 2,
    marginVertical: 156,
  },
  songName: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    paddingTop: 5,
  },
  songNameContainer: {
    width: Dimensions.get('window').width - 75,
    height: 37,
    marginVertical: 9,
    borderColor: 'red',
    borderWidth: 0,
  },
  forwardBack: {
    marginVertical: 10,
    iconSize: 35,
  },
  barHeader: {
    width: Dimensions.get('window').width,
    height: 55,
    flexDirection: 'row',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
};

function resizeMode() {
  let screenWidth = Dimensions.get('window').width.toFixed();
  let screenHeight = Dimensions.get('window').height.toFixed();
  if (screenWidth === 480 || screenHeight === 854) {
    return styleJson;
  } else if (
    parseInt(screenWidth, 10) <= 320 ||
    parseInt(screenHeight, 10) <= 426
  ) {
    styleJson.barHeader.height = 43;
    styleJson.songNameContainer.width = screenWidth - 43;
    styleJson.songNameContainer.height = 43;
    styleJson.songNameContainer.marginVertical = 3;
    styleJson.songName.fontSize = 15;
    styleJson.songName.paddingTop = 8;
    styleJson.forwardBack.iconSize = 21;
    styleJson.discBackGroundContainer = {
      width: 76,
      height: 76,
      marginHorizontal: (Dimensions.get('window').width - 76) / 2,
      marginVertical: 26,
      borderColor: 'red',
      borderWidth: 0,
    };
    styleJson.discBackGround = {
      width: 76,
      height: 76,
    };
    styleJson.coverImage = {
      width: 56,
      height: 56,
      borderRadius: 180,
      marginVertical: 9,
      marginHorizontal: 10,
    };
    styleJson.sliderContainer.marginVertical = -3;
    styleJson.sliderContainer.timeLabel.fontSize = 12;
    styleJson.sliderContainer.center.width = screenWidth - 60;
    styleJson.sliderContainer.height = 31;
    styleJson.sliderContainer.center.height = 31;
    styleJson.sliderContainer.slider.marginVertical = -3;
    //播放控制按钮B
    styleJson.playOrderIcon.marginHorizontal = 9;
    styleJson.playOrderIcon.iconSize = 17;
    styleJson.skipFirstIcon.iconSize = 17;
    styleJson.previousIcon.iconSize = 17;
    styleJson.playButton.iconSize = 51;
    styleJson.lyricText.fontSize = 17;
    //播放控制按钮E
    styleJson.commentContainer.minHeight = 78;
    styleJson.commentContainer.linearGradientBackground.minHeight = 75;
    styleJson.commentContainer.linearGradientBackground.maxHeight = 189;
    styleJson.commentContainer.linearGradientBackground.inputContainer.height = 55;
    styleJson.commentContainer.linearGradientBackground.submitButton.height = 25;
    styleJson.commentContainer.linearGradientBackground.submitButton.backGrondLinearGradient.height = 25;
    styleJson.commentContainer.linearGradientBackground.submitButton.width =
      screenWidth - 130;
    styleJson.commentContainer.linearGradientBackground.submitButton.backGrondLinearGradient.width =
      screenWidth - 130;
    styleJson.commentContainer.linearGradientBackground.submitButton.text.fontSize = 15;
  } else if (screenWidth === 360 && screenHeight === 592) {
    styleJson.barHeader.height = 43;
    styleJson.songNameContainer.width = screenWidth - 43;
    styleJson.songNameContainer.height = 43;
    styleJson.songNameContainer.marginVertical = 0;
    styleJson.songName.fontSize = 15;
    styleJson.songName.paddingTop = 8;
    styleJson.forwardBack.iconSize = 21;
    styleJson.discBackGroundContainer = {
      width: 165,
      height: 165,
      marginHorizontal: (Dimensions.get('window').width - 165) / 2,
      marginVertical: 56,
      borderColor: 'red',
      borderWidth: 0,
    };
    styleJson.discBackGround = {
      width: 165,
      height: 165,
    };
    styleJson.coverImage = {
      width: 131,
      height: 131,
      borderRadius: 180,
      marginVertical: 17,
      marginHorizontal: 17,
    };
    styleJson.playOrderIcon.marginHorizontal = 17;
    styleJson.playOrderIcon.iconSize = 23;
    styleJson.skipFirstIcon.iconSize = 23;
    styleJson.previousIcon.iconSize = 23;
    styleJson.playButton.iconSize = 63;
    styleJson.lyricText.fontSize = 21;
    styleJson.commentContainer.linearGradientBackground.submitButton.width =
      screenWidth - 210;
    styleJson.commentContainer.linearGradientBackground.submitButton.backGrondLinearGradient.width =
      screenWidth - 210;
    styleJson.commentItem.contentContainer.minHeight = 258;
    styleJson.commentItem.contentContainer.maxHeight = 978;
    styleJson.commentItem.contentContainer.content.minHeight = 157;
    styleJson.commentItem.contentContainer.content.maxHeight = 857;
  } else if (
    parseInt(screenWidth, 10) === 360 &&
    parseInt(screenHeight, 10) === 732
  ) {
    styleJson.barHeader.height = 43;
    styleJson.songNameContainer.width = screenWidth - 43;
    styleJson.songNameContainer.height = 43;
    styleJson.songNameContainer.marginVertical = 0;
    styleJson.songName.fontSize = 15;
    styleJson.songName.paddingTop = 8;
    styleJson.forwardBack.iconSize = 21;
    styleJson.discBackGroundContainer = {
      width: 165,
      height: 165,
      marginHorizontal: (Dimensions.get('window').width - 165) / 2,
      marginVertical: 56,
      borderColor: 'red',
      borderWidth: 0,
    };
    styleJson.discBackGround = {
      width: 165,
      height: 165,
    };
    styleJson.coverImage = {
      width: 131,
      height: 131,
      borderRadius: 180,
      marginVertical: 17,
      marginHorizontal: 17,
    };
    styleJson.playOrderIcon.marginHorizontal = 17;
    styleJson.playOrderIcon.iconSize = 23;
    styleJson.skipFirstIcon.iconSize = 23;
    styleJson.previousIcon.iconSize = 23;
    styleJson.playButton.iconSize = 63;
    styleJson.lyricText.fontSize = 21;
    styleJson.commentContainer.linearGradientBackground.submitButton.width =
      screenWidth - 210;
    styleJson.commentContainer.linearGradientBackground.submitButton.backGrondLinearGradient.width =
      screenWidth - 210;
    styleJson.commentItem.contentContainer.minHeight = 258;
    styleJson.commentItem.contentContainer.maxHeight = 978;
    styleJson.commentItem.contentContainer.content.minHeight = 157;
    styleJson.commentItem.contentContainer.content.maxHeight = 857;
  } else if (screenWidth <= 384 || screenHeight <= 592) {
    styleJson.barHeader.height = 43;
    styleJson.songNameContainer.width = screenWidth - 43;
    styleJson.songNameContainer.height = 43;
    styleJson.songNameContainer.marginVertical = 0;
    styleJson.songName.fontSize = 15;
    styleJson.songName.paddingTop = 8;
    styleJson.forwardBack.iconSize = 21;
    styleJson.discBackGroundContainer = {
      width: 165,
      height: 165,
      marginHorizontal: (Dimensions.get('window').width - 165) / 2,
      marginVertical: 56,
      borderColor: 'red',
      borderWidth: 0,
    };
    styleJson.discBackGround = {
      width: 165,
      height: 165,
    };
    styleJson.coverImage = {
      width: 131,
      height: 131,
      borderRadius: 180,
      marginVertical: 17,
      marginHorizontal: 17,
    };
    styleJson.playOrderIcon.marginHorizontal = 17;
    styleJson.playOrderIcon.iconSize = 23;
    styleJson.skipFirstIcon.iconSize = 23;
    styleJson.previousIcon.iconSize = 23;
    styleJson.playButton.iconSize = 63;
    styleJson.lyricText.fontSize = 21;
    styleJson.commentContainer.linearGradientBackground.submitButton.width =
      screenWidth - 210;
    styleJson.commentContainer.linearGradientBackground.submitButton.backGrondLinearGradient.width =
      screenWidth - 210;
    styleJson.commentItem.contentContainer.minHeight = 258;
    styleJson.commentItem.contentContainer.maxHeight = 978;
    styleJson.commentItem.contentContainer.content.minHeight = 157;
    styleJson.commentItem.contentContainer.content.maxHeight = 857;
  } else if (screenWidth <= 392 || screenHeight <= 753) {
    styleJson.playOrderIcon.marginHorizontal = 9;
  } else if (
    parseInt(screenWidth, 10) >= 673 ||
    parseInt(screenHeight, 10) >= 793
  ) {
    styleJson.controlButton.center.width = 466;
  }
  return styleJson;
}

const styles = StyleSheet.create(resizeMode());

//评论列表组件
class SongCommentList extends React.Component {
  constructor() {
    super();
    this.state = {
      PageSize: 10,
      CurPage: 1,
      SongId: '',
      isLoadComplete: false,
      isLoadUpComplate: false,
      nomore: false,
      PageData: null,
      DataCount: 0,
      PageCount: 0,
      SortField: 'createddatetime',
      SortMethod: 'ASC',
      refreshing: false, // 是否刷新标识
      errMsg: '',
    };
  }

  //获得每页数据
  getPageData = SongId => {
    console.log('getPageData state', this.state);
    GetSongCommentPage({
      parm: {
        SongId: SongId,
        SortField: this.state.SortField,
        SortMethod: this.state.SortMethod,
        PageSize: this.state.PageSize,
        CurPage: this.state.CurPage,
      },
      beforeCallBack: () => {},
      responseCallBack: res => {
        console.log('GetSongCommentPage res', res);
        res.then(resData => {
          if (resData !== null && typeof resData !== 'undefined') {
            console.log('GetSongCommentPage response data', resData);
            const {status, result, msg, pageCount, recordCount} = resData;
            let PageData = this.state.PageData;
            let CurPage = this.state.CurPage;
            let PageSize = this.state.PageSize;
            let nomore = this.state.nomore;
            if (status !== 0) {
              Alert.alert('错误', `获取分页数据出错,原因[${msg}]`);
              this.setState({errMsg: `获取分页数据出错,原因[${msg}]`});
            } else {
              console.log('GetSongCommentPage response result', result);
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
            console.log('GetSongCommentPage response PageData', PageData);
            console.log('GetSongCommentPage response pageCount', pageCount);
            console.log('GetSongCommentPage response recordCount', recordCount);
            this.setState({
              SongId: SongId,
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
        Alert.alert('错误', `获取评论分页数据出错,原因[${error}]`);
      },
    });
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
        this.getPageData(this.props.SongId);
      },
    );
  };

  //空数据组件
  ListEmptyComponent = () => {
    let screenHeight = Dimensions.get('window').height;
    let containerWidth = Dimensions.get('window').width;
    let containerHeight = screenHeight;
    let centerWidth = containerWidth - 150;
    let centerHeight = 356;
    let imageWidth = centerWidth;
    let imageHeight = centerHeight - 50;
    let tipsHeight = 50;
    let tipsFontSize = tipsHeight - 20;
    return (
      <TouchableOpacity
        onPress={() => {
          this.getPageData();
        }}>
        <View
          style={{
            width: containerWidth,
            height: containerHeight,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: centerWidth,
              height: centerHeight,
              borderColor: 'red',
              borderWidth: 0,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              style={{
                width: imageWidth,
                height: imageHeight,
                resizeMode: 'stretch',
              }}
              source={require('../../images/NoMusicBlue.png')}
            />
            <View
              style={{
                width: centerWidth,
                height: tipsHeight,
                borderColor: 'red',
                borderWidth: 0,
              }}>
              <Text
                style={{
                  color: 'blue',
                  fontSize: tipsFontSize,
                  textAlign: 'center',
                }}>
                没有数据点击刷新
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  //列表结尾组件
  ListFooterComponent = () => {
    let containerWidth = Dimensions.get('window').width;
    let containerHeight = 57;
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

  //单个列表元素
  renderItem = ({index, item}) => {
    return (
      <View style={styles.commentItem}>
        <View style={styles.commentItem.userFaceContainer}>
          {item.userface === '' || typeof item.userface === 'undefiend' ? (
            <Icon
              style={styles.commentItem.userFaceContainer.userFace}
              name="person-circle"
              color={'#A880F2'}
              size={styleJson.commentItem.userFaceContainer.userFace.width}
            />
          ) : (
            <Image
              style={[
                styles.commentItem.userFaceContainer.userFace,
                {borderRadius: 50},
              ]}
              source={{uri: item.userface}}
            />
          )}
          <Text
            numberOfLines={2}
            style={styles.commentItem.userFaceContainer.userName}>
            {item.username}
          </Text>
        </View>
        <View style={styles.commentItem.bubbleCorner} />
        <View style={styles.commentItem.contentContainer}>
          <View style={styles.commentItem.contentContainer.title}>
            <Text style={styles.commentItem.contentContainer.title.font}>
              {index}# 发表时间:{item.createddatetime}
            </Text>
          </View>
          <View style={styles.commentItem.contentContainer.content}>
            <Text numberOfLines={50}>{item.content}</Text>
          </View>
        </View>
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
    this.getPageData(this.state.SongId);
  };

  //组件挂载事件
  componentDidMount() {
    console.log('componentDidMount');
    let SongId = this.props.SongId;
    this.getPageData(SongId);
  }

  render() {
    return (
      <>
        {!this.state.isLoadComplete ? (
          <MiniLoading
            Width={Dimensions.get('window').width}
            Height={Dimensions.get('window').height - 35}
            Size={65}
          />
        ) : (
          <FlatList
            data={this.state.PageData}
            renderItem={this.renderItem}
            keyExtractor={item => item.commentId}
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
      </>
    );
  }
}

//评论区域组件
class TabView2Old extends React.Component {
  constructor() {
    super();
    this.state = {
      commentText: '',
    };
  }
  commentTextChange = value => {
    this.setState({commentText: value});
  };
  PublisherComment = () => {
    Storage.get('userInfo').then(userInfo => {
      let userId = '';
      let SongId = this.props.SongId;
      let commentText = this.state.commentText;
      if (
        userInfo.payload === null ||
        typeof userInfo.payload === 'undefined'
      ) {
        Alert.alert('错误', '还没有登录请先登录');
      } else if (commentText === '') {
        Alert.alert('错误', '评论内容不能为空');
      } else {
        userId = userInfo.payload.userId;
        PublisherSongComment({
          parm: {
            songId: SongId,
            userId: userId,
            content: commentText,
          },
          beforeCallBack: () => {},
          responseCallBack: res => {
            console.log('PublisherSongComment res', res);
            res.then(resData => {
              if (resData !== null && typeof resData !== 'undefined') {
                console.log('PublisherSongComment response data', resData);
                const {status, msg} = resData;
                if (status !== 0) {
                  Alert.alert('错误', `发表评论出错,原因[${msg}]`);
                } else {
                  Alert.alert('提示', '发表评论成功');
                  this.setState({commentText: ''}, () => {
                    this.CommentList.onRefresh();
                  });
                }
              }
            });
          },
          errorCallback: error => {
            Alert.alert('错误', `发表评论出错,原因[${error}]`);
          },
        });
      }
    });
  };
  render() {
    return (
      <View style={{height: Dimensions.get('window').height}}>
        {/*发表评论框B*/}
        <View style={[styles.commentContainer]}>
          <LinearGradient
            style={styles.commentContainer.linearGradientBackground}
            colors={['#12fff7', '#ffffff']}>
            <View
              style={
                styles.commentContainer.linearGradientBackground.titleContainer
              }>
              <Icon
                style={styles.commentContainer.linearGradientBackground.Icon}
                name="create-outline"
                size={31}
                color={'black'}
              />
              <Text
                style={styles.commentContainer.linearGradientBackground.title}>
                发表评论
              </Text>
            </View>
            <View
              style={
                styles.commentContainer.linearGradientBackground.inputContainer
              }>
              <TextInput
                maxLength={300}
                onChangeText={value => this.commentTextChange(value)}
                multiline={true}
              />
            </View>
            <View
              style={
                styles.commentContainer.linearGradientBackground.submitButton
              }>
              <TouchableOpacity
                onPress={() => {
                  this.PublisherComment();
                }}>
                <LinearGradient
                  style={
                    styles.commentContainer.linearGradientBackground
                      .submitButton.backGrondLinearGradient
                  }
                  start={{x: 0.5, y: 3.75}}
                  end={{x: 0.17, y: 0.65}}
                  colors={['#B3FFAB', '#12FFF7', '#B3FFAB']}>
                  <Text
                    style={
                      styles.commentContainer.linearGradientBackground
                        .submitButton.text
                    }>
                    提交评论
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
        {/*发表评论框E*/}
        <SongCommentList
          ref={r => (this.CommentList = r)}
          SongId={this.props.SongId}
        />
        <View style={styles.commentEnd} />
      </View>
    );
  }
}

//歌曲信息
function TabView1Old(props) {
  let songName = '';
  let songArtist = '';
  let songAlbumName = '';
  let songDuration = '';
  let songCreateDateTime = '';
  let songinfo = props.songinfo;
  if (songinfo !== null && typeof songinfo !== 'undefined') {
    songName = songinfo.title;
    songArtist = songinfo.artist;
    songCreateDateTime = songinfo.createdatetime.replace('T', ' ');
    var durationObj = formatDuration(songinfo.duration);
    songDuration = `${durationObj.hour}时${durationObj.minute}分${durationObj.second}秒`;
  }
  //歌曲信息
  return (
    <ScrollView {...props}>
      <View style={{height: Dimensions.get('window').height}}>
        {/*歌曲名称B*/}
        <View style={[styles.songInfoItem]}>
          <Icon name="document-text" size={25} color="gray" />
          <Text style={styles.songInfoItem.songName}>歌曲名称:{songName}</Text>
        </View>
        {/*歌曲名称E*/}
        {/*歌手名称B*/}
        <View style={[styles.songInfoItem]}>
          <Icon name="document-text" size={25} color="gray" />
          <Text style={styles.songInfoItem.songName}>歌手:{songArtist}</Text>
        </View>
        {/*歌手名称E*/}
        {/*专辑名称B*/}
        <View style={[styles.songInfoItem]}>
          <Icon name="document-text" size={25} color="gray" />
          <Text style={styles.songInfoItem.songName}>专辑:{songAlbumName}</Text>
        </View>
        {/*专辑名称E*/}
        {/*歌曲时长B**/}
        <View style={[styles.songInfoItem]}>
          <Icon name="document-text" size={25} color="gray" />
          <Text style={styles.songInfoItem.songName}>时长:{songDuration}</Text>
        </View>
        {/*歌曲时长E*/}
        {/*创建时间B*/}
        <View style={[styles.songInfoItem]}>
          <Icon name="document-text" size={25} color="gray" />
          <Text style={styles.songInfoItem.songName}>
            创建时间:{songCreateDateTime}
          </Text>
        </View>
        {/*创建时间E*/}
      </View>
    </ScrollView>
  );
}

/**
 * 播放层
 */
class PlayPanel extends React.Component {
  constructor() {
    super();
    this.state = {
      openMenuSelectedIndex: 0,
      AnimatedCover: null, //封面动画句柄
      rotateAnim: new Animated.Value(0), //封面动画初始值
    };
  }
  componentDidMount() {
    this.initAnimatedCover();
  }
  componentWillUnmount() {
    //console.log('componentWillUnmount');
    this.setState({isShowLoading: false});
    this._onFinishedPlayingSubscription.remove();
    this._onFinishedLoadingSubscription.remove();
    this._onFinishedLoadingURLSubscription.remove();
    this._onFinishedLoadingFileSubscription.remove();
  }

  /**
   * 初始化封面动画
   */
  initAnimatedCover = () => {
    let AnimatedCover = Animated.timing(this.state.rotateAnim, {
      toValue: 270,
      duration: 600000,
      useNativeDriver: true,
    });
    this.setState({AnimatedCover: AnimatedCover});
  };

  /**
   * 开始播放封面旋转动画
   */
  animatedCoverStart = () => {
    Animated.loop(this.state.AnimatedCover).start();
  };

  /**
   * 停止播放封面旋转动画
   */
  animatedCoverStop = () => {
    Animated.loop(this.state.AnimatedCover).stop();
  };

  /**
   * 改变播放状态函数
   * @param {音乐mp3的url地址} url
   * @param {要改变的播放状态} currentPlayState
   */
  changePlayState = (url, currentPlayState) => {
    let playState = '';
    try {
      if (currentPlayState === 'play') {
        playState = 'pause-circle';
        this.props.StopPlay(playState);
        this.animatedCoverStop();
      } else if (currentPlayState === 'pause') {
        playState = 'play-circle';
        this.props.PlayMusic(url, playState);
        this.animatedCoverStart();
      } else {
        this.setState({currentPlayUrl: url});
      }
    } catch (exp) {
      Alert.alert('错误', `改变播放状态出错,原因[${exp}]`);
    }
  };

  /**
   * 进度条拖拽后回调函数
   * @param {拖拽后的值} value
   */
  setSliderValue = value => {
    //console.log('setSliderValue value', value);
    this.props.SeekPlay(value);
  };

  /**
   * 跳转页面
   * @param {跳转页面名} route
   * @param {参数} args
   */
  gotoPage = (route, args) => {
    if (args === null && typeof args === 'undefined') {
      this.props.navigation.navigate(route);
    } else {
      this.props.navigation.navigate(route, args);
    }
  };

  /**
   * 播放顺序按钮组件
   * @returns
   */
  PlaySequenceButton = () => {
    let PlaySequence = this.props.PlaySequence;
    switch (PlaySequence) {
      case 'SequenceOne':
        return (
          <MaterialIcon
            name="priority-low"
            style={styles.playOrderIcon}
            size={styles.playOrderIcon.iconSize}
            color={'gray'}
          />
        );
      case 'SequenceCyclic':
        return (
          <Icon
            name="repeat-outline"
            style={styles.playOrderIcon}
            size={styles.playOrderIcon.iconSize}
            color={'gray'}
          />
        );
      case 'RandomPlay':
        return (
          <Icon
            name="shuffle-outline"
            style={styles.playOrderIcon}
            size={styles.playOrderIcon.iconSize}
            color={'gray'}
          />
        );
      case 'SingleLoop':
        return (
          <MaterialIcon
            name="sync-alert"
            style={styles.playOrderIcon}
            size={styles.playOrderIcon.iconSize}
            color={'gray'}
          />
        );
    }
  };

  onOptionSelect = menuIndex => {
    let songId = '';
    let songInfo = this.props.songInfo;
    if (songInfo !== null && typeof songInfo !== 'undefined') {
      songId = songInfo.songId;
    }
    Storage.get('userInfo').then(userInfo => {
      let UserId = '';
      if (
        userInfo.payload === null ||
        typeof userInfo.payload === 'undefined'
      ) {
        Alert.alert('错误', '还没有登录请先登录');
      } else {
        UserId = userInfo.payload.userId;
        this.gotoPage('ShareMusic', {songId: songId, userId: UserId});
      }
    });
  };

  //快捷菜单弹出方法
  openMenu = (evt, index) => {
    console.log('openMenu evt', evt);
    let top = styleJson.forwardBack.iconSize;
    let left = Dimensions.get('window').width - 232;
    this.popmenu.openMenu('popmenu-music', top, left);
  };

  getPosition = callback => {
    console.log('getPosition', this._ref.measure);
    //获取当前组件的坐标和大小参数
    this._ref.measure((width, height, px, py, fx, fy) => {
      const location = {
        fx: fx,
        fy: fy,
        px: px,
        py: py,
        width: width,
        height: height,
      };
      callback(location);
      console.log(location);
    });
  };

  render() {
    let songId = '';
    let songInfo = this.props.songInfo;
    let playState = this.props.playState;
    let songName = this.props.songName;
    let songCover = require('../../images/NoCover.png');
    let musicUrl = this.props.musicUrl;
    let maxSliderValue =
      this.props.duration === null && typeof this.props.duration === 'undefined'
        ? 0
        : this.props.duration;
    let currentDuration = 0;
    let durationObj = {hour: 0, minute: 0, second: 0};
    let currentDurationObj = {hour: 0, minute: 0, second: 0};
    if (
      this.props.currentDuration !== null &&
      typeof this.props.currentDuration !== 'undefined'
    ) {
      currentDuration = this.props.currentDuration;
      currentDurationObj = formatDuration(this.props.currentDuration);
    }
    //console.log('PlayPanel songInfo', songInfo);
    if (songInfo !== null && typeof songInfo !== 'undefined') {
      songName = songInfo.title;
      songId = songInfo.songId;
      songCover = {uri: songInfo.cover};
      //console.log('songInfo.duration', songInfo.duration);
      durationObj = formatDuration(songInfo.duration);
    }
    let iconSize = styleJson.forwardBack.iconSize;
    return (
      <View ref={r => (this._ref = r)}>
        <CustomPopupMenu
          name="popmenu-music"
          menu={this.popmenu}
          onOptionSelect={this.onOptionSelect}
          ref={r => (this.popmenu = r)}
          menuOptions={['分享歌曲']}
        />
        <LinearGradient
          onLayout={this.props.headerOnLayout}
          colors={['#12fff7', 'white']}
          style={styles.linearGradient}>
          <View style={styles.barHeader}>
            <TouchableOpacity
              onPress={() => {
                this.props.gotoBack();
              }}>
              <Icon
                style={styles.forwardBack}
                name="chevron-back-outline"
                size={iconSize}
              />
            </TouchableOpacity>
            <View style={styles.songNameContainer}>
              <Text numberOfLines={1} style={styles.songName}>
                {songName}
              </Text>
            </View>
            <TouchableOpacity onPress={event => this.openMenu(event, 0)}>
              <Icon
                style={styles.forwardBack}
                name="ellipsis-vertical"
                color={'black'}
                size={iconSize}
              />
            </TouchableOpacity>
          </View>
          {/*唱片层B*/}
          <View style={styles.discBackGroundContainer}>
            <ImageBackground
              style={styles.discBackGround}
              source={require('../../images/disc.png')}>
              <Animated.Image
                style={[
                  styles.coverImage,
                  {
                    transform: [
                      {
                        rotateZ: this.state.rotateAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0deg', '360deg'],
                        }),
                      },
                    ],
                  },
                ]}
                source={songCover}
              />
            </ImageBackground>
          </View>
          {/*唱片层E*/}
          {/*进度条B*/}
          <View style={styles.sliderContainer}>
            <View style={styles.sliderContainer.center}>
              <Text style={styles.sliderContainer.timeLabel}>
                {currentDurationObj.hour}:{currentDurationObj.minute}:
                {currentDurationObj.second}
              </Text>
              <Slider
                style={styles.sliderContainer.slider}
                minimumValue={0}
                maximumValue={maxSliderValue}
                thumbTintColor="#FF5050"
                minimumTrackTintColor="#FF5050"
                maximumTrackTintColor="#FF4DFF"
                value={currentDuration}
                onValueChange={value => this.setSliderValue(value)}
              />
              <Text style={styles.sliderContainer.timeLabel}>
                {durationObj.hour}:{durationObj.minute}:{durationObj.second}
              </Text>
            </View>
          </View>
          {/*进度条E*/}
          {/*控制层B*/}
          <View style={styles.controlButton}>
            <View style={styles.controlButton.center}>
              {/**
               * MaterialIcon priority-low 顺序播放
               * Icon shuffle-outline 随机播放
               * MaterialIcon sync-alert 单曲循环
               * Icon repeat-outline 顺序循环播放
               */}
              <TouchableOpacity
                onPress={() => {
                  this.props.changePlaySequence();
                }}>
                {this.PlaySequenceButton()}
              </TouchableOpacity>
              {/*第一条B*/}
              <TouchableOpacity
                onPress={() => {
                  this.props.gotoFirstSong();
                }}>
                <Icon
                  name="play-skip-back"
                  style={styles.skipFirstIcon}
                  size={styles.skipFirstIcon.iconSize}
                  color="black"
                />
              </TouchableOpacity>
              {/*第一条E*/}
              {/*上一条歌曲B*/}
              <TouchableOpacity
                onPress={() => {
                  this.props.changePreviousSong(
                    this.props.albumSongList,
                    this.props.songId,
                  );
                }}>
                <Icon
                  name="play-back"
                  style={styles.previousIcon}
                  size={styles.previousIcon.iconSize}
                  color="black"
                />
              </TouchableOpacity>
              {/*上一条歌曲E*/}
              <TouchableOpacity
                onPress={() => {
                  //console.log('musicUrl', musicUrl);
                  if (playState === 'play-circle') {
                    this.changePlayState(musicUrl, 'pause');
                  } else {
                    this.changePlayState(musicUrl, 'play');
                  }
                }}>
                <Icon
                  name={playState}
                  style={[styles.playButton, styles.borderShadow]}
                  size={styles.playButton.iconSize}
                  color="#7E1FD6"
                />
              </TouchableOpacity>
              {/*下一条歌曲B*/}
              <TouchableOpacity
                onPress={() => {
                  this.props.changeNextSong(
                    this.props.albumSongList,
                    this.props.songId,
                  );
                }}>
                <Icon
                  name="play-forward"
                  style={styles.previousIcon}
                  size={styles.previousIcon.iconSize}
                  color="black"
                />
              </TouchableOpacity>
              {/*下一条歌曲E*/}
              <TouchableOpacity
                onPress={() => {
                  this.props.gotoLastSong();
                }}>
                <Icon
                  name="play-skip-forward"
                  style={styles.skipFirstIcon}
                  size={styles.skipFirstIcon.iconSize}
                  color="black"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  let albumSongList = this.props.albumSongList;
                  this.gotoPage('SongList', {
                    SongList: albumSongList,
                    songId: songId,
                  });
                }}>
                <MaterialIcon
                  style={styles.skipFirstIcon}
                  name={'playlist-play'}
                  size={styles.skipFirstIcon.iconSize}
                  color="black"
                />
              </TouchableOpacity>
            </View>
          </View>
          {/*控制层E*/}
        </LinearGradient>
      </View>
    );
  }
}

export default class Index extends Component {
  constructor() {
    super();
    this.state = {
      isShowLoading: false,
      headerHeight: 200,
      loadingWidth: 150,
      loadingHeight: 80,
      songinfo: null,
      albuminfo: null,
      albumSongList: null,
      songName: '',
      currentPlayState: '',
      musicUrl: '',
      playState: '',
      duration: 0,
      durationTimer: null,
      currentSongListIndex: 0,
      currentDuration: 0,
      PlaySequence: 'SequenceOne',
      PlaySequenceAry: [
        'SequenceOne',
        'SequenceCyclic',
        'RandomPlay',
        'SingleLoop',
      ],
      PlaySequenceIndex: 0,
      songCover: require('../../images/NoCover.png'),
    };
    //console.log('PlayPage constructor');
  }
  _onFinishedPlayingSubscription = null;
  _onFinishedLoadingSubscription = null;
  _onFinishedLoadingFileSubscription = null;
  _onFinishedLoadingURLSubscription = null;
  headerOnLayout = event => {
    const {height} = event.nativeEvent.layout;
    this.setState({headerHeight: height});
  };
  _renderScrollHeader = () => {
    let songInfo = this.state.songinfo;
    return (
      <PlayPanel songInfo={songInfo} headerOnLayout={this.headerOnLayout} />
    );
  };

  /**
   * 执行播放顺序
   * @param {歌曲列表} albumSongList
   * @param {歌曲编号} songId
   * @param {播放顺序} PlaySequence
   * @returns
   */
  ExecutePlaySequence = (albumSongList, songId, PlaySequence) => {
    let currentSongListIndex = this.state.currentSongListIndex;
    currentSongListIndex = this.getCurrentPlayIndex(albumSongList, songId);

    //#region 判断当前歌曲列表是否为空
    if (
      (albumSongList === null && typeof albumSongList === 'undefined') ||
      albumSongList.length <= 0
    ) {
      return;
    }
    if (albumSongList.length === 1) {
      return;
    }
    //#endregion

    //#region 执行播放顺序
    switch (PlaySequence) {
      //#region 顺序循环播放
      case 'SequenceCyclic':
        currentSongListIndex += 1;
        if (currentSongListIndex > albumSongList.length - 1) {
          currentSongListIndex = 0;
        }
        songId = albumSongList[currentSongListIndex].songId;
        console.log('顺序循环播放 currentSongListIndex', currentSongListIndex);
        this.setState({PlaySequence: PlaySequence});
        this.loadPageData('', songId);
        break;
      //#endregion

      //#region 顺序只播放一次
      case 'SequenceOne':
        this.setState({PlaySequence: PlaySequence});
        currentSongListIndex += 1;
        console.log(
          '顺序只播放一次 currentSongListIndex',
          currentSongListIndex,
        );
        if (currentSongListIndex > albumSongList.length - 1) {
          currentSongListIndex = albumSongList.length - 1;
          let songinfo = albumSongList[currentSongListIndex];
          this._palyPanel.changePlayState(songinfo.fileName, 'play');
        } else {
          songId = albumSongList[currentSongListIndex].songId;
          this.loadPageData('', songId);
        }
        break;
      //#endregion

      //#region 随机播放
      case 'RandomPlay':
        currentSongListIndex = getRandomInt(0, albumSongList.length - 1);
        console.log('随机播放 currentSongListIndex', currentSongListIndex);
        songId = albumSongList[currentSongListIndex].songId;
        this.loadPageData('', songId);
        break;
      //#endregion

      //#region 单曲循环
      case 'SingleLoop':
        console.log('单曲循环 currentSongListIndex', currentSongListIndex);
        songId = albumSongList[currentSongListIndex].songId;
        this.loadPageData('', songId);
        break;
      //#endregion
    }
    //#endregion
  };

  /**
   * 获得当前歌曲在专辑中的序号
   * @param {歌曲列表} songList
   * @param {歌曲编号} songId
   * @returns
   */
  getCurrentPlayIndex = (songList, songId) => {
    var result = 0;
    for (var i = 0; i < songList.length; i++) {
      if (songList[i].songId === songId) {
        result = i;
      }
    }
    return result;
  };

  /**
   * 上一首歌
   */
  changePreviousSong = (albumSongList, songId) => {
    let currentSongListIndex = this.state.currentSongListIndex;
    //console.log('changePreviousSong albumSongList', albumSongList);
    //console.log('changePreviousSong songId', songId);
    currentSongListIndex = this.getCurrentPlayIndex(albumSongList, songId);
    currentSongListIndex -= 1;
    if (currentSongListIndex < 0) {
      currentSongListIndex = 0;
      Alert.alert('提示', '已经是第一首歌了');
    }
    songId = albumSongList[currentSongListIndex].songId;
    this.loadPageData('', songId);
  };

  /**
   * 下一首歌
   */
  changeNextSong = (albumSongList, songId) => {
    let currentSongListIndex = this.state.currentSongListIndex;
    //console.log('changePreviousSong albumSongList', albumSongList);
    //console.log('changePreviousSong songId', songId);
    currentSongListIndex = this.getCurrentPlayIndex(albumSongList, songId);
    currentSongListIndex += 1;
    if (currentSongListIndex > albumSongList.length - 1) {
      currentSongListIndex = albumSongList.length - 1;
      Alert.alert('提示', '已经是最后一首歌了');
    }
    songId = albumSongList[currentSongListIndex].songId;
    this.loadPageData('', songId);
  };

  gotoLastSong = () => {
    let currentSongListIndex = this.state.currentSongListIndex;
    let albumSongList = this.state.albumSongList;
    let songId = '';
    currentSongListIndex = albumSongList.length - 1;
    songId = albumSongList[currentSongListIndex].songId;
    this.loadPageData('', songId);
  };

  gotoFirstSong = () => {
    let currentSongListIndex = this.state.currentSongListIndex;
    let albumSongList = this.state.albumSongList;
    let songId = '';
    currentSongListIndex = 0;
    songId = albumSongList[currentSongListIndex].songId;
    this.loadPageData('', songId);
  };

  /**
   * 读取歌曲数据
   * @param {专辑编号} albumId
   * @param {歌曲编号} songId
   */
  loadPageData = (albumId, songId, userId) => {
    albumId =
      albumId === '' || typeof albumId === 'undefined' ? 'null' : albumId;
    songId = songId === '' || typeof songId === 'undefined' ? 'null' : songId;
    userId = userId === '' || typeof userId === 'undefined' ? 'null' : userId;
    GetPlayerData({
      parm: {
        albumId: albumId,
        songId: songId,
        userId: userId,
      },
      beforeCallBack: () => {},
      responseCallBack: res => {
        //console.log('loadPageData res', res);
        res.then(resData => {
          //console.log('loadPageData resData', resData);
          if (resData !== null && typeof resData !== 'undefined') {
            const {status, msg, result} = resData;
            if (status !== 0) {
              Alert.alert('错误', `获取歌曲数据出错,原因[${msg}]`);
            }
            const {songinfo, albuminfo, albumSongList} = result;
            //SoundPlayer.loadUrl(songinfo.fileName);
            if (this.state.playState === 'pause-circle') {
              this._palyPanel.changePlayState(songinfo.fileName, 'play');
            }
            let currentSongListIndex = this.getCurrentPlayIndex(
              albumSongList,
              songId,
            );
            this.setState(
              {
                currentSongListIndex: currentSongListIndex,
                currentDuration: 0,
                songId: songinfo.songId,
                songinfo: songinfo,
                albuminfo: albuminfo,
                musicUrl: songinfo.fileName,
                albumSongList: albumSongList,
                isShowLoading: false,
              },
              () => {
                this._palyPanel.changePlayState(songinfo.fileName, 'pause');
              },
            );
          }
        });
        this.props.route.params.albumId = '';
        this.props.route.params.songId = '';
      },
      errorCallback: error => {
        Alert.alert('错误', `歌曲数据失败,原因[${error}]`);
        this.setState({isShowLoading: false});
      },
    });
  };
  Refresh = () => {
    let albumId = '';
    let songId = '';
    let isShowLoading = true;
    //console.log('PlayPage Refresh songId', songId);
    //console.log('PlayPage Refresh albumId', albumId);
    if (
      this.props.route.params !== null &&
      typeof this.props.route.params !== 'undefined'
    ) {
      albumId = this.props.route.params.albumId;
      songId = this.props.route.params.songId;
    }
    if (isShowLoading) {
      if (this._loading !== null && typeof this._loading !== 'undefined') {
        this._loading.showLoading();
      }
      if (albumId !== '' || songId !== '') {
        this.loadPageData(albumId, songId, 'null');
      }
    } else {
      isShowLoading = false;
      this.setState({isShowLoading: isShowLoading});
    }
  };
  initWidget = () => {
    //console.log('initWidget componentDidUpdate');
    let albumId = '';
    let songId = '';
    console.log('initWidget songId', songId);
    console.log('initWidget albumId', albumId);
    if (
      this.props.route.params !== null &&
      typeof this.props.route.params !== 'undefined'
    ) {
      albumId = this.props.route.params.albumId;
      songId = this.props.route.params.songId;
    }
    if (albumId !== '' || songId !== '') {
      Storage.get('userInfo').then(userInfo => {
        if (userInfo !== null && typeof userInfo !== 'undefined') {
          if (
            userInfo.payload === null ||
            typeof userInfo.payload === 'undefined'
          ) {
            console.log('PlayPage userInfo 01');
            this.loadPageData(albumId, songId, 'null');
          } else {
            console.log('PlayPage userInfo 02');
            let userId = userInfo.payload.userId;
            this.loadPageData(albumId, songId, userId);
          }
        } else {
          console.log('PlayPage userInfo 03');
          this.loadPageData(albumId, songId, 'null');
        }
      });
    }
  };
  componentDidUpdate() {
    this.initWidget();
  }
  componentDidMount() {
    let albumId = '';
    let songId = '';
    if (albumId === '' && songId === '') {
      this.setState({isShowLoading: false});
    }
    this._onFinishedPlayingSubscription = SoundPlayer.addEventListener(
      'FinishedPlaying',
      ({success}) => {
        console.log('finished playing', success);
      },
    );
    this._onFinishedLoadingSubscription = SoundPlayer.addEventListener(
      'FinishedLoading',
      ({success}) => {
        console.log('finished loading', success);
      },
    );
    this._onFinishedLoadingFileSubscription = SoundPlayer.addEventListener(
      'FinishedLoadingFile',
      ({success, name, type}) => {
        console.log('finished loading file', success, name, type);
      },
    );
    this._onFinishedLoadingURLSubscription = SoundPlayer.addEventListener(
      'FinishedLoadingURL',
      ({success, url}) => {
        if (success) {
          SoundPlayer.getInfo().then(info => {
            let duration = parseInt(info.duration, 10);
            //console.log('SoundPlayer info', info);
            //console.log('SoundPlayer duration', duration);
            let playState = '';
            //console.log(
            //'SoundPlayer getInfo this.state.playState',
            //this.state.playState,
            //);
            if (this.state.playState === '') {
              playState = 'play-circle';
            } else {
              playState = this.state.playState;
            }
            //console.log('SoundPlayer getInfo playState', playState);
            this.setState({duration: duration, playState: playState});
          });
        }
        console.log('finished loading url', success, url);
      },
    );
  }
  componentWillUnmount() {
    //console.log('componentWillUnmount');
    this.setState({isShowLoading: false});
    this._onFinishedPlayingSubscription.remove();
    this._onFinishedLoadingSubscription.remove();
    this._onFinishedLoadingURLSubscription.remove();
    this._onFinishedLoadingFileSubscription.remove();
  }
  PlayMusic = (url, playState) => {
    try {
      SoundPlayer.playUrl(url);
      if (playState === 'play-circle') {
        let currentDuration = this.state.currentDuration;
        let duration = this.state.duration;
        if (currentDuration >= duration) {
          currentDuration = 0;
        }
        SoundPlayer.seek(currentDuration);
        this.setState(
          {playState: 'pause-circle', currentDuration: currentDuration},
          () => {
            this.UpdateCurrentDuration();
          },
        );
      }
    } catch (exp) {
      Alert.alert(`播放出错,原因[${exp}]`);
    }
  };
  StopPlay = playState => {
    try {
      SoundPlayer.stop();
      if (playState === 'pause-circle') {
        this.setState({playState: 'play-circle'});
      }
    } catch (exp) {
      Alert.alert(`暂停播放失败,原因[${exp}]`);
    }
  };
  SeekPlay = seconds => {
    try {
      SoundPlayer.seek(seconds);
      this.UpdateCurrentDuration();
    } catch (exp) {
      Alert.alert('错误', `跳转播放出错,原因[${exp}]`);
    }
  };

  /**
   * 实时更新播放进度方法
   */
  UpdateCurrentDuration = () => {
    let durationTimer = this.state.durationTimer;
    durationTimer = setInterval(() => {
      clearInterval(durationTimer);
      SoundPlayer.getInfo().then(info => {
        let currentTime = info.currentTime;
        let duration = info.duration;
        this.setState({currentDuration: currentTime}, () => {
          if (
            this.state.playState === 'pause-circle' &&
            currentTime < duration
          ) {
            this.UpdateCurrentDuration();
          } else if (currentTime >= duration) {
            console.log('播放控制');
            this.setState({playState: 'play-circle'});
            clearInterval(durationTimer);
            this._palyPanel.animatedCoverStop();
            //#region 播放控制
            let PlaySequence = this.state.PlaySequence;
            let songinfo = this.state.songinfo;
            let albumSongList = this.state.albumSongList;
            this.ExecutePlaySequence(
              albumSongList,
              songinfo.songId,
              PlaySequence,
            );
            //#endregion
          } else {
            this.setState({playState: 'play-circle'});
            clearInterval(durationTimer);
            this._palyPanel.animatedCoverStop();
            //return false;
          }
        });
      });
    }, 1000);
  };
  gotoBack = () => {
    this.props.navigation.goBack();
  };
  /**
   * 弹出消息提示框
   * @param {消息提示内容} toastMessage
   */
  showToast = toastMessage => {
    this.toast.show(toastMessage);
  };
  /**
   * 切换播放顺序
   */
  changePlaySequence = () => {
    let PlaySequenceIndex = this.state.PlaySequenceIndex;
    let PlaySequenceAry = this.state.PlaySequenceAry;
    let PlaySequence = this.state.PlaySequence;
    console.log('changePlaySequence PlaySequenceIndex', PlaySequenceIndex);
    if (PlaySequenceIndex < PlaySequenceAry.length) {
      PlaySequence = PlaySequenceAry[PlaySequenceIndex];
    }
    switch (PlaySequence) {
      case 'SequenceCyclic':
        this.showToast('顺序循环播放');
        break;
      case 'SequenceOne':
        this.showToast('顺序只播放一次');
        break;
      case 'RandomPlay':
        this.showToast('随机播放');
        break;
      case 'SingleLoop':
        this.showToast('单曲循环');
        break;
    }
    PlaySequenceIndex += 1;
    if (PlaySequenceIndex >= PlaySequenceAry.length) {
      PlaySequenceIndex = 0;
    }
    this.setState({
      PlaySequence: PlaySequence,
      PlaySequenceIndex: PlaySequenceIndex,
    });
  };
  render() {
    return (
      <View style={styles.container}>
        <Toast ref={toast => (this.toast = toast)} />
        {this.state.isShowLoading ? (
          <Loading
            ref={r => (this._loading = r)}
            loadingWidth={this.state.loadingWidth}
            loadingHeight={this.state.loadingHeight}
          />
        ) : (
          <></>
        )}
        <ScrollTabView
          style={{backgroundColor: 'white', borderBottomWidth: 0}}
          headerHeight={this.state.headerHeight}
          renderScrollHeader={() => (
            <PlayPanel
              ref={r => (this._palyPanel = r)}
              PlayMusic={this.PlayMusic}
              StopPlay={this.StopPlay}
              SeekPlay={this.SeekPlay}
              gotoBack={this.gotoBack}
              gotoLastSong={this.gotoLastSong}
              gotoFirstSong={this.gotoFirstSong}
              changeNextSong={this.changeNextSong}
              changePreviousSong={this.changePreviousSong}
              changePlaySequence={this.changePlaySequence}
              navigation={this.props.navigation}
              albumSongList={this.state.albumSongList}
              currentDuration={this.state.currentDuration}
              duration={this.state.duration}
              musicUrl={this.state.musicUrl}
              songInfo={this.state.songinfo}
              playState={this.state.playState}
              songId={this.state.songId}
              PlaySequence={this.state.PlaySequence}
              headerOnLayout={this.headerOnLayout}
            />
          )}>
          <TabView1Old songinfo={this.state.songinfo} tabLabel="歌曲信息" />
          <TabView2Old SongId={this.state.songId} tabLabel="评论信息" />
        </ScrollTabView>
      </View>
    );
  }
}
