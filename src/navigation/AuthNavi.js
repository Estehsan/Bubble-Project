import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import FlowA from "../screens/auth/FlowA";
import Flow from "../screens/auth/Flow";
import FlowB from "../screens/auth/FlowB";
import Reset from "../screens/auth/Reset";
import AuthLoading from "../screens/auth/AuthLoading";
import MonProfil from "../screens/auth/MonProfil";

const AuthScreens = createStackNavigator();

const AuthNavi = () => {
  return (
    <AuthScreens.Navigator
      initialRouteName="Flow"
      screenOptions={{
        headerShown: false,
      }}>
      {/* <AuthScreens.Screen name="AuthLoading" component={AuthLoading} /> */}
      <AuthScreens.Screen name="Flow" component={Flow} />
      <AuthScreens.Screen name="MonProfil" component={MonProfil} />

      <AuthScreens.Screen name="FlowA" component={FlowA} />
      <AuthScreens.Screen name="FlowB" component={FlowB} />
      <AuthScreens.Screen name="Reset" component={Reset} />
    </AuthScreens.Navigator>
  );
};

export default AuthNavi;

const styles = StyleSheet.create({});
