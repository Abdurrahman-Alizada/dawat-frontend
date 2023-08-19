import {
  View,
  FlatList,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, {useState} from 'react';
import {
  Text,
  FAB,
  Searchbar,
  Button,
  Appbar,
  List,
  Avatar,
  Divider,
  Checkbox,
  useTheme,
} from 'react-native-paper';
import {useAddTaskMutation} from '../../../../../redux/reducers/groups/tasks/taskThunk';

import {useSelector, useDispatch} from 'react-redux';
import {groupApi} from '../../../../../redux/reducers/groups/groupThunk';
import ErrorSnackBar from '../../../../../Components/ErrorSnackBar';

const AddGroup = ({navigation, route}) => {
  const {values, startDate, dueDate, priority} = route.params;
  const theme = useTheme();
  const dispatch = useDispatch();

  const [isSearch, setIsSearch] = useState(false);

  const currentViewingGroup = useSelector(
    state => state.groups?.currentViewingGroup,
  );
  const [addTask, {isLoading}] = useAddTaskMutation();

  const submitHandler = async () => {
    await addTask({
      taskName: values.taskTitle,
      groupId: currentViewingGroup._id,
      taskDescription: values.taskDescription,
      responsibles: users,
      startDate: startDate,
      dueDate: dueDate,
      prority: priority,
    })
      .then(response => {
        if (response.data?._id) {
          dispatch(groupApi.util.invalidateTags(['GroupLogs']));
          navigation.pop(2);
        } else {
          setSnackBarVisible(true);
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  const [users, setUsers] = useState([]);
  const [userIds, setUserIds] = useState([]);

  const Item = ({itemProps}) => {
    const [include, setInclude] = useState(userIds.includes(itemProps?._id));
    const add = () => {
      if (include) {
        setUserIds(userIds.filter(userId => userId !== itemProps?._id));
        setUsers(users.filter(user => user._id !== itemProps?._id));
      } else {
        setUsers(prevState => [...prevState, itemProps]);
        setUserIds(prevState => [...prevState, itemProps?._id]);
      }
      setInclude(!include);
    };
    return (
      <View>
        <List.Item
          onPress={add}
          title={itemProps?.name}
          // description={itemProps?.responsible?.email}
          left={props => (
            <View>
              <Avatar.Image
                {...props}
                variant="image"
                size={50}
                source={
                  itemProps?.imageURL
                    ? {uri: itemProps?.imageURL}
                    : require('../../../../../assets/drawer/userImage.png')
                }
              />
            </View>
          )}
          right={props => (
            <Checkbox
              {...props}
              status={include ? 'checked' : 'unchecked'}
              onPress={add}
            />
          )}
        />
      </View>
    );
  };

  // snackbar
  const [snackbarVisible, setSnackBarVisible] = useState(false);

  return (
    <View style={{flex: 1}}>
      {isSearch ? (
        <Appbar.Header>
          <Searchbar
            placeholder="Search"
            icon={'arrow-left'}
            autoFocus
            onIconPress={() => {
              setIsSearch(false);
            }}
            theme={{roundness: 0}}
            // onChangeText={onChangeSearch}
            // value={searchQuery}
          />
        </Appbar.Header>
      ) : (
        <Appbar.Header>
          <Appbar.BackAction
            onPress={() => {
              navigation.goBack();
            }}
          />
          <Appbar.Content title="Add participant members" />
          <Appbar.Action
            icon="magnify"
            onPress={() => {
              setIsSearch(true);
            }}
          />
        </Appbar.Header>
      )}

      <FlatList
        data={currentViewingGroup.users}
        stickyHeaderIndices={[0]}
        ListHeaderComponent={() => (
          <View style={{backgroundColor: theme.colors.background}}>
            {users.length > 0 ? (
              <ScrollView
                horizontal={true}
                contentContainerStyle={{
                  paddingHorizontal: '4%',
                  paddingVertical: '2%',
                }}
                // showsHorizontalScrollIndicator={false}
              >
                {users?.map((user, index) => (
                  <TouchableOpacity
                    style={{marginRight: 15, alignItems: 'center'}}
                    key={index}
                    onPress={() => {
                      setUserIds(
                        userIds.filter(userId => userId !== user?._id),
                      );
                      setUsers(users.filter(user1 => user1._id !== user?._id));
                    }}>
                    {user?.imageURL ? (
                      <Avatar.Image size={50} source={{uri: user?.imageURL}} />
                    ) : (
                      <Avatar.Text size={50} label={'A'} />
                    )}
                    <Text style={{}} maxLength={10}>
                      {user?.name.length > 8
                        ? user?.name.substring(0, 8) + '..'
                        : user?.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : null}
            {users.length > 0 ? (
              <Divider bold style={{marginBottom: '1%'}} />
            ) : null}
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={{marginTop: '60%', alignItems: 'center'}}>
            <Text>There isn't any participant in this group</Text>
          </View>
        )}
        renderItem={({item}) => <Item itemProps={item} />}
      />

      <FAB
        icon="check"
        label="Ok"
        style={{
          bottom: snackbarVisible ? 70 : 16,
          right: 16,
          position: 'absolute',
        }}
        disabled={isLoading}
        loading={isLoading}
        onPress={submitHandler}
      />

      <ErrorSnackBar
        isVisible={snackbarVisible}
        text={'Something went wrong'}
        onDismissHandler={setSnackBarVisible}
      />
    </View>
  );
};

export default AddGroup;

const styles = StyleSheet.create({
  images: {
    alignSelf: 'center',
    width: 150,
    height: 150,
    marginHorizontal: 30,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  error: {
    color: 'red',
  },

  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalView: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: '5%',
    // justifyContent: 'center',
  },
});
