import React from "react";
import { StyleSheet, Text, View } from "react-native";

const P = (props) => {
  return <Text style={styles.Title} {...props} />;
};

export default P;

const styles = StyleSheet.create({
  Title: {
    fontFamily: "Montserrat-Regular",
    fontSize: 12,
    fontWeight: "300",
    lineHeight: 15,
    paddingVertical: 3,
  },
});
