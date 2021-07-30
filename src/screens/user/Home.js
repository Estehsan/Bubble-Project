import React, { useState, useEffect, Component } from "react";
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
} from "react-native";
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";

import Colors from "../../assets/colors/Colors";
import Icon from "react-native-vector-icons/FontAwesome";
import ListContainer from "../../component/ListContainer";
import LocationTab from "../../component/LocationTab";
import TopBar from "../../component/TopBar";
import LinearGradient from "react-native-linear-gradient";
navigator.geolocation = require("@react-native-community/geolocation");
import Geolocation from "@react-native-community/geolocation";

import MapView, {
  Marker,
  AnimatedRegion,
  Animated,
  Polyline,
  PROVIDER_GOOGLE,
} from "react-native-maps";

// import haversine from "haversine";

const LATITUDE_DELTA = 0.009;
const LONGITUDE_DELTA = 0.009;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;

class MapHome extends Component {
  constructor() {
    super();
    this.state = {
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      initialPosition: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
    };
  }

  async componentDidMount() {
    LocationServicesDialogBox.checkLocationServicesIsEnabled({
      message:
        "<h2 style='color: #0af13e'>Use Location ?</h2>This app wants to change your device settings:<br/><br/>Use GPS, Wi-Fi, and cell network for location<br/><br/><a href='#'>Learn more</a>",
      ok: "YES",
      cancel: "NO",
      enableHighAccuracy: true, // true => GPS AND NETWORK PROVIDER, false => GPS OR NETWORK PROVIDER
      showDialog: true, // false => Opens the Location access page directly
      openLocationServices: true, // false => Directly catch method is called if location services are turned off
      preventOutSideTouch: false, // true => To prevent the location services window from closing when it is clicked outside
      preventBackClick: false, // true => To prevent the location services popup from closing when it is clicked back button
      providerListener: false, // true ==> Trigger locationProviderStatusChange listener when the location state changes
    })
      .then(function (success) {
        console.log(success); // success => {alreadyEnabled: false, enabled: true, status: "enabled"}
      })
      .catch((error) => {
        console.log(error.message); // error.message => "disabled"
      });

    BackHandler.addEventListener("hardwareBackPress", () => {
      //(optional) you can use it if you need it
      //do not use this method if you are using navigation."preventBackClick: false" is already doing the same thing.
      LocationServicesDialogBox.forceCloseDialog();
    });

    DeviceEventEmitter.addListener(
      "locationProviderStatusChange",
      function (status) {
        // only trigger when "providerListener" is enabled
        console.log(status); //  status => {enabled: false, status: "disabled"} or {enabled: true, status: "enabled"}
      }
    );

    async function requestLocationPermission() {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message:
              "This App needs access to your location " +
              "so we can know where you are.",
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("You can use locations ");
        } else {
          console.log("Location permission denied");
        }
      } catch (err) {
        console.warn(err);
      }
    }
    requestLocationPermission();

    var lat = 0;
    var long = 0;

    var initialRegion = {
      latitude: lat,
      longitude: long,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    };
    this._timeout = setInterval(() => {
      // Your code

      Geolocation.getCurrentPosition(
        (position) => {
          lat = parseFloat(position.coords.latitude);
          long = parseFloat(position.coords.longitude);

          this.setState({ region: initialRegion });
          console.log(initialRegion);
        },
        (error) => alert(JSON.stringify(error)),
        {
          enableHighAccuracy: false,
          timeout: 5000,
        }
      );
    }, 2000);

    if (lat != 0 || long != 0) {
      clearInterval(this._timeout);
    }
  }

  componentWillUnmount() {
    // used only when "providerListener" is enabled
    LocationServicesDialogBox.stopListener(); // Stop the "locationProviderStatusChange" listener
  }

  onRegionChange = (region) => {
    this.setState({ region });
  };

  render() {
    return (
      <MapView
        initialRegion={this.state.region}
        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={styles.map}
        loadingEnabled
        followsUserLocation={true}
        showsUserLocation
        region={this.state.region}
        onRegionChange={this.onRegionChange}
        showsIndoors={true}
        showsMyLocationButton={true}
        zoomControlEnabled={true}
        zoomEnabled={true}
        zoomTapEnabled={true}
        showsScale={true}
        showsBuildings={true}
        showsUserLocation={true}
        showsCompass={true}
      >
        {/* <Marker draggable
          coordinate={{ latitude: this.state.initialPosition.latitude, longitude: this.state.initialPosition.longitude }}
          onDragEnd={(e) => this.setState({ x: e.nativeEvent.coordinate })}
        /> */}
      </MapView>
    );
  }
}

const Home = () => {
  let [latitude, setLatitude] = useState(37.78825);
  let [longitude, setLongitude] = useState(-122.4324);
  let [latitudeDelta, setLatitudeDelta] = useState(0.0922);
  let [longitudeDelta, setLongitudeDelta] = useState(0.0421);

  useEffect(() => {}, []);

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
        <View style={styles.mapContainer}>
          {/* <Image
            style={{height: 400, width: '80%'}}
            resizeMode="contain"
            source={require('../../assets/images/map.png')}
          /> */}
          {/* <MapView
            provider={PROVIDER_GOOGLE} // remove if not using Google Maps
            style={styles.map}
            showsUserLocation
            region={{
              latitude: 37.78825,
              longitude: -122.4324,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,
            }}
          >
          </MapView> */}
          <MapHome />
        </View>
        <View style={{ marginBottom: 80 }}>
          <ListContainer />
        </View>
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
    marginTop: 10,
    marginHorizontal: 20,
    ...Colors.customShadow,
  },
});
