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
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import InputF from "../../component/InputF";
import { nameValidator } from "../../helpers/nameValidator";
import TopBar from "./../../component/TopBar";
import DateTimePicker from "@react-native-community/datetimepicker";

// This is signUp SCREEN

// let handlecheck = (email, password) => {

// }

const FlowA = ({ ...props }) => {
  const [FirstName, setFirstName] = useState({ value: "", error: "" });
  const [errorText, setErrorText] = useState("");

  // DatePicker
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [showDate, setShowDate] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
    setShowDate(true);
  };
  // Date Picker End

  return (
    <>
      <LinearGradient
        colors={["#DD488C", "#000"]}
        style={styles.linearGradient}>
        <SafeAreaView style={styles.main}>
          <View style={styles.center}>
            <Image
              style={{ height: 100, width: 130 }}
              resizeMode="contain"
              source={require("./../../assets/images/logo-bubble.png")}
            />
          </View>
          <View style={styles.Profile}>
            <Text style={styles.h1}>S'inscrire </Text>
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

            {show ? (
              <View
                style={{
                  width: "100%",
                  color: "black",
                }}>
                <DateTimePicker
                  style={{
                    marginHorizontal: "15%",
                    backgroundColor: "white",
                    color: "black",
                  }}
                  testID="dateTimePicker"
                  value={date}
                  mode={mode}
                  is24Hour={true}
                  display="default"
                  onChange={onChange}
                />
              </View>
            ) : (
              <View
                style={{
                  width: "100%",
                  alignItems: "center",
                }}>
                <TouchableOpacity
                  style={{
                    width: "70%",
                    borderRadius: 20,
                    height: 40,
                    justifyContent: "space-between",
                    paddingHorizontal: 60,
                    alignContent: "center",
                    justifyContent: "center",
                    backgroundColor: "#fff",
                    color: "black",
                  }}
                  onPress={showDatepicker}>
                  <Text style={{ opacity: 0.5 }}>
                    {showDate ? (
                      date.toDateString()
                    ) : (
                      <Text>Date de naissance</Text>
                    )}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* DatePickerEnd */}
            {errorText ? (
              <View style={styles.Error}>
                <Text style={{ color: "white" }}>{errorText}</Text>
              </View>
            ) : null}

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
                    date: date,
                  });
              }}>
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  marginVertical: 20,
                }}>
                <View style={styles.btnopacity}>
                  <Text style={styles.f}>VALIDER</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
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
    paddingHorizontal: 60,
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
