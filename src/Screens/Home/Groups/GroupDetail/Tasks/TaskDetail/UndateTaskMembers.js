import {View, FlatList, ScrollView, TouchableOpacity, StyleSheet, I18nManager} from 'react-native';
import React, {useLayoutEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
import {useUpdateResponsiblesMutation} from '../../../../../../redux/reducers/groups/tasks/taskThunk';

import {useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';

const AddGroup = ({navigation}) => {
  const theme = useTheme();
  const {t} = useTranslation();

  const [isSearch, setIsSearch] = useState(false);

  const currentLoginUser = useSelector(state => state.user?.currentLoginUser);
  const currentViewingTask = useSelector(state => state.tasks?.currentViewingTask);
  const currentViewingGroup = useSelector(state => state.groups?.currentViewingGroup);

  const [updateResponsibles, {isLoading: updateResponsiblesLoading}] =
    useUpdateResponsiblesMutation();

  const submitHandler = async () => {
    updateResponsibles({
      responsibles: responsibleUsers,
      userId: await AsyncStorage.getItem('userId'),
      taskId: currentViewingTask._id,
    })
      .then(response => {
        navigation.pop(2);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const [users, setUsers] = useState([]);
  const [userIds, setUserIds] = useState([]);
  const [responsibleUsers, setResponsibleUsers] = useState([]);

  useLayoutEffect(() => {
    const getResponsibles = () => {
      for (let i = 0; i < currentViewingTask.responsibles?.length; i++) {
        let user = currentViewingGroup?.users.find(
          e => e._id === currentViewingTask?.responsibles[i]?.responsible?._id,
        );
        if (user) {
          setUsers(prevState => [...prevState, user]);
          setUserIds(prevState => [...prevState, user?._id]);
        }
      }
    };
    getResponsibles();
  }, []);

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

      let includeInResponsibleUsers = responsibleUsers.some(user => user.id == itemProps?._id);
      if (includeInResponsibleUsers) {
        setResponsibleUsers(responsibleUsers.filter(user => user.id !== itemProps?._id));
      } else {
        setResponsibleUsers(prevState => [...prevState, {id: itemProps._id, name: itemProps.name}]);
      }
      setInclude(!include);
    };
    return (
      <View>
        <List.Item
          onPress={add}
          title={`${itemProps?.name} ${itemProps?.name === currentLoginUser?.name ? '(You)' : ''}`}
          style={{
            backgroundColor: include ? theme.colors.primaryContainer : theme.colors.background,
          }}
          left={props => (
            <View>
              <Avatar.Image
                {...props}
                variant="image"
                size={50}
                source={
                  itemProps?.imageURL
                    ? {uri: itemProps?.imageURL}
                    : require('../../../../../../assets/drawer/male-user.png')
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

  return (
    <View style={{flex: 1}}>
      {isSearch ? (
        <Appbar.Header style={{backgroundColor: theme.colors.background}}>
          <Searchbar
            placeholder={t('Search...')}
            icon={I18nManager.isRTL ? 'arrow-right' : 'arrow-left'}
            autoFocus
            // loading={true}
            style={{backgroundColor: theme.colors.background}}
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
          <Appbar.Content title={t('Update task members')} />
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
            <Divider bold style={{marginBottom: '1%'}} />
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
          position: 'absolute',
          margin: 16,
          right: 0,
          bottom: 0,
        }}
        disabled={
          updateResponsiblesLoading || currentViewingTask?.responsibles?.length == users.length
        }
        loading={updateResponsiblesLoading}
        onPress={submitHandler}
      />
    </View>
  );
};

export default AddGroup;
