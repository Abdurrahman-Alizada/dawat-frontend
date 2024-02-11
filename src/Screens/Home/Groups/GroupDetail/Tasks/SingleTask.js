import React, {useState} from 'react';
import {I18nManager, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import moment from 'moment';
import {useNavigation} from '@react-navigation/native';
import {
  useTheme,
  Avatar,
  Menu,
  ActivityIndicator,
  Checkbox,
} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {handleCurrentViewingTask} from '../../../../../redux/reducers/groups/tasks/taskSlice';
import {useMarkAsCompletedMutation} from '../../../../../redux/reducers/groups/tasks/taskThunk';
import {useTranslation} from 'react-i18next';

const RenderGroupMembers = ({task}) => {
  const {t} = useTranslation();
  const theme = useTheme();
  if (task?.responsibles) {
    return (
      <View
        style={{
          flexDirection: 'row',
        }}>
        {task.responsibles.map((user, index) => (
          <View key={index}>
            {index < 5 ? (
              <Avatar.Image
                size={20}
                source={
                  user?.responsible?.imageURL
                    ? {uri: user?.responsible?.imageURL}
                    : require('../../../../../assets/drawer/male-user.png')
                }
              />
            ) : (
              <></>
            )}
          </View>
        ))}
        {task.responsibles.length > 5 ? (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1.5,
              borderRadius: 50,
              borderColor: '#20232a',
            }}>
            <Text
              style={{
                fontSize: 10,
                paddingHorizontal: '1%',
                fontWeight: 'bold',
              }}>
              +{task.responsibles.length - 5}
            </Text>
          </View>
        ) : (
          <View>
            {task.responsibles.length < 1 && (
              <Text style={{color: theme.colors.onSurface}}>{t('No participant')}</Text>
            )}
          </View>
        )}
      </View>
    );
  }
};

const SingleTask = ({item}) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {t, i18n} = useTranslation();

  const currentLoginUser = useSelector(state => state.user.currentLoginUser);


  const [markAsCompleted, {isLoading: markAsCompletedLoading}] = useMarkAsCompletedMutation();

  const markAsCompletedHandler = async () => {
    await markAsCompleted({
      condition: !item.isCompleted,
      userId: currentLoginUser._id,
      taskId: item._id,
    })
      .then(response => {
        console.log('updated task in markAsCompletedHandler is =>', response);
      })
      .catch(e => {
        console.log(e);
      });
  };

  // error snackbar

  const tasksSearchQuery = useSelector(state => state.tasks.tasksSearchQuery);
  const getHighlightedText = result =>
    result.split(new RegExp(`(${tasksSearchQuery})`, `gi`)).map((piece, index) => {
      return (
        <Text
          key={index}
          style={
            piece.toLocaleLowerCase() == tasksSearchQuery.toLocaleLowerCase()
              ? {fontWeight: 'bold', color: theme.colors.primary}
              : {}
          }>
          {piece}
        </Text>
      );
    });

  const [checked, setChecked] = useState(item.isCompleted);

  return (
    <View
      style={{
        paddingHorizontal: '5%',
        paddingVertical: '4%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        alignItems: 'center',
        backgroundColor: checked ? theme.colors.surfaceVariant : theme.colors.background,
      }}>
      <View style={{width: '90%'}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              dispatch(handleCurrentViewingTask(item));
              navigation.navigate('TaskDetail');
            }}>
            <Text
              style={{
                fontWeight: '800',
                fontSize: 16,
                color: theme.colors.onSurface,
                textDecorationLine: item.isCompleted ? 'line-through' : 'none',
              }}>
              {I18nManager.isRTL ? item.taskName : getHighlightedText(item.taskName)}
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginTop: '2%',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Icon size={13} name="clock" style={{marginRight: 15}} color={theme.colors.onSurface} />
          <Text style={{fontSize: 13, color: theme.colors.onSurface}}>
            {moment(item.dueDate)?.format('llll')}
          </Text>
        </View>
        <View
          style={{
            marginTop: '2%',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Icon size={13} name="users" style={{marginRight: 10}} color={theme.colors.onSurface} />
          <RenderGroupMembers task={item} />
        </View>
      </View>

      <Checkbox
        status={checked ? 'checked' : 'unchecked'}
        onPress={() => {
          setChecked(!checked);
          markAsCompletedHandler();
        }}
      />
    </View>
  );
};

export default SingleTask;
