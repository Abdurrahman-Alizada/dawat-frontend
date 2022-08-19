import { StyleSheet, Text, View,Pressable  } from 'react-native';
import React from 'react';
import Groups from '../Groups/Index'
import Header from '../Groups/Header';

const Index = ({navigation}) => {

  return (
     <View style={{flex:1, backgroundColor:'#fff', }}>
      <Header  navigation={navigation} />
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
