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
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import Colors from "../../assets/colors/Colors";
import Icon from "react-native-vector-icons/FontAwesome";
import ListContainer from "../../component/ListContainer";
import LocationTab from "../../component/LocationTab";
import TopBar from "../../component/TopBar";
import LinearGradient from "react-native-linear-gradient";
navigator.geolocation = require("@react-native-community/geolocation");
import Geolocation from "@react-native-community/geolocation";
import { auth } from "../../db/firebase";

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
      markers: [{
        title: 'hello',
        coordinates: {
          latitude: 37.78825,
          longitude: -122.4324
        },
      },
      {
        title: 'hello',
        coordinates: {
          latitude: 37.78821,
          longitude: -122.4329
        },
      }],
      restaurantList: []
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
    await requestLocationPermission();

    this._timeout = setTimeout(() => {
      // Your code

      Geolocation.getCurrentPosition(
        (position) => {
          var lat = parseFloat(position.coords.latitude);
          var long = parseFloat(position.coords.longitude);

          var initialRegion = {
            latitude: lat,
            longitude: long,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          };

          this.setState({ region: initialRegion });
          console.log(initialRegion);
        },
        (error) => alert(JSON.stringify(error)),
        {
          enableHighAccuracy: false,
          timeout: 5000,
        }
      );
    }, 4000);

    let handleRestaurantSearch = () => {
      console.log("here")
      const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?'
      const location = `location=${this.state.region.latitude},${this.state.region.longitude}`;
      const radius = '&radius=2000';
      const type = '&keyword=restaurant';
      const key = '&key=AIzaSyCI4_jhTZcxnYHla6xmzgatq4s_blaURno';
      const restaurantSearchUrl = url + location + radius + type + key;
      fetch(restaurantSearchUrl)
        .then(response => response.json())
        .then(result =>

          this.setState({ restaurantList: result })
          // console.log(result.results[0].geometry.location)

          // console.log(result.results[0].place_id)
        )
        .catch(e => console.log(e))
    }

    setTimeout(() => {
      handleRestaurantSearch()

    }, 5000);


  }

  componentWillUnmount() {
    // used only when "providerListener" is enabled
    LocationServicesDialogBox.stopListener(); // Stop the "locationProviderStatusChange" listener
  }

  onRegionChange = (region) => {
    this.setState({ region });
  };

  render() {
    // console.log(this.state.restaurantList.results[0].name)
    return (
      <MapView
        initialRegion={this.state.region}
        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={styles.map}
        loadingEnabled
        // followsUserLocation={true}
        showsUserLocation
        region={this.state.region}
        onRegionChange={this.onRegionChange}
        showsIndoors={true}
        showsMyLocationButton={true}
        zoomControlEnabled={true}
        zoomEnabled={false}
        zoomTapEnabled={true}
        scrollEnabled={false}
      >

        {/* {this.state.markers.map((marker, index) => {
          <MapView.Marker
            key={index}
            coordinate={marker.coordinates}
            title={marker.title}

          />
        })
        } */}

        {
          this.state.restaurantList.results &&
          Object.keys(this.state.restaurantList.results).map((item, index) => {
            <Marker
              key={index}
              title={this.state.restaurantList.results[item].name}
              coordinate={{
                latitude: this.state.restaurantList.results[item].geometry.location.lat,
                longitude: this.state.restaurantList.results[item].geometry.location.lng
              }}
            />
          })
        }
        
      </MapView>
    );
  }
}

const Home = (props) => {
  let [latitude, setLatitude] = useState(37.78825);
  let [longitude, setLongitude] = useState(-122.4324);
  let [latitudeDelta, setLatitudeDelta] = useState(0.0922);
  let [longitudeDelta, setLongitudeDelta] = useState(0.0421);



  useEffect(() => {

  }, []);

  return (
    <LinearGradient
      colors={["#FFC1DD", "#ffffff"]}
      style={styles.linearGradient}
    >
      <SafeAreaView style={styles.main}>
        <TopBar />
        <Button
          title="logout"
          onPress={() => {
            auth
              .signOut()
              .then(() => {
                // Sign-out successful.
                props.navigation.push("Flow");
              })
              .catch(() => {
                // An error happened.
              });
          }}
        ></Button>
        <View style={{ marginTop: 30 }}>
          <LocationTab />
        </View>
        {/* <GooglePlacesAutocomplete
          placeholder='Search'
          onPress={(data, details = null) => {
            // 'details' is provided when fetchDetails = true
            console.log(data, details);
          }}
          query={{
            key: 'AIzaSyCI4_jhTZcxnYHla6xmzgatq4s_blaURno',
            language: 'en',
          }}
        /> */}
        <View style={styles.mapContainer}>
          {/* <Image
            style={{height: 400, width: '80%'}}
            resizeMode="contain"
            source={require('../../assets/images/map.png')}
          /> */}

          <MapHome />
        </View>
        {/* <View style={{ marginBottom: 80 }}>
          <ListContainer />
        </View> */}
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
    height: 300
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
