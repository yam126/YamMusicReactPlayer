import {StyleSheet, Dimensions} from 'react-native';
export const publicStyles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    flexDirection: 'column',
  },
  headerContainer: {
    width: Dimensions.get('window').width,
    height: 55,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
  },
});
