import {View, Text, Image, Alert} from 'react-native';
import React, {useState} from 'react';
import {Button, Checkbox, Divider, List, useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAddGroupMutation, useAddMultipleGroupMutation} from '../../../redux/reducers/groups/groupThunk';

const SyncDataIndex = () => {
  const navigation = useNavigation();
  const theme = useTheme();

  const [groupChecked, setGroupChecked] = useState(true);
  const [guestsChecked, setGuestsChecked] = useState(true);
  const [tasksChecked, setTasksChecked] = useState(true);

  const [addMultipleGroup, {isLoading: addGroupLoading}] = useAddMultipleGroupMutation();

  const syncDataHandler = async () => {
    const Grp = JSON.parse(await AsyncStorage.getItem('groups'));
    if (!Grp?.length) {
      setGroupChecked(false);
      setGuestsChecked(false);
      setTasksChecked(false);
    }
    let groups = [];
    let groups1 = Grp;

    for (let i = 0; i < Grp?.length; i++) {
      if (Grp[i].isSyncd === false) {
        groups.push(Grp[i]);
        groups1.splice(i, 1);
      }
    }
    addMultipleGroup({
      groups: groups,
    })
      .then(async res => {
        if (res.data) {
          let newGroups = [...groups1, ...res.data];
          await AsyncStorage.setItem('groups', JSON.stringify(newGroups));
        }
      })
      .catch(err => {
        console.log("error in addMultipleGroup =>", err);
      })
      .finally(() => {
        navigation.navigate('Drawer', {
          sreen: 'Home',
        });
      });
  };

  return (
    <View style={{flex: 1, justifyContent: 'space-between'}}>
      <View>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Image
            style={{
              width: 80,
              height: 80,
            }}
            source={require('../../../assets/logo/logo.png')}
          />
          <Text
            style={{
              padding: '4%',
              fontWeight: '800',
              fontSize: 17,
            }}>
            What do you want to sync?
          </Text>
        </View>

        <Divider />

        <Checkbox.Item
          label="Groups"
          status={groupChecked ? 'checked' : 'unchecked'}
          onPress={() => {
            if (guestsChecked) {
              setGuestsChecked(false);
              setTasksChecked(false);
            }
            setGroupChecked(!groupChecked);
          }}
        />
        <Divider />
        <View>
          <Checkbox.Item
            label="Guests in every group"
            status={guestsChecked ? 'checked' : 'unchecked'}
            onPress={() => setGuestsChecked(!guestsChecked)}
            disabled={!groupChecked}
          />
          <Divider />
          <Checkbox.Item
            label="Tasks list in every group"
            status={tasksChecked ? 'checked' : 'unchecked'}
            onPress={() => setTasksChecked(!tasksChecked)}
            disabled={!groupChecked}
          />
          <Divider />
        </View>
      </View>

      <View
        style={{
          margin: '5%',
        }}>
        <Button
          disabled={!groupChecked || addGroupLoading}
          loading={addGroupLoading}
          contentStyle={{padding: '2%'}}
          theme={{roundness: 20}}
          mode="contained"
          onPress={syncDataHandler}
          buttonColor={theme.colors.blueBG}
          textColor={'#fff'}>
          Sync data
        </Button>
        <Button
          style={{
            marginTop: '5%',
          }}
          contentStyle={{padding: '2%'}}
          theme={{roundness: 20}}
          mode="outlined"
          onPress={() =>
            navigation.navigate('Drawer', {
              sreen: 'Home',
            })
          }>
          Continue without sync
        </Button>
      </View>
    </View>
  );
};

export default SyncDataIndex;
