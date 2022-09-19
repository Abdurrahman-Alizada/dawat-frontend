import {createSlice} from '@reduxjs/toolkit';
import {
  NavigationContainer,
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from '@react-navigation/native';
import {
  DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
  Provider as PaperProvider,
} from 'react-native-paper';

const initialState = {
  isDarkTheme: false,
  paperTheme: PaperDefaultTheme,
  navigationTheme: NavigationDefaultTheme,
};

export const UserSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    toggleTheme: (state, action) => {
      state.isDarkTheme = !state.isDarkTheme;
    },
    currentPaperTheme: state => {
      state.isDarkTheme
        ? (state.paperTheme = PaperDarkTheme)
        : (state.paperTheme = PaperDefaultTheme);
    },
    currentNavigationTheme: state => {
        state.isDarkTheme
          ? (state.navigationTheme = NavigationDarkTheme)
          : (state.paperTheme = NavigationDefaultTheme);
      },
  },
  extraReducers: {},
});

// Action creators are generated for each case reducer function
export const {currentPaperTheme,currentNavigationTheme,toggleTheme} = UserSlice.actions;

export default UserSlice.reducer;
