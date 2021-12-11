import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import Entypo from "react-native-vector-icons/Entypo";

const TopBar = ({ children }) => {
  return (
    <View style={styles.container}>
      {children && <View style={styles.side}>{children}</View>}

      <View style={styles.center}>
        <Image
          style={{ height: 100, width: 130 }}
          resizeMode="contain"
          source={require("./../assets/images/logo-bubble.png")}
        />
      </View>
      {children && <View style={styles.side}></View>}
    </View>
  );
};

export default TopBar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row-reverse",
    display: "flex",
    height: 100,
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
  },
  main: {
    alignItems: "center",
    width: "70%",
  },
  side: { width: "15%" },
});
