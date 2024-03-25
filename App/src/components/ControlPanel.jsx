/* eslint-disable react-native/no-inline-styles */
// 此组件可根据具体需求自定义
import React, {Component} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Image,
  Alert,
  FlatList,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {logout} from '../redux/features/User/userSlice';
import {connect} from 'react-redux';
import Storage from '../utils/storage';

let styleJson = {
  container: {
    //flex: 1,
    padding: 0,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  logo: {
    width: 85,
    height: 85,
    resizeMode: 'stretch',
    marginVertical: 12,
    //marginVertical: 17,
    borderWidth: 0,
    borderColor: 'red',
  },
  logoTitle: {
    width: 118,
    height: 16,
    marginVertical: 7,
  },
  loginOrSign: {
    width: 138,
    height: 32,
    borderColor: 'white',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 23,
  },
  loginOrSignText: {
    fontSize: 13,
    color: '#fff',
    textAlign: 'center',
    marginVertical: 3,
    textAlignVertical: 'center',
    fontWeight: 'bold',
  },
  menuList: {
    width: 210,
    height: Dimensions.get('window').height - 315,
    marginVertical: 7,
    flexDirection: 'column',
    borderColor: 'red',
    borderWidth: 0,
  },
  menuItemActive: {
    width: 197,
    height: 37,
    flexDirection: 'row',
    //alignItems: 'flex-start',
    alignItems: 'center',
    borderColor: 'red',
    borderWidth: 0,
    borderRadius: 7,
    marginVertical: 5,
    Icon: {
      marginVertical: 3,
      marginHorizontal: 7,
      color: 'white',
      iconSize: 27,
    },
    Text: {
      fontSize: 27,
      color: 'white',
      textAlign: 'left',
      marginHorizontal: 3,
    },
  },
  menuItemNormal: {
    width: 197,
    height: 37,
    flexDirection: 'row',
    //alignItems: 'flex-start',
    alignItems: 'center',
    marginVertical: 5,
    borderColor: 'red',
    borderWidth: 0,
    borderRadius: 7,
    Icon: {
      marginVertical: 3,
      marginHorizontal: 7,
      color: 'black',
      iconSize: 27,
    },
    Text: {
      fontSize: 27,
      color: 'black',
      textAlign: 'left',
      marginHorizontal: 3,
    },
  },
  headerContainer: {
    width: 210,
    height: 198,
    borderColor: 'red',
    borderWidth: 0,
    marginHorizontal: 0,
    alignItems: 'center',
    backgroundColor: '#35F2EE',
    borderBottomStartRadius: 15,
    borderBottomEndRadius: 15,
  },
  controlText: {
    color: 'black',
  },
  button: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
  },
};

function resizeMode(drawerWidth, userName) {
  let screenWidth = parseInt(Dimensions.get('window').width.toFixed(), 10);
  let screenHeight = parseInt(Dimensions.get('window').height.toFixed(), 10);
  //console.log('resizeMode drawerWidth', drawerWidth);
  styleJson.headerContainer.width = screenWidth - drawerWidth;
  let menuWidth = styleJson.headerContainer.width;
  styleJson.menuList.width = screenWidth - drawerWidth;
  styleJson.menuItemNormal.width = styleJson.menuList.width - 15;
  styleJson.menuItemActive.width = styleJson.menuList.width - 15;
  if (screenWidth <= 320 || screenHeight <= 426) {
    styleJson.logo.width = 56;
    styleJson.logo.height = 56;
    styleJson.headerContainer.height = 170;
    styleJson.loginOrSign.width = menuWidth - 70;
    styleJson.menuList.width - 5;
    styleJson.menuList.height = 170;
    styleJson.menuItemActive.Icon.iconSize = 15;
    styleJson.menuItemActive.Text = {
      fontSize: 17,
      color: 'white',
      textAlign: 'left',
      marginHorizontal: 3,
    };
    styleJson.menuItemActive.height = 25;
    styleJson.menuItemNormal.Icon.iconSize = 15;
    styleJson.menuItemNormal.Text = {
      fontSize: 17,
      color: 'black',
      textAlign: 'left',
      marginHorizontal: 3,
    };
    styleJson.menuItemNormal.height = 25;
  }
  if (userName !== '') {
    styleJson.loginOrSignText.fontSize = 15;
    styleJson.logo.width = 35;
    styleJson.logo.height = 35;
    styleJson.logo.marginVertical = 47;
    styleJson.logoTitle.height = 0;
    styleJson.loginOrSign.marginVertical += 45;
    //console.log(' ControlPanel resizeMode userName', userName);
  }
  return styleJson;
}

//抽屉菜单内容页
class ControlPanel extends Component {
  Logout = () => {
    let userInfo = this.props.userInfo;
    //console.log('ControlPanel Logout userInfo', userInfo);
    if (userInfo !== null && typeof userInfo !== 'undefined') {
      Alert.alert('确认', '是否退出登录', [
        {
          text: '是',
          onPress: () => {
            this.props.logout();
            this.setState();
          },
        },
        {
          text: '否',
          onPress: () => {},
        },
      ]);
    }
  };
  gotoPage = PageName => {
    this.props.navigation.navigate(PageName);
  };
  gotoPageAddAlbums = Action => {
    console.log('props', this.props);
    this.props.navigation.navigate('AlbumsEdit', {
      albums: null,
      Action,
      songData: null,
    });
  };
  constructor() {
    super();
    this.state = {
      currentIndex: 0,
      menuData: [
        {
          id: 0,
          title: '首页',
          routePath: 'Home',
          iconName: 'home',
          iconWidget: 'Icon',
          onPress: () => {
            this.gotoPage('Home');
          },
        },
        {
          id: 1,
          title: '音乐列表',
          routePath: 'MusicList',
          iconName: 'playlist-music-outline',
          iconWidget: 'MaterialIcon',
          onPress: () => {
            this.gotoPage('MusicList');
          },
        },
        {
          id: 2,
          title: '添加专辑',
          routePath: 'AddAlbums',
          iconName: 'add-circle',
          iconWidget: 'Icon',
          onPress: () => {
            Storage.get('userInfo').then(userInfo => {
              if (userInfo !== null && typeof userInfo !== 'undefined') {
                if (
                  userInfo.payload !== null ||
                  typeof userInfo.payload !== 'undefined'
                ) {
                  this.gotoPageAddAlbums('Add');
                } else {
                  Alert.alert('错误', '没有登录不能添加专辑');
                }
              } else {
                Alert.alert('错误', '没有登录不能添加专辑');
              }
            });
          },
        },
        {
          id: 3,
          title: '专辑分类',
          routePath: 'Albums',
          iconName: 'albums',
          iconWidget: 'Icon',
          onPress: () => {
            this.gotoPage('Albums');
          },
        },
        {
          id: 4,
          title: '关于程序',
          routePath: '',
          iconName: 'alert-circle',
          iconWidget: 'MaterialIcon',
          onPress: () => {
            this.gotoPage('About');
          },
        },
        {
          id: 5,
          title: '退出登录',
          routePath: '',
          iconName: 'exit',
          iconWidget: 'Icon',
          onPress: () => {
            this.Logout();
          },
        },
      ],
    };
  }
  gotoUserSetting = userName => {
    if (userName !== '') {
      this.props.navigation.navigate('UserSetting');
    }
  };
  renderItem = ({index, item}) => {
    //console.log('this.props', this.props);
    let currentIndex = -1;
    if (
      this.props.navigation !== null &&
      typeof this.props.navigation !== 'undefined'
    ) {
      const navigationState = this.props.navigation.getState();
      let routeName = navigationState.routeNames[navigationState.index];
      if (routeName === item.routePath) {
        //console.log(' navigationState routeName ', routeName);
        //console.log(' navigationState item.routePath ', item.routePath);
        currentIndex = index;
      }
      //console.log('navigationState', navigationState);
      //console.log('navigationState currentIndex', currentIndex);
    }
    return (
      <TouchableOpacity onPress={item.onPress}>
        {index === currentIndex ? (
          <LinearGradient
            colors={['#ff9a9e', '#fad0c4']}
            style={styleJson.menuItemActive}>
            {item.iconWidget === 'Icon' ? (
              <Icon
                style={styleJson.menuItemActive.Icon}
                name={item.iconName}
                size={styleJson.menuItemActive.Icon.iconSize}
              />
            ) : (
              <MaterialIcon
                style={styleJson.menuItemActive.Icon}
                name={item.iconName}
                size={styleJson.menuItemActive.Icon.iconSize}
              />
            )}
            <Text style={styleJson.menuItemActive.Text}>{item.title}</Text>
          </LinearGradient>
        ) : (
          <View style={styleJson.menuItemNormal}>
            {item.iconWidget === 'Icon' ? (
              <Icon
                style={styleJson.menuItemNormal.Icon}
                name={item.iconName}
                size={styleJson.menuItemNormal.Icon.iconSize}
              />
            ) : (
              <MaterialIcon
                style={styleJson.menuItemNormal.Icon}
                name={item.iconName}
                size={styleJson.menuItemNormal.Icon.iconSize}
              />
            )}
            <Text style={styleJson.menuItemNormal.Text}>{item.title}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };
  render() {
    let {closeDrawer, drawerWidth} = this.props; //菜单关闭事件
    let userName = '';
    let userInfo = null;
    let userFace = require('../images/Logo.png');
    if (
      this.props.userInfo !== null &&
      typeof this.props.userInfo !== 'undefined'
    ) {
      userInfo = this.props.userInfo;
      userName = userInfo.userName;
      userFace = {uri: userInfo.userFace};
    }
    //console.log('ControlPanel props', this.props);
    //console.log('ControlPanel userInfo', userInfo);
    const styles = StyleSheet.create(resizeMode(drawerWidth, userName));
    return (
      <ScrollView style={styles.container}>
        {/*头部B*/}
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => this.gotoUserSetting(userName)}>
            <Image
              style={[
                styles.logo,
                {
                  width: styleJson.logo.width,
                  height: styleJson.logo.height,
                  marginVertical: styleJson.logo.marginVertical,
                },
              ]}
              source={userFace}
            />
          </TouchableOpacity>
          {userName === '' ? (
            <Image
              style={styles.logoTitle}
              source={require('../images/SplashTitle.png')}
            />
          ) : (
            <></>
          )}
          {/*登录或注册B*/}
          {userName === '' ? (
            <LinearGradient
              colors={['#89f7fe', '#89f7fe']}
              style={styles.loginOrSign}>
              <TouchableOpacity onPress={() => this.gotoPage('NoAuth')}>
                <Text numberOfLines={1} style={styles.loginOrSignText}>
                  登录或注册
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          ) : (
            <View style={[styles.loginOrSign, {borderWidth: 0}]}>
              <Text numberOfLines={1} style={styles.loginOrSignText}>
                {userName}
              </Text>
            </View>
          )}
          {/*登录或注册E*/}
        </View>
        {/*头部E*/}
        {/*菜单列表B*/}
        <View style={styles.menuList}>
          <FlatList
            data={this.state.menuData}
            style={styles.menuList}
            renderItem={this.renderItem}
            keyExtractor={item => item.id}
            horizontal={false} //是否水平布局模式
          />
        </View>
        {/*菜单列表E*/}
      </ScrollView>
    );
  }
}

/*
 1.mapStateToProps函数返回的是一个对象
 2.返回的对象中的key就作为传递给UI组件props的key,value就作为传递给UI组件props的value
 3.mapStateToProps用于传递状态
 */
function mapStateToProps(state) {
  return {userInfo: state.user.userInfo};
}

/*
1.mapDispathToProps函数返回的是一个对象
2.返回的对象中的key就作为传递给UI组件props的key,value就作为传递给UI组件props的value
3.mapDispathToProps用于传递操作状态的方法
*/
function mapDispathToProps(dispatch) {
  //通知redux执行加法
  return {
    logout: number => dispatch(logout()),
  };
}

export default connect(mapStateToProps, mapDispathToProps)(ControlPanel);
