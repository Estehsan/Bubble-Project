import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity, Button,
  ActivityIndicator, Platform,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import InputF from "../../component/InputF";
import { emailValidator } from "../../helpers/emailValidator";
import { passwordValidator } from "../../helpers/passwordValidator";
import TopBar from "./../../component/TopBar";
import DateTimePicker from '@react-native-community/datetimepicker';

// This is signUp SCREEN

// let handlecheck = (email, password) => {

// }

const FlowA = ({ ...props }) => {

  const [email, setEmail] = useState({ value: '', error: '' });
  const [errorText, setErrorText] = useState('');

  // DatePicker 
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };
  // Date Picker End

  return (
    <>
      <LinearGradient colors={["#DD488C", "#000"]} style={styles.linearGradient}>
        <SafeAreaView style={styles.main}>
          <TopBar />

          <View style={styles.Profile}>
            <Text style={styles.h1}>SE CONNECTER </Text>
          </View>
          <View style={styles.Form}>


            <InputF onChangeText={(e) => setEmail({ value: e, error: '' })}
              value={email.value}
              error={email.error}
              errorText={email.error}
              placeholder="pseudo"
              keyboardType="default" />

            {/* DataPicker Start */}


            {
              show ? (
                <View style={{
                  width: "100%",
                }}>

                  <DateTimePicker
                    style={{ marginHorizontal: "15%", backgroundColor: 'white', }}
                    testID="dateTimePicker"
                    value={date}
                    mode={mode}
                    is24Hour={true}
                    display="default"
                    onChange={onChange}
                  />
                </View>
              ) : (


                <View style={{
                  width: "100%",
                  alignItems: 'center'

                }}>
                  <TouchableOpacity style={{
                    width: "70%",
                    borderRadius: 20,
                    height: 40,
                    justifyContent: "space-between",
                    paddingHorizontal: 60,
                    alignContent: 'center',
                    justifyContent: 'center',
                    backgroundColor: "#fff",
                    color: "black",
                  }}
                    onPress={showDatepicker}
                  >
                    <Text style={{ opacity: 0.5 }}>date de naissance</Text>
                  </TouchableOpacity>
                </View>


              )
            }

            {/* DatePickerEnd */}
            {errorText ?
              <View style={styles.Error}>
                <Text style={{ color: 'white' }}>{errorText}</Text>
              </View>
              : null}

            <TouchableOpacity
              onPress={() => {
                const emailError = emailValidator(email.value)

                if (emailError) {
                  setEmail({ ...email, error: emailError })
                }




                if (!emailError)


                  props.navigation.push("MonProfil", { email: email.value, date: date });
              }}
            >
              <View style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 20 }}>
                <View style={styles.btnopacity}>

                  <Text style={styles.f}>VALIDER</Text>
                </View>
              </View>

            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient >

    </>
  );
};

export default FlowA;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    display: "flex",
  },
  h1: {
    fontFamily: "FredokaOne-Regular",

    color: "#fff",
    marginBottom: 15,
    fontSize: 30,
  },
  h2: {
    fontFamily: "FredokaOne-Regular",
    color: "#fff",
    fontSize: 50,
    opacity: 0.5,
  },
  Profile: { alignItems: "center", marginVertical: 30 },

  linearGradient: { flex: 1 },

  input: {
    width: "70%",
    borderRadius: 20,
    marginBottom: 19,
    height: 40,
    justifyContent: "space-between",
    paddingHorizontal: 60,
    backgroundColor: "#fff",
    color: "black"
  },
  btn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 12,
  },
  btnopacity: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 12,
    opacity: 0.5,
  },
  f: {
    fontFamily: "FredokaOne-Regular",
  },
  Error: {
    marginHorizontal: '16%',
    marginTop: 10
  }
});
