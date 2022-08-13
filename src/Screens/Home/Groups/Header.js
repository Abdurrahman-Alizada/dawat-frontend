import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Linking,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {Header as HeaderRNE, Icon, Avatar} from 'react-native-elements';
import { width } from '../../../GlobalStyles'
import { SearchBar } from 'react-native-elements';

const Header = ({navigation}, props) => {

   const [isSearch, setIsSearch] = useState(false)
   const [search, setSearch] = useState("");
   const updateSearch = (search) => {
     setSearch(search);
   };  
 
    const SearchHandler = () => {
      setIsSearch(!isSearch)
    };

  const playgroundNavigate = () => {
    Linking.openURL(`https://react-native-elements.js.org/#/${props.view}`);
  };

  return (
    <>
      <HeaderRNE
        barStyle="dark-content"
        containerStyle={{backgroundColor: '#6c6399', }}
        >
        
        {isSearch ?
        <SearchBar
        placeholder="Search anything..."
        onChangeText={updateSearch}
        value={search}
        showCancel={true}
        // showLoading={true}
        // round={true}
        autoFocus
        onBlur={SearchHandler}
        cancel={()=>{console.log('hello')}}
        inputContainerStyle={{backgroundColor:'#fff'}}
        searchIcon={()=><Icon type="antdesign" name="search1" color="#000" />}
        // rightIconContainerStyle={{backgroundColor:'#000'}}
        containerStyle={{width:width, marginLeft:-10, backgroundColor:'#fff', minHeight:'10%'}}
        />
        :
        <View style={{flexDirection:'row', justifyContent:'space-between', width:width - 20,}} >        
          <View style={styles.headerRight}>
            <Avatar
            onPress={()=>navigation.openDrawer()}
            size={25}
            source={{uri: 'https://media.istockphoto.com/photos/macaw-parrot-isolated-on-white-background-picture-id1328860045?b=1&k=20&m=1328860045&s=170667a&w=0&h=o24me3gyECkw5b_iKKrCiyowQYyAaW8q1cx8WUfwfoI='}}
            rounded
            />

          </View>

          <View style={styles.headerRight}>
            <Text style={styles.heading}>Hello</Text>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity onPress={SearchHandler}>
              <Icon type="antdesign" name="search1" color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={{marginLeft: 20}}
              onPress={playgroundNavigate}>
              <Icon type="entypo" name="dots-three-vertical" color="white" />
            </TouchableOpacity>
          </View>

        </View>

        }
      </HeaderRNE>
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#397af8',
    marginBottom: 20,
    width: '100%',
    paddingVertical: 15,
  },
  heading: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerRight: {
    display: 'flex',
    flexDirection: 'row',
    marginVertical: 5,
  },
  subheaderText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Header;
