import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Colors from "./../../assets/colors/Colors";
import H1 from "./H1";
import WP from "./WP";

const CustomModal = ({ title, content, onPress, toggleModal }) => {
  return (
    <View style={styles.main}>
      <View style={styles.container}>
        {/* <TouchableOpacity onPress={toggleModal}>
          <WP>X</WP>
        </TouchableOpacity> */}

        <View style={styles.subContainer}>
          <H1>{title}</H1>
          <View style={styles.gap}>
            <WP>{content}</WP>
          </View>
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
    paddingVertical: 30,
  },
  subContainer: {
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
  },
  gap: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
});
