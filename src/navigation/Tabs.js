import React, { useEffect, useState } from "react";

import { Platform, StyleSheet, Text, View, Image } from "react-native";
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
import { auth } from "../db/firebase";

import Colors from "../assets/colors/Colors";
import { ifIphoneX } from 'react-native-iphone-x-helper'


const Tab = createBottomTabNavigator();
let currentRouteName = "";

console.log("PLATFORM VERSION: ", Platform)

function Tabs() {
  getTabBarVisibility = (route) => {
    const routeName = route.state
      ? route.state.routes[route.state.index].name
      : '';
  
    currentRouteName = routeName;

    // ChatUser
    if (routeName === 'ChatUser') {
      return false;
    }
  
    return true;
  }

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarStyle: {
          //background: "red"
        },
      }}
      sceneContainerStyle={{ 
        
      }}

      // tabBar={props => <TabBar {...props} />}
      
      tabBarOptions={{
        activeTintColor: "#DD488C",
        inactiveTintColor: "black",
        showLabel: false,
        
        style: {
          height: 60,
          position: "absolute",
          marginHorizontal: "10%",
          marginBottom: "10%",
          // bottom: 30,
          //elevation: 0,
          alignContent: "center",
          

          borderRadius: 30,
          ...styles.shadow,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={AllScreens}
        
        options={({ route }) => {
          return {
            // tabBarVisible: false,
            // tabBarBadge: 3,
            tabBarIcon: ({ color }) => (
              <MIcon
                style={Platform.OS == "ios" ? styles.position : styles.position2}
                name="home"
                size={38}
                color={color}
              />
            ),
          }
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
        //tabBarBadge: false,
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
          tabBarIcon: ({ color }) => {
            let button;
            if (color != "black") {
              button = (<View style={{height: 60, display: "flex",alignItems:"center",justifyContent:"center"}}><Image resizeMode={"contain"} source={require('../assets/images/marker.png')} style={[Platform.OS == "ios" ? styles.position : styles.position2], {
                width: 35,
                ...ifIphoneX({
                  marginTop: 30,
                }, {
                  marginTop: 0
                })
              }} /></View>);
            } else {
              button = <View style={{height: 60, flex: 1,display: "flex",alignItems:"center",justifyContent:"center"}}><Image resizeMode={"contain"} source={require('../assets/images/marker-black.png')} style={[Platform.OS == "ios" ? styles.position : styles.position2], {
                width: 35,
                ...ifIphoneX({
                  marginTop: 30,
                }, {
                  marginTop: 0
                })
              }} /></View>;
            }
            return button;
          },
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
    <All.Navigator screenOptions={screenOptionStyle} initialRouteName="Home">
      {/* <All.Screen
        name="AuthLoading"
        component={AuthLoading}
        options={{ headerShown: false }}
      /> */}
      {/* <All.Screen
        name="Flow"
        component={AuthNavi}
        options={{ headerShown: false, tabBarVisible: false }}
      /> */}
      {/* <All.Screen
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
      /> */}
      <All.Screen name="Home" component={Home} />
      <All.Screen name="MonProfil" component={MonProfil} />
      {/* <All.Screen name="Drink" component={Drink} />
      <All.Screen name="Message" component={Message} /> */}

      <All.Screen name="UsersListPlace" component={UsersListPlace} />
      <All.Screen name="PlacesDetails" component={PlacesDetails} />
      <All.Screen name="Scan" component={Scan} />

      <All.Screen
        options={{
          headerShown: true,
          tabBarVisible: false
        }}
        
        name="ChatUser"
        component={ChatUser}
      />
      
      <All.Screen name="Fiche" component={Fiche} />
      <All.Screen name="Profile" component={Profile} />
      <All.Screen name="AchatUser" component={AchatUser} />
    </All.Navigator>
  );
}
// const AuthScreens = createStackNavigator();

// const AuthNavi = () => {
//   return (
//     <AuthScreens.Navigator
//       initialRouteName="AuthLoading"
//       screenOptions={{
//         headerShown: false,
//       }}>
//       <AuthScreens.Screen name="AuthLoading" component={AuthLoading} />
//       <AuthScreens.Screen name="Flow" component={Flow} />
//       <AuthScreens.Screen name="FlowA" component={FlowA} />
//       <AuthScreens.Screen name="FlowB" component={FlowB} />
//       <AuthScreens.Screen name="Reset" component={Reset} />
//     </AuthScreens.Navigator>
//   );
// };

export default Tabs;

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#7f5d50",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 3.6,
    //levation: 5,
  },
  position: {
    ...ifIphoneX({
      top: "40%",
    }, {
      top: "0%",
    })
  },
  position2: {
    top: "0%",
  },
});
