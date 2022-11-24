import React, {useState, useEffect} from 'react';
import {Text,StyleSheet, View, TouchableOpacity} from 'react-native';
import {Header as HeaderRNE, Icon} from 'react-native-elements';
import {width} from '../../../../GlobalStyles';
import {SearchBar} from 'react-native-elements';

const Header = ({navigation, onOpen}) => {
  const [isSearch, setIsSearch] = useState(true);

  const [search, setSearch] = useState('');
  const updateSearch = search => {
    setSearch(search);
  };

  const SearchHandler = () => {
    setIsSearch(!isSearch);
  };

  const playgroundNavigate = () => {};

  return (
    <HeaderRNE backgroundColor="#6c6399">
      {isSearch ? (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: width - 20,
          }}>
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

            <TouchableOpacity style={{marginLeft: 20}} onPress={() => onOpen()}>
              <Icon type="entypo" name="briefcase" color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              style={{marginLeft: 20}}
              onPress={playgroundNavigate}>
              <Icon type="entypo" name="dots-three-vertical" color="white" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <SearchBar
          placeholder="Search anything..."
          onChangeText={updateSearch}
          value={search}
          showCancel={true}
          // showLoading={true}
          // round={true}
          autoFocus
          onBlur={SearchHandler}
          cancel={() => {
            console.log('hello');
          }}
          inputContainerStyle={{backgroundColor: '#fff'}}
          containerStyle={{
            width: width,
            marginLeft: -10,
            backgroundColor: '#fff',
          }}
          // rightIconContainerStyle={{backgroundColor:'#000'}}
          searchIcon={() => (
            <Icon type="antdesign" name="search1" color="#000" />
          )}
        />
      )}
    </HeaderRNE>
  );
};

const styles = StyleSheet.create({
  heading: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerRight: {
    display: 'flex',
    flexDirection: 'row',
  },
  subheaderText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Header;
