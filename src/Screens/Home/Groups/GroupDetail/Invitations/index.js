import React, {useState, useRef} from 'react';
import {Image, StyleSheet, Text, View, FlatList, Alert} from 'react-native';
import RenderItem from './SingleInviti';
import {FAB, Avatar} from 'react-native-elements';
import {useSelector, useDispatch} from 'react-redux';
import AddInviti from './AddInviti';
import {Modalize} from 'react-native-modalize';
import {height} from '../../../../../GlobalStyles';
import {SectionGrid, FlatGrid} from 'react-native-super-grid';

const modalHeight = height * 0.7;

export default function Example() {
  const groupList = useSelector(state => state.groups);
  console.log(groupList);
  const modalizeRef = useRef(null);

  const FABHandler = () => {
    modalizeRef.current?.open();
  };

  return (
    <>
      <SectionGrid
        itemDimension={130}
        // staticDimension={300}
        // fixed
        // spacing={20}
        sections={[
          {
            title: 'To be Invited',
            data: groupList,
          },
          {
            title: 'Invited',
            data: groupList,
          },
        ]}
        style={styles.gridView}
        renderItem={({item, section, index}) => <RenderItem item={item} />}
        renderSectionHeader={({section}) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
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
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    alignSelf: 'center',
  },
});
