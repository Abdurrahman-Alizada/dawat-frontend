import React, {useState, useRef} from 'react';
import {Image, StyleSheet, Text, View, FlatList, Alert} from 'react-native';
import RenderItem from './SingleInviti';
import {FAB, Avatar} from 'react-native-elements';
import {useSelector, useDispatch} from 'react-redux';
import AddInviti from './AddInviti';
import {Modalize} from 'react-native-modalize';
import {height} from '../../../../../GlobalStyles';

const modalHeight = height * 0.7;

export default function Example() {
  const groupList = useSelector(state => state.groups);
  const modalizeRef = useRef(null);

  const FABHandler = () => {
    modalizeRef.current?.open();
  };

  return (
    <>
      <Text style={styles.sectionHeader}>Invited</Text>
      <FlatList
        numColumns={2}
        data={groupList}
        style={styles.gridView}
        renderItem={({item, section, index}) => <RenderItem item={item} />}
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
