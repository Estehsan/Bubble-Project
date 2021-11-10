import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

const InputF = ({ errorText, description, ...props }) => {
  return (
    <View style={styles.container}>
      <TextInput
        placeholderTextColor="black"
        style={[
          errorText
            ? { borderColor: "red", borderWidth: 2.5, ...styles.input }
            : styles.input,
        ]}
        keyboardType="default"
        {...props}
      />
      {description && !errorText ? (
        <View style={styles.Error}>
          <Text style={{ color: "white" }}>{description}</Text>
        </View>
      ) : null}
      {errorText ? (
        <View style={styles.Error}>
          <Text style={{ color: "white" }}>{errorText}</Text>
        </View>
      ) : null}
    </View>
  );
};

export default InputF;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 19,
  },
  input: {
    textAlign: "center",
    width: "70%",
    borderRadius: 20,
    height: 40,
    backgroundColor: "#fff",
  },
  Error: {
    color: "white",
    width: "70%",
    paddingVertical: 5,
    alignContent: "flex-start",
  },
});
