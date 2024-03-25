import {createSlice} from '@reduxjs/toolkit';
import Storage from '../../../utils/storage';

const initialState = {
  isLogin: false,
  userInfo: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    uploadUser(state, userInfo) {
      console.log('uploadUser userInfo', userInfo);
      state.userInfo =
        userInfo.payload === null || typeof userInfo.payload === 'undefined'
          ? userInfo
          : userInfo.payload;
    },
    login(state, userInfo) {
      let userInfoLocal =
        userInfo.payload === null || typeof userInfo.payload === 'undefined'
          ? userInfo
          : userInfo.payload;
      state.isLogin = true;
      state.userInfo = userInfoLocal;
      console.log('login userInfoLocal', userInfoLocal);
      Storage.get('userInfo').then(storageUserInfo => {
        console.log('storageUserInfo', storageUserInfo);
        if (
          storageUserInfo === null ||
          typeof storageUserInfo === 'undefined' ||
          storageUserInfo.payload === null ||
          typeof storageUserInfo.payload === 'undefined'
        ) {
          if (
            userInfoLocal.payload === null ||
            typeof userInfoLocal.payload === 'undefined'
          ) {
            console.log('Storage payload', userInfoLocal);
            Storage.set('userInfo', {payload: userInfoLocal});
          } else if (
            userInfoLocal === null ||
            typeof userInfoLocal === 'undefined'
          ) {
            console.log('Storage', userInfoLocal);
            Storage.set('userInfo', userInfoLocal);
          }
        }
      });
    },
    logout(state) {
      console.log(' reducers logout ');
      state.isLogin = false;
      state.userInfo = null;
      Storage.delete('userInfo');
      console.log(' reducers logout ');
    },
  },
});

export const {login, logout, uploadUser} = userSlice.actions;

export default userSlice.reducer;
