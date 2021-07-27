import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import Colors from './../assets/colors/Colors';
import Entypo from 'react-native-vector-icons/Entypo';
import Fontisto from 'react-native-vector-icons/Fontisto';

const LocationTab = () => {
  return (
    <View style={styles.container}>
      <View style={styles.lBox}>
        <TouchableOpacity>
          <View style={styles.highlight}>
            <Text style={styles.fstyle}>MOINS DE 10 KM</Text>
          </View>
        </TouchableOpacity>
        <View style={{justifyContent: 'center'}}>
          <TouchableOpacity>
            <Text style={styles.fstyle}>MOINS DE 1 KM</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.rBox}>
        <TouchableOpacity>
          <View style={styles.shiglight}>
            <Entypo color="#f9d71c" name="moon" size={20} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View style={{justifyContent: 'center'}}>
            <Fontisto color="#f9d71c" name="sun" size={20} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LocationTab;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  lBox: {
    width: '60%',
    height: 'auto',
    paddingHorizontal: -4,
    paddingVertical: 5,
    justifyContent: 'space-around',
    display: 'flex',
    flexDirection: 'row',
    shadowColor: 'box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5)',

    backgroundColor: '#fff',
    borderRadius: 18,
    ...Colors.customShadow,
  },
  rBox: {
    width: '25%',
    height: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-around',
    shadowColor: 'box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    backgroundColor: '#fff',
    ...Colors.customShadow,
    borderRadius: 17,
  },
  highlight: {
    backgroundColor: Colors.darkPink,
    paddingHorizontal: 15,
    borderRadius: 18,
    justifyContent: 'center',
    ...Colors.customShadow,
    paddingVertical: 5,
  },
  shiglight: {
    backgroundColor: Colors.darkPink,
    paddingVertical: 2,
    borderRadius: 17,
    ...Colors.customShadow,
    paddingHorizontal: 10,
  },
  fstyle: {fontSize: 10},
});
