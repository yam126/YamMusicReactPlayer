/* eslint-disable react-hooks/exhaustive-deps */
import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import React, {Component} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import {GetUserFaces, ChangeUserFace} from '../../utils/api';
import MiniLoading from '../../components/MiniLoading';
import {Image} from 'react-native-animatable';
import {useDispatch} from 'react-redux';
import Storage from '../../utils/storage';
import {uploadUser} from '../../redux/features/User/userSlice';

export default function Index(props) {
  const [data, setData] = React.useState({
    userId: '',
    isLoadComplete: false,
    faceImages: [],
  });
  const gotoBack = () => {
    props.navigation.goBack();
  };
  const getData = () => {
    GetUserFaces({
      parm: null,
      beforeCallBack: () => {},
      responseCallBack: res => {
        res.then(resData => {
          const {status, msg, result} = resData;
          if (status !== 0) {
            Alert.alert('错误', `读取头像数据出错,原因[${msg}]`);
          }
          setData({...data, isLoadComplete: true, faceImages: result});
        });
      },
      errorCallback: error => {
        Alert.alert('错误', `读取头像数据出错,原因[${error}]`);
      },
    });
  };
  React.useEffect(() => {
    getData();
  }, []);
  const onRefresh = () => {
    setData({...data, isLoadComplete: false});
    getData();
  };
  const gotoPage = (PageName, args) => {
    console.log('gotoPage props', props);
    console.log('gotoPage PageName', PageName);
    props.navigation.navigate(PageName, args);
  };
  const dispatch = useDispatch(); //获得调用redux中自定义方法的钩子
  const updateLocalUserFace = userInfoData => {
    let vUserInfo = {payload: userInfoData};
    dispatch(uploadUser(vUserInfo.payload));
    Storage.delete('userInfo', vUserInfo).then(() => {
      console.log('updateLocalUserFace props', props);
      Storage.set('userInfo', vUserInfo).then(() => {
        gotoPage('UserSetting', {userInfo: userInfoData});
      });
    });
  };
  const UpdateUserFace = (UserId, userFaceUrl) => {
    let args = {
      userId: UserId,
      userFaceUrl: userFaceUrl,
    };
    console.log('UpdateUserFace props', props);
    ChangeUserFace({
      parm: args,
      beforeCallBack: () => {},
      responseCallBack: res => {
        res.then(resData => {
          const {status, msg} = resData;
          console.log('ChangeUserFace resData', resData);
          if (status !== 0) {
            Alert.alert('错误', `上传头像失败，原因[${msg}]`);
          } else {
            let userInfo = props.route.params.userInfo;
            console.log('UpdateUserFace userInfo old', userInfo);
            userInfo.userFace = userFaceUrl;
            console.log('UpdateUserFace userInfo new', userInfo);
            updateLocalUserFace(userInfo);
          }
        });
      },
    });
  };
  const clickUserFace = userFaceUrl => {
    const UserId = props.route.params.userId;
    UpdateUserFace(UserId, userFaceUrl);
  };
  const renderItem = ({index, item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          clickUserFace(item);
        }}>
        <Image style={styles.faceImageItem} source={{uri: item}} />
      </TouchableOpacity>
    );
  };
  let loadingWidth = styles.faceListContainer.width;
  let loadingHeight = styles.faceListContainer.height;
  let loadingSize = 60;
  let faceImages = data.faceImages;
  return (
    <LinearGradient colors={['#12fff7', 'white']} style={styles.LinearGradient}>
      <View style={styles.barHeader}>
        <TouchableOpacity
          onPress={() => {
            gotoBack();
          }}>
          <Icon
            style={styles.forwardBack}
            name="chevron-back-outline"
            size={styles.forwardBack.iconSize}
          />
        </TouchableOpacity>
        <View style={styles.AppBarTitleContainer}>
          <Text numberOfLines={1} style={styles.AppBarTitle}>
            头像列表
          </Text>
        </View>
      </View>
      {!data.isLoadComplete ? (
        <MiniLoading
          Width={loadingWidth}
          Height={loadingHeight}
          Size={loadingSize}
        />
      ) : faceImages === null ||
        typeof faceImages === 'undefined' ||
        faceImages.length === 0 ? (
        <View style={styles.emptyContainer}>
          <TouchableOpacity
            onPress={() => {
              onRefresh();
            }}>
            <Text style={styles.emptyText}>用户头像数据为空,点击刷新</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.faceListContainer}>
          <FlatList data={faceImages} numColumns={3} renderItem={renderItem} />
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  linearGradient: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    flex: 1,
  },
  faceImageItem: {
    width: (Dimensions.get('window').width - 35) / 3,
    height: (Dimensions.get('window').width - 35) / 3,
    marginHorizontal: 3,
    marginVertical: 3,
    resizeMode: 'stretch',
    borderWidth: 0,
    borderColor: 'red',
  },
  faceListContainer: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 57,
    borderColor: 'red',
    borderWidth: 0,
  },
  emptyContainer: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 57,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 35,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  barHeader: {
    width: Dimensions.get('window').width,
    height: 55,
    flexDirection: 'row',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  AppBarTitleContainer: {
    width: Dimensions.get('window').width - 75,
    height: 37,
    marginVertical: 9,
    borderColor: 'red',
    borderWidth: 0,
  },
  AppBarTitle: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    paddingTop: 5,
  },
  forwardBack: {
    marginVertical: 10,
    iconSize: 35,
  },
});
