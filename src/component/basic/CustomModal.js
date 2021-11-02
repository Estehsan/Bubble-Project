import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import Colors from "./../../assets/colors/Colors";
import H1 from "./H1";
import WP from "./WP";

const CustomModal = ({ title, content, onPress }) => {
  return (
    <View style={styles.main}>
      <View style={styles.container}>
        <H1>{title}</H1>
        <View style={styles.gap}>
          <WP>{content}</WP>
        </View>
      </View>
    </View>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  main: { justifyContent: "center", alignItems: "center" },
  container: {
    backgroundColor: Colors.darkPink,
    padding: 10,
    width: "60%",
    justifyContent: "center",
    paddingVertical: 30,
    alignContent: "center",
    alignItems: "center",
  },
  gap: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
});
