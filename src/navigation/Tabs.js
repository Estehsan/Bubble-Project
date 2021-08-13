import React from "react";

import { StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import FaIcon from "react-native-vector-icons/FontAwesome5";
import MIcon from "react-native-vector-icons/MaterialIcons";
import McIcon from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";

import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import AuthLoading from "./../screens/auth/AuthLoading";
import Flow from "./../screens/auth/Flow";
import FlowA from "./../screens/auth/FlowA";
import FlowB from "./../screens/auth/FlowB";

import Home from "../screens/user/Home";
import Message from "../screens/user/Message";
import Profile from "../screens/user/Profile";
import { MaterialIcon } from "./components/Icon";
import Drink from "../screens/user/Drink";
import MonProfil from "../screens/auth/MonProfil";
import AchatUser from "../screens/extra/AchatUser";

import Fiche from "../screens/extra/Fiche";
import UsersListPlace from "../screens/user/Drink/UsersListPlace";
import ChatUser from "../component/ChatUser";

import { connect } from "react-redux";

const Stack = createBottomTabNavigator();

function BottomTabNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        activeTintColor: "blue",
        showLabel: false,
        style: {
          position: "absolute",
          bottom: 25,
          left: 40,
          right: 40,
          alignContent: "center",
          elevation: 0,
          height: 70,
          borderRadius: 30,
          ...styles.shadow,
        },
      }}
    >
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => (
            <MIcon style={styles.position} name="home" size={30} />
          ),
        }}
      />
      {/* <Stack.Screen
        name="AchatUser"
        component={AchatUser}
        options={{
          tabBarIcon: ({focused}) => (
            <MIcon style={styles.position} name="home" size={30} />
          ),
        }}
      /> */}
      <Stack.Screen
        name="Message"
        component={Message}
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons style={styles.position} name="chatbubbles" size={30} />
          ),
        }}
      />
      <Stack.Screen
        name="Drink"
        component={Drink}
        options={{
          tabBarIcon: ({ focused }) => (
            <McIcon style={styles.position} name="glass-cocktail" size={30} />
          ),
        }}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ focused }) => (
            <FaIcon style={styles.position} name="user-alt" size={30} />
          ),
        }}
      />
    </Stack.Navigator>
  );
}
const All = createStackNavigator();
const screenOptionStyle = {
  headerShown: false,
};
function Tabs() {
  return (
    <All.Navigator
      screenOptions={screenOptionStyle}
      initialRouteName="AuthLoading"
    >
      <All.Screen
        name="AuthLoading"
        component={AuthLoading}
        options={{ headerShown: false }}
      />
      <All.Screen
        name="Flow"
        component={Flow}
        options={{ headerShown: false }}
      />

      <All.Screen
        name="FlowA"
        component={FlowA}
        options={{ headerShown: false }}
      />
      <All.Screen
        name="FlowB"
        component={FlowB}
        options={{ headerShown: false }}
      />
      <All.Screen name="Home" component={BottomTabNavigator} />

      <All.Screen name="MonProfil" component={MonProfil} />
      <All.Screen name="Drink" component={Drink} />
      <All.Screen name="Message" component={Message} />
      <All.Screen name="UsersListPlace" component={UsersListPlace} />
      <All.Screen name="ChatUser" component={ChatUser} />
      <All.Screen name="Fiche" component={Fiche} />
      <All.Screen name="Profile" component={Profile} />
      <All.Screen name="AchatUser" component={AchatUser} />
    </All.Navigator>
  );
}

export default Tabs;

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#7f5d50",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 3.6,
    elevation: 5,
  },
  position: {
    justifyContent: "center",
    alignContent: "center",
    top: 15,
  },
});
