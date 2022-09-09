import React, {useState, useRef} from 'react';
import {Image, StyleSheet, Text, View, FlatList, Alert} from 'react-native';
import renderItem from './SingleTask';
import {FAB} from 'react-native-elements';
import {useSelector, useDispatch} from 'react-redux';
import {Modalize} from 'react-native-modalize';
import {height} from '../../../../../GlobalStyles';

const modalHeight = height * 0.7;

const Task = () => {
  const groupList = useSelector(state => state.groups);

  const modalizeRef = useRef(null);

  const FABHandler = () => {
    modalizeRef.current?.open();
  };

  return (
    <View style={{backgroundColor: '#fff', flex: 1}}>
      <FlatList
        keyExtractor={item => item.id}
        data={groupList.tasks}
        renderItem={item => renderItem(item)}
      />

      <FAB
        onPress={() => FABHandler()}
        visible={true}
        placement="right"
        // title="Show"
        style={{
          position: 'absolute',
          zIndex: 1,
          paddingBottom: '5%',
        }}
        icon={{name: 'add', color: 'white'}}
        color="#334C8C"
      />
  
      <Modalize ref={modalizeRef} modalHeight={modalHeight}>
        {/* <AddInviti />    */}
      </Modalize>
    </View>
  );
};

export default Task;

const styles = StyleSheet.create({});
