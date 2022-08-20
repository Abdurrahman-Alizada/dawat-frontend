import React, {useEffect, useRef} from 'react';
import {StyleSheet, View, FlatList} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import RenderItem from './SingleGroup';
import Header from './Header';
import {FAB} from 'react-native-elements';
import {useSelector, useDispatch} from 'react-redux';
import AddGroup from './AddGroup';
import {Modalize} from 'react-native-modalize';
import {height} from '../../../GlobalStyles';
import { allGroups } from '../../../redux/reducers/groups/groupThunk'
import CustomLoader from '../../../Components/CustomLoader';

const modalHeight = height * 0.9;

const Groups = ({navigation}) => {
  const [userId, setuserId] = React.useState(null);
  const [isSearch, setIsSearch] = React.useState(false);
  const groupList = useSelector(state => state.groups);
  const animating = useSelector(state=> state.groups.groupLoader) 
  // console.log("in index is....",groupList)
  const dispatch = useDispatch();

  useEffect(() => {

    const getUserInfo = async () => {
      let userId = await AsyncStorage.getItem('userId');
      setuserId(userId);
      // console.log("user id is..", userId);
    };

    const getAllGroups = ()=>{
      dispatch(
        allGroups()
      )
    }

    getUserInfo();
    getAllGroups();

  }, []);

  const modalizeRef = useRef(null);

  const onOpen = () => {
    modalizeRef.current?.open();
  };

  const onClose = () => {
    modalizeRef.current?.close();
  };

  return (
    <View style={{backgroundColor: '#fff',flex:1}}>
      <CustomLoader animating={animating} />
      <Header navigation={navigation} isSearch={isSearch} setIsSearch={setIsSearch} />

      <FlatList
        keyExtractor={item => item._id}
        data={groupList.totalgroups}
        renderItem={item => RenderItem(item, navigation)}
      />

      <FAB
        onPress={onOpen}
        visible={true}
        // onPress={() => setVisible(true)}
        placement="right"
        // title="Show"
        style={{
          position: 'absolute',
          zIndex: 1,
        }}
        icon={{name: 'add', color: 'white'}}
        color="#334C8C"
      />

      <Modalize ref={modalizeRef} modalHeight={modalHeight}>
        <AddGroup navigation={navigation} onClose={onClose} />
      </Modalize>
    </View>
  );
};

export default Groups;

const styles = StyleSheet.create({});
