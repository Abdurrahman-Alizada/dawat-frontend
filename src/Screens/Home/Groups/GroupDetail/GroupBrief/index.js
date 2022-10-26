import React, {useCallback, useState} from 'react';
import {TouchableOpacity, StyleSheet, Text, View} from 'react-native';
import {
  Divider,
  Avatar,
  Card,
  Icon,
} from 'react-native-elements';

const Index = () => {
  const [textShown, setTextShown] = useState(false); //To show ur remaining Text
  const [lengthMore, setLengthMore] = useState(false); //to show the "Read more & Less Line"
  const toggleNumberOfLines = () => {
    //To toggle the show text or hide it
    setTextShown(!textShown);
    console.log('clicked');
  };

  const onTextLayout = useCallback(
    e => {
      setLengthMore(e.nativeEvent.lines.length >= 2); //to check the text is more than 4 lines or not
      // console.log(e.nativeEvent);
    },
    [textShown],
  );

  const postDescription =
    "Lorem Ipsum is simply dummy text of the printing and  of the pri of the printing and  of the printing and nting and  of the printing and  of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.Aldus PageMaker including versions of Lorem Ipsum.";

  return (
    <View style={{paddingHorizontal: '9%', paddingVertical: '5%'}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-start',
          marginBottom: '5%',
        }}>
        <Avatar
          containerStyle={{height: 40, width: 40, marginRight: '5%'}}
          avatarStyle={{borderRadius: 50}}
          source={{
            uri: 'https://media.istockphoto.com/photos/red-tailed-black-cockatoo-picture-id1159108632?b=1&k=20&m=1159108632&s=170667a&w=0&h=Jkf4rYZNDawLV-8ER33bYLFHbXyAiNRGXIa9tx03mBI=',
          }}
        />

        <View style={{}}>
          <Text
            style={{fontSize: 16, fontWeight: 'bold', marginVertical: '1%'}}>
            Group Name
          </Text>

          <Text
            onTextLayout={onTextLayout}
            numberOfLines={textShown ? undefined : 2}
            style={{}}>
            {postDescription}
          </Text>

          {lengthMore ? (
            <TouchableOpacity onPress={() => toggleNumberOfLines()}>
              <Text style={styles.seeMore}>
                {textShown ? 'Read less...' : 'Read more...'}
              </Text>
            </TouchableOpacity>
          ) : (
            <></>
          )}
        </View>
      </View>

      <Divider />

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginBottom: '2%',
        }}>
        <Card>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{fontSize: 16, fontWeight: 'bold'}}> Invitations</Text>
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon name="check" color="#000" />
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>
              {' '}
              83
              <Text style={{fontSize: 10, fontWeight: 'bold'}}>
                {' '}
                Invited
              </Text>{' '}
            </Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon name="radio-button-unchecked" color="#000" />
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>
              {' '}
              83
              <Text style={{fontSize: 10, fontWeight: 'bold'}}>
                {' '}
                Remaining
              </Text>{' '}
            </Text>
          </View>
        </Card>

        <Card>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{fontSize: 16, fontWeight: 'bold'}}> Tasks</Text>
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon name="check" color="#000" />
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>
              {' '}
              83
              <Text style={{fontSize: 10, fontWeight: 'bold'}}>
                {' '}
                Completed
              </Text>{' '}
            </Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon name="pending" color="#000" />
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>
              {' '}
              83
              <Text style={{fontSize: 10, fontWeight: 'bold'}}>
                {' '}
                pending
              </Text>{' '}
            </Text>
          </View>
        </Card>
      </View>
      <Divider />
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  postDescription: {
    fontFamily: 'DM Sans',
    fontSize: 16,
    fontWeight: 'normal',
  },
  seeMore: {
    fontFamily: 'DM Sans',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
