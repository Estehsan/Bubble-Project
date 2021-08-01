import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Colors from "../assets/colors/Colors";
import { useNavigation } from "@react-navigation/native";
import UsersListPlace from "../screens/user/Drink/UsersListPlace";

const SearchFlatList = ({ item }) => {
  return (
    <Pressable style={styles.row}>
      <View style={styles.iconContainer}>
        <Icon
          style={styles.position}
          name="ios-location-sharp"
          size={30}
          color="#DD488C"
        />
      </View>
      <View>
        <Text styles={styles.locationText}>{item.description}</Text>
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
    paddingHorizontal: 10,

    borderBottomWidth: 1,
    borderColor: "lightgrey",
    ...Colors.customShadow,
  },
  iconContainer: {
    backgroundColor: "#b2bec3",
    padding: 5,
    borderRadius: 10,
    marginRight: 10,
  },
  locationText: {
    color: "#fff",
  },
});
