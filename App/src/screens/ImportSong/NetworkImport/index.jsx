/* eslint-disable react-native/no-inline-styles */
import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  Alert,
  RefreshControl,
} from 'react-native';
import React, {Component} from 'react';
import {publicStyles} from '../../../publicStyle';
import Icon from 'react-native-vector-icons/Ionicons';
import {querySongInfoPage} from '../../../utils/api';
import {SongChangeAlbum} from '../../../utils/api';
import MiniLoading from '../../../components/MiniLoading';
import {ListItem} from '@rneui/themed';
import Storage from '../../../utils/storage';

let styleJson = {
  menuIcon: {
    width: 25,
    height: 25,
    marginVertical: 12,
    marginHorizontal: 12,
  },
  searchContainer: {
    width: Dimensions.get('window').width - 100,
    height: 38,
    marginVertical: 7,
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 15,
    flexDirection: 'row',
  },
  searchText: {
    width: Dimensions.get('window').width - 150,
    height: 38,
    fontSize: 12,
    lineHeight: 7,
    verticalAlign: 'middle',
    textAlign: 'left',
    color: '#ccc',
    //borderColor: 'red',
    //borderWidth: 1,
  },
  musicListItem: {
    width: Dimensions.get('window').width - 21,
    height: 75,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    borderTopColor: '#ccc',
    marginHorizontal: 7,
    flexDirection: 'row',
    borderTopWidth: 1,
    ellipsisContainer: {
      width: 30,
      height: 74,
      borderWidth: 0,
      borderColor: 'red',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      ellipsis: {},
    },
  },
  musicListItemCover: {
    width: 66,
    height: 66,
    marginHorizontal: 5,
    marginVertical: 5,
    borderRadius: 5,
  },
  musicListItemInfo: {
    width: Dimensions.get('window').width - 115,
    height: 66,
    marginVertical: 5,
    flexDirection: 'column',
    //borderColor: 'red',
    //borderWidth: 1,
    title: {
      fontSize: 23,
      fontWeight: 'bold',
      marginHorizontal: 3,
      color: 'black',
    },
    author: {
      fontSize: 15,
      marginHorizontal: 3,
      marginVertical: 5,
      color: 'black',
    },
  },
  listHeaderContainer: {
    width: Dimensions.get('window').width,
    height: 27,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
};

function resizeMode() {
  return styleJson;
}

const styles = StyleSheet.create(resizeMode());

export default class Index extends Component {
  constructor() {
    super();
    this.state = {
      pageSize: 10,
      curPage: 1,
      sqlWhere: '',
      isLoadComplete: false,
      isLoadUpComplate: false,
      nomore: false,
      pageData: null,
      dataCount: 0,
      PageCount: 0,
      sortField: 'createdatetime',
      sortMethod: 'DESC',
      refreshing: false, // 是否刷新标识
      checkedStateAry: [],
      isCheckedAll: false,
      errMsg: '',
      albums: null,
    };
  }

  //获得每页数据
  getPageData = () => {
    console.log('getPageData state', this.state);
    querySongInfoPage({
      parm: {
        SqlWhere: this.state.sqlWhere,
        SortField: this.state.sortField,
        SortMethod: this.state.sortMethod,
        PageSize: this.state.pageSize,
        CurPage: this.state.curPage,
      },
      beforeCallBack: () => {},
      responseCallBack: res => {
        console.log('querySongInfoPage res', res);
        res.then(resData => {
          if (resData !== null && typeof resData !== 'undefined') {
            console.log('querySongInfoPage response data', resData);
            const {status, result, msg, pageCount, recordCount} = resData;
            let PageData = this.state.pageData;
            let CurPage = this.state.curPage;
            let PageSize = this.state.pageSize;
            let nomore = this.state.nomore;
            let checkedStateAry = this.state.checkedStateAry;
            if (status !== 0) {
              Alert.alert('错误', `获取焦点图出错,原因[${msg}]`);
              this.setState({errMsg: `获取焦点图出错,原因[${msg}]`});
            } else {
              console.log('querySongInfoPage response result', result);
              if (recordCount > 0) {
                if (result !== null && typeof result !== 'undefined') {
                  if (CurPage === 1) {
                    PageData = result;
                  } else if (
                    CurPage <= pageCount &&
                    PageData.length <= PageSize * CurPage
                  ) {
                    for (var i = 0; i < result.length; i++) {
                      if (
                        PageData.findIndex(
                          item => item.songId === result[i].songId,
                        ) === -1
                      ) {
                        PageData.push(result[i]);
                      }
                    }
                  } else {
                    nomore = true;
                  }
                }
              }
            }
            console.log('querySongInfoPage response PageData', PageData);
            console.log('querySongInfoPage response pageCount', pageCount);
            console.log('querySongInfoPage response recordCount', recordCount);
            //#region 填充复选框数组
            if (
              PageData !== null &&
              typeof PageData !== 'undefined' &&
              PageData.length > 0
            ) {
              PageData.map((item, index) => {
                let isCheckedAll = this.state.isCheckedAll;
                checkedStateAry.push(isCheckedAll ? true : false);
              });
            }
            //#endregion
            this.setState({
              checkedStateAry: checkedStateAry,
              isLoadComplete: true,
              pageData: PageData,
              dataCount: recordCount,
              PageCount: pageCount,
              nomore: nomore,
            });
          }
        });
      },
      errorCallback: error => {
        Alert.alert('错误', `获取焦点数据出错,原因[${error}]`);
      },
    });
  };

  //快捷菜单弹出方法
  openMenu = (evt, index) => {
    console.log('openMenu', index);
    console.log('evt.nativeEvent', evt.nativeEvent);
    let top = evt.nativeEvent.pageY;
    let left = Dimensions.get('window').width - 230;
    this.popmenu.openMenu('popmenu-1', top, left);
  };

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

  //单个列表元素
  renderItem = ({index, item}) => {
    let checkedStateAry = this.state.checkedStateAry;
    return (
      <>
        <TouchableOpacity>
          <View style={styles.musicListItem}>
            <ListItem.CheckBox
              iconType="material-community"
              checkedIcon="checkbox-marked"
              uncheckedIcon="checkbox-blank-outline"
              checked={checkedStateAry[index]}
              containerStyle={{
                backgroundColor: '#F2F2F2',
                justifyContent: 'center',
              }}
              center={true}
              onPress={() => {
                this.setChecked(index);
              }}
            />
            <Image
              style={styles.musicListItemCover}
              source={{uri: item.cover}}
            />
            <ListItem.Content
              style={{backgroundColor: 'rgba(255,255,255,0.0)'}}>
              <ListItem.Title>{item.title}</ListItem.Title>
              <ListItem.Subtitle>{item.artist}</ListItem.Subtitle>
            </ListItem.Content>
          </View>
        </TouchableOpacity>
        {index === this.state.pageData.length - 1 ? (
          <View style={styles.musicListItem}>{this.ListFooterComponent()}</View>
        ) : (
          <></>
        )}
      </>
    );
  };

  //打开侧滑菜单
  openDrawer = () => {
    let {showDrawer} = this.props;
    console.log('showDrawer', showDrawer);
    showDrawer();
  };

  //满屏页面判断
  fullScreenJusting = (ItemHeight, screnHeight) => {
    //计算列表个数
    const listNum = (screnHeight - 40) / ItemHeight;
    return Math.ceil(listNum);
  };

  //空数据组件
  ListEmptyComponent = () => {
    let screenHeight = Dimensions.get('window').height;
    let tabbarHeight = publicStyles.headerContainer.height;
    let containerWidth = Dimensions.get('window').width;
    let containerHeight = screenHeight - tabbarHeight;
    let centerWidth = containerWidth - 150;
    let centerHeight = 356;
    let imageWidth = centerWidth;
    let imageHeight = centerHeight - 50;
    let tipsHeight = 50;
    let tipsFontSize = tipsHeight - 20;
    return (
      <TouchableOpacity>
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
              source={require('../../../images/NoMusicBlue.png')}
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
    let containerHeight = styleJson.musicListItem.height;
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
    let CurPage = this.state.curPage;
    let PageCount = this.state.PageCount;
    let nomore = this.state.nomore;
    CurPage += 1;
    console.log('_onEndReached CurPage', CurPage);
    console.log('_onEndReached PageCount', PageCount);
    if (CurPage >= PageCount) {
      CurPage = PageCount;
      nomore = true;
      this.setState({curPage: CurPage, nomore: nomore});
    } else {
      this.setState({curPage: CurPage});
    }
    this.getPageData();
  };

  //组件挂载事件
  componentDidMount() {
    console.log('componentDidMount');
    let albums = null;
    if (
      this.props.route.params !== null &&
      typeof this.props.route.params !== 'undefined'
    ) {
      albums = this.props.route.params.albums;
    }
    console.log('NetwoorkImport componentDidMount albums', albums);
    this.setState({albums: albums});
    this.getPageData();
  }

  //获取搜索框
  searchTextChange = val => {
    this.setState({sqlWhere: val});
  };

  //点击搜索数据
  searchData = () => {
    if (this.state.sqlWhere !== '') {
      this.setState(
        {
          isLoadComplete: false,
          curPage: 1,
          pageData: null,
          dataCount: 0,
          PageCount: 0,
        },
        () => {
          this.getPageData();
        },
      );
    }
  };

  //下拉刷新事件
  _onRefresh = () => {
    this.setState(
      {
        curPage: 1,
        nomore: false,
        isLoadComplete: false,
        isLoadUpComplate: false,
      },
      () => {
        this.getPageData();
      },
    );
  };

  /**
   * 返回上一页
   */
  gotoBack = () => {
    console.log(' gotoBack props ', this.props);
    this.props.navigation.goBack();
  };

  ListHeaderComponent = () => {
    return (
      <View style={styles.listHeaderContainer}>
        <ListItem.CheckBox
          iconType="material-community"
          checkedIcon="checkbox-marked"
          uncheckedIcon="checkbox-blank-outline"
          checked={this.state.isCheckedAll}
          containerStyle={{
            marginHorizontal: 15,
            backgroundColor: '#F2F2F2',
            justifyContent: 'center',
          }}
          center={true}
          onPress={() => {
            let isCheckedAll = !this.state.isCheckedAll;
            let checkedStateAry = this.state.checkedStateAry;
            checkedStateAry = checkedStateAry.map((item, index) => {
              return isCheckedAll;
            });
            this.setState({
              isCheckedAll: isCheckedAll,
              checkedStateAry: checkedStateAry,
            });
          }}
        />
        <Text>{this.state.isCheckedAll ? '取消全选' : '全选'}</Text>
      </View>
    );
  };

  getSelectedData = () => {
    let pageData = this.state.pageData;
    let checkedStateAry = this.state.checkedStateAry;
    let result = [];
    pageData.map((item, index) => {
      if (checkedStateAry[index]) {
        result.push(item.songId);
      }
    });
    return result;
  };

  importSongTouch = () => {
    let selectedData = this.getSelectedData();
    let albums = this.state.albums;
    if (selectedData.length <= 0) {
      Alert.alert('错误', '请至少选择一项');
      return false;
    }
    if (albums === null && typeof albums === 'undefined') {
      Alert.alert('错误', '没有专辑信息');
      return false;
    }
    Storage.get('userInfo').then(userInfo => {
      let userid = '';
      if (
        userInfo.payload !== null &&
        typeof userInfo.payload !== 'undefined'
      ) {
        userid = userInfo.payload.userId;
        console.log('importSongTouch userid', userid);
      }
      console.log('importSongTouch albums.albumId', albums.albumId);
      SongChangeAlbum({
        parm: {
          albumId: albums.albumId,
          userid: userid,
        },
        songIdAry: selectedData,
        beforeCallBack: () => {},
        responseCallBack: res => {
          res.then(resData => {
            if (resData !== null && typeof resData !== 'undefined') {
              const {status, msg} = resData;
              if (status === 0) {
                Alert.alert('成功', '导入歌曲成功');
              } else {
                Alert.alert('失败', `导入到专辑失败,原因[${msg}]`);
              }
            }
          });
        },
      });
    });
  };

  //主要渲染方法
  render() {
    return (
      <View style={publicStyles.container}>
        {/*页面标题B*/}
        <View style={publicStyles.headerContainer}>
          <TouchableOpacity
            onPress={() => {
              this.gotoBack();
            }}>
            <Icon
              style={styles.menuIcon}
              name="chevron-back-outline"
              size={25}
              color={'grey'}
            />
          </TouchableOpacity>
          <View style={styles.searchContainer}>
            <TextInput
              numberOfLines={1}
              style={styles.searchText}
              placeholder={'  请输入歌曲名'}
              onChangeText={val => this.searchTextChange(val)}
            />
            <TouchableOpacity
              onPress={() => {
                this.searchData();
              }}>
              <Icon
                style={[styles.menuIcon, {marginVertical: 4}]}
                name="search-outline"
                size={25}
                color={'grey'}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => {
              this.importSongTouch();
            }}>
            <Icon
              style={styles.menuIcon}
              name="cloud-upload"
              size={25}
              color={'grey'}
            />
          </TouchableOpacity>
        </View>
        {/*页面标题E*/}
        {!this.state.isLoadComplete ? (
          <MiniLoading
            Width={Dimensions.get('window').width}
            Height={
              Dimensions.get('window').height -
              publicStyles.headerContainer.height
            }
            Size={65}
          />
        ) : (
          <FlatList
            data={this.state.pageData}
            renderItem={this.renderItem}
            keyExtractor={item => item.songId}
            ListHeaderComponent={this.ListHeaderComponent}
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
                  this._onRefresh();
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
