import React, { useState, useEffect, Component, useRef } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  PermissionsAndroid,
  Dimensions,
  Button,
  BackHandler,
  DeviceEventEmitter,
  ActivityIndicator,
  FlatList,
  useWindowDimensions,
} from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

import Colors from "../../assets/colors/Colors";
import MapCorousel from "../../component/MapCorousel";
import LocationTab from "../../component/LocationTab";
import TopBar from "../../component/TopBar";
import LinearGradient from "react-native-linear-gradient";
import Geolocation from "@react-native-community/geolocation";
import { auth, firestore } from "../../db/firebase";
import Entypo from "react-native-vector-icons/Entypo";

import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

// import haversine from "haversine";

const LATITUDE_DELTA = 0.1;
const LONGITUDE_DELTA = 0.1;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;

const Home = (props) => {
  const [marker, setMarker] = useState([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userMarker, setUserMarker] = useState(
    {
      latlng: {
        longitude: 38.71899780347724,
        latitude: -122.46168731600267,
      },

    }
  );

  const width = useWindowDimensions().width;

  const flatlist = useRef();

  useEffect(() => {

    auth.onAuthStateChanged((user) => {
      if (user) {
        var uid = user.uid;
        // console.log(uid)
        firestore.collection("users").doc(uid)
          .onSnapshot((doc) => {

            let docs = {
              key: user.uid,
              title: doc.data().userName,
              latlng: {
                longitude: doc.data().longitude,
                latitude: doc.data().latitude,
              },
            }

            setUserMarker(docs)
            console.log(docs)

          })

      } else {
        // User is signed out
        // ...
      }
    });

    firestore.collection("location").onSnapshot((querySnapshot) => {
      let docs = querySnapshot.docs.map((doc) => ({
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
      }));
      setMarker(docs);
      setLoading(false);
    });

    if (!selectedPlaceId || !flatlist) {
      return;
    }
    const index = marker.findIndex((marker) => marker.key == selectedPlaceId);
    flatlist.current.scrollToIndex({ index });
  }, [selectedPlaceId]);

  // console.log(marker);

  return (
    <LinearGradient
      colors={["#FFC1DD", "#ffffff"]}
      style={styles.linearGradient}
    >
      <SafeAreaView style={styles.main}>
        <TopBar />
        <View style={{ marginTop: 30 }}>
          <LocationTab />
        </View>
        <MapView
          style={styles.mapContainer}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {marker.map((marker, key) => (
            <Marker
              key={key}
              coordinate={marker.latlng}
              title={marker.title}
              description={marker.description}
              onPress={() => setSelectedPlaceId(marker.key)}
            >
              <Entypo
                color={marker.key == selectedPlaceId ? "black" : "red"}
                name="drink"
                size={40}
              />
            </Marker>
          ))}

          {userMarker &&
            <Marker
              coordinate={userMarker.latlng}
            >
            </Marker>
          }
        </MapView>
        {loading ? (
          <ActivityIndicator
            //visibility of Overlay Loading Spinner
            visible={loading}
            //Text with the Spinner
            textContent={"Loading..."}
            //Text style of the Spinner Text
            textStyle={styles.spinnerTextStyle}
          />
        ) : (
          <View style={styles.Corousel}>
            <FlatList
              ref={flatlist}
              data={marker}
              showsHorizontalScrollIndicator={false}
              snapToInterval={width - 60}
              horizontal
              snapToAlignment={"center"}
              decelerationRate={"fast"}
              renderItem={({ item }) => (
                <MapCorousel
                  title={item.title}
                  place={item.description}
                  location={item.location}
                  code={item.code}
                />
              )}
            />
          </View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Home;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    display: "flex",
  },
  linearGradient: { flex: 1 },
  container: {
    ...StyleSheet.absoluteFillObject,
    height: 400,
    width: 400,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    height: 400,
  },
  bubble: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.7)",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  latlng: {
    width: 200,
    alignItems: "stretch",
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: "center",
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    marginVertical: 20,
    backgroundColor: "transparent",
  },
  boldText: {
    fontSize: 25,
    color: "red",
    marginVertical: 16,
  },
  mapContainer: {
    alignItems: "center",
    flex: 4,
    marginBottom: 100,
    marginTop: 30,
    marginHorizontal: 15,
    borderRadius: 40,
    ...Colors.customShadow,
  },
  Corousel: {
    position: "absolute",
    bottom: 80,
  },
});
