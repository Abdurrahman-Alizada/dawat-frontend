import React from 'react'
import {StyleSheet, Text, View, Alert} from 'react-native'
import {Icon, Chip, ListItem, Avatar, Badge } from 'react-native-elements'

const SingleInviti = ({ item }, navigation ) => {
 
  const onPressHandler = ()=>{
    Alert.alert('Hello', 'onPress')  
  }
  
  const onLongPressHandler = ()=>{
   Alert.alert('Hello', 'onlongPress')
 }
 
  return(
      <>
      <ListItem
      onLongPress={onLongPressHandler}
      // bottomDivider
    >
      <Avatar containerStyle={{height:50, width:50}} avatarStyle={{borderRadius:50,  }} source={{uri: item.avatar_url}} />       
      <ListItem.Content>
      <ListItem.Title >
           {item.name} 
      </ListItem.Title>
          <View style={styles.subtitleView}>
            <Text style={styles.ratingText}>5 months  </Text>
          </View>
        </ListItem.Content>
        <ListItem.Content>
        <Chip
          onPress={ onPressHandler}
          title={<Icon name="people" color="#fff" />}
          type="solid"
          containerStyle={{ margin: 15, alignSelf:"flex-end" }}
          // loading
          />
        </ListItem.Content>
    </ListItem>

    </>
      
      )
  }

export default SingleInviti

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