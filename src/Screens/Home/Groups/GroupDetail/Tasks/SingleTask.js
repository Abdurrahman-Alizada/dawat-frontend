import React, {useState} from 'react';
import {
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
  View,
  Alert,
} from 'react-native';
import moment from 'moment';
import {
  Badge,
  Card,
  Paragraph,
  IconButton,
  List,
  Title,
} from 'react-native-paper';

const RenderGroupMembers = ({task}) => {
  console.log('hello', task.responsibles);
  if (task.responsibles) {
    // console.log('hhhh', task.responsibles);
    return (
      <View style={styles.groupMembersContent}>
        {task.responsibles.map((user, index) => (
          <View key={index}>
            {index < 3 ? (
              <View>
                <Image
                  style={styles.memberImage}
                  source={require('../../../../../assets/drawer/userImage.png')}
                  // source={require('../../../../../assets')}
                />
              </View>
            ) : (
              <></>
            )}
          </View>
        ))}
        {task.responsibles.length > 3 ? (
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
              +{task.responsibles.length - 3}
            </Text>
          </View>
        ) : (
          <></>
        )}
      </View>
    );
  }
  return (
    <Image
      style={styles.memberImage}
      source={require('../../../../../assets/images/onboarding/1.png')}
    />
  );
};

const SingleTask = ({item, cardHandler}, navigation) => {
  return (
    <List.Section title={moment(item.dueDate).format('lll')}>
      <Card onPress={() => cardHandler(item)}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Card.Content>
            <Title style={{fontFamily: 'Poppins-Regular'}}>
              {item.taskName}
            </Title>
          </Card.Content>

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
        <Card.Content>
          <Paragraph>{item.taskDescription}</Paragraph>
        </Card.Content>

        <Card.Actions style={{justifyContent: 'space-between'}}>
          <RenderGroupMembers task={item} />
        </Card.Actions>
        {/* </View> */}
      </Card>
    </List.Section>
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
