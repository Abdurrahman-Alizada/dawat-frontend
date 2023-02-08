import React, {useState} from 'react';
import {View} from 'react-native';
import {List, Avatar, Checkbox, ActivityIndicator} from 'react-native-paper';
import { useDispatch } from 'react-redux';
import {handleCurrentViewingGroup} from '../../../redux/reducers/groups/groups';

const SingleGroup = ({
  item,
  navigation,
  checked,
  setChecked,
  checkedItems,
  setCheckedItems,
  deleteLoading,
  setIsSearch
}) => {
  const dispatch = useDispatch()

  const onPressHandler = () => {
    setIsSearch(false)
    dispatch(handleCurrentViewingGroup(item));
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
    <List.Item
      onPress={onPressHandler}
      onLongPress={() => onLongPressHandler()}
      title={item.groupName}
      description={item.groupDescription}
      left={props => (
        <View>
          {item.imageURL ? (
            <Avatar.Image
              style={props.style}
              source={{uri: item.imageURL}}
              size={40}
            />
          ) : (
            <Avatar.Text
              style={props.style}
              label={item.groupName.charAt(0)}
              size={40}
            />
          )}
        </View>
      )}
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
  );
};

export default SingleGroup;
