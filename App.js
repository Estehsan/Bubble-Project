import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Tabs from "./src/navigation/Tabs";
import createStackNavigator from "@react-navigation/stack";
import { Provider } from "react-redux";
import store from "./src/redux/store";
import { LogBox } from "react-native";
import SplashScreen from "react-native-splash-screen";

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  return (
    <Provider store={store}>
      <NavigationContainer>
        {LogBox.ignoreAllLogs()}
        <Tabs />
      </NavigationContainer>
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({});







