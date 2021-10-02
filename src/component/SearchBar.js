import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import Icon from "react-native-vector-icons/Ionicons";
import SearchFlatList from "./SearchFlatList";

const SearchBar = ({ ...props }) => {
  const [search, onSearch] = React.useState(null);

  return (
    <View style={styles.container}>
      <View>
        <GooglePlacesAutocomplete
          placeholder="Where You wanna go ? "
          onPress={(data, details = null) => {
            // 'details' is provided when fetchDetails = true
            console.log(data, details);
            const city = city.description.split(",")[0];
            props.navigation.navigate("UsersListPlace");
          }}
          fetchDetails
          styles={{
            textInput: styles.inputField,
          }}
          query={{
            key: "AIzaSyCI4_jhTZcxnYHla6xmzgatq4s_blaURno",
            language: "en",
          }}
          currentLocation={true}
          suppressDefaultStyles
          currentLocationLabel="Current location"
          renderRow={(item) => <SearchFlatList item={item} />}
        />
      </View>

      {/* <View
        style={{
          alignItems: "center",
        }}
      >
        <View style={styles.inputField}>
          <TextInput
            style={styles.input}
            onChangeText={onSearch}
            value={search}
            placeholder="useless placeholder"
            keyboardType="numeric"
          />
          <TouchableOpacity
            style={{ alignItems: "center", justifyContent: "center" }}
            underlayColor="transparent"
          >
            <View>
              <EvilIcons name="search" size={35} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.showResult}>
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View style={styles.iconContainer}>
                <Icon
                  style={styles.position}
                  name="ios-location-sharp"
                  size={30}
                />
              </View>
              <View>
                <Text styles={styles.locationText}>{item.content}</Text>
              </View>
            </View>
          )}
        />



      </View>
   
    */}
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  input: {
    width: "90%",
  },
  container: {
    marginHorizontal: 10,
  },
  inputField: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 15,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 20,
  },
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
