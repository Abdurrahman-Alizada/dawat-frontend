import React, {useState} from 'react';
import {TouchableOpacity, Image, StyleSheet, Text, View, Alert} from 'react-native';
import moment from 'moment';
import {Badge, Card, Paragraph, IconButton, Title} from 'react-native-paper';

const RenderGroupMembers = ({groupMembers}) => {
  // console.log('hhhh', groupMembers.responsibles);
  if (groupMembers.responsibles) {
    return (
      <View style={styles.groupMembersContent}>
        {groupMembers.responsibles.map((user, index) => (
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
        {groupMembers.responsibles.length > 3 ? (
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
              +{groupMembers.responsibles.length - 3}
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
    <View>
       <TouchableOpacity
      onPress={()=>cardHandler(item)}
      // onLongPress={() => onLongPressHandler()}
      >
      <Card
        mode="outlined"
        style={{
          marginTop: '3%',
          marginHorizontal: '3%',
        }}>
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
          
         {item.priority.priority === "High" && <Badge style={{marginHorizontal:5}}></Badge>}
         {item.priority.priority === "Normal" && <Badge style={{marginHorizontal:5, backgroundColor:"#34f"}}></Badge>}
         {item.priority.priority === "Low" && <Badge style={{marginHorizontal:5, backgroundColor:"#ed3"}}></Badge>}

        </View>
        <Card.Content>
          <Paragraph>{item.taskDescription}</Paragraph>
        </Card.Content>
        <View
          style={{
            height: 1,
            width: '100%',
            marginVertical: '1%',
            backgroundColor: '#BDBDBD',
          }}></View>
        <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
          <Card.Actions style={{justifyContent: 'space-between'}}>
            <Paragraph>
              {moment(item.startingDate).fromNow()} - {moment(item.dueDate).to()}
            </Paragraph>
          </Card.Actions>
          <Card.Actions style={{justifyContent: 'space-between'}}>
            <RenderGroupMembers groupMembers={item} />
          </Card.Actions>
        </View>
      </Card>
    </TouchableOpacity>
  
    </View>
  );
};

export default SingleTask;

const styles = StyleSheet.create({
  itemContainer: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    justifyContent: 'flex-start',
    borderRadius: 5,
    paddingVertical: '1%',
    paddingHorizontal: '2%',
    height: 100,
    alignItems: 'baseline',
  },
  itemName: {
    fontSize: 13,
    color: '#282F3E',
    fontWeight: '600',
  },

  itemDate: {
    fontSize: 13,
    color: '#282F3E',
    fontWeight: 'bold',
  },
  itemDesc: {
    fontSize: 13,
    color: '#282F3E',
    // fontWeight: 'bold',
  },
  groupMembersContent: {
    flexDirection: 'row',
  },
  memberImage: {
    height: 20,
    width: 20,
    borderRadius: 50,
  },
});
