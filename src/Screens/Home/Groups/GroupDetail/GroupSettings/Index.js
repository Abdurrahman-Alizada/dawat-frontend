import {StyleSheet, ScrollView, View} from 'react-native';
import React, {useState} from 'react';
import {
  Avatar,
  TextInput,
  Button,
  List,
  ActivityIndicator,
  Divider
} from 'react-native-paper';
import {
  useUpdateGroupInfoMutation,
  useDeleteGroupForUserMutation,
} from '../../../../../redux/reducers/groups/groupThunk';
import AsyncStorage from '@react-native-community/async-storage';
const Index = ({route, navigation}) => {
  const {users, groupName, _id} = route?.params?.group?.group;
  console.log("hello =>", route.params.group.group)
  const [memberUsers, setMemberUsers] = useState(users);
  const [name, setName] = useState(groupName);
  const [disable, setDisable] = useState(true);

  const [updateGroupInfo, {isLoading}] = useUpdateGroupInfoMutation();
  const [deleteGroupForUser, {isLoading: deleteLoading}] =
    useDeleteGroupForUserMutation();

  const handleSubmit = () => {
    updateGroupInfo({groupName: name, groupId: _id});
  };

  const handleLeave = async () => {
    deleteGroupForUser({
      chatId: _id,
      userId: await AsyncStorage.getItem('userId'),
    })
      .then(res => {
        console.log('You left the group successfully');
        navigation.replace('Drawer');
      })
      .catch(e => {
        console.log('error in handleLeave', e);
      });
  };
  return (
    <ScrollView >
     
     <List.Section style={{padding: '2%', backgroundColor: '#fff'}}>
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
      </List.Section>

      <List.Section style={{margin: '2%',padding:"2%", backgroundColor: '#fff'}}>
      <List.Subheader>Group members</List.Subheader>
      <List.Item
          // onPress={handleLeave}
          title="Add Member"
          left={() => <Avatar.Icon size={50} icon="account-plus-outline" />}
        />
        <Divider />
        {memberUsers.map((member,index)=>(
          <List.Item
            key={index}
            title={member.name}
            description={member.email}
            left={() =>  
            <Avatar.Image
              source={{
                uri: member.imageURL ? member.imageURL : 'https://pbs.twimg.com/profile_images/952545910990495744/b59hSXUd_400x400.jpg',
              }}
              size={50}
            />
          }
          />
        ))

        }
      </List.Section>

      <List.Section style={{margin: '2%',padding:"2%", backgroundColor: '#fff'}}>
        <List.Item
          onPress={handleLeave}
          title="Leave group"
          left={() => <List.Icon icon="logout" />}
          right={() =>
            deleteLoading ? (
              <ActivityIndicator animating={true} size="small" />
            ) : (
              <></>
            )
          }
        />
        <List.Item
          title="Report"
          onPress={() => console.log('report pressed')}
          left={() => <List.Icon icon="thumb-down-outline" />}
        />
      </List.Section>


    </ScrollView>
  );
};

export default Index;

const styles = StyleSheet.create({});
