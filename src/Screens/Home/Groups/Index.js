import React, {useRef, useEffect} from 'react'
import {StyleSheet, View, FlatList} from 'react-native'
import RenderItem from './SingleGroup'
import Header from './Header';
import { FAB, } from 'react-native-elements';
import { useSelector, useDispatch } from 'react-redux'
import { changeName } from '../../../redux/user'
import AddGroup from './AddGroup'
import { Modalize } from 'react-native-modalize';
import { height } from '../../../GlobalStyles'
// import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust';

const modalHeight = height * 0.9

const Groups = ({navigation}) => {

  useEffect(()=>{
		// AndroidKeyboardAdjust.setAdjustNothing()
	});
	
  const name = useSelector((state) => state.user.name)  
  const groupList = useSelector((state) => state.groups)
  const dispatch = useDispatch()

  const changeNameHandler = ()=>{
    dispatch(changeName())
   }
 
  const modalizeRef = useRef(null);

  const onOpen = () => {
    modalizeRef.current?.open();
  };

  const onClose = () => {
    modalizeRef.current?.close();
  };

  return (
    <View style={{backgroundColor:'#fff', flex:1}}>
      <Header name={name}  changeNameHandler={changeNameHandler} navigation={navigation} />
    
      <FlatList 
      keyExtractor={item => item.id}
      data={groupList}
      renderItem={(item) => RenderItem(item, navigation)}
      />

    <FAB
      onPress={ onOpen }
      visible={true}
      // onPress={() => setVisible(true)}
      placement="right"
      // title="Show"
      style={{
        position: 'absolute',
        zIndex: 1,
    }}
      icon={{ name: 'add', color: 'white' }}
      color="#334C8C"
    />

      <Modalize ref={modalizeRef} modalHeight={modalHeight} >
       <AddGroup navigation={navigation} onClose={onClose} />
      </Modalize>

    </View>
  )
}

export default Groups

const styles = StyleSheet.create({
  })