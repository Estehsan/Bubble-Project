import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

const SearchBar = () => {
  const [number, onChangeNumber] = React.useState(null);

  return (
    <View>
      <View style={{flex: 1, alignItems: 'center'}}>
        <View style={styles.inputField}>
          <TextInput
            style={styles.input}
            onChangeText={onChangeNumber}
            value={number}
            placeholder="useless placeholder"
            keyboardType="numeric"
          />
          <TouchableOpacity
            style={{alignItems: 'center', justifyContent: 'center'}}
            underlayColor="transparent">
            <View>
              <EvilIcons name="search" size={35} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  input: {
    width: '90%',
  },
  inputField: {
    height: 40,

    backgroundColor: '#fff',
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: 20,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
});
