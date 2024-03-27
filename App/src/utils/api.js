//import axios from 'axios';
//import request from './request';
import axios from 'axios';

//部署api地址
export const host = 'http://180fad49.nat123.fun:34607/';

/**
 * 将对象转换为GET查询参数
 * @param {要转换的对象} parmObj
 * @returns GET参数字符串
 */
const getQueryParm = parmObj => {
  let result = '';
  if (parmObj === null || typeof parmObj === 'undefined') {
    return result;
  }
  for (var p in parmObj) {
    if (typeof parmObj[p] !== 'function') {
      if (
        parmObj[p] !== '' &&
        parmObj[p] != null &&
        typeof parmObj[p] !== 'undefined'
      ) {
        result += `${p}=${parmObj[p]}&`;
      }
    }
  }
  if (result !== '') {
    result = result.substring(0, result.length - 1);
  }
  return result;
};

/**
 * 获得返回参数
 * @param {原始参数} parmObj
 */
const getParam = parmObj => {
  if (parmObj === null || typeof parmObj === 'undefined') {
    return '';
  } else {
    return parmObj;
  }
};

/**
 * 新方法能获取上传进度
 * @param {方法参数} param0
 * @returns
 */
export const UploadAxiosSongFile = async ({
  parm,
  filePath,
  progressCallBack,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  const formData = new FormData();
  if (filePath === '' || typeof filePath === 'undefined') {
    return false;
  }
  let file = {
    uri: 'file://' + filePath,
    type: 'multipart/form-data',
    name: filePath || 'file',
  };
  formData.append('file', file);
  let response = null;
  let url = `${host}api/SongInfo/Upload/Song`;
  let querystr = '';
  console.log(' UploadAxiosSongFile filePath ', filePath);
  console.log(' UploadAxiosSongFile formData ', formData);
  querystr = getQueryParm(parm);
  if (querystr !== '') {
    url = url + '?' + querystr;
  }
  console.log('UploadAxiosSongFile url', url);
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack();
  }
  try {
    response = await axios.post(url, formData, {
      headers: {'Content-Type': 'multipart/form-data'},
      onUploadProgress: function (progressEvent) {
        let percentProgress =
          (progressEvent.loaded * 100) / progressEvent.total;
        console.log(`Upload Progress: ${Math.round(percentProgress)}%`);
        // 可以在这里更新用户界面以显示上传进度
        if (
          progressCallBack !== null &&
          typeof progressCallBack !== 'undefined'
        ) {
          progressCallBack(percentProgress.toFixed(2));
        }
      },
    });
    console.log('UploadAxiosSongFile response', response);
    if (responseCallBack !== null && typeof responseCallBack !== 'undefined') {
      responseCallBack(response);
    }
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error);
    }
  }
};

//编辑专辑数据
export const editAlbumApi = async ({
  parm,
  filePath,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  const formData = new FormData();
  console.log('editAlbumApi filePath', filePath);
  if (filePath !== '' && typeof filePath !== 'undefined') {
    if (filePath.toLowerCase().indexOf('http') === -1) {
      let file = {
        uri: filePath,
        type: 'multipart/form-data',
        name: filePath || 'file',
      };
      formData.append('file', file);
    } else if (filePath.toLowerCase().indexOf('http') !== -1) {
      formData.append('albumCover', filePath);
    }
  }
  if (parm !== null && typeof parm !== 'undefined') {
    formData.append('action', getParam(parm.action));
    formData.append('albumId', getParam(parm.albumId));
    formData.append('albumName', getParam(parm.albumName));
    formData.append('albumAuthor', getParam(parm.albumAuthor));
    formData.append('albumIntro', getParam(parm.albumIntro));
    formData.append('userId', getParam(parm.userId));
  }
  let response = null;
  let url = `${host}api/Album/EditAsync`;
  let querystr = '';
  console.log(' ediitAlbumApi filePath ', filePath);
  console.log(' ediitAlbumApi formData ', formData);
  querystr = getQueryParm(parm);
  if (querystr !== '') {
    url = url + '?' + querystr;
  }
  console.log('ediitAlbumApi filePath', filePath);
  console.log('ediitAlbumApi url', url);
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack();
  }
  try {
    console.log('ediitAlbumApi url 111', url);
    response = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    console.log('fetch response', response);
    if (responseCallBack !== null && typeof responseCallBack !== 'undefined') {
      responseCallBack(response.json());
    }
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error);
    }
  }
};

//上传用户头像
export const UploadUserFace = async ({
  parm,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  const formData = new FormData();
  const {UserId, filePath} = parm;
  if (filePath !== '' && typeof filePath !== 'undefined') {
    let file = {
      uri: filePath,
      type: 'multipart/form-data',
      name: filePath || 'file',
    };
    formData.append('file', file);
  }
  formData.append('UserId', UserId);
  let response = null;
  let url = `${host}api/User/Upload/UserFace`;
  console.log('UploadUserFace filePath', filePath);
  console.log('UploadUserFace url', url);
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack();
  }
  try {
    console.log('UploadUserFace url 111', url);
    response = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    console.log('fetch response', response);
    if (responseCallBack !== null && typeof responseCallBack !== 'undefined') {
      responseCallBack(response.json());
    }
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error);
    }
  }
};

/**
 * 旧上传文件方法无法获取进度
 * @param {参数集合} param0
 * @returns
 */
export const UploadSongFile = async ({
  parm,
  filePath,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  const formData = new FormData();
  if (filePath === '' || typeof filePath === 'undefined') {
    return false;
  }
  let file = {
    uri: 'file://' + filePath,
    type: 'multipart/form-data',
    name: filePath || 'file',
  };
  formData.append('file', file);
  let response = null;
  let url = `${host}api/SongInfo/Upload/Song`;
  let querystr = '';
  console.log(' UploadSongFile filePath ', filePath);
  console.log(' UploadSongFile formData ', formData);
  querystr = getQueryParm(parm);
  if (querystr !== '') {
    url = url + '?' + querystr;
  }
  console.log('UploadSongFile url', url);
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack();
  }
  try {
    console.log('UploadSongFile url 111', url);
    response = await fetch(url, {
      method: 'POST',
      body: formData,
      onprogress: event => {
        console.log('onprogress event', event);
        if (event.lengthComputable) {
          const progressPercentage = Math.round(
            (event.loaded / event.total) * 100,
          );
          console.log(`上传进度: ${progressPercentage}%`);
        }
      },
    });
    console.log('fetch response', response);
    if (responseCallBack !== null && typeof responseCallBack !== 'undefined') {
      responseCallBack(response.json());
    }
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error);
    }
  }
};

//查询专辑歌曲信息
export const queryAlbumSongData = async ({
  parm,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  let response = null;
  let url = `${host}api/SongInfo/Album/SongInfos`;
  let querystr = '';
  querystr = getQueryParm(parm);
  if (querystr !== '') {
    url = url + '?' + querystr;
  }
  console.log('queryAlbumSongData url', url);
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack();
  }
  try {
    console.log('queryAlbumSongData url 111', url);
    response = (
      await fetch(url, {
        method: 'GET',
      })
    ).json();
    if (responseCallBack !== null && typeof responseCallBack !== 'undefined') {
      responseCallBack(response);
    }
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error);
    }
  }
};

//专辑分页
export const queryAlbumPage = async ({
  parm,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  let response = null;
  let url = `${host}api/Album/Page`;
  let querystr = '';
  querystr = getQueryParm(parm);
  if (querystr !== '') {
    url = url + '?' + querystr;
  }
  console.log('queryAlbumPage url', url);
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack();
  }
  try {
    console.log('queryAlbumPage url 111', url);
    response = (
      await fetch(url, {
        method: 'GET',
      })
    ).json();
    if (responseCallBack !== null && typeof responseCallBack !== 'undefined') {
      responseCallBack(response);
    }
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error);
    }
  }
};

//歌曲信息分页
export const querySongInfoPage = async ({
  parm,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  let response = null;
  let url = `${host}api/SongInfo/Page`;
  let querystr = '';
  querystr = getQueryParm(parm);
  if (querystr !== '') {
    url = url + '?' + querystr;
  }
  console.log('querySongInfoPage url', url);
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack();
  }
  try {
    console.log('querySongInfoPage url 111', url);
    response = (
      await fetch(url, {
        method: 'GET',
      })
    ).json();
    if (responseCallBack !== null && typeof responseCallBack !== 'undefined') {
      responseCallBack(response);
    }
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error);
    }
  }
};

//常听专辑
export const recentlylistenedAlbum = async ({
  parm,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  let response = null;
  let url = `${host}api/Home/recentlylistenedAlbum`;
  let querystr = '';
  console.log('recentlylistenedAlbum url', url);
  if (parm !== null && typeof parm !== 'undefined') {
    const {userId, limit} = parm;
    if (userId !== '' && userId != null && typeof userId !== 'undefined') {
      querystr += `userId=${userId}&`;
    }
    if (limit !== null && typeof limit !== 'undefined') {
      querystr += `limit=${limit}&`;
    }
  }
  if (querystr !== '') {
    querystr = querystr.substring(0, querystr.length - 1);
    url = `${url}?${querystr}`;
  }
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack();
  }
  try {
    console.log('recentlylistened url 111', url);
    response = (
      await fetch(url, {
        method: 'GET',
      })
    ).json();
    if (responseCallBack !== null && typeof responseCallBack !== 'undefined') {
      responseCallBack(response);
    }
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error);
    }
  }
};

//常听歌曲
export const recentlylistened = async ({
  parm,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  let response = null;
  let url = `${host}api/Home/recentlylistened`;
  let querystr = '';
  console.log('recentlylistened url', url);
  if (parm !== null && typeof parm !== 'undefined') {
    const {userId, limit} = parm;
    if (userId !== '' && userId != null && typeof userId !== 'undefined') {
      querystr += `userId=${userId}&`;
    }
    if (limit !== null && typeof limit !== 'undefined') {
      querystr += `limit=${limit}&`;
    }
  }
  if (querystr !== '') {
    querystr = querystr.substring(0, querystr.length - 1);
    url = `${url}?${querystr}`;
  }
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack();
  }
  try {
    console.log('recentlylistened url 111', url);
    response = (
      await fetch(url, {
        method: 'GET',
      })
    ).json();
    if (responseCallBack !== null && typeof responseCallBack !== 'undefined') {
      responseCallBack(response);
    }
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error);
    }
  }
};

//焦点图
export const focusImage = async ({
  parm,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  let response = null;
  let url = `${host}api/Home/focusImage`;
  let querystr = '';
  console.log('focusImage url', url);
  if (parm !== null && typeof parm !== 'undefined') {
    const {userId, limit} = parm;
    if (userId !== '' && userId != null && typeof userId !== 'undefined') {
      querystr += `userId=${userId}&`;
    }
    if (limit !== null && typeof limit !== 'undefined') {
      querystr += `limit=${limit}&`;
    }
  }
  if (querystr !== '') {
    querystr = querystr.substring(0, querystr.length - 1);
    url = `${url}?${querystr}`;
  }
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack();
  }
  try {
    console.log('focusImage url 111', url);
    response = (
      await fetch(url, {
        method: 'GET',
      })
    ).json();
    if (responseCallBack !== null && typeof responseCallBack !== 'undefined') {
      responseCallBack(response);
    }
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error);
    }
  }
};

//登录
export const Login = async ({
  parm,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  let response = null;
  let url = `${host}api/NoAuth/Login`;
  const {username, password, deviceId, deviceType} = parm;
  url = `${url}?username=${username}&password=${password}&deviceId=${deviceId}&deviceType=${deviceType}`;
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack();
  }
  try {
    response = (
      await fetch(url, {
        method: 'POST',
        /*headers: {
          'Content-Type': 'application/json',
        },*/
      })
    ).json();
    if (responseCallBack !== null && typeof responseCallBack !== 'undefined') {
      responseCallBack(response);
    }
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error);
    }
  }
};

//注册方法
export const Register = async ({
  dataObj,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  let response = null;
  let url = `${host}api/NoAuth/Register`;
  console.log('url', url);
  console.log('userInfo', dataObj);
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack();
  }
  try {
    response = (
      await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataObj),
      })
    ).json();
    if (responseCallBack !== null && typeof responseCallBack !== 'undefined') {
      responseCallBack(response);
    }
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error);
    }
  }
};

/**
 * 歌曲更改专辑
 * @param {
 *  parm,参数
    songIdAry,歌曲编号
    beforeCallBack,请求前事件
    responseCallBack,返回值
    errorCallback,错误消息
  } param0
 */
export const SongChangeAlbum = async ({
  parm,
  songIdAry,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  let response = null;
  let url = `${host}api/SongInfo/Change/Album`;
  let querystr = '';
  querystr = getQueryParm(parm);
  if (querystr !== '') {
    url = url + '?' + querystr;
  }
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack();
  }
  try {
    response = (
      await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(songIdAry),
      })
    ).json();
    if (responseCallBack !== null && typeof responseCallBack !== 'undefined') {
      responseCallBack(response);
    }
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error);
    }
  }
};

//检查登录状态
export const CheckLogin = async ({
  userInfo,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  let response = null;
  let url = `${host}api/NoAuth/CheckLogin`;
  console.log('url', url);
  console.log('api CheckLogin userInfo', userInfo);
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack();
  }
  try {
    response = (
      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInfo),
      })
    ).json();
    if (responseCallBack !== null && typeof responseCallBack !== 'undefined') {
      responseCallBack(response);
    }
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error);
    }
  }
};

//删除歌曲
export const DeteleSong = async ({
  parm,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  let response = null;
  let url = `${host}api/SongInfo/Delete`;
  let querystr = '';
  querystr = getQueryParm(parm);
  if (querystr !== '') {
    url = url + '?' + querystr;
  }
  console.log(' DeteleSong url ', url);
  console.log(' api DeteleSong parm ', parm);
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack();
  }
  try {
    response = (
      await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    ).json();
    if (responseCallBack !== null && typeof responseCallBack !== 'undefined') {
      responseCallBack(response);
    }
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error);
    }
  }
};

//清空专辑内的歌曲
export const AlbumClearSong = async ({
  parm,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  let response = null;
  let url = `${host}api/Album/Clear/Song`;
  let querystr = '';
  querystr = getQueryParm(parm);
  if (querystr !== '') {
    url = url + '?' + querystr;
  }
  console.log(' AlbumClearSong url ', url);
  console.log(' api AlbumClearSong parm ', parm);
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack();
  }
  try {
    response = (
      await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    ).json();
    if (responseCallBack !== null && typeof responseCallBack !== 'undefined') {
      responseCallBack(response);
    }
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error);
    }
  }
};

//删除专辑
export const AlbumDelete = async ({
  parm,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  let response = null;
  let url = `${host}api/Album/Delete`;
  let querystr = '';
  querystr = getQueryParm(parm);
  if (querystr !== '') {
    url = url + '?' + querystr;
  }
  console.log(' AlbumDelete url ', url);
  console.log(' api AlbumDelete parm ', parm);
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack();
  }
  try {
    response = (
      await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    ).json();
    if (responseCallBack !== null && typeof responseCallBack !== 'undefined') {
      responseCallBack(response);
    }
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error);
    }
  }
};

//获得播放页数据
export const GetPlayerData = async ({
  parm,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  let response = null;
  let url = `${host}api/PlayPage/Data`;
  let querystr = '';
  querystr = getQueryParm(parm);
  if (querystr !== '') {
    url = url + '?' + querystr;
  }
  console.log(' GetPlayerData url ', url);
  console.log(' api GetPlayerData parm ', parm);
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack();
  }
  try {
    response = (
      await fetch(url, {
        method: 'GET',
      })
    ).json();
    if (responseCallBack !== null && typeof responseCallBack !== 'undefined') {
      responseCallBack(response);
    }
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error);
    }
  }
};

/**
 * 歌曲评论分页方法
 * @param {分页参数} param0
 */
export const GetSongCommentPage = async ({
  parm,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  let response = null;
  let url = `${host}api/SongComment/Page`;
  let querystr = '';
  querystr = getQueryParm(parm);
  if (querystr !== '') {
    url = url + '?' + querystr;
  }
  console.log(' GetSongCommentPage url ', url);
  console.log(' api GetSongCommentPage parm ', parm);
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack();
  }
  try {
    response = (
      await fetch(url, {
        method: 'GET',
      })
    ).json();
    if (responseCallBack !== null && typeof responseCallBack !== 'undefined') {
      responseCallBack(response);
    }
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error);
    }
  }
};

/**
 * 发布歌曲评论
 * @param {发表参数} param0
 */
export const PublisherSongComment = async ({
  parm,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  let response = null;
  let url = `${host}api/SongComment/Add`;
  console.log(' PublisherSongComment url ', url);
  console.log(' api PublisherSongComment parm ', parm);
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack();
  }
  try {
    response = (
      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parm),
      })
    ).json();
    if (responseCallBack !== null && typeof responseCallBack !== 'undefined') {
      responseCallBack(response);
    }
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error);
    }
  }
};

/**
 * 最近收听分页
 * @param {分页参数} param0
 */
export const GetRecentlyListenedPage = async ({
  parm,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  let response = null;
  let url = `${host}api/Recently/Listened/Page`;
  let querystr = '';
  querystr = getQueryParm(parm);
  if (querystr !== '') {
    url = url + '?' + querystr;
  }
  console.log(' GetRecentlyListenedPage url ', url);
  console.log(' api GetRecentlyListenedPage parm ', parm);
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack();
  }
  try {
    response = (
      await fetch(url, {
        method: 'GET',
      })
    ).json();
    if (responseCallBack !== null && typeof responseCallBack !== 'undefined') {
      responseCallBack(response);
    }
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error);
    }
  }
};

/**
 * 获得收听历史分页
 * @param {分页参数} param0
 */
export const GetShareHistoryPage = async ({
  parm,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  let response = null;
  let url = `${host}api/Share/History/Page`;
  let querystr = '';
  querystr = getQueryParm(parm);
  if (querystr !== '') {
    url = url + '?' + querystr;
  }
  console.log(' GetShareHistoryPage url ', url);
  console.log(' api GetShareHistoryPage parm ', parm);
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack();
  }
  try {
    response = (
      await fetch(url, {
        method: 'GET',
      })
    ).json();
    if (responseCallBack !== null && typeof responseCallBack !== 'undefined') {
      responseCallBack(response);
    }
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error);
    }
  }
};

/**
 * 好友分页
 * @param {分页参数} param0
 */
export const GetFriendsPage = async ({
  parm,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  let response = null;
  let url = `${host}api/Friends/Page`;
  let querystr = '';
  querystr = getQueryParm(parm);
  if (querystr !== '') {
    url = url + '?' + querystr;
  }
  console.log(' GetFriendsPage url ', url);
  console.log(' api GetFriendsPage parm ', parm);
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack();
  }
  try {
    response = (
      await fetch(url, {
        method: 'GET',
      })
    ).json();
    if (responseCallBack !== null && typeof responseCallBack !== 'undefined') {
      responseCallBack(response);
    }
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error);
    }
  }
};

/**
 * 获取用户信息
 * @param {用户编号} param0
 */
export const GetUserInfoById = async ({
  parm,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  let response = null;
  let url = `${host}api/User/ById`;
  let querystr = '';
  querystr = getQueryParm(parm);
  if (querystr !== '') {
    url = url + '?' + querystr;
  }
  console.log(' GetUserInfoById url ', url);
  console.log(' api GetUserInfoById parm ', parm);
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack();
  }
  try {
    response = (
      await fetch(url, {
        method: 'GET',
      })
    ).json();
    if (responseCallBack !== null && typeof responseCallBack !== 'undefined') {
      responseCallBack(response);
    }
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error);
    }
  }
};

/**
 * 删除好友参数
 * @param {删除参数} param0
 */
export const DeleteFriend = async ({
  parm,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  let response = null;
  let url = `${host}api/Friends/Delete`;
  let querystr = '';
  querystr = getQueryParm(parm);
  if (querystr !== '') {
    url = url + '?' + querystr;
  }
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack();
  }
  try {
    response = (
      await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    ).json();
    if (responseCallBack !== null && typeof responseCallBack !== 'undefined') {
      responseCallBack(response);
    }
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error);
    }
  }
};

/**
 * 常听专辑分页
 * @param {分页参数} param0
 */
export const QueryRecentlyListenedAlbumPage = async ({
  parm,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  let response = null;
  let url = `${host}api/Album/Recently/Listened/Page`;
  let querystr = '';
  querystr = getQueryParm(parm);
  if (querystr !== '') {
    url = url + '?' + querystr;
  }
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack();
  }
  try {
    response = (
      await fetch(url, {
        method: 'GET',
      })
    ).json();
    if (responseCallBack !== null && typeof responseCallBack !== 'undefined') {
      responseCallBack(response);
    }
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error);
    }
  }
};

/**
 * 获取所有头像列表
 * @param {参数集合} param0
 */
export const GetUserFaces = async ({
  parm,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  let response = null;
  let url = `${host}api/File/UserFace`;
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack();
  }
  try {
    response = (
      await fetch(url, {
        method: 'GET',
      })
    ).json();
    if (responseCallBack !== null && typeof responseCallBack !== 'undefined') {
      responseCallBack(response);
    }
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error);
    }
  }
};

/**
 * 切换用户头像
 * @param {切换用户头像} param0
 */
export const ChangeUserFace = async ({
  parm,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  let response = null;
  let url = `${host}api/User/Change/UserFace`;
  console.log('url', url);
  console.log('ChangeUserFace parm', parm);
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack();
  }
  try {
    response = (
      await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parm),
      })
    ).json();
    if (responseCallBack !== null && typeof responseCallBack !== 'undefined') {
      responseCallBack(response);
    }
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error);
    }
  }
};

/**
 * 添加好友
 * @param {参数} param0
 */
export const AddFriend = async ({
  parm,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  let response = null;
  let url = `${host}api/Friends/Add/Friend`;
  console.log('url', url);
  console.log('AddFriend parm', parm);
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack();
  }
  try {
    response = (
      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parm),
      })
    ).json();
    if (responseCallBack !== null && typeof responseCallBack !== 'undefined') {
      responseCallBack(response);
    }
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error);
    }
  }
};

/**
 * 添加分享历史
 * @param {*} param0
 */
export const AddSharingHistory = async ({
  parm,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  let response = null;
  let url = `${host}api/Share/History/Add`;
  console.log('url', url);
  console.log('AddFriend parm', parm);
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack();
  }
  try {
    response = (
      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parm),
      })
    ).json();
    if (responseCallBack !== null && typeof responseCallBack !== 'undefined') {
      responseCallBack(response);
    }
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error);
    }
  }
};

/**
 * 增加专辑浏览次数
 * @param {参数} param0
 */
export const AddViewCount = async ({
  parm,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  let response = null;
  let url = `${host}api/Album/Add/ViewCount`;
  let querystr = '';
  querystr = getQueryParm(parm);
  if (querystr !== '') {
    url = url + '?' + querystr;
  }
  console.log('url', url);
  console.log('AddFriend parm', parm);
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack();
  }
  try {
    response = (
      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    ).json();
    if (responseCallBack !== null && typeof responseCallBack !== 'undefined') {
      responseCallBack(response);
    }
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error);
    }
  }
};

/**
 * 修改密码
 * @param {参数} param0
 */
export const EditPassword = async ({
  parm,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  let response = null;
  let url = `${host}api/User/Edit/Password`;
  console.log('url', url);
  console.log('EditPassword parm', parm);
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack();
  }
  try {
    response = (
      await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parm),
      })
    ).json();
    if (responseCallBack !== null && typeof responseCallBack !== 'undefined') {
      responseCallBack(response);
    }
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error);
    }
  }
};

/**
 * 编辑签名
 * @param {参数} param0
 */
export const editSignature = async ({
  parm,
  beforeCallBack,
  responseCallBack,
  errorCallback,
}) => {
  let response = null;
  let url = `${host}api/User/Edit/Signature`;
  console.log('url', url);
  console.log('editSignature parm', parm);
  if (beforeCallBack !== null && typeof beforeCallBack !== 'undefined') {
    beforeCallBack();
  }
  try {
    response = (
      await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parm),
      })
    ).json();
    if (responseCallBack !== null && typeof responseCallBack !== 'undefined') {
      responseCallBack(response);
    }
  } catch (error) {
    if (errorCallback !== null && typeof errorCallback !== 'undefined') {
      errorCallback(error);
    }
  }
};
