import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import H1 from "./../../component/basic/H1";
import LinearGradient from "react-native-linear-gradient";
import QRCodeScanner from "react-native-qrcode-scanner";
import { RNCamera } from "react-native-camera";
import H2 from "../../component/basic/H2";
import { firestore } from "../../db/firebase";
import ListContainer from "../../component/ListContainer";
const Scan = ({ navigation }) => {
  const [scan, setScan] = useState(true);
  const [result, setResult] = useState();
  const [data, setData] = useState([]);
  startScan = () => {
    setScan(true);
    setResult();
  };
  onSuccess = (e) => {
    setResult(e.data);
    setScan(false);
    firestore
      .collection("location")
      .doc(e.data)
      .get()
      .then((doc) => {
        if (doc.exists) {
          let file = {
            key: doc.id,
            title: doc.data().title,
            address: doc.data().address,
            description: doc.data().description,
            schedules: doc.data().schedules,
            img: doc.data().photo,
            latlng: {
              longitude: doc.data().longitude,
              latitude: doc.data().latitude,
            },
          };
          setData(file);
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.log("Error getting document:", error);
      });
  };
  return (
    <LinearGradient
      colors={["#FFC1DD", "#ffffff"]}
      style={styles.linearGradient}>
      <SafeAreaView style={styles.main}>
        {result && (
          // Final result
          <View style={styles.sectionContainer}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("UsersListPlace", {
                  id: data.key,
                  title: data.title,
                  place: data.address,
                  location: data.description,
                  code: data.schedules,
                  img: data.photo,
                  latlng: data.latlng,
                })
              }>
              <ListContainer
                title={data.title}
                place={data.address}
                location={data.description}
                code={data.schedules}
                img={data.photo}
                navigation={navigation}
              />
            </TouchableOpacity>
          </View>
        )}
        {!scan && (
          <View style={styles.sectionContainer}>
            <TouchableOpacity onPress={startScan}>
              <H2>Start Scan Again</H2>
            </TouchableOpacity>
          </View>
        )}
        {scan && (
          <QRCodeScanner
            reactivate={true}
            showMarker={true}
            ref={(node) => {
              this.scanner = node;
            }}
            onRead={this.onSuccess}
            topContent={<H2>Scan your QRCode!</H2>}
            bottomContent={
              <TouchableOpacity
                style={styles.buttonTouchable}
                onPress={() => setScan(false)}>
                <Text style={styles.buttonText}>Cancel Scan</Text>
              </TouchableOpacity>
            }
          />
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Scan;

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
  },
  main: {
    flex: 1,
    justifyContent: "center",
  },
  sectionContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});