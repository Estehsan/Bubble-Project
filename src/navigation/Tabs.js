import React from "react";

import { Platform, StyleSheet, Text, View } from "react-native";
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
import Reset from "./../screens/auth/Reset";

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
import PlacesDetails from "../screens/user/Drink/PlacesDetails";
import Scan from "../screens/extra/Scan";

const Tab = createBottomTabNavigator();

function Tabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        activeTintColor: "#DD488C",
        inactiveTintColor: "black",
        showLabel: false,
        style: {
          position: "absolute",
          marginHorizontal: "10%",
          marginVertical: "10%",
          elevation: 0,
          alignContent: "center",

          borderRadius: 30,
          ...styles.shadow,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={AllScreens}
        options={{
          tabBarIcon: ({ color }) => (
            <MIcon
              style={Platform.OS == "ios" ? styles.position : styles.position2}
              name="home"
              size={38}
              color={color}
            />
          ),
        }}
      />
      {/* <Tab.Screen
        name="AchatUser"
        component={AchatUser}
        options={{
          tabBarIcon: ({color}) => (
            <MIcon style={styles.position} name="home" size={30} color={color} />
          ),
        }}
      /> */}
      <Tab.Screen
        name="Message"
        component={Message}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons
              style={Platform.OS == "ios" ? styles.position : styles.position2}
              name="chatbubbles"
              size={35}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Drink"
        component={Drink}
        options={{
          tabBarIcon: ({ color }) => (
            <McIcon
              style={Platform.OS == "ios" ? styles.position : styles.position2}
              name="glass-cocktail"
              size={35}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color }) => (
            <FaIcon
              style={Platform.OS == "ios" ? styles.position : styles.position2}
              name="user-alt"
              size={30}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
const All = createStackNavigator();
const screenOptionStyle = {
  headerShown: false,
};

function AllScreens() {
  return (
    <All.Navigator
      screenOptions={screenOptionStyle}
      initialRouteName="AuthLoading">
      <All.Screen
        name="AuthLoading"
        component={AuthLoading}
        options={{ headerShown: false }}
      />
      <All.Screen
        name="Flow"
        component={Flow}
        options={{ headerShown: false, tabBarVisible: false }}
      />
      <All.Screen
        name="FlowA"
        component={FlowA}
        options={{ headerShown: false }}
      />
      <All.Screen
        name="FlowB"
        component={FlowB}
        options={{ headerShown: false, tabBarVisible: false }}
      />
      <All.Screen
        name="Reset"
        component={Reset}
        options={{ headerShown: false }}
      />
      <All.Screen name="Home" component={Home} />
      <All.Screen name="MonProfil" component={MonProfil} />
      {/* <All.Screen name="Drink" component={Drink} />
      <All.Screen name="Message" component={Message} /> */}

      <All.Screen name="UsersListPlace" component={UsersListPlace} />
      <All.Screen name="PlacesDetails" component={PlacesDetails} />
      <All.Screen name="Scan" component={Scan} />

      <All.Screen
        options={{ headerShown: true }}
        name="ChatUser"
        component={ChatUser}
      />
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
    top: "40%",
  },
  position2: {
    top: "0%",
  },
});
