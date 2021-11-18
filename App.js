import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import Tabs from "./src/navigation/Tabs";
import OneSignal from "react-native-onesignal";
import { Provider, connect } from "react-redux";
import store from "./src/redux/store";
import { LogBox } from "react-native";
import SplashScreen from "react-native-splash-screen";
import Purchases from "react-native-purchases";
import AuthNavi from "./src/navigation/AuthNavi";
import { auth, firestore } from "./src/db/firebase";
import { FA5Style } from "react-native-vector-icons/FontAwesome5";

const App = () => {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(async () => {
    Purchases.setDebugLogsEnabled(true);
    Purchases.setup("zifxuZYCNFKPfOvPmTfCtFWrhgUhxezw");
    SplashScreen.hide();

    const { userId } = await OneSignal.getDeviceState();
    auth.onAuthStateChanged(async (user) => {
      setLoading(true);
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
            setUser(true);
            setLoading(false);
          })
          .catch((error) => {
            console.log("Error getting documents: ", error);
          });
      } else {
        setLoading(true);
        setUser(false);
        setLoading(false);
      }
    });
  }, [user]);

  return (
    <Provider store={store}>
      <NavigationContainer>
        {loading ? (
          <ActivityIndicator size="large" />
        ) : user ? (
          <Tabs />
        ) : (
          <AuthNavi />
        )}
        {LogBox.ignoreAllLogs()}
      </NavigationContainer>
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({});
