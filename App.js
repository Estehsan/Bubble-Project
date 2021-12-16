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
import Colors from "./src/assets/colors/Colors";

const App = () => {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);
  const navigationRef = React.useRef(null);
  const [noTabBar, setNoTabBar] = useState(false);

  useEffect(async () => {
    Purchases.setDebugLogsEnabled(true);
    Purchases.setup("zifxuZYCNFKPfOvPmTfCtFWrhgUhxezw");
    SplashScreen.hide();

    const state = navigationRef.current?.getRootState();
    const unsubscribe = navigationRef.current?.addListener('state', (e) => {
      
      if(navigationRef.current?.getCurrentRoute().name == "ChatUser"){
        setNoTabBar(true)
      }
      else{
        setNoTabBar(false)
      }
    });

    console.log('-------> 0.1')

    setLoading(false);

    const { userId } = await OneSignal.getDeviceState();
    auth.onAuthStateChanged(async (user) => {

      console.log('-------> 0.2')

      setLoading(false);

      if (user) {

        let datum = await firestore
          .collection("users")
          .doc(user.uid)
          .get()
          .then(async (doc) => {
            let data = doc.data();
            if (
              data &&
              data != undefined
            ) {
              console.log('------> 1')
              await firestore.collection("users").doc(user.uid).update({
                notificationId: userId,
              });
            }
            console.log('------> 2')
            setUser(true);
            setLoading(false);
          })
          .catch((error) => {
            console.log('------> 3')
            console.log("Impossible de récupérer les documents: ", error);
          });
      } else {
        setLoading(true);
        setUser(false);
        setLoading(false);
      }
    });
  }, [user]);

  return (
    <Provider store={store} >
      <View style={{ 
        flex: 1,
        marginBottom: noTabBar ? -200 : 0
       }}>
        <NavigationContainer  ref={navigationRef}>
          {loading ? (
            <ActivityIndicator size="large" />
          ) : user ? (
            <Tabs />
          ) : (
            <AuthNavi />
          )}
          {LogBox.ignoreAllLogs()}
        </NavigationContainer>
      </View>
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({});
