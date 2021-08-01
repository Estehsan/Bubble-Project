import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const SearchFlatList = ({ item }) => {
  return (
    <Pressable
      style={styles.row}
      onPress={() => navigation.navigate("UsersListPlace")}
    >
      <View style={styles.iconContainer}>
        <Icon style={styles.position} name="ios-location-sharp" size={30} />
      </View>
      <View>
        <Text styles={styles.locationText}>{item.content}</Text>
      </View>
    </Pressable>
  );
};

export default SearchFlatList;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "lightgrey",
  },
  iconContainer: {
    backgroundColor: "#b2bec3",
    padding: 5,
    borderRadius: 10,
    marginRight: 10,
  },
});
