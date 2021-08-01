

import React from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import LocationTab from "../../component/LocationTab";
import TopBar from "../../component/TopBar";
import ListContainer from "./../../component/ListContainer";
import SearchBar from "./../../component/SearchBar";

// linear-gradient(0deg, #FFFFFF 0%, #FFC1DD 78.9%)
const Message = ({ ...props }) => {
  return (
    <LinearGradient
      colors={["#FFC1DD", "#ffffff"]}
      style={styles.linearGradient}
    >
      <SafeAreaView>
        <View>
          <TopBar />
        </View>
        <View style={{ marginTop: 30 }}>
          <LocationTab />
        </View>
        <SearchBar />
      </SafeAreaView>

      <View style={{ marginTop: 350 }}>
        <Text>Messages Screen to be updated</Text>
      </View>
    </LinearGradient>
  );
};

export default Message;

const styles = StyleSheet.create({
  linearGradient: { flex: 1 },
});
