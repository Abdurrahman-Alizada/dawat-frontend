import {View, FlatList, ScrollView, TouchableOpacity, StyleSheet, I18nManager} from 'react-native';
import React, {useState} from 'react';
import {
  Text,
  FAB,
  Searchbar,
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
import {useTranslation} from 'react-i18next';

const AddGroup = ({navigation, route}) => {
  const {values, startDate, dueDate, priority} = route.params;
  const theme = useTheme();
  const dispatch = useDispatch();
  const {t} = useTranslation();

  const [isSearch, setIsSearch] = useState(false);

  const currentViewingGroup = useSelector(state => state.groups?.currentViewingGroup);
  const currentLoginUser = useSelector(state => state.user?.currentLoginUser);
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
          title={`${itemProps?.name} ${itemProps?.name === currentLoginUser?.name ? t('(You)') : ''}`}
          left={props => (
            <View>
              <Avatar.Image
                {...props}
                variant="image"
                size={50}
                source={
                  itemProps?.imageURL
                    ? {uri: itemProps?.imageURL}
                    : require('../../../../../assets/drawer/male-user.png')
                }
              />
            </View>
          )}
          right={props => (
            <Checkbox {...props} status={include ? 'checked' : 'unchecked'} onPress={add} />
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
            placeholder={t('Search...')}
            icon={I18nManager.isRTL ? 'arrow-right' : 'arrow-left'}
            style={{backgroundColor: theme.colors.background}}
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
          <Appbar.Content title={t('Add participant members')} />
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
                      setUserIds(userIds.filter(userId => userId !== user?._id));
                      setUsers(users.filter(user1 => user1._id !== user?._id));
                    }}>
                    {user?.imageURL ? (
                      <Avatar.Image size={50} source={{uri: user?.imageURL}} />
                    ) : (
                      <Avatar.Text size={50} label={'A'} />
                    )}
                    <Text style={{}} maxLength={10}>
                      {user?.name.length > 8 ? user?.name.substring(0, 8) + '..' : user?.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : null}
            {users.length > 0 ? <Divider bold style={{marginBottom: '1%'}} /> : null}
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={{marginTop: '60%', alignItems: 'center'}}>
            <Text>{t("There isn't any participant in this group")}</Text>
          </View>
        )}
        renderItem={({item}) => <Item itemProps={item} />}
      />

      <FAB
        icon="check"
        label={t('Ok')}
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
        text={t('Something went wrong')}
        onDismissHandler={setSnackBarVisible}
      />
    </View>
  );
};

export default AddGroup;
