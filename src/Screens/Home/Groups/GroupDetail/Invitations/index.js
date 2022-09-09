import React, {useState, useRef, useEffect} from 'react';
import {Image, StyleSheet, Text, View, FlatList, Alert} from 'react-native';
import RenderItem from './SingleInviti';
import {FAB, Avatar} from 'react-native-elements';
import {useSelector, useDispatch} from 'react-redux';
import AddInviti from './AddInviti';
import {Modalize} from 'react-native-modalize';
import {height} from '../../../../../GlobalStyles';
import { allInvitations } from '../../../../../redux/reducers/groups/groupThunk'
import CustomLoader from '../../../../../Components/CustomLoader';

const modalHeight = height * 0.7;

export default function Example() {
  
  // const [animating, setAnimating] = useState(false); //State for ActivityIndicator animation
  const groupList = useSelector(state => state.groups);
  const animating = useSelector(state=> state.groups.invitationsLoader) 
  const modalizeRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(()=>{

    const getAllPosts = ()=>{
      dispatch(allInvitations())
    }
    getAllPosts()
  },[])

  const FABHandler = () => {
    modalizeRef.current?.open();
  };

  return (
    <>
      <Text style={styles.sectionHeader}>Invited</Text>
      <FlatList
        numColumns={2}
        data={groupList.invitations}
        style={styles.gridView}
        renderItem={({item, section, index}) => <RenderItem item={item} />}
      />
      {/* <CustomLoader animating={animating} /> */}

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
    </>
  );
}

const styles = StyleSheet.create({
  gridView: {
    padding: 10,
    flex: 1,
    width: '100%',
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    alignSelf: 'center',
  },
});
