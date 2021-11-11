import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import TopBar from "../../component/TopBar";
import { auth, messaging, firestore } from "../../db/firebase";
import OneSignal from "react-native-onesignal";

const AuthLoading = ({ navigation }) => {
  useEffect(async () => {
    const { userId } = await OneSignal.getDeviceState();
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        let datum = await firestore
          .collection("users")
          .doc(user.uid)
          .get()
          .then(async (doc) => {
            if (
              doc.data().notificationId != userId ||
              !doc.data().notificationId
            ) {
              await firestore.collection("users").doc(user.uid).update({
                notificationId: userId,
              });
            }
            navigation.reset({ routes: [{ name: "Home" }] });
          })
          .catch((error) => {
            console.log("Error getting documents: ", error);
          });
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
