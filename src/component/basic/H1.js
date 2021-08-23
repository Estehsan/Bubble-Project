import React from "react";
import { StyleSheet, Text, View } from "react-native";

const H1 = (props) => {
    return <Text style={styles.Title} {...props} />;
};

export default H1;

const styles = StyleSheet.create({
    Title: {
        fontFamily: "FredokaOne-Regular",
        fontSize: 25,
        color: 'white',
        flexWrap: "wrap",
    },
});
