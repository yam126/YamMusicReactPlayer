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
  Alert,
  RefreshControl,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {ScrollView} from 'react-native-gesture-handler';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import {querySongInfoPage, AlbumDelete} from '../../utils/api';
import MiniLoading from '../../components/MiniLoading';
import Storage from '../../utils/storage';
import {AddViewCount} from '../../utils/api';

let styleJson = {
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    flexDirection: 'column',
    alignItems: 'center',
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
            iconSize: 55,
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
          iconSize: 18,
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
        iconSize: 18,
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
    width: 20,
    height: 15,
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
      marginHorizontal: 7,
      marginVertical: 5,
      iconSize: 25,
    },
    Text: {
      fontSize: 17,
      fontWeight: 'bold',
      color: 'white',
      marginHorizontal: 5,
      marginVertical: 7,
    },
  },
  albumInfoPanel: {
    width: Dimensions.get('window').width - 35,
    height: 237,
    marginVertical: 15,
    backgroundColor: 'rgba(53, 242, 238, 0.3)',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 15,
  },
  albumInfo: {
    width: Dimensions.get('window').width - 37,
    height: 128,
    flexDirection: 'row',
    marginVertical: 8,
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
    width: 97,
    height: 97,
    marginHorizontal: 29,
    marginVertical: 12,
    borderRadius: 10,
  },
  albumInfoContent: {
    width: Dimensions.get('window').width - 239,
    height: 106,
    marginVertical: 8,
    flexDirection: 'column',
    marginHorizontal: 6,
    borderColor: 'red',
    borderWidth: 0,
    albumName: {
      fontSize: 31,
      color: 'rgba(82, 82, 82, 0.8)',
      fontWeight: 'bold',
      marginHorizontal: 5,
      textAlign: 'left',
    },
    albumAuthor: {
      fontSize: 21,
      color: 'rgba(82, 82, 82, 0.8)',
      marginHorizontal: 5,
      textAlign: 'left',
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
    iconSize: 35,
  },
};

function resizeMode() {
  let screenWidth = Dimensions.get('window').width.toFixed();
  let screenHeight = Dimensions.get('window').height.toFixed();
  if (parseInt(screenWidth, 10) <= 320 || parseInt(screenHeight, 10) <= 426) {
    styleJson.albumCover = {
      width: 47,
      height: 47,
      marginHorizontal: 19,
      marginVertical: 25,
      borderRadius: 10,
    };
    styleJson.albumInfoContent.marginVertical = 15;
    styleJson.albumInfoContent.width =
      styleJson.albumInfo.width - styleJson.albumCover.width - 61;
    styleJson.albumInfoContent.height = 77;
    styleJson.albumInfoContent.marginHorizontal = 3;
    styleJson.albumInfoContent.albumName.marginVertical = 5;
    styleJson.albumInfoContent.albumName.fontSize = 12;
    styleJson.albumInfoContent.albumAuthor.fontSize = 12;
    styleJson.albumInfoPanel.height = 98;
    styleJson.albumStatistics.width = 0;
    styleJson.albumStatistics.height = 0;
    styleJson.albumStatistics.marginVertical = -12;
    styleJson.albumStatistics.itemContainer.height = 33;
    styleJson.albumStatistics.itemContainer.numberLabel.fontSize = 12;
    styleJson.albumStatistics.itemContainer.textLabel.fontSize = 12;
    styleJson.albumStatistics.itemContainer.minWidth = 105;
    styleJson.playAlbumsButton.Icon.iconSize = 18;
    styleJson.playAlbumsButton.Text.fontSize = 12;
    styleJson.playAlbumsButton.Text.marginHorizontal = 3;
    styleJson.playAlbumsButton.width = 98;
    styleJson.playAlbumsButton.height = 32;
    styleJson.orderButton.width = 17;
    styleJson.orderButton.height = 12;
    styleJson.orderButton.marginVertical = 23;
    styleJson.orderButton.marginHorizontal =
      styleJson.controlContainer.width - styleJson.playAlbumsButton.width - 50;
    styleJson.detailContainer.height = screenHeight - 137;
    styleJson.controlContainer.height = 55;
    let controlContainerHeight = styleJson.controlContainer.height;
    let detailContainerHeight = styleJson.detailContainer.height;
    let listContainerrHeight = detailContainerHeight - controlContainerHeight;
    styleJson.operationPanel.height = listContainerrHeight - 55;
    styleJson.listContainer.height = listContainerrHeight - 55;
    styleJson.listItemContainer.cover.width = 56;
    styleJson.listItemContainer.cover.height = 56;
    styleJson.listItemContainer.menuIcon.iconSize = 25;
    let menuIconIconSize = styleJson.listItemContainer.menuIcon.iconSize;
    let listItemContainerWidth = styleJson.listItemContainer.width;
    let listItemContainerCoverWidth = styleJson.listItemContainer.cover.width;
    let listItemContainerInfoWidth =
      listItemContainerWidth -
      listItemContainerCoverWidth -
      menuIconIconSize -
      37;
    styleJson.listItemContainer.infoContainer.width =
      listItemContainerInfoWidth;
    styleJson.listItemContainer.infoContainer.songName.fontSize = 21;
    styleJson.listItemContainer.infoContainer.author.fontSize = 12;
    styleJson.listItemContainer.infoContainer.height = 65;
    styleJson.listItemContainer.height = 75;
    styleJson.expandButton.centerPanel.Icon.iconSize = 13;
    styleJson.expandButton.centerPanel.width = 155;
    styleJson.expandButton.centerPanel.height = 21;
    styleJson.expandButton.height = 31;
    styleJson.operationPanel.buttonPanel.height =
      styleJson.operationPanel.height - 20;
    styleJson.operationPanel.buttonPanel.buttonLine.buttonItem.Icon.iconSize = 25;
    styleJson.operationPanel.buttonPanel.buttonLine.buttonItem.Text.fontSize = 12;
    styleJson.operationPanel.buttonPanel.buttonLine.buttonItem.width =
      (screenWidth - 37) / 2 - 55;
    styleJson.operationPanel.buttonPanel.buttonLine.buttonItem.marginVertical = 5;
    styleJson.operationPanel.buttonPanel.buttonLine.buttonItem.marginHorizontal = 23;
    styleJson.operationPanel.buttonPanel.buttonLine.buttonItem.height = 87;
    styleJson.operationPanel.buttonPanel.buttonLine.height = 97;
    styleJson.operationPanel.foldButton.centerPanel.Icon.marginVertical = 1;
    styleJson.albumInfoContent.albumCreateTime.fontSize = 12;
    styleJson.barHeader = {
      width: Dimensions.get('window').width,
      height: 35,
      //backgroundColor: '#35F2EE',
      backgroundColor: 'rgba(53, 242, 238, 0.3)',
      flexDirection: 'row',
      borderBottomColor: '#fff',
      borderBottomWidth: 1,
    };
    styleJson.appBarTitleContainer = {
      width: Dimensions.get('window').width - 45,
      height: 35,
      borderColor: 'red',
      borderWidth: 0,
    };
    styleJson.appBarTitle = {
      fontSize: 12,
      fontWeight: 'bold',
      textAlign: 'center',
      marginVertical: 9,
      textAlignVertical: 'center',
      color: 'rgba(82, 82, 82, 0.8)',
    };
    styleJson.forwardBack = {
      marginVertical: 10,
      iconSize: 12,
    };
  } else if (screenWidth === 360 && screenHeight === 592) {
    styleJson.albumCover = {
      width: 77,
      height: 77,
      marginHorizontal: 29,
      marginVertical: 12,
      borderRadius: 10,
    };
    styleJson.albumInfoContent.width =
      styleJson.albumInfo.width - styleJson.albumCover.width - 65;
    styleJson.albumInfoContent.height = 98;
    styleJson.albumInfoContent.marginHorizontal = -3;
    styleJson.albumInfoContent.albumName.marginVertical = 5;
    styleJson.albumInfoContent.albumName.fontSize = 21;
    styleJson.albumInfoContent.albumAuthor.fontSize = 16;
    styleJson.albumInfoContent.albumCreateTime.fontSize = 12;
    styleJson.albumInfoPanel.height = 198;
    styleJson.albumStatistics.width = styleJson.albumInfo.width - 10;
    styleJson.albumStatistics.height = 53;
    styleJson.albumStatistics.marginVertical = -8;
    styleJson.albumStatistics.itemContainer.height = 53;
    styleJson.albumStatistics.itemContainer.numberLabel.fontSize = 21;
    styleJson.albumStatistics.itemContainer.minWidth = 105;
    styleJson.playAlbumsButton.Icon.iconSize = 18;
    styleJson.playAlbumsButton.Text.fontSize = 12;
    styleJson.playAlbumsButton.Text.marginHorizontal = 3;
    styleJson.playAlbumsButton.width = 98;
    styleJson.playAlbumsButton.height = 32;
    styleJson.orderButton.width = 17;
    styleJson.orderButton.height = 12;
    styleJson.orderButton.marginVertical = 23;
    styleJson.orderButton.marginHorizontal =
      styleJson.controlContainer.width - styleJson.playAlbumsButton.width - 50;
    styleJson.controlContainer.height = 55;
    let controlContainerHeight = styleJson.controlContainer.height;
    let detailContainerHeight = styleJson.detailContainer.height;
    let listContainerrHeight = detailContainerHeight - controlContainerHeight;
    styleJson.operationPanel.height = listContainerrHeight - 55;
    styleJson.listContainer.height = listContainerrHeight - 55;
    styleJson.listItemContainer.cover.width = 56;
    styleJson.listItemContainer.cover.height = 56;
    styleJson.listItemContainer.menuIcon.iconSize = 25;
    let menuIconIconSize = styleJson.listItemContainer.menuIcon.iconSize;
    let listItemContainerWidth = styleJson.listItemContainer.width;
    let listItemContainerCoverWidth = styleJson.listItemContainer.cover.width;
    let listItemContainerInfoWidth =
      listItemContainerWidth -
      listItemContainerCoverWidth -
      menuIconIconSize -
      37;
    styleJson.listItemContainer.infoContainer.width =
      listItemContainerInfoWidth;
    styleJson.listItemContainer.infoContainer.songName.fontSize = 21;
    styleJson.listItemContainer.infoContainer.author.fontSize = 12;
    styleJson.listItemContainer.infoContainer.height = 65;
    styleJson.listItemContainer.height = 75;
    styleJson.expandButton.centerPanel.Icon.iconSize = 13;
    styleJson.expandButton.centerPanel.width = 155;
    styleJson.expandButton.centerPanel.height = 21;
    styleJson.expandButton.height = 31;
    styleJson.operationPanel.buttonPanel.height =
      styleJson.operationPanel.height - 20;
    styleJson.operationPanel.buttonPanel.buttonLine.buttonItem.Icon.iconSize = 25;
    styleJson.operationPanel.buttonPanel.buttonLine.buttonItem.Text.fontSize = 16;
    styleJson.operationPanel.buttonPanel.buttonLine.buttonItem.width =
      (screenWidth - 37) / 2 - 75;
    styleJson.operationPanel.buttonPanel.buttonLine.buttonItem.marginVertical = 5;
    styleJson.operationPanel.buttonPanel.buttonLine.buttonItem.marginHorizontal = 35;
    styleJson.operationPanel.buttonPanel.buttonLine.buttonItem.height = 87;
    styleJson.operationPanel.buttonPanel.buttonLine.height = 97;
    styleJson.operationPanel.foldButton.centerPanel.Icon.marginVertical = 1;
  } else if (screenWidth <= 392 || screenHeight <= 753) {
    console.log('PlayList screenWidth', screenWidth);
    console.log('PlayList screenHeight', screenHeight);
    styleJson.albumCover = {
      width: 77,
      height: 77,
      marginHorizontal: 29,
      marginVertical: 12,
      borderRadius: 10,
    };
    styleJson.albumInfoContent.width =
      styleJson.albumInfo.width - styleJson.albumCover.width - 65;
    styleJson.albumInfoContent.height = 98;
    styleJson.albumInfoContent.marginHorizontal = -3;
    styleJson.albumInfoContent.albumName.marginVertical = 5;
    styleJson.albumInfoContent.albumName.fontSize = 21;
    styleJson.albumInfoContent.albumAuthor.fontSize = 16;
    styleJson.albumInfoPanel.height = 198;
    styleJson.albumStatistics.width = styleJson.albumInfo.width - 10;
    styleJson.albumStatistics.height = 53;
    styleJson.albumStatistics.marginVertical = -8;
    styleJson.albumStatistics.itemContainer.height = 53;
    styleJson.albumStatistics.itemContainer.numberLabel.fontSize = 21;
    styleJson.albumStatistics.itemContainer.minWidth = 105;
    styleJson.playAlbumsButton.Icon.iconSize = 18;
    styleJson.playAlbumsButton.Text.fontSize = 12;
    styleJson.playAlbumsButton.Text.marginHorizontal = 3;
    styleJson.playAlbumsButton.width = 98;
    styleJson.playAlbumsButton.height = 32;
    styleJson.orderButton.width = 17;
    styleJson.orderButton.height = 12;
    styleJson.orderButton.marginVertical = 23;
    styleJson.orderButton.marginHorizontal =
      styleJson.controlContainer.width - styleJson.playAlbumsButton.width - 50;
    styleJson.controlContainer.height = 55;
    let controlContainerHeight = styleJson.controlContainer.height;
    let detailContainerHeight = styleJson.detailContainer.height;
    let listContainerHeight = detailContainerHeight - controlContainerHeight;
    styleJson.operationPanel.height = listContainerHeight - 55;
    styleJson.listContainer.height = listContainerHeight - 55;
    styleJson.listItemContainer.cover.width = 56;
    styleJson.listItemContainer.cover.height = 56;
    styleJson.listItemContainer.menuIcon.iconSize = 25;
    let menuIconIconSize = styleJson.listItemContainer.menuIcon.iconSize;
    let listItemContainerWidth = styleJson.listItemContainer.width;
    let listItemContainerCoverWidth = styleJson.listItemContainer.cover.width;
    let listItemContainerInfoWidth =
      listItemContainerWidth -
      listItemContainerCoverWidth -
      menuIconIconSize -
      37;
    styleJson.listItemContainer.infoContainer.width =
      listItemContainerInfoWidth;
    styleJson.listItemContainer.infoContainer.songName.fontSize = 21;
    styleJson.listItemContainer.infoContainer.author.fontSize = 12;
    styleJson.listItemContainer.infoContainer.height = 65;
    styleJson.listItemContainer.height = 75;
    styleJson.expandButton.centerPanel.Icon.iconSize = 13;
    styleJson.expandButton.centerPanel.width = 155;
    styleJson.expandButton.centerPanel.height = 21;
    styleJson.expandButton.height = 31;
    styleJson.operationPanel.buttonPanel.height =
      styleJson.operationPanel.height - 20;
    styleJson.operationPanel.buttonPanel.buttonLine.buttonItem.Icon.iconSize = 55;
    styleJson.operationPanel.buttonPanel.buttonLine.buttonItem.Text.fontSize = 26;
    styleJson.operationPanel.buttonPanel.buttonLine.buttonItem.width =
      (screenWidth - 37) / 2 - 35;
    styleJson.operationPanel.buttonPanel.buttonLine.buttonItem.marginVertical = 9;
    styleJson.operationPanel.buttonPanel.buttonLine.buttonItem.marginHorizontal = 15;
    styleJson.operationPanel.buttonPanel.buttonLine.buttonItem.height = 127;
    styleJson.operationPanel.buttonPanel.buttonLine.height = 157;
    styleJson.operationPanel.foldButton.centerPanel.Icon.marginVertical = 2;
    styleJson.operationPanel.foldButton.marginVertical = -3;
    styleJson.operationPanel.foldButton.height = 35;
  } else if (
    parseInt(screenWidth, 10) <= 480 &&
    parseInt(screenHeight, 10) <= 854
  ) {
    return styleJson;
  } else if (
    parseInt(screenWidth, 10) >= 673 ||
    parseInt(screenHeight, 10) >= 793
  ) {
    styleJson.albumInfo.width = parseInt(screenWidth, 10) - 279;
    styleJson.albumInfoPanel.width = styleJson.albumInfo.width - 10;
    styleJson.albumInfoContent.width =
      styleJson.albumInfo.width - styleJson.albumCover.width - 75;
    styleJson.albumStatistics.width = styleJson.albumInfo.width - 5;
    let controlContainerHeight = styleJson.controlContainer.height;
    let detailContainerHeight = styleJson.detailContainer.height;
    let listContainerHeight = detailContainerHeight - controlContainerHeight;
    styleJson.operationPanel.height = listContainerHeight - 115;
    styleJson.listContainer.height = listContainerHeight - 115;
    styleJson.operationPanel.foldButton.marginVertical = -35;
  }
  return styleJson;
}

const styles = StyleSheet.create(resizeMode());

//歌曲列表
class SongListContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      PageSize: 10,
      CurPage: 1,
      SqlWhere: '',
      isLoadComplete: false,
      isLoadUpComplate: false,
      nomore: false,
      PageData: null,
      DataCount: 0,
      PageCount: 0,
      SortField: 'createdatetime',
      SortMethod: 'ASC',
      refreshing: false, // 是否刷新标识
      errMsg: '',
    };
  }
  renderItem = ({index, item}) => {
    return (
      <>
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
          {/*<TouchableOpacity>
            <Icon
              style={styles.listItemContainer.menuIcon}
              name="ellipsis-vertical"
              color="rgba(82, 82, 82, 0.8)"
              size={styles.listItemContainer.menuIcon.iconSize}
            />
          </TouchableOpacity>*/}
        </View>
        {/*index === this.state.PageData.length - 1 ? (
          <View style={styles.musicListItem}>{this.ListFooterComponent()}</View>
        ) : (
          <></>
        )*/}
      </>
    );
  };
  showOperationPanel = () => {
    this.props.changeExpandPanel();
  };

  //获得每页数据
  getPageData = () => {
    console.log('getPageData state', this.state);
    querySongInfoPage({
      parm: {
        SqlWhere: `albumId|[${this.props.albumId}]`,
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

  //列表尾组件
  ListFooterComponent = () => {
    let containerWidth = styles.listItemContainer.width;
    let containerHeight = styles.listItemContainer.height;
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

  //列表空数据组件
  ListEmptyComponent = () => {
    let containerWidth = styles.listContainer.width;
    let containerHeight = styles.listContainer.height;
    let tipsFontSize = 35;
    return (
      <View
        style={{
          width: containerWidth,
          height: containerHeight,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{fontSize: tipsFontSize, color: '#ccc', textAlign: 'center'}}>
          专辑没有歌曲
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

  componentDidMount() {
    this.getPageData();
  }

  changeSortMethod = SortMethod => {
    console.log('changeSortMethod SortMethod=', SortMethod);
    this.setState(
      {CurPage: 1, isLoadComplete: false, SortMethod: SortMethod},
      () => {
        this.getPageData();
      },
    );
  };

  render() {
    let {songData} = this.props;
    let loadingWidth = styles.listContainer.width;
    let loadingHeight = styles.listContainer.height;
    let loadingSize = 55;
    return (
      <View style={styles.listContainer}>
        {/*功能列表展开按钮B*/}
        <View style={styles.expandButton}>
          <TouchableOpacity
            onPress={() => {
              this.showOperationPanel();
            }}>
            <View style={styles.expandButton.centerPanel}>
              <Icon
                style={styles.expandButton.centerPanel.Icon}
                name="chevron-down-outline"
                size={styles.expandButton.centerPanel.Icon.iconSize}
              />
              <Text>点击展开功能列表</Text>
              <Icon
                style={styles.expandButton.centerPanel.Icon}
                name="chevron-down-outline"
                size={styles.expandButton.centerPanel.Icon.iconSize}
              />
            </View>
          </TouchableOpacity>
        </View>
        {/*功能列表展开按钮E*/}
        {!this.state.isLoadComplete ? (
          <MiniLoading
            Width={loadingWidth}
            Height={loadingHeight}
            Size={loadingSize}
          />
        ) : (
          <FlatList
            data={this.state.PageData}
            renderItem={this.renderItem}
            keyExtractor={item => item.songId}
            horizontal={false} //是否水平布局模式
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
          />
        )}
      </View>
    );
  }
}

function OperationButton(props) {
  return (
    <View
      style={[
        styles.operationPanel.buttonPanel.buttonLine.buttonItem,
        {backgroundColor: props.backgroundColor},
      ]}>
      <Icon
        name={props.iconName}
        style={styles.operationPanel.buttonPanel.buttonLine.buttonItem.Icon}
        size={
          styles.operationPanel.buttonPanel.buttonLine.buttonItem.Icon.iconSize
        }
      />
      <Text
        style={styles.operationPanel.buttonPanel.buttonLine.buttonItem.Text}>
        {props.text}
      </Text>
    </View>
  );
}

//操作列表
function OperationPanel(props) {
  const {navigation, albums, songData} = props;
  console.log('OperationPanel albums', albums);
  const showOperationPanel = () => {
    props.changeExpandPanel();
  };
  const gotoPage = Action => {
    console.log('props', props);
    navigation.navigate('AlbumsEdit', {albums, Action, songData});
  };
  const gotoPageNormal = PageRoute => {
    navigation.navigate(PageRoute, {albums: albums});
  };
  const gotoPageRoute = PageRoute => {
    navigation.navigate(PageRoute);
  };
  const gotoEdit = () => {
    Storage.get('userInfo').then(userInfo => {
      let userid = '';
      console.log('gotoEdit userInfo', userInfo);
      if (userInfo !== null && typeof userInfo !== 'undefined') {
        if (
          userInfo.payload === null ||
          typeof userInfo.payload === 'undefined'
        ) {
          Alert.alert('错误', '还没有登录请先登录');
        } else {
          userid = userInfo.payload.userId;
          if (albums.userid === userid) {
            gotoPage('Edit');
          } else {
            Alert.alert('错误', '这个专辑不是你添加的无法编辑');
          }
        }
      } else {
        Alert.alert('错误', '还没有登录请先登录');
      }
    });
  };
  const albumDeleteClick = albumId => {
    Storage.get('userInfo').then(userInfo => {
      let userid = '';
      if (userInfo !== null && typeof userInfo !== 'undefined') {
        if (
          userInfo.payload === null ||
          typeof userInfo.payload === 'undefined'
        ) {
          Alert.alert('错误', '还没有登录请先登录');
        } else {
          userid = userInfo.payload.userId;
          if (albums.userid === userid) {
            albumDelete(albumId);
          } else {
            Alert.alert('错误', '这个专辑不是你添加的无法删除');
          }
        }
      } else {
        Alert.alert('错误', '还没有登录请先登录');
      }
    });
  };
  const albumDelete = albumId => {
    Alert.alert('确认删除', '确定要删除专辑?', [
      {
        text: '取消',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: '确认',
        onPress: () => {
          AlbumDelete({
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
                    Alert.alert('错误', `删除歌单出错,原因[$${msg}]`);
                  } else {
                    Alert.alert('成功', '删除成功');
                    gotoPageRoute('Albums');
                  }
                }
              });
            },
            errorCallback: error => {
              Alert.alert('错误', `获取焦点数据出错,原因[${error}]`);
            },
          });
        },
        style: 'OK',
      },
    ]);
  };
  const gotoImportSong = PageRoute => {
    Storage.get('userInfo').then(userInfo => {
      console.log('gotoImportSong userInfo', userInfo);
      let userid = '';
      if (userInfo !== null && typeof userInfo !== 'undefined') {
        if (
          userInfo.payload === null ||
          typeof userInfo.payload === 'undefined'
        ) {
          Alert.alert('错误', '还没有登录请先登录');
        } else {
          userid = userInfo.payload.userId;
          if (albums.userid === userid) {
            gotoPageNormal(PageRoute);
          } else {
            Alert.alert('错误', '这个专辑不是你添加的无法编辑');
          }
        }
      } else {
        Alert.alert('错误', '还没有登录请先登录');
      }
    });
  };
  return (
    <View style={styles.operationPanel}>
      <View style={styles.operationPanel.buttonPanel}>
        <ScrollView
          horizontal={false}
          style={styles.operationPanel.buttonPanel}>
          <View style={styles.operationPanel.buttonPanel.buttonLine}>
            {/*添加按钮B*/}
            <TouchableOpacity
              onPress={() => {
                Storage.get('userInfo').then(userInfo => {
                  if (userInfo !== null && typeof userInfo !== 'undefined') {
                    if (
                      userInfo.payload !== null ||
                      typeof userInfo.payload !== 'undefined'
                    ) {
                      gotoPage('Add');
                    } else {
                      Alert.alert('错误', '没有登录不能添加专辑');
                    }
                  } else {
                    Alert.alert('错误', '没有登录不能添加专辑');
                  }
                });
              }}>
              <OperationButton
                iconName={'add-circle'}
                backgroundColor={'#03A9F4'}
                text={'添加专辑'}
              />
            </TouchableOpacity>
            {/*添加按钮E*/}
            {/*修改专辑B*/}
            <TouchableOpacity
              onPress={() => {
                gotoEdit();
              }}>
              <OperationButton
                iconName={'create'}
                backgroundColor={'#26A69A'}
                text={'修改专辑'}
              />
            </TouchableOpacity>
            {/*修改专辑E*/}
          </View>
          <View style={styles.operationPanel.buttonPanel.buttonLine}>
            <TouchableOpacity
              onPress={() => {
                gotoImportSong('SelectMethod');
              }}>
              <OperationButton
                iconName={'download'}
                backgroundColor={'#81D4FA'}
                text={'导入歌曲'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                let albumId = albums.albumId;
                Storage.get('userInfo').then(userInfo => {
                  let userid = '';
                  console.log('gotoEdit userInfo', userInfo);
                  if (userInfo !== null && typeof userInfo !== 'undefined') {
                    if (
                      userInfo.payload === null ||
                      typeof userInfo.payload === 'undefined'
                    ) {
                      Alert.alert('错误', '还没有登录请先登录');
                    } else {
                      userid = userInfo.payload.userId;
                      if (albums.userid === userid) {
                        albumDeleteClick(albumId);
                      } else {
                        Alert.alert('错误', '这个专辑不是你添加的无法删除');
                      }
                    }
                  } else {
                    Alert.alert('错误', '还没有登录请先登录');
                  }
                });
              }}>
              <OperationButton
                iconName={'trash'}
                backgroundColor={'#FF7043'}
                text={'删除专辑'}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      <View style={styles.operationPanel.foldButton}>
        <TouchableOpacity onPress={showOperationPanel}>
          <View style={styles.operationPanel.foldButton.centerPanel}>
            <Icon
              style={styles.operationPanel.foldButton.centerPanel.Icon}
              name="chevron-up-outline"
              size={styles.operationPanel.foldButton.centerPanel.Icon.iconSize}
            />
            <Text>点击折叠功能列表</Text>
            <Icon
              style={styles.operationPanel.foldButton.centerPanel.Icon}
              name="chevron-up-outline"
              size={styles.operationPanel.foldButton.centerPanel.Icon.iconSize}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

class AlbumInfo extends React.Component {
  constructor() {
    super();
    this.state = {
      viewCount: 0,
    };
  }
  componentDidMount() {
    let {albums} = this.props;
    AddViewCount({
      parm: {
        albumId: albums.albumId,
      },
      beforeCallBack: () => {},
      responseCallBack: res => {
        res.then(resData => {
          if (resData !== null && typeof resData !== 'undefined') {
            console.log('AddViewCount resData', resData);
            const {status, msg, result} = resData;
            if (status !== 0) {
              console.log('AddViewCount msg', msg);
            } else {
              this.setState({viewCount: result});
            }
          }
        });
      },
      errorCallback: error => {
        console.log('AddViewCount error', error);
      },
    });
  }
  render() {
    let {albums} = this.props;
    return (
      <Animatable.View animation={'fadeInDown'} style={styles.albumInfoPanel}>
        {/*专辑信息B*/}
        <View style={styles.albumInfo}>
          <Image source={{uri: albums.albumCover}} style={styles.albumCover} />
          <View style={styles.albumInfoContent}>
            <Text numberOfLines={1} style={styles.albumInfoContent.albumName}>
              {albums.albumName}
            </Text>
            <Text numberOfLines={1} style={styles.albumInfoContent.albumAuthor}>
              {albums.albumAuthor}
            </Text>
            <Text
              numberOfLines={1}
              style={styles.albumInfoContent.albumCreateTime}>
              {albums.createdatetime}
            </Text>
          </View>
        </View>
        {/*专辑信息E*/}
        {/*统计信息B*/}
        <View style={styles.albumStatistics}>
          <ScrollView horizontal={true}>
            {/*浏览次数B*/}
            <View style={styles.albumStatistics.itemContainer}>
              <Text
                numberOfLines={1}
                style={styles.albumStatistics.itemContainer.numberLabel}>
                {this.state.viewCount}
              </Text>
              <Text
                numberOfLines={1}
                style={styles.albumStatistics.itemContainer.textLabel}>
                浏览次数
              </Text>
            </View>
            {/*浏览次数E*/}
            {/*歌曲数量B*/}
            <View style={styles.albumStatistics.itemContainer}>
              <Text
                numberOfLines={1}
                style={styles.albumStatistics.itemContainer.numberLabel}>
                {albums.songLength}
              </Text>
              <Text
                numberOfLines={1}
                style={styles.albumStatistics.itemContainer.textLabel}>
                歌曲数量
              </Text>
            </View>
            {/*歌曲数量E*/}
            {/*分享次数B*/}
            <View style={styles.albumStatistics.itemContainer}>
              <Text
                numberOfLines={1}
                style={styles.albumStatistics.itemContainer.numberLabel}>
                {albums.shareCount}
              </Text>
              <Text
                numberOfLines={1}
                style={styles.albumStatistics.itemContainer.textLabel}>
                分享次数
              </Text>
            </View>
            {/*分享次数E*/}
          </ScrollView>
        </View>
        {/*统计信息E*/}
      </Animatable.View>
    );
  }
}

export default function Index(props) {
  let _songListHandle = null;
  const [data, setData] = React.useState({
    isExpandPanel: false,
    SortMethod: 'ASC',
    OrderAscIconPath: require('../../images/OrderAscMini.png'), //升序排列图标
    OrderDescIconPath: require('../../images/OrderDescMini.png'), //降序排列图标
    OrderIconPath: require('../../images/OrderAscMini.png'), //默认排列图标
  });
  const {navigation} = props;
  const {albums, songData} = props.route.params;
  console.log('props', props);
  console.log('albums', albums);
  const goBack = () => {
    if (navigation != null && typeof navigation !== 'undefined') {
      navigation.goBack();
    }
  };
  const changeExpandPanel = () => {
    if (data.isExpandPanel) {
      setData({...data, isExpandPanel: false});
    } else {
      setData({...data, isExpandPanel: true});
    }
    console.log('data.isExpandPanel', data.isExpandPanel);
  };

  //切换排序方式
  const changeSortMethod = () => {
    let SortMethod = data.SortMethod;
    let OrderIconPath = data.OrderAscIconPath;
    SortMethod = SortMethod === 'ASC' ? 'DESC' : 'ASC';
    if (SortMethod === 'ASC') {
      OrderIconPath = data.OrderAscIconPath;
    } else if (SortMethod === 'DESC') {
      OrderIconPath = data.OrderDescIconPath;
    }
    setData({...data, SortMethod: SortMethod, OrderIconPath: OrderIconPath});
    _songListHandle.changeSortMethod(SortMethod);
  };
  const gotoPlay = albumId => {
    props.navigation.navigate('PlayPage', {albumId: albumId});
  };
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../images/PlayListBG.png')}
        style={styles.container}>
        {/*appBar B*/}
        <View style={styles.barHeader}>
          <TouchableOpacity onPress={goBack}>
            <Icon
              style={styles.forwardBack}
              name="chevron-back-outline"
              color="rgba(82, 82, 82, 0.8)"
              size={styles.forwardBack.iconSize}
            />
          </TouchableOpacity>
          <View style={styles.appBarTitleContainer}>
            <Text numberOfLines={1} style={styles.appBarTitle}>
              {albums.title}
            </Text>
          </View>
          {/*<Icon
            style={styles.forwardBack}
            name="share-social-sharp"
            color="rgba(82, 82, 82, 0.8)"
            size={styles.forwardBack.iconSize}
          />*/}
        </View>
        {/*appBar E*/}
        {/*专辑信息B*/}
        <AlbumInfo albums={albums} />
        {/*专辑信息E*/}
        {/*专辑详细信息B*/}
        <Animatable.View style={styles.detailContainer} animation={'fadeInUp'}>
          {/*控制层B*/}
          <View style={styles.controlContainer}>
            {/*播放按钮B*/}
            <TouchableOpacity
              onPress={() => {
                gotoPlay(albums.albumId);
              }}>
              <LinearGradient
                colors={['#97e7a2', '#d8ff7e']}
                style={styles.playAlbumsButton}>
                <Icon
                  style={styles.playAlbumsButton.Icon}
                  name="caret-forward-circle"
                  size={styles.playAlbumsButton.Icon.iconSize}
                />
                <Text numberOfLines={1} style={styles.playAlbumsButton.Text}>
                  播放专辑
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            {/*播放按钮E*/}
            {/*排序按钮B*/}
            <TouchableOpacity
              onPress={() => {
                changeSortMethod();
              }}>
              <Image style={styles.orderButton} source={data.OrderIconPath} />
            </TouchableOpacity>
            {/*排序按钮E*/}
          </View>
          {/*控制层E*/}
          {/*列表层B*/}
          {data.isExpandPanel ? (
            <OperationPanel
              navigation={navigation}
              albums={albums}
              songData={songData}
              changeExpandPanel={changeExpandPanel}
            />
          ) : (
            <SongListContainer
              ref={ref => (_songListHandle = ref)}
              albumId={albums.albumId}
              songData={songData}
              changeExpandPanel={changeExpandPanel}
            />
          )}
          {/*列表层E*/}
        </Animatable.View>
        {/*专辑详细信息E*/}
      </ImageBackground>
    </View>
  );
}
