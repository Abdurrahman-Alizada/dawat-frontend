import {Text, View, SafeAreaView} from 'react-native';
import React, {useState} from 'react';
import Header from '../../../../Components/ProfileScreenHeader';
import {
  Avatar,
  List,
  IconButton,
  TextInput,
  ActivityIndicator,
  Button
} from 'react-native-paper';
import {useGetCurrentLoginUserQuery} from '../../../../redux/reducers/user/userThunk';

export default ProfileIndex = ({route}) => {
  const [editNam, setEditName] = useState(false);
  const [editEmail, setEditEmail] = useState(false);

  const {
    data: user,
    isError,
    error,
    isLoading,
  } = useGetCurrentLoginUserQuery(route.params?.id);

  return (
    <SafeAreaView style={{flexGrow: 1}}>
      <View style={{flex: 1}}>
        <Header />
        {user ? (
          <List.Section
            style={{
              marginVertical: '2%',
              paddingVertical: '2%',
            }}>
            <View>
              <Avatar.Image
                source={{
                  uri: 'https://pbs.twimg.com/profile_images/952545910990495744/b59hSXUd_400x400.jpg',
                }}
                style={{alignSelf: 'center'}}
                size={130}
              />
              <IconButton
                style={{position: 'absolute', left: '55%', top: 75}}
                icon="camera"
                mode="contained"
                size={28}
                onPress={() => console.log('Pressed')}
              />
            </View>

            <View style={{padding: '5%'}}>
              <List.Subheader>Name </List.Subheader>

              <List.Item
                title={user?.name}
                left={props => <List.Icon {...props} icon="account-outline" />}
                right={() => (
                  <IconButton
                    icon="pencil"
                    mode="outlined"
                    size={20}
                    onPress={() => {
                      setEditEmail(false)
                      setEditName(true)
                    }}
                  />
                )}
              />

              <List.Subheader>Email</List.Subheader>

              <List.Item
                title={user?.email}
                left={props => <List.Icon {...props} icon="email-outline" />}
                right={() => (
                  <IconButton
                    icon="pencil"
                    mode="outlined"
                    size={20}
                    onPress={() => {
                      setEditName(false)
                      setEditEmail(true)
                    }}
                  />
                )}
              />
            </View>
          </List.Section>
        ) : (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
            }}>
            <ActivityIndicator animating={isLoading} />
          </View>
        )}
      </View>

      {editNam && (
        <View style={{padding:"2%", backgroundColor:"#fff"}}>

          <TextInput
            label="Enter name"
            autoFocus={true}
            mode="outlined"
            // value={currentContact.note}
            // onChangeText={(text) => setAttribute("note", text)}
          />
          <View style={{flexDirection:"row", marginVertical:"2%", alignSelf:"flex-end"}}>
          <Button icon="close" mode="text"  onPress={() => setEditName(false)}>
            cancel
          </Button>
          <Button icon="check" mode="text"  onPress={() => setEditName(false)}>
            Ok
          </Button>

          </View>
        </View>
      )}
            {editEmail && (
        <View style={{padding:"2%", backgroundColor:"#fff"}}>

          <TextInput
            label="Enter email"
            autoFocus={true}
            mode="outlined"
            // value={currentContact.note}
            // onChangeText={(text) => setAttribute("note", text)}
          />
          <View style={{flexDirection:"row", marginVertical:"2%", alignSelf:"flex-end"}}>
          <Button icon="close" mode="text"  onPress={() => setEditEmail(false)}>
            cancel
          </Button>
          <Button icon="check" mode="text"  onPress={() => setEditEmail(false)}>
            Ok
          </Button>

          </View>
        </View>
      )}
    </SafeAreaView>
  );
};
