import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import TopBar from "./../../component/TopBar";
import { auth } from "../../db/firebase";
import firebase from "firebase/app"

const Profile = (props) => {
  var unsubscribeUserAuthStateChangedListener = null;


  useEffect(() => {

    return () => {
      if (unsubscribeUserAuthStateChangedListener) {
        unsubscribeUserAuthStateChangedListener();
      }
    }
  })

  const [number, setNumber] = useState("");
  return (
    <LinearGradient colors={["#DD488C", "#000"]} style={styles.linearGradient}>
      <SafeAreaView style={styles.main}>
        <TopBar />
        <View style={styles.Profile}>
          <Text style={styles.h1}>MON PROFIL </Text>
          <Image
            style={{ height: 70, width: 70, borderRadius: 70 }}
            resizeMode="contain"
            source={{ uri: "https://www.w3schools.com/howto/img_avatar.png" }}
          />
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
          <TextInput
            style={styles.input}
            onChangeText={setNumber}
            value={number}
            placeholder="genre"
            keyboardType="numeric"
          />
          <TouchableOpacity>
            <View style={styles.btn}>
              <Text style={styles.f}>MODIFIER</Text>
            </View>
          </TouchableOpacity>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Image
              style={{ height: 70, width: 70, borderRadius: 70 }}
              resizeMode="contain"
              source={require("./../../assets/images/rose.png")}
            />
            <Text style={styles.h2}>3</Text>
          </View>
          <TouchableOpacity>
            <View style={styles.btnopacity}>
              <Text style={styles.f}>ACHETAR</Text>
            </View>
            <TouchableOpacity
              style={styles.btnopacity}
              onPress={() => {
                unsubscribeUserAuthStateChangedListener = auth
                  .signOut()
                  .then(() => {
                    // Sign-out successful.
                    props.navigation.replace("Flow");
                  })
                  .catch(() => {
                    // An error happened.
                  });
              }}
            >
              <Text style={styles.f}>LOGOUT</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Profile;

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
