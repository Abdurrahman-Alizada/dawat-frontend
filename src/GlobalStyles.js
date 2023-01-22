import {Dimensions, StyleSheet} from 'react-native';

export const width = Dimensions.get('window').width;
export const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
});

// const c = [
//   "#FFC4D0",
//   "#BDBDFF",
//   "#8BBBF2",
//   "#F9CEDF",
//   "#FCEECB",
//   "#D7DDE9",
//   "#CF99FF",
//   '#4838D1'
//  ]

export const COLORS = {
  primary: '#282534',
  white: '#fff',
  black: '#000',
  blackLight: '#282F3E',
  greyLight: '#888C94',
  red: '#D70F64',
  orange: '#F77A55',
  blueLight: '#4838D1',
  
};

export const lightPalette = {
  primary :"#9b78d4",
  primaryContainer: "#75d9ff",
  
  secondary:"#835ac3",
  secondaryContainer: "#2cc6ff",
  
  tertiary: "#5e3e8b",
  tertiaryContainer: "#008fcc",
  
  accent :"#62468d",
  
  // surface: palette.neutral99,
  // surfaceVariant: palette.neutralVariant90,
  // surfaceDisabled: palette.neutral99 ,
  background: "#f2f1fc",
  // error: palette.error40,
  // errorContainer: palette.error90,
  
}


export default styles;
