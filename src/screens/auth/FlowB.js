import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import InputF from "../../component/InputF";
import { emailValidator } from "../../helpers/emailValidator";
import { passwordValidator } from "../../helpers/passwordValidator";
import TopBar from "./../../component/TopBar";
// This is signUp SCREEN

// let handlecheck = (email, password) => {

// }

const FlowA = ({ ...props }) => {
  const [email, setEmail] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });

  return (
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

          <InputF onChangeText={(e) => setEmail({ value: e, error: '' })}
            secureTextEntry={true}
            onChangeText={(e) => setPassword({ value: e, error: '' })}
            value={password.value}
            error={password.error}
            errorText={password.error}
            placeholder="date de naissance"
            keyboardType="default" />


          <TouchableOpacity
            onPress={() => {
              const emailError = emailValidator(email.value)
              const passwordError = passwordValidator(password.value)

              if (emailError || passwordError) {
                setEmail({ ...email, error: emailError })
                setPassword({ ...password, error: passwordError })
              }

              if (!emailError & !passwordError)

                props.navigation.push("MonProfil", { email: email.value, password: password.value });
            }}
          >

            <View style={styles.btnopacity}>

              <Text style={styles.f}>VALIDER</Text>
            </View>

          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient >
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
  Form: {
    alignItems: "center",
  },
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
});
