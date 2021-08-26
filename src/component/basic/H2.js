import React from "react";
import { StyleSheet, Text, View } from "react-native";

const H2 = (props) => {
  return <Text style={styles.Title} {...props} />;
};

export default H2;

const styles = StyleSheet.create({
  Title: {
    fontFamily: "FredokaOne-Regular",
    fontSize: 15,
    lineHeight: 15,
    paddingVertical: 3,
    textTransform: 'uppercase',

    flexWrap: "wrap",
  },
});
