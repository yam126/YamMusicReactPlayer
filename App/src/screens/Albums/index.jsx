/* eslint-disable no-bitwise */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Dimensions,
  FlatList,
  Image,
  Alert,
  RefreshControl,
} from 'react-native';
import React, {useState} from 'react';
import {publicStyles} from '../../publicStyle';
import Icon from 'react-native-vector-icons/Ionicons';
import DrawerMenu from '../../components/DrawerMenu';
import {queryAlbumPage, queryAlbumSongData} from '../../utils/api';
import MiniLoading from '../../components/MiniLoading';
import {ScrollView} from 'react-native-gesture-handler';

//歌曲列表组件
class SongList extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoadComplete: false,
      errMsg: '',
      songData: null,
    };
  }
  QueryAlbumSongData = ({
    parm,
    beforeCallBack,
    responseCallBack,
    errorCallback,
  }) => {
    queryAlbumSongData({
      parm: parm,
      beforeCallBack: beforeCallBack,
      responseCallBack: responseCallBack,
      errorCallback: errorCallback,
    });
  };
  albumSongData = albumId => {
    console.log('albumSongData albumId', albumId);
    this.QueryAlbumSongData({
      parm: {
        albumId: albumId,
        limit: 10,
      },
      beforeCallBack: () => {},
      responseCallBack: res => {
        //console.log('QueryAlbumSongData res', res);
        res.then(resData => {
          //console.log('QueryAlbumSongData resData', resData);
          if (resData !== null && typeof resData !== 'undefined') {
            const {status, result, msg} = resData;
            if (status !== 0) {
              //Alert.alert('错误', `获取专辑歌曲出错,原因[${msg}]`);
              this.setState({errMsg: msg});
            } else {
              this.setState({songData: result});
            }
            if (result !== null && typeof result !== 'undefined') {
              console.log(
                `QueryAlbumSongData ${albumId} result.length=`,
                result.length,
              );
            } else {
              console.log(`QueryAlbumSongData ${albumId} result.length=0`);
            }
          }
          this.setState({isLoadComplete: true});
        });
      },
      errorCallback: error => {
        //Alert.alert('错误', `获取专辑歌曲出错,原因[${error}]`);
        this.setState({errMsg: error});
        this.setState({isLoadComplete: true});
      },
    });
  };
  renderMusicItem = (item, index) => {
    let itemSong = this.state.songData[index];
    //console.log(itemSong);
    //console.log('itemSong index', index);
    return (
      <View style={albumsStyles.container.songList.itemContainner}>
        <TouchableOpacity>
          <Image
            style={albumsStyles.container.songList.itemContainner.cover}
            source={{uri: itemSong.cover}}
          />
          <View style={albumsStyles.container.songList.itemContainner.songName}>
            <Text
              numberOfLines={1}
              style={
                albumsStyles.container.songList.itemContainner.songName.text
              }>
              {itemSong.title}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  ListEmptyComponent = () => {
    let errMsg = this.state.errMsg;
    let Width = this.props.Width;
    let Height = this.props.Height;
    let stylesJson = {
      container: {
        width: Width,
        height: Height,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textStyle: {
          fontSize: Height / 3,
          textAlign: 'center',
          color: '#ccc',
        },
      },
    };
    const emptyStyle = StyleSheet.create(stylesJson);
    return errMsg === '' ? (
      <View style={emptyStyle.container}>
        <Text style={emptyStyle.container.textStyle}>歌单内没有歌曲</Text>
      </View>
    ) : (
      <View style={emptyStyle.container}>
        <Text style={emptyStyle.container.textStyle}>{errMsg}</Text>
      </View>
    );
  };
  componentDidMount() {
    this.albumSongData(this.props.albumId);
  }
  render() {
    let loadingSize = 37;
    let Width = this.props.Width;
    let Height = this.props.Height;
    return !this.state.isLoadComplete ? (
      <MiniLoading Width={Width} Height={Height} Size={loadingSize} />
    ) : (
      <FlatList
        data={this.state.songData}
        horizontal={true}
        ListEmptyComponent={this.ListEmptyComponent}
        renderItem={({itemSong, index}) =>
          this.renderMusicItem(itemSong, index)
        }
      />
    );
  }
}

//专辑列表组件
class AlbumsList extends React.Component {
  constructor() {
    super();
    let propsId = 0;
    if (this.props !== null && typeof this.props !== 'undefined') {
      propsId = this.props.id;
    }
    this.state = {
      refreshing: false,
      PageSize: 10,
      PageCount: 0,
      CurPage: 1,
      RecordCount: 0,
      SearchWhere: '',
      SortField: 'createdatetime',
      SortMethod: 'desc',
      nomore: false,
      PageData: null,
      isLoadComplete: false,
      errMsg: '',
    };
  }

  //生成随机ID：GUID
  genId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
      .replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      })
      .toUpperCase();
  }

  //加载页面数据
  getPageData = () => {
    queryAlbumPage({
      parm: {
        SqlWhere: this.state.SearchWhere,
        SortField: this.state.SortField,
        PageSize: this.state.PageSize,
        CurPage: this.state.CurPage,
      },
      beforeCallBack: () => {},
      responseCallBack: res => {
        console.log('queryAlbumPage res', res);
        res.then(resData => {
          if (resData !== null && typeof resData !== 'undefined') {
            console.log('queryAlbumPage response data', resData);
            const {status, result, msg, pageCount, recordCount} = resData;
            let PageData = this.state.PageData;
            let CurPage = this.state.CurPage;
            let PageSize = this.state.PageSize;
            let nomore = this.state.nomore;
            if (status !== 0) {
              Alert.alert('错误', `获取焦点图出错,原因[${msg}]`);
              this.setState({errMsg: `获取焦点图出错,原因[${msg}]`});
            } else {
              console.log('queryAlbumPage response result', result);
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
            console.log('queryAlbumPage response PageData', PageData);
            console.log('queryAlbumPage response pageCount', pageCount);
            console.log('queryAlbumPage response recordCount', recordCount);
            this.setState({
              isLoadComplete: true,
              PageData: PageData,
              RecordCount: recordCount,
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

  //组件挂载事件
  componentDidMount() {
    console.log('componentDidMount');
    this.getPageData();
  }

  //列表结尾组件
  ListFooterComponent = () => {
    let containerWidth = Dimensions.get('window').width;
    let containerHeight = 239;
    let loadingSize = 55;
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
    this.getPageData();
  };

  //获取搜索框搜索关键字
  searchTextChange = val => {
    this.setState({SearchWhere: val});
  };

  //获取搜索框
  searchData = () => {
    if (this.state.SearchWhere !== '') {
      this.setState(
        {
          isLoadComplete: false,
          CurPage: 1,
          PageData: null,
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
        isLoadComplete: false,
        CurPage: 1,
        PageData: null,
      },
      () => {
        this.getPageData();
      },
    );
  };

  //单个专辑模板
  renderItem = ({item, index}) => {
    let {navigation} = this.props;
    console.log('renderItem item.albumId=', item.albumId);
    const gotoPage = () => {
      navigation.navigate('PlayList', {
        albums: item,
        songData: this.state.songData,
      });
    };
    return (
      <>
        <View style={albumsStyles.container}>
          {/*专辑信息B*/}
          <TouchableOpacity onPress={gotoPage}>
            <View style={albumsStyles.albumsInfo}>
              <Image
                source={{uri: item.albumCover}}
                style={albumsStyles.albumsInfo.cover}
              />
              <View style={albumsStyles.albumsInfo.infoContainer}>
                <View
                  style={albumsStyles.albumsInfo.infoContainer.lineContainer}>
                  <Text
                    numberOfLines={1}
                    style={albumsStyles.albumsInfo.infoContainer.albumName}>
                    专辑名称:{item.albumName}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={albumsStyles.albumsInfo.infoContainer.text}>
                    数量:{item.songLength}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={albumsStyles.albumsInfo.infoContainer.text}>
                    作者:{item.albumAuthor}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
          {/*专辑信息E*/}
          {/*歌曲列表B*/}
          <View style={albumsStyles.container.songList}>
            <SongList
              albumId={item.albumId}
              Width={albumsStyles.container.songList.width}
              Height={albumsStyles.container.songList.height}
            />
          </View>
          {/*歌曲列表E*/}
        </View>
        {/*index === this.state.PageData.length - 1 ? (
          this.ListFooterComponent()
        ) : (
          <></>
        )*/}
      </>
    );
  };

  //返回专辑唯一key
  _keyExtractor = (item, index) => {
    item.albumId;
    return item.albumId;
  };

  render() {
    let containerWidth = Dimensions.get('window').width;
    let containerHeight = Dimensions.get('window').height;
    let loadingSize = 51;
    return !this.state.isLoadComplete ? (
      <ScrollView>
        <MiniLoading
          Width={containerWidth}
          Height={containerHeight}
          Size={loadingSize}
        />
      </ScrollView>
    ) : (
      <FlatList
        data={this.state.PageData}
        keyExtractor={this._keyExtractor}
        renderItem={this.renderItem}
        ListEmptyComponent={this.ListEmptyComponent}
        ListFooterComponent={this.ListFooterComponent}
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
      />
    );
  }
}

function AlbumsPage(props) {
  let {showDrawer, navigation} = props;
  let _albumsList = null;

  //打开侧滑菜单
  const openDrawer = () => {
    console.log('showDrawer', showDrawer);
    showDrawer();
  };

  //获取搜索框
  const onSearchTextChange = val => {
    _albumsList.searchTextChange(val);
  };

  const searchData = () => {
    _albumsList.searchData();
  };
  return (
    <View style={[publicStyles.container, {backgroundColor: '#EEEEEE'}]}>
      {/*头部层B*/}
      <View style={[publicStyles.headerContainer, {backgroundColor: 'white'}]}>
        <TouchableOpacity onPress={() => openDrawer()}>
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
            placeholder={'请输入专辑名'}
            onChangeText={val => onSearchTextChange(val)}
          />
          <TouchableOpacity
            onPress={() => {
              searchData();
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
      {/*头部层E*/}
      {/*列表层B*/}
      <AlbumsList ref={ref => (_albumsList = ref)} navigation={navigation} />
      {/*列表层E*/}
      <View style={{height: 65}} />
    </View>
  );
}

export default function Index(props) {
  let {navigation} = props;
  return (
    <DrawerMenu
      navigation={navigation}
      childComponent={openDrawer => (
        <AlbumsPage navigation={navigation} showDrawer={openDrawer} />
      )}
    />
  );
}

const albumsStyles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    minHeight: 239,
    maxHeight: 578,
    marginVertical: 15,
    flexDirection: 'column',
    backgroundColor: 'white',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    borderTopColor: '#ccc',
    borderTopWidth: 1,
    songList: {
      width: Dimensions.get('window').width,
      height: 150,
      borderColor: 'red',
      borderWidth: 0,
      itemContainner: {
        width: 115,
        height: 153,
        marginHorizontal: 2,
        flexDirection: 'column',
        alignItems: 'center',
        cover: {
          width: 89,
          height: 95,
          marginVertical: 5,
          marginHorizontal: 5,
          borderRadius: 10,
        },
        songName: {
          width: 112,
          height: 20,
          text: {
            fontSize: 13,
            marginHorizontal: 7,
          },
        },
      },
    },
  },
  albumsInfo: {
    width: Dimensions.get('window').width - 20,
    height: 98,
    marginHorizontal: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    flexDirection: 'row',
    lineContainer: {
      width: Dimensions.get('window').width - 20,
      height: 20,
    },
    cover: {
      width: 87,
      height: 87,
      borderRadius: 10,
      marginHorizontal: 5,
      marginVertical: 5,
    },
    infoContainer: {
      width: Dimensions.get('window').width - 118,
      height: 87,
      marginVertical: 5,
      marginHorizontal: 3,
      flexDirection: 'row',
      borderColor: 'red',
      borderWidth: 0,
      albumName: {
        fontSize: 16,
        color: 'black',
        fontWeight: 'bold',
        marginHorizontal: 10,
        marginVertical: 5,
      },
      text: {
        fontSize: 13,
        color: 'black',
        marginHorizontal: 10,
        marginVertical: 5,
      },
    },
  },
});

const styles = StyleSheet.create({
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
});
