import React from "react";
import { Image, SafeAreaView, StyleSheet, Text, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Colors from "../../../assets/colors/Colors";
import H1 from "../../../component/basic/H1";
import H2 from "../../../component/basic/H2";
import P from "../../../component/basic/P";
import TopBar from "../../../component/TopBar";

const PlacesDetails = ({ route }) => {
  const { id, title, place, location, code, img, latlng, qrimage } =
    route.params;
  return (
    <LinearGradient
      colors={["#FFC1DD", "#ffffff"]}
      style={styles.linearGradient}>
      <SafeAreaView>
        <View>
          <View>
            <View style={styles.center}>
              <Image
                style={{ height: 100, width: 130 }}
                resizeMode="contain"
                source={require("./../../../assets/images/logo-bubble.png")}
              />
              <Image
                style={{ height: 60, width: 60 }}
                source={{ uri: qrimage }}
              />
            </View>
          </View>
          <View style={{ marginTop: 30 }}></View>

          <View style={styles.Data}>
            <Image
              style={{ height: 100, width: 130 }}
              resizeMode="contain"
              source={{ uri: img }}
            />
            {img ? (
              <Image
                style={{
                  height: 180,
                  width: 240,
                  ...Colors.customShadow,
                }}
                source={{ uri: img }}
              />
            ) : (
              <Image
                style={{ height: 180, width: 240, ...Colors.customShadow }}
                source={require("./../../../assets/images/description.png")}
                // source={{ uri: img }}
              />
            )}
            <H2></H2>

            <Text style={styles.Heading}>{title}</Text>
            <H2>{place}</H2>
            <H2>{location}</H2>
            <H2>{code}</H2>
            <View style={{ width: "80%" }}>
              <P>
                Lorem iHsum dolor sit amet, consectetur adipiscing elit. Sed ex
                felis, lobortis nec felis a, venenatis semper metus. Vivamus
                fringilla sed lorem id finibus. Integer tristique felis magna, a
                iaculis nisi scelerisque at. Maecenas lectus justo, blandit sed
                mollis vel,
              </P>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default PlacesDetails;

const styles = StyleSheet.create({
  linearGradient: { flex: 1 },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  Data: {
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  Heading: {
    fontFamily: "FredokaOne-Regular",
    fontSize: 35,
    flexWrap: "wrap",
  },
});
