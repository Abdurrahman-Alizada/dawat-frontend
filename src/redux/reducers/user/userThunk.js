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

    console.log('data is..', data);
    // if (data.email) {
      await AsyncStorage.setItem('isLoggedIn', 'login');
      await AsyncStorage.setItem('id', data._id);
      await AsyncStorage.setItem('token', data?.token);
      await AsyncStorage.setItem('userId', data?._id);
      await AsyncStorage.setItem('name', data?.name);
      user.navigation.navigate({
        name: 'Drawer',
        params: {
          user: 'jane',
        },
      }).then(()=>{
        console.log("navigate")
      });
      return data;
    // } else {
    //   return null;
    // }
  },
);

export const Logout = createAsyncThunk('user/Logout', async (navigation) => {
  
  console.log(AsyncStorage.getItem("isLoggedIn")) 
    await AsyncStorage.setItem('isLoggedIn',"0");
    await AsyncStorage.setItem('id', "");
    await AsyncStorage.setItem('token', "");
    await AsyncStorage.setItem('userId', "");
    await AsyncStorage.setItem('name', "");
    // navigation.navigation.navigate({
    //   name: 'Auth',
    //   params: {
    //     user: 'jane',
    //   },
    // });
   
});
