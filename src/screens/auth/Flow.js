import React, { useEffect, useState } from "react";
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
import TopBar from "../../component/TopBar";

import { auth } from "../../db/firebase";

//  Login or Register Button

function Flow(props) {
  return (
    <LinearGradient colors={["#000", "#DD488C"]} style={styles.linearGradient}>
      <SafeAreaView style={styles.main}>
        <TopBar />

        <View style={styles.Form}>
          <TouchableOpacity onPress={() => props.navigation.push("FlowA")}>
            <View style={styles.btn}>
              <Text style={styles.f}>CONNEXION</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => props.navigation.navigate("FlowB")}>
            <View style={styles.btn}>
              <Text style={styles.f}>INSCRIPTION</Text>


            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

export default Flow;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    display: "flex",
  },
  h1: {
    fontFamily: "FredokaOne-Regular",
    fontSize: 30,

    color: "#fff",
    marginBottom: 15,
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
    flex: 1,
    justifyContent: "center",
    marginBottom: 30,
    display: "flex",
  },

  btn: {
    paddingHorizontal: 60,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 12,
  },

  f: {
    fontFamily: "FredokaOne-Regular",
  },
});
