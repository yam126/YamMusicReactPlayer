/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  Alert,
  RefreshControl,
} from 'react-native';
import React, {Component} from 'react';
import {GetRecentlyListenedPage} from '../../../utils/api';
import MiniLoading from '../../..//components/MiniLoading';

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
    ellipsis: {
      marginVertical: -50,
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
};

function resizeMode() {
  let screenWidth = Dimensions.get('window').width.toFixed();
  let screenHeight = Dimensions.get('window').height.toFixed();
  if (parseInt(screenWidth, 10) <= 320 || parseInt(screenHeight, 10) <= 426) {
    styleJson.musicListItemCover = {
      width: 43,
      height: 43,
      marginHorizontal: 5,
      marginVertical: 5,
      borderRadius: 5,
    };
    styleJson.musicListItem.height = 53;
    styleJson.musicListItemInfo.title.fontSize = 15;
    styleJson.musicListItemInfo.author.fontSize = 12;
    styleJson.musicListItemInfo.height = styleJson.musicListItem.height;
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
    GetRecentlyListenedPage({
      parm: {
        UserId: UserId,
        SortField: this.state.SortField,
        SortMethod: this.state.SortMethod,
        PageSize: this.state.PageSize,
        CurPage: this.state.CurPage,
      },
      beforeCallBack: () => {},
      responseCallBack: res => {
        console.log('GetRecentlyListenedPage res', res);
        res.then(resData => {
          if (resData !== null && typeof resData !== 'undefined') {
            console.log('GetRecentlyListenedPage response data', resData);
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

  gotoPlay = songId => {
    this.props.navigation.navigate('PlayPage', {songId: songId});
  };

  renderItem = ({index, item}) => {
    //console.log('this.popmenu');
    console.log('renderItem', item);
    return (
      <View style={styles.musicListItem}>
        <TouchableOpacity
          onPress={() => {
            this.gotoPlay(item.songId);
          }}>
          <Image style={styles.musicListItemCover} source={{uri: item.cover}} />
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

  //组件挂载事件
  componentDidMount() {
    console.log('componentDidMount');
    let UserId = this.props.UserId;
    if (UserId !== '' && typeof UserId !== 'undefined') {
      this.getPageData(UserId);
    }
  }

  render() {
    return (
      <View>
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
            keyExtractor={item => item.recordID}
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
