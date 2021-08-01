import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Tabs from "./src/navigation/Tabs";
import createStackNavigator from "@react-navigation/stack";
import { Provider } from "react-redux";
import store from "./src/redux/store";
import { LogBox } from "react-native";
import SplashScreen from "react-native-splash-screen";
import { auth, storage, firestore } from "./src/db/firebase";
import { current_User } from "./src/redux/action";
import { connect } from 'react-redux';


const App = (props) => {

  useEffect(() => {
    if (props.current_User)
    {
      props.navigation.push("Home")
    }
    else{
      props.navigation.push("Flow")
    }
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

const mapDispatchToProps = dispatch => {
  return {
    current_User: () => dispatch(current_User()),
  }
}

export default connect(null, mapDispatchToProps)(App);

const styles = StyleSheet.create({});
