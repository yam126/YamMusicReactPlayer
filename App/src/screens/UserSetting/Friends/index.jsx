/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  RefreshControl,
  Alert,
} from 'react-native';
import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {GetFriendsPage, DeleteFriend} from '../../../utils/api';
import MiniLoading from '../../../components/MiniLoading';
import CustomPopupMenu from '../../../components/CustomPopupMenu';
import Storage from '../../../utils/storage';

let styleJson = {
  container: {
    width: Dimensions.get('window').width - 37,
    height: Dimensions.get('window').height,
    backgroundColor: '#F2F2F2',
    flexDirection: 'column',
  },
  space: {
    width: Dimensions.get('window').width - 37,
    height: 21,
  },
  searchTextContainer: {
    width: Dimensions.get('window').width - 51,
    height: 51,
    marginHorizontal: 5,
    marginVertical: 5,
    borderColor: '#ccc',
    borderWidth: 3,
    borderRadius: 20,
    flexDirection: 'row',
  },
  searchText: {
    width: Dimensions.get('window').width - 133,
    height: 47,
    borderColor: 'red',
    borderWidth: 0,
    textAlign: 'left',
    fontSize: 18,
    marginHorizontal: 9,
  },
  searchButton: {
    marginVertical: 3,
    iconSize: 37,
  },
  searchContainer: {
    width: Dimensions.get('window').width - 37,
    height: 61,
    marginVertical: 0,
    backgroundColor: 'white',
  },
  itemContainer: {
    width: Dimensions.get('window').width - 37,
    height: 96,
    flexDirection: 'row',
    marginVertical: 8,
    backgroundColor: 'white',
  },
  itemUserFace: {
    width: 85,
    height: 85,
    marginVertical: 6,
    marginHorizontal: 6,
    borderColor: 'red',
    borderWidth: 0,
    borderRadius: 51,
  },
  itemInfoTouchable: {
    width: 95,
    height: 92,
    flexDirection: 'row',
    borderColor: 'red',
    borderWidth: 0,
  },
  itemInfoContainer: {
    width: Dimensions.get('window').width - 198,
    height: 92,
    flexDirection: 'column',
    borderColor: 'red',
    borderWidth: 0,
  },
  itemInfoUserName: {
    width: Dimensions.get('window').width - 198,
    height: 35,
    borderColor: 'red',
    borderWidth: 0,
  },
  itemInfoUserNameText: {
    fontSize: 21,
    color: 'black',
    marginVertical: 3,
    marginHorizontal: 3,
    fontWeight: 'bold',
    textAlign: 'left',
    textAlignVertical: 'center',
  },
  itemInfoSignature: {
    width: Dimensions.get('window').width - 198,
    height: 22,
    marginVertical: 3,
    borderColor: 'red',
    borderWidth: 0,
  },
  itemInfoSignatureText: {
    fontSize: 12,
    color: 'black',
    marginVertical: 3,
    marginHorizontal: 3,
    textAlign: 'left',
    textAlignVertical: 'center',
  },
  itemListeningRecently: {
    width: Dimensions.get('window').width - 198,
    height: 25,
    flexDirection: 'row',
    marginVertical: 0,
    borderColor: 'red',
    borderWidth: 0,
  },
  itemListeningRecentlyIcon: {
    marginVertical: 3,
    marginHorizontal: 3,
    iconSize: 17,
  },
  itemListeningRecentlySongName: {
    fontSize: 12,
    color: 'black',
    fontWeight: 'bold',
    marginVertical: 3,
  },
  itemPopMenu: {
    marginVertical: 27,
    marginHorizontal: 7,
    iconSize: 35,
  },
};

function resizeMode() {
  let screenWidth = Dimensions.get('window').width;
  let screenHeight = Dimensions.get('window').height;
  if (parseInt(screenWidth, 10) <= 320 || parseInt(screenHeight, 10) <= 426) {
    styleJson.searchButton = {
      marginVertical: 2,
      iconSize: 25,
    };
    styleJson.searchText.borderWidth = 0;
    styleJson.searchText.fontSize = 12;
    styleJson.searchText.height = 35;
    styleJson.searchText.marginVertical = 1;
    styleJson.searchTextContainer.height = 39;
    let searchTextContainerWidth = styleJson.searchTextContainer.width;
    styleJson.searchText.width =
      searchTextContainerWidth - styleJson.searchButton.iconSize - 35;
    styleJson.searchContainer.height = 53;
    styleJson.itemUserFace = {
      width: 55,
      height: 55,
      marginVertical: 6,
      marginHorizontal: 6,
      borderColor: 'red',
      borderWidth: 0,
      borderRadius: 51,
    };
    styleJson.itemInfoContainer.borderWidth = 0;
    styleJson.itemInfoUserName.borderWidth = 0;
    styleJson.itemInfoSignature.borderWidth = 0;
    styleJson.itemListeningRecently.borderWidth = 0;
    styleJson.itemInfoSignature.width = 0;
    styleJson.itemInfoSignature.height = 0;
    styleJson.itemListeningRecentlyIcon.iconSize = 12;
    styleJson.itemInfoUserNameText.fontSize = 12;
    styleJson.itemInfoUserName.height = 27;
    styleJson.itemInfoContainer.width = 215;
    styleJson.itemInfoContainer.height = 55;
    styleJson.itemPopMenu.iconSize = 21;
    styleJson.itemContainer.height = 65;
    styleJson.itemListeningRecentlySongName.fontSize = 12;
    styleJson.itemPopMenu.marginVertical = 17;
  } else if (screenWidth === 360 && screenHeight === 592) {
    styleJson.container.width = screenWidth - 37;
    styleJson.container.height = screenHeight - 335;
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
      SearchWhere: '',
      isLoadComplete: false,
      isLoadUpComplate: false,
      nomore: false,
      PageData: null,
      DataCount: 0,
      PageCount: 0,
      SortField: 'createddatetime',
      SortMethod: 'DESC',
      refreshing: false, // 是否刷新标识
      errMsg: '',
      openMenuSelectedIndex: 0,
    };
  }
  //获得每页数据
  getPageData = UserId => {
    console.log('getPageData state', this.state);
    GetFriendsPage({
      parm: {
        UserId: UserId,
        SqlWhere: this.state.SearchWhere,
        SortField: this.state.SortField,
        SortMethod: this.state.SortMethod,
        PageSize: this.state.PageSize,
        CurPage: this.state.CurPage,
      },
      beforeCallBack: () => {},
      responseCallBack: res => {
        console.log('GetFriendsPage res', res);
        res.then(resData => {
          if (resData !== null && typeof resData !== 'undefined') {
            console.log('GetFriendsPage response data', resData);
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
            console.log('GetFriendsPage response PageData', PageData);
            console.log('GetFriendsPage response pageCount', pageCount);
            console.log('GetFriendsPage response recordCount', recordCount);
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
    let containerHeight = styles.itemContainer.height;
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

  gotoPage = userObject => {
    console.log('userObject', userObject);
    this.props.navigation.navigate('UserProfile', {
      userId: userObject.friendUserId,
    });
  };

  onOptionSelect = menuIndex => {
    let dataIndex = this.state.openMenuSelectedIndex;
    let deleteUser = this.state.PageData[dataIndex];
    console.log('menuIndex', menuIndex);
    Storage.get('userInfo').then(userInfo => {
      let userid = '';
      if (
        userInfo.payload === null ||
        typeof userInfo.payload === 'undefined'
      ) {
        Alert.alert('错误', '还没有登录请先登录');
      } else {
        userid = userInfo.payload.userId;
        Alert.alert(
          '确认删除',
          `确定要删除好友[${deleteUser.friendUserName}]吗?`,
          [
            {
              text: '取消',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: '确定',
              onPress: () => {
                DeleteFriend({
                  parm: {
                    UserId: userid,
                    FriendId: deleteUser.friendUserId,
                  },
                  beforeCallBack: () => {},
                  responseCallBack: res => {
                    res.then(resData => {
                      if (resData !== null && typeof resData !== 'undefined') {
                        const {status, msg} = resData;
                        if (status !== 0) {
                          Alert.alert('错误', `删除好友出错,原因[$${msg}]`);
                        } else {
                          Alert.alert('成功', '删除成功');
                          this.onRefresh();
                        }
                      }
                    });
                  },
                  errorCallback: error => {
                    Alert.alert('错误', `shan数据出错,原因[${error}]`);
                  },
                });
              },
              style: 'ok',
            },
          ],
        );
      }
    });
  };

  //组件挂载事件
  componentDidMount() {
    console.log('componentDidMount');
    let UserId = this.props.UserId;
    if (UserId !== '' && typeof UserId !== 'undefined') {
      this.getPageData(UserId);
    }
  }

  //快捷菜单弹出方法
  openMenu = (evt, index) => {
    let pageY = evt.nativeEvent.pageY;
    this.setState({openMenuSelectedIndex: index});
    this.getPosition(location => {
      console.log('openMenu', index);
      console.log('evt', evt);
      console.log('evt.nativeEvent', evt.nativeEvent);
      console.log('location', location);
      console.log('pageY', pageY);
      let top =
        parseInt(pageY, 10) - location.fy + styleJson.itemPopMenu.iconSize;
      let left = Dimensions.get('window').width - 252;
      console.log('top', top);
      this.popmenu.openMenu('popmenu-3', top, left);
    });
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

  renderItem = ({index, item}) => {
    let userface = require('../../../images/userfaces/useface01.png');
    if (
      item.friendUserFace !== '' &&
      typeof item.friendUserFace !== 'undefined'
    ) {
      userface = {uri: item.friendUserFace};
    }
    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity
          onPress={() => {
            this.gotoPage(item);
          }}
          style={styles.itemInfoTouchable}>
          <Image source={userface} style={styles.itemUserFace} />
        </TouchableOpacity>
        <View style={styles.itemInfoContainer}>
          {/*用户名B*/}
          <View style={styles.itemInfoUserName}>
            <Text numberOfLines={1} style={styles.itemInfoUserNameText}>
              {item.friendUserName}
            </Text>
          </View>
          {/*用户名E*/}
          {/*签名B*/}
          <View style={styles.itemInfoSignature}>
            <Text numberOfLines={1} style={styles.itemInfoSignatureText}>
              {item.friendSignature}
            </Text>
          </View>
          {/*签名E*/}
          {/*最近在听B*/}
          <View style={styles.itemListeningRecently}>
            <Icon
              style={styles.itemListeningRecentlyIcon}
              name="musical-note-sharp"
              size={styleJson.itemListeningRecentlyIcon.iconSize}
            />
            <Text style={styles.itemListeningRecentlySongName}>
              最近在听:{item.title}
            </Text>
          </View>
          {/*最近在听E*/}
        </View>
        <TouchableOpacity onPress={evt => this.openMenu(evt, index)}>
          <Icon
            style={styles.itemPopMenu}
            name="ellipsis-vertical"
            color={'black'}
            size={styleJson.itemPopMenu.iconSize}
          />
        </TouchableOpacity>
      </View>
    );
  };

  //获取搜索框
  searchData = () => {
    if (this.state.SearchWhere !== '') {
      let UserId = this.props.UserId;
      this.setState(
        {
          isLoadComplete: false,
          CurPage: 1,
          PageData: null,
        },
        () => {
          this.getPageData(UserId);
        },
      );
    }
  };

  onChangeSearchValue = value => {
    this.setState({SearchWhere: value});
  };

  render() {
    return (
      <View
        ref={r => {
          this._ref = r;
        }}
        style={[
          styles.container,
          {width: this.props.ParentWidth, height: this.props.ParentHeight},
        ]}>
        {/*搜索层B*/}
        <View style={styles.searchContainer}>
          <View style={styles.searchTextContainer}>
            <TextInput
              onChangeText={value => this.onChangeSearchValue(value)}
              style={styles.searchText}
              placeholder="搜索好友"
            />
            <TouchableOpacity
              onPress={() => {
                this.searchData();
              }}>
              <Icon
                name="search-sharp"
                size={styleJson.searchButton.iconSize}
                style={styles.searchButton}
              />
            </TouchableOpacity>
          </View>
        </View>
        <CustomPopupMenu
          name="popmenu-3"
          menu={this.popmenu}
          onOptionSelect={this.onOptionSelect}
          ref={r => (this.popmenu = r)}
          menuOptions={['删除好友']}
        />
        {/*搜索层E*/}
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
        <View style={styles.space} />
      </View>
    );
  }
}
