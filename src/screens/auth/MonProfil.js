import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import TopBar from './../../component/TopBar';
import Ionicons from 'react-native-vector-icons/Ionicons';

const MonProfil = ({...props}) => {
  const [number, setNumber] = useState('');
  return (
    <LinearGradient colors={['#DD488C', '#000']} style={styles.linearGradient}>
      <SafeAreaView style={styles.main}>
        <TopBar />
        <View style={styles.Profile}>
          <Text style={styles.h1}>MON PROFIL</Text>
        </View>
        <View style={styles.Form}>
          <TextInput
            style={styles.input}
            onChangeText={setNumber}
            value={number}
            placeholder="pseudo "
            keyboardType="numeric"
          />

          <TextInput
            style={styles.input}
            onChangeText={setNumber}
            value={number}
            placeholder="date de naissance"
            keyboardType="numeric"
          />

          <View style={styles.SelectGender}>
            <Ionicons style={styles.position} name="male-female" size={60} />

            <Ionicons style={styles.position} name="female" size={60} />
            <Ionicons style={styles.position} name="male" size={60} />
          </View>
          <View style={styles.uploadImg}>
            <Ionicons style={styles.position} name="md-camera" size={60} />
          </View>

          <TouchableOpacity onPress={() => props.navigation.push('Home')}>
            <View style={styles.btn}>
              <Text style={styles.f}>MODIFIER</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => props.navigation.navigate('FlowB')}>
            <View style={styles.btnopacity}>
              <Text style={styles.f}>VALIDER</Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default MonProfil;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    display: 'flex',
  },
  h1: {
    fontFamily: 'FredokaOne-Regular',

    color: '#fff',
    marginBottom: 15,
    fontSize: 30,
  },
  h2: {
    fontFamily: 'FredokaOne-Regular',
    color: '#fff',
    fontSize: 50,
    opacity: 0.5,
  },
  Profile: {alignItems: 'center', marginVertical: 30},

  linearGradient: {flex: 1},
  Form: {
    alignItems: 'center',
  },
  input: {
    width: '70%',
    borderRadius: 20,
    marginBottom: 19,
    height: 40,
    justifyContent: 'space-between',
    paddingHorizontal: 60,
    backgroundColor: '#fff',
  },
  btn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 12,
    marginTop: 20,
  },
  btnopacity: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 12,
    opacity: 0.5,
  },
  f: {
    fontFamily: 'FredokaOne-Regular',
  },
  SelectGender: {
    height: 100,
    width: '70%',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 17,
  },
  uploadImg: {
    height: 100,
    width: '70%',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 17,
    marginTop: 10,
  },
});
