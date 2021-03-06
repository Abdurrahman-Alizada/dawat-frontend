import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {Header as HeaderRNE, Icon} from 'react-native-elements';
import { width } from '../../../../GlobalStyles'
import { SearchBar } from 'react-native-elements';
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust';

const Header = ({navigation, onOpen}) => {
  useEffect(()=>{
    AndroidKeyboardAdjust.setAdjustNothing()
 });

   const [isSearch, setIsSearch] = useState(true)

   const [search, setSearch] = useState("");
   const updateSearch = (search) => {
     setSearch(search);
   };  
 

    const SearchHandler = () => {
      setIsSearch(!isSearch)
    };

  const playgroundNavigate = () => {

  };

  return (
    <>
      <StatusBar />
      <HeaderRNE
        backgroundColor="#6c6399"
        barStyle="dark-content"
        containerStyle={{backgroundColor: '#6c6399', height: '12%'}}
        >
        
        {isSearch ?
        <View style={{flexDirection:'row', justifyContent:'space-between', width:width - 20,}} >        
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={{}}
            onPress={() => navigation.replace('GroupStack')}>
            <Icon type="antdesign" name="arrowleft" color="white" />
          </TouchableOpacity>
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
            onPress={()=> onOpen()}>
            <Icon type="entypo" name="briefcase" color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={{marginLeft: 20}}
            onPress={playgroundNavigate}>
            <Icon type="entypo" name="dots-three-vertical" color="white" />
          </TouchableOpacity>
        </View>

        </View>
        :
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
        containerStyle={{width:width, marginLeft:-10, backgroundColor:'#fff'}}
        // rightIconContainerStyle={{backgroundColor:'#000'}}
        searchIcon={()=><Icon type="antdesign" name="search1" color="#000" />}
        />
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
    marginTop: 5,
  },
  subheaderText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Header;
