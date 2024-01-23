import AsyncStorage from '@react-native-async-storage/async-storage';

export default token = async () => {
  const aa = await AsyncStorage.getItem('token');
  return aa;
};
