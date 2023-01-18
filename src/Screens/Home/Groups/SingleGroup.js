import React, {useState} from 'react';
import {Image, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {
  Chip,
  Card,
  Paragraph,
  IconButton,
  Title,
  List,
  Avatar,
  Checkbox,
  ActivityIndicator,
  Divider,
} from 'react-native-paper';

const SingleGroup = ({
  item,
  navigation,
  checked,
  setChecked,
  checkedItems,
  setCheckedItems,
  deleteLoading,
}) => {
  const onPressHandler = () => {
    navigation.navigate('GroupDetail', {
      group: item,
      groupId: item._id,
      groupName: item.groupName,
    });
  };

  // logic for checked on longPress
  const [include, setInclude] = useState(checkedItems?.includes(item._id));
  const index = checkedItems?.indexOf(item._id);

  const onLongPressHandler = () => {
    setChecked(true);
    if (include) {
      if (index !== -1 && index !== 0) {
        checkedItems.splice(include, 1);
        // console.log('if ',index, props.item._id);
      } else if (index == 0) {
        checkedItems.shift();
      }
    } else {
      setCheckedItems([...checkedItems, item._id]);
    }
    setInclude(!include);
  };
  // end logic for checked on longPress

  return (
    <TouchableOpacity
      onPress={onPressHandler}
      onLongPress={() => onLongPressHandler()}>
      <List.Item
        title={item.groupName}
        description={item.groupDescription}
        left={props => <Avatar.Text style={props.style} label="A" size={40} />}
        right={() => (
          <View>
            {checked && (
              <View>
                {!deleteLoading ? (
                  <Checkbox
                    status={checked && include ? 'checked' : 'unchecked'}
                    onPress={onLongPressHandler}
                  />
                ) : (
                  <ActivityIndicator animating={deleteLoading} />
                )}
              </View>
            )}
          </View>
        )}
      />
     {/* <Divider/> */}
    </TouchableOpacity>
  );
};

export default SingleGroup;

const styles = StyleSheet.create({
  itemContainer: {
    width: '96%',
    margin: '2%',
    justifyContent: 'flex-start',
    borderRadius: 5,
    padding: '1%',
    height: 90,
    alignItems: 'baseline',
  },
  itemName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  itemCode: {
    fontWeight: '600',
    fontSize: 12,
    color: '#fff',
  },

  subtitleView: {
    flexDirection: 'row',
    paddingTop: 5,
  },
  mainImage: {
    height: 19.21,
    width: 100,
  },
  ratingText: {
    paddingLeft: 10,
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
