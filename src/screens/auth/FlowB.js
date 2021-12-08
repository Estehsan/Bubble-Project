import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
  Button,
  ActivityIndicator,
  Platform,
  ImageBackground,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import InputF from "../../component/InputF";
import { nameValidator } from "../../helpers/nameValidator";
import TopBar from "./../../component/TopBar";
import DateTimePicker from "@react-native-community/datetimepicker";
import ValiderBtn from "./../../component/basic/ValiderBtn";

import { TextInputMask } from "react-native-masked-text";

// This is signUp SCREEN

// let handlecheck = (email, password) => {

// }

const FlowA = ({ ...props }) => {
  const [FirstName, setFirstName] = useState({ value: "", error: "" });
  const [DOB, setDOB] = useState();

  const [errorText, setErrorText] = useState("");

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  return (
    <>
      <LinearGradient
        colors={["#000", "#DD488C"]}
        style={styles.linearGradient}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <SafeAreaView style={styles.main}>
            
              <View style={styles.center}>
                <Image
                  style={{ height: 100, width: 130 }}
                  resizeMode="contain"
                  source={require("./../../assets/images/logo-bubble.png")}
                />
              </View>
              <View style={styles.Profile}>
                <Text style={styles.h1}>S'inscrire</Text>
              </View>
              <View style={styles.Form}>
                <InputF
                  onChangeText={(e) => setFirstName({ value: e, error: "" })}
                  value={FirstName.value}
                  error={FirstName.error}
                  errorText={FirstName.error}
                  placeholder="Pseudo"
                  keyboardType="default"
                />

                {/* DataPicker Start */}
                <View
                  style={{
                    width: "100%",
                    alignItems: "center",
                  }}>
                  <TextInputMask
                    placeholder="Date de naissance 27/06/1992"
                    placeholderTextColor="black"
                    style={styles.input}
                    refInput={(ref) => (this.myDateText = ref)}
                    type={"datetime"}
                    value={DOB}
                    onChangeText={(e) => {
                      setDOB(e);
                    }}
                    options={{
                      format: "DD/MM/YYYY",
                    }}
                  />
                </View>

                {/* DatePickerEnd */}
                {errorText ? (
                  <View style={styles.Error}>
                    <Text style={{ color: "white" }}>{errorText}</Text>
                  </View>
                ) : null}
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    marginVertical: 20,
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      // const emailError = emailValidator(email.value)

                      const firstNameError = nameValidator(FirstName.value);

                      if (firstNameError) {
                        setFirstName({ ...FirstName, error: firstNameError });
                      }

                      if (!firstNameError)
                        props.navigation.push("MonProfil", {
                          name: FirstName.value,
                          date: DOB,
                        });
                    }}>
                    <ValiderBtn />
                  </TouchableOpacity>
                </View>
              </View>
            </SafeAreaView>
          </TouchableWithoutFeedback>
      </LinearGradient>
    </>
  );
};

export default FlowA;

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
  },
  main: {
    justifyContent: "center",

    flex: 1,
  },
  center: {
    alignItems: "center",
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

  input: {
    width: "70%",
    borderRadius: 20,
    marginBottom: 19,
    height: 40,
    justifyContent: "space-between",
    paddingHorizontal: 20,
    textAlign: "center",

    backgroundColor: "#fff",
    color: "black",
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
    marginHorizontal: "16%",
    marginTop: 10,
  },
});
