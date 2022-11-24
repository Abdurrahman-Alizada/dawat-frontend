import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {Avatar, TextInput, Button} from 'react-native-paper';
import {useUpdateGroupInfoMutation} from '../../../../../redux/reducers/groups/groupThunk';

const Index = ({route}) => {
  const [name, setName] = React.useState(route?.params?.group?.groupName);
  const [disable, setDisable] = React.useState(true);

  const [updateGroupInfo, {isLoading}] = useUpdateGroupInfoMutation();

  const handleSubmit = () => {
    updateGroupInfo({groupName: name, groupId: route?.params?.group?.groupId});
  };
  return (
    <View style={{padding: '2%', backgroundColor: '#fff'}}>
      <View style={{marginTop: '2%'}}>
        <Avatar.Icon style={{alignSelf: 'center'}} size={35} icon="folder" />
        <TextInput
          // editable={false}
          label="Group name"
          mode="outlined"
          value={name}
          onChangeText={text => {
            setDisable(false);
            setName(text);
          }}
        />
      </View>
      <View style={{marginVertical: '2%'}}>
        <Button
          disabled={disable}
          loading={isLoading}
          mode="contained"
          onPress={handleSubmit}
          style={{
            // backgroundColor: '#334C8C',
            borderRadius: 10,
            borderColor: '#C1C2B8',
            borderWidth: 0.5,
            padding: '1%',
            marginVertical: '2%',
          }}>
          Update
        </Button>
      </View>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({});
