import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import TopBar from "../../component/TopBar";
import { auth, messaging } from "../../db/firebase";

const AuthLoading = ({ navigation }) => {
  useEffect(async () => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.reset({ routes: [{ name: "Home" }] });
      } else {
        navigation.reset({ routes: [{ name: "Flow" }] });
      }
    });
  }, []);

  return (
    <LinearGradient colors={["#000", "#DD488C"]} style={styles.linearGradient}>
      <TopBar />
      <View style={{ margin: 20 }}>
        <ActivityIndicator size="large" />
      </View>
    </LinearGradient>
  );
};

export default AuthLoading;

const styles = StyleSheet.create({
  linearGradient: {
    justifyContent: "center",
    flex: 1,
  },
});
