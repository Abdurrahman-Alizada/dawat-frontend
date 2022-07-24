import React, {useState, useRef} from 'react'
import {Image, StyleSheet, Text, View, FlatList, Alert} from 'react-native'
import renderItem from './SingleInviti'
import { FAB, } from 'react-native-elements';
import { useSelector, useDispatch } from 'react-redux'
import AddInviti from './AddInviti'
import { Modalize } from 'react-native-modalize';
import { height } from '../../../../../GlobalStyles'

const modalHeight = height * 0.7;

const Groups = ({navigation}) => {

  const groupList = useSelector((state) => state.groups)
  
  const modalizeRef = useRef(null);

  const FABHandler = () => {
    modalizeRef.current?.open();
  };

  return (
    <View style={{backgroundColor:'#fff', flex:1}}>
  
    <FlatList 
    keyExtractor={item => item.id}
    data={groupList}
    renderItem={(item) => renderItem(item, navigation)}
 
    />

    <FAB
      onPress={()=> FABHandler() }
      visible={true}
      placement="right"
      // title="Show"
      style={{
        position: 'absolute',
        zIndex: 1,
        paddingBottom:'5%'
      }}
      icon={{ name: 'add', color: 'white' }}
      color="#334C8C"
    />
    
     <Modalize 
     ref={modalizeRef} 
     modalHeight={modalHeight}
    //  snapPoint={400}
    //  HeaderComponent={
    //   <View style={{alignSelf:'flex-end', paddingHorizontal:'5%'}}>
    //     <Text>Header</Text>
    //   </View>
    // }
    // withHandle={false} 
     >

      <AddInviti />   
     
     </Modalize>

    </View>
  )
}

export default Groups

const styles = StyleSheet.create({
  })