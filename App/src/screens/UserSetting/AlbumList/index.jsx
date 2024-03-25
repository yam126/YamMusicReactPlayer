/* eslint-disable react-native/no-inline-styles */
import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  Alert,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import React, {Component} from 'react';
import {queryAlbumPage, queryAlbumSongData} from '../../../utils/api';
import MiniLoading from '../../../components/MiniLoading';
import {Image} from 'react-native-animatable';

let styleJson = {
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: '#F2F2F2',
    flexDirection: 'column',
  },
  emptyContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 26,
    color: 'black',
    fontWeight: 'bold',
  },
  itemContainer: {
    width: Dimensions.get('window').width - 43,
    height: 198,
    marginHorizontal: 12,
    marginVertical: 15,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 18,
    borderColor: '#ccc',
    borderWidth: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  itemAlbumContainer: {
    width: Dimensions.get('window').width - 73,
    height: 192 / 2,
    marginVertical: 6,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    flexDirection: 'row',
  },
  itemAlbumCover: {
    width: 86,
    height: 86,
    marginVertical: 6,
    marginHorizontal: 6,
    borderRadius: 10,
    resizeMode: 'stretch',
  },
  itemAlbumInfoContainer: {
    width: Dimensions.get('window').width - 185,
    height: 86,
    marginVertical: 6,
    borderColor: 'red',
    borderWidth: 0,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  itemAlbumInfoAlbumName: {
    color: 'black',
    fontSize: 32,
    fontWeight: 'bold',
  },
  itemAlbumInfoIntro: {
    color: 'black',
    fontSize: 16,
  },
  itemAlbumSongListContainer: {
    width: Dimensions.get('window').width - 85,
    height: 76,
    marginVertical: 3,
    borderColor: 'red',
    borderWidth: 0,
    flexDirection: 'row',
  },
};

let albumsStyleJson = {
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
        height: styleJson.itemAlbumSongListContainer.height,
        marginHorizontal: 2,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'red',
        borderWidth: 0,
        cover: {
          width: 56,
          height: 56,
          marginVertical: 3,
          marginHorizontal: (115 - 56) / 2,
          borderRadius: 10,
        },
        songName: {
          width: 112,
          height: 20,
          text: {
            fontSize: 13,
            textAlign: 'center',
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
};

function resizeAlbumMode() {
  let screenWidth = Dimensions.get('window').width.toFixed();
  let screenHeight = Dimensions.get('window').height.toFixed();
  console.log('resizeAlbumMode screenWidth', screenWidth);
  console.log('resizeAlbumMode screenHeight', screenHeight);
  if (parseInt(screenWidth, 10) <= 384 && parseInt(screenHeight, 10) <= 592) {
    albumsStyleJson.albumsInfo.cover.width = 45;
    albumsStyleJson.albumsInfo.cover.height = 45;
  }
  return albumsStyleJson;
}

const albumsStyles = StyleSheet.create(resizeAlbumMode());

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

function resizeMode() {
  let screenWidth = Dimensions.get('window').width.toFixed();
  let screenHeight = Dimensions.get('window').height.toFixed();
  console.log('resizeMode screenWidth', screenWidth);
  console.log('resizeMode screenHeight', screenHeight);
  if (parseInt(screenWidth, 10) <= 384 && parseInt(screenHeight, 10) <= 592) {
    styleJson.itemAlbumCover.width = 65;
    styleJson.itemAlbumCover.height = 65;
    styleJson.itemAlbumCover.marginHorizontal = 12;
    styleJson.itemAlbumInfoAlbumName.fontSize = 21;
    styleJson.itemAlbumInfoContainer.height = 70;
    styleJson.itemAlbumContainer.height = 82;
  }
  if (parseInt(screenWidth, 10) <= 393 && parseInt(screenHeight, 10) <= 803) {
    styleJson.itemAlbumCover.width = 65;
    styleJson.itemAlbumCover.height = 65;
    styleJson.itemAlbumCover.marginHorizontal = 12;
    styleJson.itemAlbumInfoAlbumName.fontSize = 21;
    styleJson.itemAlbumInfoContainer.height = 70;
    styleJson.itemAlbumContainer.height = 82;
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
      SortField: 'createdatetime',
      SortMethod: 'DESC',
      refreshing: false, // 是否刷新标识
      SearchWhere: '',
      errMsg: '',
    };
  }
  //加载页面数据
  getPageData = () => {
    let userid = this.props.UserId;
    queryAlbumPage({
      parm: {
        SqlWhere: `userid|[${userid}]`,
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

  //空数据组件
  ListEmptyComponent = () => {
    let containerWidth = Dimensions.get('window').width;
    let containerHeight = this.props.ParentHeight;
    return (
      <View
        style={[
          styles.emptyContainer,
          {width: containerWidth, height: containerHeight},
        ]}>
        <TouchableOpacity>
          <Text style={styles.emptyText}>没有任何数据点击刷新</Text>
        </TouchableOpacity>
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
    this.getPageData();
  };

  renderItem = ({index, item}) => {
    console.log('index', item);
    let albumCover = require('../../../images/NoCover.png');
    if (item.albumCover !== '' && typeof item.albumCover !== 'undefined') {
      albumCover = {uri: item.albumCover};
    }
    return (
      <View
        style={[styles.itemContainer, {width: this.props.ParentWidth - 35}]}>
        <View
          style={[
            styles.itemAlbumContainer,
            {width: this.props.ParentWidth - 43},
          ]}>
          <Image style={styles.itemAlbumCover} source={albumCover} />
          <View style={styles.itemAlbumInfoContainer}>
            <Text numberOfLines={1} style={[styles.itemAlbumInfoAlbumName]}>
              {item.albumName}
            </Text>
            <Text numberOfLines={1} style={styles.itemAlbumInfoIntro}>
              {item.albumAuthor}
            </Text>
            <Text numberOfLines={1} style={styles.itemAlbumInfoIntro}>
              {item.createdatetime}
            </Text>
          </View>
        </View>
        <View style={styles.itemAlbumSongListContainer}>
          <SongList
            albumId={item.albumId}
            Width={styles.itemAlbumSongListContainer.width}
            Height={styles.itemAlbumSongListContainer.height}
          />
        </View>
      </View>
    );
  };

  //列表结尾组件
  ListFooterComponent = () => {
    let containerWidth = this.props.ParentWidth - 35;
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
      <View
        style={[
          styles.itemContainer,
          {
            width: this.props.ParentWidth - 35,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}>
        <Text
          style={{color: '#ccc', fontSize: loadingSize, textAlign: 'center'}}>
          已经加载全部
        </Text>
      </View>
    );
  };

  componentDidMount() {
    this.getPageData();
  }

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
        this.getPageData();
      },
    );
  };

  render() {
    let containerWidth = this.props.ParentWidth;
    let containerHeight = this.props.ParentHeight;
    let loadingSize = 51;
    return (
      <View
        style={[
          styles.container,
          {width: containerWidth, height: containerHeight},
        ]}>
        {!this.state.isLoadComplete ? (
          <MiniLoading
            Width={containerWidth}
            Height={containerHeight}
            Size={loadingSize}
          />
        ) : (
          <FlatList
            data={this.state.PageData}
            keyExtractor={item => item.albumId}
            renderItem={this.renderItem}
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
          />
        )}
      </View>
    );
  }
}
