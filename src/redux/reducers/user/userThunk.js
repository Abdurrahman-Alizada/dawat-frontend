import {createAsyncThunk} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-community/async-storage';
import {instance} from '../../axios';
// register new user
export const registerUser = createAsyncThunk(
  'user/registerUser',
  async user => {
    const {name, email, password, passwordConfirmation} = user;
    const {data} = await instance.post('/api/account/register', {
      name,
      email,
      password,
      passwordConfirmation,
    });

    console.log('register data is..', data);
    // if (data.email) {
    await AsyncStorage.setItem('isLoggedIn', 'login');
    await AsyncStorage.setItem('id', data._id);
    await AsyncStorage.setItem('token', data?.token);
    await AsyncStorage.setItem('userId', data?._id);
    await AsyncStorage.setItem('name', data?.name);
    await AsyncStorage.setItem('email', data?.email);
    user.navigation.navigate('Drawer');
    return data;
  },
);

export const loginUser = createAsyncThunk('user/login', async user => {
  const {email, password, navigation} = user;
  const {data} = await instance.post('/api/account/login', {
    email,
    password,
  });
  // console.log('login data is..', data);
  await AsyncStorage.setItem('isLoggedIn', 'login');
  await AsyncStorage.setItem('id', data._id);
  await AsyncStorage.setItem('token', data?.token);
  await AsyncStorage.setItem('userId', data?._id);
  await AsyncStorage.setItem('name', data?.name);
  await AsyncStorage.setItem('email', data?.email);
  navigation.navigate('Drawer');
});
export const Logout = createAsyncThunk('user/Logout', async navigation => {
  console.log('navigataion', navigation);
  await AsyncStorage.setItem('isLoggedIn', '0');
  await AsyncStorage.setItem('id', '');
  await AsyncStorage.setItem('token', '');
  await AsyncStorage.setItem('userId', '');
  await AsyncStorage.setItem('name', '');
  navigation.navigate('Auth');
});
