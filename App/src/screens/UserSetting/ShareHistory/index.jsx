/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  Alert,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {Image} from 'react-native-animatable';
import MiniLoading from '../../../components/MiniLoading';
import {GetShareHistoryPage, AddFriend} from '../../../utils/api';
import Storage from '../../../utils/storage';

const styleJson = {
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: '#F2F2F2',
    flexDirection: 'column',
  },
  focusButton: {
    width: 96,
    height: 37,
    marginHorizontal: 6,
    marginVertical: 17,
    borderColor: 'red',
    borderWidth: 2,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    text: {
      fontSize: 21,
      textAlign: 'center',
      color: 'red',
      fontWeight: 'bold',
    },
  },
  userFaceIcon: {
    iconSize: 55,
    marginHorizontal: 5,
    marginVertical: 5,
  },
  contentItem: {
    width: Dimensions.get('window').width - 43,
    height: 219,
    marginHorizontal: 12,
    marginVertical: 15,
    borderRadius: 25,
    backgroundColor: 'white',
    borderTopColor: '#ccc',
    borderTopWidth: 1,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    userInfo: {
      width: Dimensions.get('window').width - 71,
      height: 75,
      flexDirection: 'row',
      marginHorizontal: 12,
      borderBottomColor: '#ccc',
      borderBottomWidth: 1,
      userTextContainer: {
        width: Dimensions.get('window').width - 256,
        height: 71,
        borderColor: 'red',
        borderWidth: 0,
        flexDirection: 'column',
        userName: {
          fontSize: 17,
          marginVertical: 8,
          marginHorizontal: 10,
          color: 'black',
          fontWeight: 'bold',
        },
        shareText: {
          fontSize: 13,
          marginVertical: 1,
          marginHorizontal: 10,
          color: 'black',
        },
      },
    },
    songInfo: {
      width: Dimensions.get('window').width - 71,
      height: 95,
      marginHorizontal: 12,
      marginVertical: 9,
      borderColor: 'red',
      borderWidth: 0,
      flexDirection: 'row',
      cover: {
        width: 78,
        height: 78,
        marginHorizontal: 6,
        marginVertical: 7,
        borderRadius: 15,
      },
      info: {
        width: Dimensions.get('window').width - 167,
        height: 78,
        marginVertical: 6,
        borderColor: 'red',
        borderWidth: 0,
        flexDirection: 'column',
        songName: {
          fontSize: 25,
          color: 'black',
          fontWeight: 'bold',
        },
        author: {
          marginVertical: 5,
          fontSize: 15,
          color: 'black',
        },
      },
    },
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
};

function resizeMode() {
  let screenWidth = Dimensions.get('window').width.toFixed();
  let screenHeight = Dimensions.get('window').height.toFixed();
  if (parseInt(screenWidth, 10) <= 320 || parseInt(screenHeight, 10) <= 426) {
    styleJson.userFaceIcon = {
      iconSize: 43,
      marginHorizontal: 5,
      marginVertical: 5,
    };
    let userFaceSize = styleJson.userFaceIcon.iconSize;
    let userInfoWidth = styleJson.contentItem.userInfo.width;
    styleJson.contentItem.userInfo.userTextContainer.borderWidth = 0;
    styleJson.contentItem.userInfo.userTextContainer.userName.fontSize = 12;
    styleJson.focusButton.width = 58;
    styleJson.focusButton.text.fontSize = 12;
    styleJson.focusButton.height = 23;
    let focusButtoonWidth = styleJson.focusButton.width;
    styleJson.contentItem.userInfo.height = 55;
    styleJson.contentItem.userInfo.userTextContainer.width =
      userInfoWidth - (userFaceSize + focusButtoonWidth) - 10;
    styleJson.contentItem.userInfo.userTextContainer.height =
      styleJson.contentItem.userInfo.height - 3;
    styleJson.contentItem.userInfo.userTextContainer.shareText.marginVertical =
      -2;
    styleJson.contentItem.songInfo.borderWidth = 0;
    styleJson.contentItem.songInfo.info.borderWidth = 0;
    styleJson.contentItem.songInfo.cover = {
      width: 51,
      height: 51,
      marginHorizontal: 6,
      marginVertical: 7,
      borderRadius: 15,
    };
    styleJson.contentItem.songInfo.info.height = 51;
    styleJson.contentItem.songInfo.height = 63;
    styleJson.contentItem.songInfo.info.songName.fontSize = 15;
    styleJson.contentItem.songInfo.info.author.fontSize = 12;
    styleJson.contentItem.height = 139;
  } else if (screenWidth === 360 && screenHeight === 592) {
    styleJson.container.width = screenWidth - 37;
    styleJson.container.height = screenHeight - 335;
    styleJson.contentItem.width = screenWidth - 57;
    styleJson.contentItem.height = 157;
    styleJson.contentItem.userInfo.userTextContainer.width = screenWidth - 226;
    styleJson.contentItem.userInfo.userTextContainer.userName.fontSize = 15;
    styleJson.focusButton.width = 78;
    styleJson.contentItem.songInfo.info.songName.fontSize = 18;
    styleJson.focusButton.text.fontSize = 15;
    styleJson.contentItem.songInfo.cover = {
      width: 58,
      height: 58,
      marginHorizontal: 6,
      marginVertical: 7,
      borderRadius: 15,
    };
  }
  return styleJson;
}

const styles = StyleSheet.create(resizeMode());

export default class Index extends Component {
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
    GetShareHistoryPage({
      parm: {
        UserId: UserId,
        SortField: this.state.SortField,
        SortMethod: this.state.SortMethod,
        PageSize: this.state.PageSize,
        CurPage: this.state.CurPage,
      },
      beforeCallBack: () => {},
      responseCallBack: res => {
        console.log('GetShareHistoryPage res', res);
        res.then(resData => {
          if (resData !== null && typeof resData !== 'undefined') {
            console.log('GetShareHistoryPage response data', resData);
            const {status, result, msg, pageCount, recordCount} = resData;
            let PageData = this.state.PageData;
            let CurPage = this.state.CurPage;
            let PageSize = this.state.PageSize;
            let nomore = this.state.nomore;
            if (status !== 0) {
              Alert.alert('错误', `获取分页数据出错,原因[${msg}]`);
              this.setState({errMsg: `获取分页数据出错,原因[${msg}]`});
            } else {
              console.log('GetShareHistoryPage response result', result);
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
        this.getPageData(this.props.UserId);
      },
    );
  };

  gotoPlay = songId => {
    this.props.navigation.navigate('PlayPage', {songId: songId});
  };

  //组件挂载事件
  componentDidMount() {
    console.log('componentDidMount');
    let UserId = this.props.UserId;
    if (UserId !== '' && typeof UserId !== 'undefined') {
      this.getPageData(UserId);
    }
  }

  JoinFriend = (userId, friendId) => {
    AddFriend({
      parm: {
        userId: userId,
        friendId: friendId,
      },
      beforeCallBack: () => {},
      responseCallBack: res => {
        res.then(resData => {
          console.log('AddFriend resData', resData);
          if (resData !== null && typeof resData !== 'undefined') {
            console.log('AddFriend response data', resData);
            const {status, msg} = resData;
            if (status !== 0) {
              Alert.alert('错误', `添加好友出错,原因[${msg}]`);
            } else {
              this.onRefresh();
            }
          }
        });
      },
    });
  };

  gotoPage = userId => {
    console.log('userId', userId);
    this.props.navigation.navigate('UserProfile', {
      userId: userId,
    });
  };

  renderItem = ({index, item}) => {
    console.log('renderItem index', index);
    return (
      <View style={[styles.contentItem, styles.borderShadow]}>
        {/*用户层B*/}
        <View style={styles.contentItem.userInfo}>
          <TouchableOpacity
            onPress={() => {
              this.gotoPage(item.shareTarget);
            }}>
            {item.shareTargetUserFace === '' ||
            typeof item.shareTargetUserFace === 'undefined' ? (
              <Icon
                name="person-circle"
                style={styles.userFaceIcon}
                color={'#A880F2'}
                size={styles.userFaceIcon.iconSize}
              />
            ) : (
              <Image
                style={[
                  styles.userFaceIcon,
                  {
                    resizeMode: 'stretch',
                    width: styleJson.userFaceIcon.iconSize,
                    height: styleJson.userFaceIcon.iconSize,
                  },
                ]}
                source={{uri: item.shareTargetUserFace}}
              />
            )}
          </TouchableOpacity>
          <View style={styles.contentItem.userInfo.userTextContainer}>
            <Text
              numberOfLines={1}
              style={styles.contentItem.userInfo.userTextContainer.userName}>
              {item.shareTargetUserName}
            </Text>
            <Text
              style={styles.contentItem.userInfo.userTextContainer.shareText}>
              分享了歌曲
            </Text>
          </View>
          {item.isFriend === 'true' ? (
            <></>
          ) : (
            <TouchableOpacity
              onPress={() => {
                let UserId = this.props.UserId;
                if (
                  UserId !== '' &&
                  typeof UserId !== 'undefined' &&
                  UserId !== '-1'
                ) {
                  this.JoinFriend(UserId, item.shareTarget);
                } else {
                  Alert.alert('错误', '没有登录不能添加好友');
                }
              }}>
              <View style={styles.focusButton}>
                <Text style={styles.focusButton.text}>+为好友</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
        {/*用户层E*/}
        {/*歌曲层B*/}
        <View style={styles.contentItem.songInfo}>
          <TouchableOpacity
            onPress={() => {
              this.gotoPlay(item.songId);
            }}>
            <Image
              source={{uri: item.cover}}
              style={styles.contentItem.songInfo.cover}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.gotoPlay(item.songId);
            }}>
            <View style={styles.contentItem.songInfo.info}>
              <Text
                numberOfLines={1}
                style={styles.contentItem.songInfo.info.songName}>
                {item.title}
              </Text>
              <Text
                numberOfLines={1}
                style={styles.contentItem.songInfo.info.author}>
                {item.artist}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        {/*歌曲层E*/}
      </View>
    );
  };

  //空数据组件
  ListEmptyComponent = () => {
    let screenHeight = Dimensions.get('window').height;
    let containerWidth = Dimensions.get('window').width;
    let containerHeight = this.props.ParentHeight;
    let centerWidth = containerWidth - 150;
    let centerHeight = 356;
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

  render() {
    return (
      <View style={styles.container}>
        {!this.state.isLoadComplete ? (
          <MiniLoading
            Width={Dimensions.get('window').width}
            Height={this.props.ParentHeight}
            Size={65}
          />
        ) : (
          <FlatList
            data={this.state.PageData}
            renderItem={this.renderItem}
            keyExtractor={item => item.recordId}
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
