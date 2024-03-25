/* eslint-disable react/no-unstable-nested-components */
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
import {publicStyles} from '../../publicStyle';
import Icon from 'react-native-vector-icons/Ionicons';
import GlobalPopupMenu from '../../components/GlobalPopupMenu';
import DrawerMenu from '../../components/DrawerMenu';
import {querySongInfoPage} from '../../utils/api';
import MiniLoading from '../../components/MiniLoading';

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
    width: Dimensions.get('window').width - 135,
    height: 66,
    marginVertical: 5,
    flexDirection: 'column',
    borderColor: 'red',
    borderWidth: 0,
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
};

function resizeMode() {
  return styleJson;
}

const styles = StyleSheet.create(resizeMode());

class MusicList extends Component {
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
      errMsg: '',
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
            this.setState({
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

  gotoPlay = songId => {
    this.props.navigation.navigate('PlayPage', {songId: songId});
  };

  //单个列表元素
  renderItem = ({index, item}) => {
    return (
      <>
        <View style={styles.musicListItem}>
          <TouchableOpacity
            onPress={() => {
              this.gotoPlay(item.songId);
            }}>
            <Image
              style={styles.musicListItemCover}
              source={{uri: item.cover}}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.gotoPlay(item.songId);
            }}>
            <View style={styles.musicListItemInfo}>
              <Text numberOfLines={1} style={styles.musicListItemInfo.title}>
                {item.title}
              </Text>
              <Text numberOfLines={1} style={styles.musicListItemInfo.author}>
                {item.artist}
              </Text>
            </View>
          </TouchableOpacity>
          {/*<TouchableOpacity onPress={evt => this.openMenu(evt, index)}>
            <View style={styles.musicListItem.ellipsisContainer}>
              {index === this.state.pageData.length ? (
                <Icon
                  style={styles.musicListItem.ellipsisContainer.ellipsis}
                  name="ellipsis-vertical"
                  color={'red'}
                  size={29}
                />
              ) : (
                <Icon
                  style={styles.musicListItem.ellipsisContainer.ellipsis}
                  name="ellipsis-vertical"
                  color={'black'}
                  size={29}
                />
              )}
            </View>
          </TouchableOpacity>*/}
          <View style={styles.musicListItem.ellipsisContainer}>
            <Icon
              style={styles.musicListItem.ellipsisContainer.ellipsis}
              name="caret-forward-circle"
              color={'black'}
              size={29}
            />
          </View>
        </View>
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

  //主要渲染方法
  render() {
    return (
      <View style={publicStyles.container}>
        {/*页面标题B*/}
        <View style={publicStyles.headerContainer}>
          <TouchableOpacity onPress={this.openDrawer}>
            <Icon
              style={styles.menuIcon}
              name="grid-outline"
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
          <TouchableOpacity>
            <Icon
              style={styles.menuIcon}
              name="scan-outline"
              size={25}
              color={'grey'}
            />
          </TouchableOpacity>
        </View>
        {/*页面标题E*/}
        {/*弹出菜单B*/}
        <GlobalPopupMenu
          name="popmenu-1"
          menu={this.popmenu}
          ref={r => (this.popmenu = r)}
        />
        {/*弹出菜单E*/}
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

export default function Index(props) {
  console.log('MusicList props', props);
  return (
    <DrawerMenu
      navigation={props.navigation}
      childComponent={openDrawer => (
        <MusicList navigation={props.navigation} showDrawer={openDrawer} />
      )}
    />
  );
}
