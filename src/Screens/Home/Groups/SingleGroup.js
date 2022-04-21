import React from 'react'
import {Image, StyleSheet, Text, View, FlatList, Alert} from 'react-native'
import { ListItem, Avatar } from 'react-native-elements'
 
const RenderGroupMembers = ( { groupMembers }) => {
    if(groupMembers) {
      return (
        <View style={styles.groupMembersContent}>
          {groupMembers.membersAvatars.map((groupMember, key) => {
            return (
              <Image key={key} style={styles.memberImage}  source={{uri:groupMember}}/>
            );
          })}
        </View>
      );
    }
    return <Text>hello</Text>;
  }


const SingleGroup = ({ item }, navigation ) => {
 
  const onPressHandler = ()=>{
    navigation.navigate('GroupDetail', {
      itemId: 2,
      otherParam: 'anything you want here',
    });
  }
  
  const onLongPressHandler = ()=>{
   Alert.alert('Hello', 'onlongPress')
 }
 
  const id = item.id;

  return(
      <ListItem 
      onPress={ onPressHandler}
      onLongPress={onLongPressHandler}
      bottomDivider
    >
      <Avatar containerStyle={{height:50, width:50}} avatarStyle={{borderRadius:50,  }} source={{uri: item.avatar_url}} />       
    
      <ListItem.Content>
      <ListItem.Title>{item.name} </ListItem.Title>
          <View style={styles.subtitleView}>
            <RenderGroupMembers groupMembers={item} />
  
            <Text style={styles.ratingText}>5 months  </Text>
          </View>
        </ListItem.Content>
      {/* <ListItem.Chevron /> */}
    </ListItem>
      )
  }

export default SingleGroup

const styles = StyleSheet.create({
    subtitleView: {
      flexDirection: 'row',
      paddingTop: 5
    },
    mainImage: {
      height: 19.21,
      width: 100
    },
    ratingText: {
      paddingLeft: 10,
      color: 'grey'
    },
    groupMembersContent:{
      flexDirection:'row',
    },
    memberImage: {
      height: 20,
      width: 20,
      borderRadius:50,
    },
  })