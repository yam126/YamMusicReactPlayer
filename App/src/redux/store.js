//import {createStore, applyMiddleware} from 'redux';
///import reducers from './reducers';
//import reduxThunk from 'redux-thunk';
import {configureStore} from '@reduxjs/toolkit';
import userRedurcer from './features/User/userSlice';

//const store = createStore(reducers, applyMiddleware(reduxThunk));
const store = configureStore({
  reducer: {
    user: userRedurcer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      //关闭redux序列化检测
      serializableCheck: false,
    }),
});

export default store;
