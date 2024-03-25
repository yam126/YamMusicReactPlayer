/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  Alert,
  RefreshControl,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import {
  querySongInfoPage,
  editAlbumApi,
  DeteleSong,
  AlbumClearSong,
} from '../../../utils/api';
import MiniLoading from '../../../components/MiniLoading';
import CustomAlertDialog from '../../../components/CustomAlertDialog';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Storage from '../../../utils/storage';
import CustomPopupMenu from '../../../components/CustomPopupMenu';

let styleJson = {
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    flexDirection: 'column',
    alignItems: 'center',
  },
  tabBarActive: {
    width: (Dimensions.get('window').width - 37) / 2,
    height: 55,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    center: {
      width: (Dimensions.get('window').width - 37) / 2 - 75,
      height: 37,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderColor: 'red',
      borderWidth: 0,
      iconSize: 27,
      IconColor: {
        color: '#4A79EB',
      },
      Text: {
        fontSize: 21,
        color: '#4A79EB',
        fontWeight: 'bold',
      },
    },
    borderBottomColor: '#4A79EB',
    borderBottomWidth: 3,
  },
  tabBarNormal: {
    width: (Dimensions.get('window').width - 37) / 2,
    height: 55,
    borderColor: 'red',
    borderWidth: 0,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    center: {
      width: (Dimensions.get('window').width - 37) / 2 - 75,
      height: 37,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderColor: 'red',
      borderWidth: 0,
      iconSize: 27,
      IconColor: {
        color: '#ccc',
      },
      Text: {
        fontSize: 21,
        color: '#ccc',
        fontWeight: 'bold',
      },
    },
  },
  tabBarContainer: {
    width: Dimensions.get('window').width - 37,
    height: 55,
    flexDirection: 'row',
    marginVertical: 10,
    borderColor: 'red',
    borderWidth: 0,
  },
  tabContainer: {
    width: Dimensions.get('window').width - 37,
    height: 467,
    flexDirection: 'column',
    borderColor: 'red',
    borderWidth: 0,
  },
  detailContainer: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 257,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    flexDirection: 'column',
    alignItems: 'center',
    borderTopStartRadius: 30,
    borderTopEndRadius: 30,
  },
  listContainer: {
    width: Dimensions.get('window').width - 37,
    height: 397,
    borderColor: 'red',
    borderWidth: 0,
  },
  operationPanel: {
    width: Dimensions.get('window').width - 37,
    height: 397,
    borderLeftColor: '#ACAC9D',
    borderLeftWidth: 1,
    borderRightColor: '#ACAC9D',
    borderRightWidth: 1,
    borderBottomColor: '#ACAC9D',
    borderBottomWidth: 1,
    borderBottomStartRadius: 10,
    borderBottomEndRadius: 10,
    buttonPanel: {
      width: Dimensions.get('window').width - 37,
      height: 361,
      flexDirection: 'column',
      borderColor: 'red',
      borderWidth: 0,
      buttonLine: {
        width: Dimensions.get('window').width - 37,
        height: 166,
        borderColor: 'red',
        borderWidth: 0,
        flexDirection: 'row',
        buttonItem: {
          width: (Dimensions.get('window').width - 37) / 2 - 75,
          height: 137,
          marginHorizontal: 35,
          marginVertical: 13,
          flexDirection: 'column',
          alignItems: 'center',
          borderColor: '#ccc',
          borderWidth: 1,
          borderRadius: 15,
          Icon: {
            marginVertical: 12,
            color: '#fff',
          },
          Text: {
            fontSize: 26,
            color: '#fff',
            fontWeight: 'bold',
          },
        },
      },
    },
    foldButton: {
      width: Dimensions.get('window').width - 37,
      height: 36,
      flexDirection: 'column',
      alignItems: 'center',
      borderColor: 'red',
      borderWidth: 0,
      centerPanel: {
        width: 167,
        height: 27,
        flexDirection: 'row',
        marginVertical: 3,
        borderWidth: 0,
        borderColor: 'red',
        Icon: {
          marginHorizontal: 3,
          marginVertical: 3,
          color: '#ACAC9D',
        },
        Text: {
          fontSize: 18,
          textAlign: 'center',
          color: '#ACAC9D',
        },
      },
    },
  },
  expandButton: {
    width: Dimensions.get('window').width - 37,
    height: 36,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 15,
    borderColor: '#ACAC9D',
    borderWidth: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10,
    centerPanel: {
      width: 167,
      height: 27,
      flexDirection: 'row',
      marginVertical: 3,
      borderWidth: 0,
      borderColor: 'red',
      Icon: {
        marginHorizontal: 3,
        marginVertical: 3,
        color: '#ACAC9D',
      },
      Text: {
        fontSize: 18,
        textAlign: 'center',
        color: '#ACAC9D',
      },
    },
  },
  listItemContainer: {
    width: Dimensions.get('window').width - 37,
    height: 97,
    flexDirection: 'row',
    borderBottomColor: '#ACAC9D',
    borderBottomWidth: 1,
    cover: {
      width: 76,
      height: 76,
      borderRadius: 10,
      marginHorizontal: 10,
      marginVertical: 8,
    },
    infoContainer: {
      width: Dimensions.get('window').width - 196,
      height: 87,
      borderColor: 'red',
      borderWidth: 0,
      flexDirection: 'column',
      marginHorizontal: 6,
      marginVertical: 6,
      songName: {
        fontSize: 26,
        color: 'black',
        fontWeight: 'bold',
        marginHorizontal: 7,
        marginVertical: 3,
      },
      author: {
        fontSize: 17,
        color: 'black',
        marginHorizontal: 7,
        marginVertical: 3,
      },
    },
    menuIcon: {
      marginVertical: 26,
      iconSize: 35,
    },
  },
  orderButton: {
    width: 25,
    height: 15,
    //iconSize: 35,
    marginHorizontal: Dimensions.get('window').width - 217,
    marginVertical: 31,
  },
  controlContainer: {
    width: Dimensions.get('window').width - 37,
    height: 67,
    flexDirection: 'row',
    borderBottomColor: '#ACAC9D',
    borderBottomWidth: 1,
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
  albumInfoPanel: {
    width: Dimensions.get('window').width - 35,
    height: 198,
    marginVertical: 15,
    backgroundColor: 'rgba(53, 242, 238, 0.3)',
    flexDirection: 'column',
    alignItems: 'center',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 15,
  },
  albumInfo: {
    width: Dimensions.get('window').width - 37,
    height: 198,
    flexDirection: 'row',
    marginVertical: 0,
    borderColor: 'red',
    borderWidth: 0,
  },
  albumStatistics: {
    width: Dimensions.get('window').width - 97,
    height: 76,
    flexDirection: 'row',
    marginVertical: 5,
    borderColor: 'red',
    borderWidth: 0,
    itemContainer: {
      minWidth: 127,
      maxWidth: 275,
      height: 76,
      flexDirection: 'column',
      alignItems: 'center',
      borderLeftColor: 'rgba(82, 82, 82, 0.8)',
      borderLeftWidth: 0.5,
      borderRightColor: 'rgba(82, 82, 82, 0.8)',
      borderRightWidth: 0.5,
      numberLabel: {
        textAlign: 'center',
        fontSize: 27,
        color: 'rgba(82, 82, 82, 0.8)',
      },
      textLabel: {
        textAlign: 'center',
        fontSize: 17,
        color: 'rgba(82, 82, 82, 0.8)',
      },
    },
  },
  albumCover: {
    width: 175,
    height: 175,
    backgroundColor: 'rgba(204,204,204,0.8)',
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginHorizontal: 29,
    marginVertical: 12,
    borderRadius: 10,
    iconSize: 56,
  },
  albumInfoContent: {
    width: Dimensions.get('window').width - 279,
    height: 175,
    marginVertical: 9,
    flexDirection: 'column',
    alignItems: 'center',
    marginHorizontal: -5,
    borderColor: 'red',
    borderWidth: 0,
    albumName: {
      fontSize: 25,
      color: 'rgba(82, 82, 82, 0.8)',
      fontWeight: 'bold',
      marginVertical: 23,
      textAlign: 'center',
    },
    albumAuthor: {
      fontSize: 15,
      color: 'rgba(82, 82, 82, 0.8)',
      marginVertical: 23,
      textAlign: 'center',
    },
    albumCreateTime: {
      fontSize: 17,
      color: 'rgba(82, 82, 82, 0.8)',
      marginVertical: 5,
      marginHorizontal: 5,
      textAlign: 'left',
    },
  },
  barHeader: {
    width: Dimensions.get('window').width,
    height: 55,
    //backgroundColor: '#35F2EE',
    backgroundColor: 'rgba(53, 242, 238, 0.3)',
    flexDirection: 'row',
    borderBottomColor: '#fff',
    borderBottomWidth: 1,
  },
  appBarTitleContainer: {
    width: Dimensions.get('window').width - 85,
    height: 55,
    borderColor: 'red',
    borderWidth: 0,
  },
  appBarTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 9,
    textAlignVertical: 'center',
    color: 'rgba(82, 82, 82, 0.8)',
  },
  forwardBack: {
    marginVertical: 10,
  },
};

function resizeMode() {
  let screenWidth = Dimensions.get('window').width.toFixed();
  let screenHeight = Dimensions.get('window').height.toFixed();
  if (parseInt(screenWidth, 10) <= 320 || parseInt(screenHeight, 10) <= 426) {
    styleJson.albumCover.width = 57;
    styleJson.albumCover.height = 57;
    styleJson.albumCover.iconSize = 35;
    styleJson.albumCover.marginHorizontal = 8;
    styleJson.albumInfoContent.width =
      styleJson.albumInfo.width - styleJson.albumCover.width - 25;
    styleJson.albumInfoContent.marginHorizontal = 3;
    styleJson.albumInfoContent.height = 57;
    styleJson.albumInfoContent.albumName.fontSize = 15;
    styleJson.albumInfoContent.albumName.marginVertical = 3;
    styleJson.albumInfoContent.albumAuthor.marginVertical = 5;
    styleJson.albumInfo.height = 87;
    styleJson.albumInfoPanel.height = 87;
    //styleJson.detailContainer.borderWidth = 1;
    styleJson.detailContainer.height =
      screenHeight - styleJson.albumInfoPanel.height - 10;
    //let detailContainerHeight = styleJson.detailContainer.height;
    styleJson.tabContainer.borderWidth = 0;
    styleJson.tabContainer.marginVertical = -12;
    styleJson.tabContainer.height = 160;
    styleJson.listContainer.height = 160;
    styleJson.listItemContainer.menuIcon.iconSize = 15;
    styleJson.listItemContainer.infoContainer.songName.fontSize = 21;
    styleJson.orderButton.width = 37;
    styleJson.orderButton.height = 21;
    styleJson.tabBarNormal.height = 37;
    styleJson.tabBarNormal.center.iconSize = 15;
    styleJson.tabBarNormal.center.Text.fontSize = 15;
    styleJson.tabBarActive.height = 37;
    styleJson.tabBarActive.center.Text.fontSize = 15;

    //styleJson.orderButton.iconSize = 35;
    //styleJson.orderButton.marginVertical = 25;
  } else if (screenWidth === 360 && screenHeight === 592) {
    styleJson.albumCover.width = 97;
    styleJson.albumCover.height = 97;
    styleJson.albumCover.iconSize = 35;
    styleJson.albumCover.marginHorizontal = 8;
    styleJson.albumInfoContent.width =
      styleJson.albumInfo.width - styleJson.albumCover.width - 25;
    styleJson.albumInfoContent.marginHorizontal = 3;
    styleJson.albumInfoContent.height = 97;
    styleJson.albumInfoContent.albumName.fontSize = 18;
    styleJson.albumInfoContent.albumName.marginVertical = 7;
    styleJson.albumInfoContent.albumAuthor.marginVertical = 5;
    styleJson.albumInfo.height = 123;
    styleJson.albumInfoPanel.height = 127;
    styleJson.detailContainer.height =
      screenHeight - styleJson.albumInfoPanel.height - 10;
    //let detailContainerHeight = styleJson.detailContainer.height;
    styleJson.tabContainer.height = 270;
    styleJson.listContainer.height = 200;
    styleJson.listItemContainer.menuIcon.iconSize = 25;
    styleJson.listItemContainer.infoContainer.songName.fontSize = 21;
    styleJson.orderButton.width = 37;
    styleJson.orderButton.height = 21;
    //styleJson.orderButton.iconSize = 35;
    //styleJson.orderButton.marginVertical = 25;
  } else if (screenWidth <= 392 || screenHeight <= 753) {
    styleJson.albumCover.width = 97;
    styleJson.albumCover.height = 97;
    styleJson.albumCover.iconSize = 35;
    styleJson.albumCover.marginHorizontal = 8;
    styleJson.albumInfoContent.width =
      styleJson.albumInfo.width - styleJson.albumCover.width - 25;
    styleJson.albumInfoContent.marginHorizontal = 3;
    styleJson.albumInfoContent.height = 97;
    styleJson.albumInfoContent.albumName.fontSize = 18;
    styleJson.albumInfoContent.albumName.marginVertical = 7;
    styleJson.albumInfoContent.albumAuthor.marginVertical = 5;
    styleJson.albumInfo.height = 123;
    styleJson.albumInfoPanel.height = 127;
    styleJson.detailContainer.height =
      screenHeight - styleJson.albumInfoPanel.height - 10;
    //let detailContainerHeight = styleJson.detailContainer.height;
    styleJson.tabContainer.height = 270;
    styleJson.listContainer.height = 370;
    styleJson.listItemContainer.menuIcon.iconSize = 25;
    styleJson.listItemContainer.infoContainer.songName.fontSize = 21;
    styleJson.orderButton.width = 37;
    styleJson.orderButton.height = 21;
  }
  return styleJson;
}

const styles = StyleSheet.create(resizeMode());

//歌曲列表
class SongListContainer extends Component {
  constructor() {
    super();
    this.state = {
      PageSize: 10,
      CurPage: 1,
      SqlWhere: '',
      isLoadComplete: false,
      nomore: false,
      PageData: null,
      DataCount: 0,
      PageCount: 0,
      SortField: 'createdatetime',
      SortMethod: 'ASC',
      refreshing: false, // 是否刷新标识
      errMsg: '',
      openMenuSelectedIndex: 0,
    };
  }

  //获得每页数据
  getPageData = () => {
    console.log('getPageData state', this.state);
    console.log('getPageData albumId', this.props.albumId);
    querySongInfoPage({
      parm: {
        SqlWhere: `albumId|[${this.props.albumId}]`,
        //SqlWhere: '',
        SortField: this.state.SortField,
        SortMethod: this.state.SortMethod,
        PageSize: this.state.PageSize,
        CurPage: this.state.CurPage,
      },
      beforeCallBack: () => {},
      responseCallBack: res => {
        console.log('querySongInfoPage res', res);
        res.then(resData => {
          if (resData !== null && typeof resData !== 'undefined') {
            console.log('querySongInfoPage response data', resData);
            const {status, result, msg, pageCount, recordCount} = resData;
            let PageData = this.state.PageData;
            let CurPage = this.state.CurPage;
            let PageSize = this.state.PageSize;
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
              PageData: PageData,
              DataCount: recordCount,
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
    let pageY = evt.nativeEvent.pageY;
    this.setState({openMenuSelectedIndex: index});
    this.getPosition(widgetPageY => {
      console.log('openMenu', index);
      console.log('evt', evt);
      console.log('evt.nativeEvent', evt.nativeEvent);
      let top = pageY - widgetPageY;
      let left = Dimensions.get('window').width - 252;
      console.log('top', top);
      this.popmenu.openMenu('popmenu-2', top, left);
    });
  };

  //单个歌曲模板
  renderItem = ({index, item}) => {
    return (
      <View style={styles.listItemContainer}>
        <Image
          style={styles.listItemContainer.cover}
          source={{uri: item.cover}}
        />
        <View style={styles.listItemContainer.infoContainer}>
          <Text
            numberOfLines={1}
            style={styles.listItemContainer.infoContainer.songName}>
            {item.title}
          </Text>
          <Text
            numberOfLines={1}
            style={styles.listItemContainer.infoContainer.author}>
            {item.artist}
          </Text>
        </View>
        <TouchableOpacity onPress={evt => this.openMenu(evt, index)}>
          <Icon
            style={styles.listItemContainer.menuIcon}
            name="ellipsis-vertical"
            color="rgba(82, 82, 82, 0.8)"
            size={styleJson.listItemContainer.menuIcon.iconSize}
          />
        </TouchableOpacity>
      </View>
    );
  };

  //空数据组件
  ListEmptyComponent = () => {
    let containerWidth = styleJson.listContainer.width;
    let containerHeight = styleJson.listContainer.height;
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
                歌单没有歌曲
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  //列表结尾组件
  ListFooterComponent = () => {
    let containerWidth = styleJson.listItemContainer.width;
    let containerHeight = styleJson.listItemContainer.height;
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
    this.getPageData();
  };

  //组件挂载方法
  componentDidMount() {
    console.log('SongListContainer this', this);
    this.getPageData();
  }

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

  Refresh = () => {
    this._onRefresh();
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
      callback(py);
      console.log(location);
    });
  };

  onOptionSelect = menuIndex => {
    let dataIndex = this.state.openMenuSelectedIndex;
    console.log('onOptionSelect menuIndex', menuIndex);
    console.log('onOptionSelect dataIndex', dataIndex);
    let selectedItemm = this.state.PageData[dataIndex];
    switch (menuIndex) {
      case 0:
        //删除歌单歌曲
        console.log('删除歌单歌曲 selectedItemm', selectedItemm);
        Alert.alert('确认删除', `确定要删除歌曲[${selectedItemm.title}]吗?`, [
          {
            text: '取消',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: '确定',
            onPress: () => {
              //TODO:调用歌曲删除方法
              DeteleSong({
                parm: {songId: selectedItemm.songId},
                beforeCallBack: () => {},
                responseCallBack: res => {
                  console.log('querySongInfoPage res', res);
                  res.then(resData => {
                    if (resData !== null && typeof resData !== 'undefined') {
                      console.log('DeteleSong response data', resData);
                      const {status, msg} = resData;
                      if (status !== 0) {
                        Alert.alert('错误', `删除歌曲出错,原因[$${msg}]`);
                      } else {
                        this._onRefresh();
                      }
                    }
                  });
                },
                errorCallback: error => {
                  Alert.alert('错误', `获取焦点数据出错,原因[${error}]`);
                },
              });
            },
          },
        ]);
        break;
    }
  };

  //渲染方法
  render() {
    let loadingSize = 55;
    return (
      <View
        ref={r => {
          this._ref = r;
        }}
        style={styles.listContainer}>
        <CustomPopupMenu
          name="popmenu-2"
          menu={this.popmenu}
          onOptionSelect={this.onOptionSelect}
          ref={r => (this.popmenu = r)}
          menuOptions={['删除歌曲']}
        />
        {this.state.isLoadComplete ? (
          <FlatList
            data={this.state.PageData}
            renderItem={this.renderItem}
            keyExtractor={item => item.songId}
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
            horizontal={false} //是否水平布局模式
          />
        ) : (
          <MiniLoading
            Width={styleJson.listContainer.width}
            Height={styleJson.listContainer.height}
            Size={loadingSize}
          />
        )}
      </View>
    );
  }
}

const downUpPopupItem = ['拍照(Camera)', '从相册选择(ImageLibrary)'];

class AlbumInfo extends React.Component {
  constructor() {
    super();
    this.state = {
      albums: null,
      Action: '',
      albumCover: '',
      albumCoverObject: null,
      bottomPopupIsShow: false,
      isPermissionsed: false,
    };
  }
  componentDidMount() {
    let {albums, Action} = this.props;
    let albumCover = '';
    console.log('AlbumInfo albums', albums);
    if (albums !== '' && typeof albums !== 'undefined' && Action === 'Edit') {
      albumCover = albums.albumCover;
    }
    console.log('AlbumInfo albumCover', albumCover);
    this.setState({albumCover: albumCover, albums: albums, Action: Action});
  }
  showButtomPopup = () => {
    this.setState({bottomPopupIsShow: true});
  };
  closeBottomPopup = show => {
    this.setState({bottomPopupIsShow: show});
  };

  /**
   * 验证权限
   */
  checkPermissions = async () => {
    let isPermissionsed = false;
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
            isPermissionsed = false;
          } else {
            isPermissionsed = true;
          }
          if (isPermissionsed) {
            const grantedWriteStorage = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
              {
                title: '申请写入文件权限',
                message: '需要申请写入文件权限',
                buttonPositive: 'OK',
              },
            );
            if (grantedWriteStorage !== PermissionsAndroid.RESULTS.GRANTED) {
              Alert.alert('没有文件写入授权无法进行后续操作');
              isPermissionsed = false;
            } else {
              isPermissionsed = true;
            }
          }
          if (isPermissionsed) {
            const grantedCamera = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.CAMERA,
              {
                title: '申请相机权限',
                message: '需要申请相机权限',
                buttonPositive: 'OK',
              },
            );
            if (grantedCamera !== PermissionsAndroid.RESULTS.GRANTED) {
              Alert.alert('没有文件写入授权无法进行后续操作');
              isPermissionsed = false;
            } else {
              isPermissionsed = true;
            }
          }
          this.setState({isPermissionsed: isPermissionsed});
          break;
      }
    } catch (exp) {
      Alert.alert('错误', `申请权限出错,原因[${exp}]`);
    }
  };

  /**
   * 底部弹出框回调函数
   * @param {选项索引} index
   */
  bottomPopupCallBack = index => {
    this.checkPermissions().then(() => {
      let isPermissionsed = this.state.isPermissionsed;
      let imagePickerOption = {
        mediaType: 'photo',
        quality: 0.5,
        maxWidth: Dimensions.get('window').width / 2,
        maxHeight: Dimensions.get('window').height / 2,
        selectionLimit: 1,
      };
      if (isPermissionsed) {
        console.log('bottomPopupCallBack index', index);
        switch (index) {
          case 0:
            //拍照
            launchCamera(imagePickerOption).then(result => {
              console.log('launchCamera result', result);
              this.setState(
                {
                  albumCover: result.assets[0].uri,
                  albumCoverObject: result.assets[0],
                  bottomPopupIsShow: false,
                },
                () => {
                  this.props.AlbumCoverChange(
                    result.assets[0].uri,
                    result.assets[0],
                  );
                },
              );
            });
            break;
          case 1:
            //从相册选择
            launchImageLibrary(imagePickerOption).then(result => {
              console.log('launchImageLibrary result', result);
              this.setState(
                {
                  albumCover: result.assets[0].uri,
                  albumCoverObject: result.assets[0],
                  bottomPopupIsShow: false,
                },
                () => {
                  this.props.AlbumCoverChange(
                    result.assets[0].uri,
                    result.assets[0],
                  );
                },
              );
            });
            break;
        }
      }
    });
  };
  render() {
    console.log(' AlbumInfo props', this.props);
    return (
      <>
        <Animatable.View animation={'fadeInDown'} style={styles.albumInfoPanel}>
          <View style={styles.albumInfo}>
            {/*上传封面按钮B*/}
            <TouchableOpacity
              onPress={() => {
                this.showButtomPopup();
              }}>
              {this.state.albumCover === '' ? (
                <View style={styles.albumCover}>
                  <Icon
                    name="cloud-upload"
                    size={styleJson.albumCover.iconSize}
                    color={'#fff'}
                  />
                </View>
              ) : (
                <ImageBackground
                  style={styles.albumCover}
                  source={{uri: this.state.albumCover}}>
                  <Icon
                    name="cloud-upload"
                    size={styleJson.albumCover.iconSize}
                    color={'#fff'}
                  />
                </ImageBackground>
              )}
            </TouchableOpacity>
            {/*上传封面按钮E*/}
            <View style={styles.albumInfoContent}>
              <Text numberOfLines={1} style={styles.albumInfoContent.albumName}>
                专辑封面
              </Text>
              <Text
                numberOfLines={2}
                style={styles.albumInfoContent.albumAuthor}>
                点击图片修改专辑封面
              </Text>
            </View>
          </View>
          <CustomAlertDialog
            entityList={downUpPopupItem}
            show={this.state.bottomPopupIsShow}
            callback={index => {
              this.bottomPopupCallBack(index);
            }}
            closeModal={show => {
              this.closeBottomPopup(show);
            }}
          />
        </Animatable.View>
      </>
    );
  }
}

let editStyleJson = {
  tabContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  inputItemContainer: {
    width: Dimensions.get('window').width - 77,
    height: 57,
    marginVertical: 23,
    backgroundColor: 'rgba(204, 204, 204, 0.8)',
    borderRadius: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    inputText: {
      width: Dimensions.get('window').width - 87,
      height: 56,
      fontSize: 21,
      fontWeight: 'bold',
      textAlign: 'left',
      borderColor: 'red',
      borderWidth: 1,
    },
    intro: {
      fontSize: 18,
      height: 215,
      marginVertical: 23,
      multiline: true,
    },
  },
};

function resizeModeEditPanel() {
  let screenWidth = Dimensions.get('window').width.toFixed();
  let screenHeight = Dimensions.get('window').height.toFixed();
  if (parseInt(screenWidth, 10) <= 320 || parseInt(screenHeight, 10) <= 426) {
    editStyleJson.inputItemContainer.marginVertical = 5;
    editStyleJson.inputItemContainer.height = 36;
    editStyleJson.inputItemContainer.inputText = 15;
    editStyleJson.inputItemContainer.inputText.fontSize = 12;
    editStyleJson.inputItemContainer.intro.height = 36;
    editStyleJson.inputItemContainer.intro.marginVertical = 0;
    editStyleJson.inputItemContainer.intro.fontSize = 12;
    editStyleJson.inputItemContainer.intro.multiline = false;
  } else if (screenWidth === 360 && screenHeight === 592) {
    editStyleJson.inputItemContainer.marginVertical = 5;
    editStyleJson.inputItemContainer.height = 43;
    editStyleJson.inputItemContainer.inputText = 37;
    editStyleJson.inputItemContainer.intro.height = 135;
    editStyleJson.inputItemContainer.intro.marginVertical = 5;
  } else if (screenWidth <= 384 || screenHeight <= 592) {
    editStyleJson.inputItemContainer.marginVertical = 5;
    editStyleJson.inputItemContainer.height = 43;
    editStyleJson.inputItemContainer.inputText = 37;
    editStyleJson.inputItemContainer.intro.height = 135;
    editStyleJson.inputItemContainer.intro.marginVertical = 5;
  } else if (
    parseInt(screenWidth, 10) >= 673 ||
    parseInt(screenHeight, 10) >= 793
  ) {
    editStyleJson.inputItemContainer.intro.height = 175;
    editStyleJson.inputItemContainer.intro.marginVertical = -31;
  }
  return editStyleJson;
}

const editStyles = StyleSheet.create(resizeModeEditPanel());

//编辑专辑内容
function EditContainer(props) {
  console.log(' EditContainer props ', props);
  let AlbumName = props.AlbumName;
  let AlbumAuthor = props.AlbumAuthor;
  let AlbumIntroValue = props.AlbumIntroValue;
  const AlbumNameChangeText = value => {
    props.AlbumNameChangeText(value);
  };
  const AlbumAuthorChangeText = value => {
    props.AlbumAuthorChangeText(value);
  };
  const AlbumIntroValueChangeText = value => {
    props.AlbumIntroValueChangeText(value);
  };
  return (
    <View style={[styles.tabContainer, editStyles.tabContainer]}>
      {/*专辑名称B*/}
      <View style={editStyles.inputItemContainer}>
        <TextInput
          placeholder="专辑名称"
          fontSize={editStyleJson.inputItemContainer.inputText.fontSize}
          style={editStyles.inputText}
          value={AlbumName}
          onChangeText={value => {
            AlbumNameChangeText(value);
          }}
        />
      </View>
      {/*专辑名称E*/}
      {/*专辑作者B*/}
      <View style={editStyles.inputItemContainer}>
        <TextInput
          placeholder="专辑作者"
          fontSize={editStyleJson.inputItemContainer.inputText.fontSize}
          style={editStyles.inputText}
          value={AlbumAuthor}
          onChangeText={value => {
            AlbumAuthorChangeText(value);
          }}
        />
      </View>
      {/*专辑作者E*/}
      {/*专辑简介B*/}
      <View
        style={[
          editStyles.inputItemContainer,
          {height: editStyleJson.inputItemContainer.intro.height},
        ]}>
        <TextInput
          placeholder="专辑简介"
          fontSize={editStyleJson.inputItemContainer.intro.fontSize}
          textAlign="left"
          textAlignVertical="top"
          justifyContent="top"
          multiline={editStyleJson.inputItemContainer.intro.multiline}
          maxLength={100}
          style={editStyles.inputText}
          value={AlbumIntroValue}
          onChangeText={value => {
            AlbumIntroValueChangeText(value);
          }}
        />
      </View>
      {/*专辑简介E*/}
    </View>
  );
}

function ListContainer(props) {
  const {albums, navigation, Action} = props;
  let albumId = props.albumId;
  let songListHandle = null;
  //if (albums !== null && typeof albums !== 'undefined') {
  //albumId = albums.albumId;
  //}
  const gotoPageNormal = PageRoute => {
    if (props.albumId !== '' && typeof props.albumId !== 'undefined') {
      albums.albumId = props.albumId;
    }
    console.log('Albums/Edit gotoPageNormal albums.albumId', albums.albumId);
    navigation.navigate(PageRoute, {albums: albums});
  };
  const ClearSong = albumId => {
    AlbumClearSong({
      parm: {
        albumId: albumId,
      },
      beforeCallBack: () => {},
      responseCallBack: res => {
        console.log('AlbumClearSong res', res);
        res.then(resData => {
          if (resData !== null && typeof resData !== 'undefined') {
            const {status, msg} = resData;
            if (status !== 0) {
              Alert.alert('错误', `清空歌单出错,原因[$${msg}]`);
            } else {
              Alert.alert('成功', '请刷新歌曲列表');
              if (
                songListHandle === null &&
                typeof songListHandle === 'undefined'
              ) {
                songListHandle.Refresh();
              }
            }
          }
        });
      },
      errorCallback: error => {
        Alert.alert('错误', `获取焦点数据出错,原因[${error}]`);
      },
    });
  };
  return (
    <View style={styles.tabContainer}>
      {/*控制层B*/}
      <View style={styles.controlContainer}>
        {/*导入歌曲B*/}
        <TouchableOpacity
          onPress={() => {
            console.log('ListContainer albumId', albumId);
            if (albumId !== '') {
              gotoPageNormal('SelectMethod');
            } else if (albumId === '') {
              Alert.alert('错误', '请先保存才能导入歌曲');
            }
          }}>
          <LinearGradient
            colors={['#02AAB0', '#00CDAC', '#02AAB0']}
            style={styles.playAlbumsButton}>
            <Icon
              style={styles.playAlbumsButton.Icon}
              name="download"
              size={styleJson.playAlbumsButton.Icon.iconSize}
            />
            <Text numberOfLines={1} style={styles.playAlbumsButton.Text}>
              导入歌曲
            </Text>
          </LinearGradient>
        </TouchableOpacity>
        {/*导入歌曲E*/}
        {/*排序按钮B*/}
        <TouchableOpacity
          onPress={() => {
            Alert.alert('确认清空', '确定要清空歌单吗?', [
              {
                text: '取消',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {
                text: '确认',
                onPress: () => {
                  ClearSong(albumId);
                },
                style: 'OK',
              },
            ]);
          }}>
          <MaterialIcon
            size={styleJson.orderButton.iconSize}
            style={[
              styles.orderButton,
              {
                with: styleJson.orderButton.width,
                height: styleJson.orderButton.height,
              },
            ]}
            name="broom"
          />
        </TouchableOpacity>
        {/*排序按钮E*/}
      </View>
      {/*控制层E*/}
      {/*列表层B*/}
      <SongListContainer
        ref={r => (songListHandle = r)}
        Action={Action}
        albumId={props.albumId}
      />
      {/*列表层E*/}
    </View>
  );
}

export default class Index extends React.Component {
  constructor() {
    super();
    this.state = {
      tabIndex: 0,
      Action: '',
      albumId: '',
      albums: null,
      albumCover: '',
      albumCoverObject: null,
      songData: null,
      AlbumName: '',
      AlbumAuthor: '',
      AlbumIntroValue: '',
    };
  }
  goBack = () => {
    if (
      this.props.navigation != null &&
      typeof this.props.navigation !== 'undefined'
    ) {
      this.props.navigation.goBack();
    }
  };
  gotoPageNormal = (PageRoute, albums) => {
    this.props.navigation.navigate(PageRoute, {albums: albums});
  };
  changeTab = tabIndex => {
    this.setState({tabIndex: tabIndex});
  };
  AlbumCoverChange = (albumCover, albumCoverObject) => {
    console.log('AlbumCoverChange albumCover', albumCover);
    console.log('AlbumCoverChange albumCoverObject', albumCoverObject);
    this.setState({albumCover: albumCover, albumCoverObject: albumCoverObject});
  };
  AlbumNameChangeText = value => {
    this.setState({AlbumName: value});
  };
  AlbumAuthorChangeText = value => {
    this.setState({AlbumAuthor: value});
  };
  AlbumIntroValueChangeText = value => {
    this.setState({AlbumIntroValue: value});
  };

  /**
   * 组件挂载方法
   */
  componentDidMount() {
    const {Action, albums, songData} = this.props.route.params;
    let albumId = '';
    let AlbumName = '';
    let AlbumAuthor = '';
    let AlbumIntroValue = '';
    console.log(' Albums Edit props ', this.props);
    console.log(' Albums Edit albums ', albums);
    if (Action === 'Add') {
      albumId = '';
      AlbumName = '';
      AlbumAuthor = '';
      AlbumIntroValue = '';
    } else if (Action === 'Edit') {
      albumId = albums.albumId;
      AlbumName = albums.albumName;
      AlbumAuthor = albums.albumAuthor;
      AlbumIntroValue = albums.albumIntro;
    }
    this.setState({
      Action: Action,
      albumId: albumId,
      albums: albums,
      AlbumName: AlbumName,
      AlbumAuthor: AlbumAuthor,
      AlbumIntroValue: AlbumIntroValue,
      songData: songData,
    });
  }

  /**
   * 保存专辑信息
   */
  saveAlbum = async () => {
    let Action = this.state.Action;
    let albums = this.state.albums;
    let AlbumName = this.state.AlbumName;
    let AlbumAuthor = this.state.AlbumAuthor;
    let AlbumIntroValue = this.state.AlbumIntroValue;
    let AlbumCover = this.state.albumCover;
    let checkEmpty = '';
    let userId = '';
    let albumId =
      albums === null || typeof albums === 'undefined' ? '' : albums.albumId;
    //Alert.alert('调试', '保存专辑');
    if (AlbumName === '') {
      checkEmpty += '专辑名称、';
    }
    if (AlbumAuthor === '') {
      checkEmpty += '专辑作者、';
    }
    if (AlbumIntroValue === '') {
      checkEmpty += '专辑简介、';
    }
    console.log('saveAlbum checkEmpty', checkEmpty);
    console.log('saveAlbum AlbumCover', AlbumCover);
    if (checkEmpty !== '') {
      Alert.alert('错误', `非空验证出错,原因[${checkEmpty}]不能为空`);
    } else {
      let userInfo = await Storage.get('userInfo');
      console.log('saveAlbum userInfo', userInfo);
      if (
        userInfo.payload !== null &&
        typeof userInfo.payload !== 'undefined'
      ) {
        userId = userInfo.payload.userId;
        console.log('saveAlbum userId', userId);
      }
      if (AlbumCover === '' && Action !== 'Add') {
        AlbumCover = albums.albumCover;
      }
      try {
        await editAlbumApi({
          parm: {
            action: Action,
            userId: userId,
            albumId: albumId,
            albumName: AlbumName,
            albumAuthor: AlbumAuthor,
            albumIntro: AlbumIntroValue,
          },
          filePath: AlbumCover,
          beforeCallBack: () => {},
          responseCallBack: res => {
            console.log('EdiitAlbum res', res);
            res.then(resData => {
              if (resData !== null && typeof resData !== 'undefined') {
                const {status, result, msg} = resData;
                if (status !== 0) {
                  Alert.alert('错误', `编辑专辑出错,原因[${msg}]`);
                } else if (status === 0) {
                  Alert.alert('成功', '保存成功');
                }
                albums = result;
                albumId = albums.albumId;
                this.setState({albumId: albumId, albums: albums});
              }
            });
          },
          errorCallback: error => {
            Alert.alert('错误', `保存出错,原因[${error}]`);
          },
        });
      } catch (exp) {
        Alert.alert('错误', `保存出错,原因[${exp}]`);
      }
    }
  };
  render() {
    const {Action, albums, songData} = this.props.route.params;
    let albumId = '';
    console.log('Index Action', Action);
    if (Action === 'Add') {
      albumId = '';
    } else {
      albumId = albums.albumId;
    }
    console.log('Index albumId', albumId);
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require('../../../images/PlayListBG.png')}
          style={styles.container}>
          {/*appBar B*/}
          <View style={styles.barHeader}>
            <TouchableOpacity
              onPress={() => {
                let albumsState = this.state.albums;
                if (
                  albumsState !== null &&
                  typeof albumsState !== 'undefined'
                ) {
                  this.gotoPageNormal('PlayList', albumsState);
                } else {
                  this.goBack();
                }
              }}>
              <Icon
                style={styles.forwardBack}
                name="chevron-back-outline"
                color="rgba(82, 82, 82, 0.8)"
                size={35}
              />
            </TouchableOpacity>
            <View style={styles.appBarTitleContainer}>
              <Text numberOfLines={1} style={styles.appBarTitle}>
                编辑专辑
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                //Alert.alert('调试', '保存专辑');
                this.saveAlbum();
              }}>
              <Icon
                style={styles.forwardBack}
                name="save"
                color="rgba(82, 82, 82, 0.8)"
                size={35}
              />
            </TouchableOpacity>
          </View>
          {/*appBar E*/}
          {/*专辑信息B*/}
          <AlbumInfo
            AlbumCoverChange={this.AlbumCoverChange}
            albums={albums}
            Action={Action}
          />
          {/*专辑信息E*/}
          {/*专辑详细信息B*/}
          <Animatable.View
            style={styles.detailContainer}
            animation={'fadeInUp'}>
            {/*切换控制B*/}
            <View style={styles.tabBarContainer}>
              <TouchableOpacity
                onPress={() => {
                  this.changeTab(0);
                }}>
                <View
                  style={
                    this.state.tabIndex === 0
                      ? styles.tabBarActive
                      : styles.tabBarNormal
                  }>
                  <View
                    style={
                      this.state.tabIndex === 0
                        ? styles.tabBarActive.center
                        : styles.tabBarNormal.center
                    }>
                    <Icon
                      style={
                        this.state.tabIndex === 0
                          ? styles.tabBarActive.center.IconColor
                          : styles.tabBarNormal.center.IconColor
                      }
                      name="create"
                      size={styleJson.tabBarNormal.center.iconSize}
                    />
                    <Text
                      style={
                        this.state.tabIndex === 0
                          ? styles.tabBarActive.center.Text
                          : styles.tabBarNormal.center.Text
                      }>
                      专辑信息
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.changeTab(1);
                }}>
                <View
                  style={
                    this.state.tabIndex === 1
                      ? styles.tabBarActive
                      : styles.tabBarNormal
                  }>
                  <View
                    style={
                      this.state.tabIndex === 1
                        ? styles.tabBarActive.center
                        : styles.tabBarNormal.center
                    }>
                    <MaterialIcon
                      name={'playlist-music'}
                      size={styleJson.tabBarNormal.center.iconSize}
                      style={
                        this.state.tabIndex === 1
                          ? styles.tabBarActive.center.IconColor
                          : styles.tabBarNormal.center.IconColor
                      }
                    />
                    <Text
                      style={
                        this.state.tabIndex === 1
                          ? styles.tabBarActive.center.Text
                          : styles.tabBarNormal.center.Text
                      }>
                      歌曲列表
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
            {/*切换控制E*/}
            {this.state.tabIndex === 0 ? (
              <EditContainer
                AlbumName={this.state.AlbumName}
                AlbumNameChangeText={this.AlbumNameChangeText}
                AlbumAuthor={this.state.AlbumAuthor}
                AlbumAuthorChangeText={this.AlbumAuthorChangeText}
                AlbumIntroValue={this.state.AlbumIntroValue}
                AlbumIntroValueChangeText={this.AlbumIntroValueChangeText}
                navigation={this.props.navigation}
                albums={albums}
                Action={Action}
              />
            ) : (
              <ListContainer
                albumId={this.state.albumId}
                navigation={this.props.navigation}
                albums={albums}
                songData={songData}
                Action={Action}
              />
            )}
          </Animatable.View>
          {/*专辑详细信息E*/}
        </ImageBackground>
      </View>
    );
  }
}
