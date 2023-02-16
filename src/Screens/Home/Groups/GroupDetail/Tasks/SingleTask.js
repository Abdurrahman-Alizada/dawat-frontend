import React, {useState} from 'react';
import {
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
  View,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import moment from 'moment';
import {
  Badge,
  Card,
  Paragraph,
  IconButton,
  List,
  Title,
  Avatar,
} from 'react-native-paper';

const RenderGroupMembers = ({task}) => {
  if (task.responsibles) {
    return (
      <View style={styles.groupMembersContent}>
        {task.responsibles.map((user, index) => (
          <View key={index}>
            {index < 5 ? (
              <Avatar.Image
                size={20}
                source={{
                  uri: 'https://res.cloudinary.com/dblhm3cbq/image/upload/v1673329064/avatars-for-user-profile/Panda_qek53a.png',
                }}
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
            {task.responsibles.length < 1 && <Text style={{}}>No participant</Text>}
          </View>
        )}
      </View>
    );
  }
};

const SingleTask = ({item, cardHandler}, navigation) => {
  return (
    <View>
      <View
        style={{
          paddingHorizontal: '5%',
          paddingVertical: '4%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}>
        <View style={{width:"90%"}}>
          <View
            style={{
              marginTop: '2%',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text style={{fontWeight: '800', fontSize: 16}}>
              {item.taskName} 
            </Text>
          </View>
          <View
            style={{
              marginTop: '2%',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Icon size={13} name="clock" style={{marginRight: 15}} />
            <Text style={{fontSize:13}}>{moment(item.dueDate).format('llll')}</Text>
          </View>
          <View
            style={{
              marginTop: '2%',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Icon size={13} name="users" style={{marginRight: 10}} />
            <RenderGroupMembers task={item} />
          </View>
        </View>
        <IconButton
          icon="dots-vertical"
          size={20}
          onPress={() => cardHandler(item)}
        />
      </View>

      {/* <Card onPress={() => cardHandler(item)}>

          {item.priority.priority === 'High' && (
            <Badge style={{marginHorizontal: 5}}></Badge>
          )}
          {item.priority.priority === 'Normal' && (
            <Badge
              style={{marginHorizontal: 5, backgroundColor: '#34f'}}></Badge>
          )}
          {item.priority.priority === 'Low' && (
            <Badge
              style={{marginHorizontal: 5, backgroundColor: '#ed3'}}></Badge>
          )}
        </View>
*/}
    </View>
  );
};

export default SingleTask;

const styles = StyleSheet.create({
  groupMembersContent: {
    flexDirection: 'row',
  },
  memberImage: {
    height: 20,
    width: 20,
    borderRadius: 50,
  },
});
