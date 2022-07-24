import React, {useState} from 'react';
import {Image, StyleSheet, Text, View, Alert} from 'react-native';
import { ListItem, } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Entypo'
import moment from 'moment';

const SingleTask = ({item}) => {
  return (
    <ListItem bottomDivider>
      <ListItem.CheckBox checked={item.checked} />
      <ListItem.Content>
        <ListItem.Title>{item.name}</ListItem.Title>
        <Text>{moment().format('2016-01-01 11:31:23 PM', "dddd, MMMM Do YYYY, h:mm:ss")}</Text>
        <View style={{flexDirection:"row", marginVertical:"2%"}}>

        {item.responsibleAvatars.map((responsibleAvatar, key) => {
          return (
            <View key={key}>
              {key < 3 ? (
                <Image style={styles.memberImage} source={{uri: responsibleAvatar}} />
                ) : (
                  <></>
                  )}
            </View>
          );
        })}
        <View style={{ justifyContent:"center", alignItems:"center", borderWidth: 1, borderRadius:50, borderColor: "#20232a",}}>
          <Text style={{fontSize:10, paddingHorizontal:'2%', fontWeight:"bold"}}>+3</Text>
        </View>
        </View>
      

      </ListItem.Content>

      <Icon name={"dots-three-vertical"} size={25} />

    </ListItem>
  );
};

export default SingleTask;

const styles = StyleSheet.create({
  subtitleView: {
    flexDirection: 'row',
    paddingTop: 5,
  },
  mainImage: {
    height: 19.21,
    width: 100,
  },
  ratingText: {
    color: 'grey',
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
