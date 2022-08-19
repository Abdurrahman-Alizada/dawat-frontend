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
    // await AsyncStorage.setItem('token', data?.token);
    // await AsyncStorage.setItem('userId', data?._id);
    // await AsyncStorage.setItem('name', data?.name);
    // console.log("data is..", data)
    // user.navigation.navigate({
    //   name: 'Drawer',
    //   params: {
    //     user: 'jane',
    //   },
    // });
    if (data.email) {
      await AsyncStorage.setItem('name', data._id);
      user.navigation.navigate({
        name: 'Drawer',
        params: {
          user: 'jane',
        },
      });
      return data;
    } else {
      return null;
    }
  },
);
