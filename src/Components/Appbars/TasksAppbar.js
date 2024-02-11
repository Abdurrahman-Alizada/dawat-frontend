import React, {useState} from 'react';
import { Appbar, Searchbar, useTheme} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import {handleIsSearch} from '../../redux/reducers/groups/groups';
import {
  handleIsTaskSearch,
  handleTasksSearch,
  handleIsTaskSummaryOpen,
} from '../../redux/reducers/groups/tasks/taskSlice';
import { useTranslation } from 'react-i18next';
import { I18nManager } from 'react-native';
const Header = ({openTasksSummaryModalize}) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const navigation = useNavigation();
  const {t} = useTranslation();
  //search
  const isSearch = useSelector(state => state.groups.isSearch);

  const [search, setSearch] = useState('');
  const updateSearch = search => {
    setSearch(search);
    dispatch(handleIsTaskSearch(search));
    dispatch(handleTasksSearch(search));
  };
  const BlurHandler = () => {
    setSearch('');
    dispatch(handleIsSearch(false));
    dispatch(handleIsTaskSearch(search));
  };

  return (
    <>
      {!isSearch ? (
        <Appbar
          elevated={true}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: theme.colors.background,
            marginBottom: 2,
          }}>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content
            title={t("To-do")}
            titleStyle={{
              color: theme.colors.onBackground,
            }}
          />
          <Appbar.Action
            icon="magnify"
            color={theme.colors.onBackground}
            onPress={() => {
              dispatch(handleIsSearch(true));
              dispatch(handleIsTaskSearch(true));
            }}
          />

          <Appbar.Action
            icon="briefcase-outline"
            color={theme.colors.onBackground}
            onPress={() => {
              dispatch(handleIsTaskSummaryOpen(true));
              openTasksSummaryModalize();
            }}
          />
        </Appbar>
      ) : (
        <Appbar
          elevated={true}
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: theme.colors.background,
            marginBottom: 2,
          }}>
          <Searchbar
            placeholder={t("Search...")}
            onChangeText={updateSearch}
            value={search}
            cancelButtonTitle="cancel"
            autoFocus
            icon={I18nManager.isRTL ? 'arrow-right' : 'arrow-left'}
            onIconPress={BlurHandler}
            theme={{roundness: 0}}
            style={{
              backgroundColor: theme.colors.background,
            }}
            cancel={() => {
              console.log('hello');
            }}
          />
        </Appbar>
      )}
    </>
  );
};

export default Header;
