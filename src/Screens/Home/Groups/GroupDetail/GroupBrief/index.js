import React, {useCallback, useState} from 'react'
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native'
import {Divider, Avatar } from 'react-native-elements'
import CountDown from 'react-native-countdown-component'
const Index = () => {

  const [textShown, setTextShown] = useState(false); //To show ur remaining Text
  const [lengthMore,setLengthMore] = useState(false); //to show the "Read more & Less Line"
  const toggleNumberOfLines = () => { //To toggle the show text or hide it
      setTextShown(!textShown);
  }

  const onTextLayout = useCallback(e =>{
      setLengthMore(e.nativeEvent.lines.length >=2); //to check the text is more than 4 lines or not
      // console.log(e.nativeEvent);
  },[]);

  const postDescription = "Lorem Ipsum is simply dummy text of the printing and  of the pri of the printing and  of the printing and nting and  of the printing and  of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";

  return (
    <View style={{paddingHorizontal:'9%', paddingVertical:'5%'}}>
    
    <View style={{flexDirection:'row', alignItems:'center', marginBottom:'5%' }}>
   
    <Avatar containerStyle={{height:40, width:40, marginRight:'5%'}} avatarStyle={{borderRadius:50,  }} 
    source={{uri: 'https://media.istockphoto.com/photos/red-tailed-black-cockatoo-picture-id1159108632?b=1&k=20&m=1159108632&s=170667a&w=0&h=Jkf4rYZNDawLV-8ER33bYLFHbXyAiNRGXIa9tx03mBI='}}
    />       
    <Text style={{fontSize:16, fontWeight:'bold',marginVertical:'1%'}} >Group Name</Text>
    </View>
    <Divider />
    <View style={{ marginVertical:'2%',}}>
      <Text style={{fontSize:16, fontWeight:'bold',marginVertical:'1%'}} >Description</Text>
      <Text
        onTextLayout={onTextLayout}
        numberOfLines={textShown ? undefined : 2}
        style={{ lineHeight: 21, }}>{postDescription}</Text>

        {
            lengthMore ? 
            <TouchableOpacity> 
              <Text
                onPress={toggleNumberOfLines}
                style={styles.seeMore}>{textShown ? 'Read less...' : 'Read more...'}
              </Text> 
            </TouchableOpacity>
            :null
        }
    </View>
    <Divider />
    <View style={{marginVertical:'2%'}}>
      <Text style={{ fontSize:16, fontWeight:'bold', marginBottom:'2%'}} >Remaining Time</Text>
      <CountDown
        size={30}
        until={1000}
        onFinish={() => alert('Finished')}
        digitStyle={{backgroundColor: '#FFF', borderWidth: 2, borderColor: '#1CC625'}}
        digitTxtStyle={{color: '#1CC625'}}
        timeLabelStyle={{color: '#6c6399', fontWeight: 'bold'}}
        separatorStyle={{color: '#1CC625'}}
        timeToShow={['D','H', 'M', 'S']}
        timeLabels={{m: 'Minutes', s: 'Seconds',h:'Hours', d:'Days'}}
        // showSeparator
      />
    </View>
    <Divider />
    <View style={{flexDirection:'row', justifyContent:'space-around', marginVertical:'2%'}}>
     <View>
     <Text style={{ fontSize:16, fontWeight:'bold', marginBottom:'2%'}} >Remaining Invitations</Text>
     <Text style={{alignSelf:'center', margin:'2%', padding:'10%',borderRadius:50, backgroundColor:'#FFF1F3', fontWeight:'bold', fontSize:22}} >
       83
     </Text>
     </View>

     <View>
     <Text style={{ fontSize:16, fontWeight:'bold', marginBottom:'2%'}} >Remaining Tasks</Text>
     <Text style={{alignSelf:'center', margin:'2%', padding:'10%',borderRadius:50, backgroundColor:'#FFF1F3', fontWeight:'bold', fontSize:22}} >
       100
     </Text>
     </View>
      
    </View>
    </View>
  )
}

export default Index

const styles = StyleSheet.create({
  postDescription:{
  fontFamily:'DM Sans',
  fontSize:16,
  fontWeight:'normal'
  },
  seeMore:{
    fontFamily:'DM Sans',
    fontSize:16,
    fontWeight:'bold'
  }
})


