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
  // background: '#fff',
  blueBG: '#265AE8',
  textGray: '#3E3F41',
  cardBG: '#fff',
  textRed : "#DD105E",
  yellow :"#FFAF4F",
  purpleLight:"#62468d",
  grayBG : "#D9D9D9"
};

export const darkPalette = {
  background: '#212121',
  blueBG: '#265AE8',
  textGray: '#3E3F41',
  cardBG: '#3E3F41',
  textRed : "#DD105E",
  yellow :"#FFAF4F",
  purpleLight:"#AC8DAF"

  // accent :"#62468d",
};

export default styles;
