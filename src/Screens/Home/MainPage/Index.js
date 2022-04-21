import { StyleSheet, Text, View,Pressable  } from 'react-native';
import React from 'react';
import Groups from '../Groups/Index'
// import Groups from '../../../navigation/GroupStack'
import Header from '../Groups/Header';
import COLORS from '../../../GlobalStyles'

import { useSelector, useDispatch } from 'react-redux'
import { changeName } from '../../../redux/user'

const Index = ({navigation}) => {

  const name = useSelector((state) => state.user.name)
  const dispatch = useDispatch()


  const changeNameHandler = ()=>{
   dispatch(changeName())
  }

  return (
     <View style={{flex:1, backgroundColor:'#fff', }}>
      <Header name={name}  changeNameHandler={changeNameHandler} navigation={navigation} />
      <Groups  navigation={navigation} />
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  headerText: {
    fontSize: 20,
    textAlign: 'left',
  },

});
