import { useEffect, useState, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, Button } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

const defaultLatitude = 37.78825;
const defaultLongitude = -122.4324;
const initialRegion = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.00922,
  longitudeDelta: 0.0421,
};

export default function Map() {
  const mapRef = useRef(null);
  const [location, setLocation] = useState(initialRegion);
  const [errorMsg, setErrorMsg] = useState(null);
  let debounce = setTimeout(() => {}, 0);

  const goToCurrentLocation = () => {
    if (mapRef) {
      mapRef.current.animateToRegion(location, 100);
    }
  };

  useEffect(() => {
    const timeout = setInterval(async () => {
      /* @hide */
      // if (Platform.OS === "android") {
      //   setErrorMsg(
      //     "Oops, this will not work on Snack in an Android Emulator. Try it on your device!"
      //   );
      //   return;
      // }
      /* @end */
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});

      console.log(location);
      setLocation((prev) => ({
        ...prev,
        latitude: location?.coords?.latitude,
        longitude: location?.coords?.longitude,
      }));
    }, 500);

    return () => {
      clearInterval(timeout);
    };
  }, []);

  const onRegionChange = ({ latitudeDelta, longitudeDelta }) => {
    // clearTimeout(debounce);
    setLocation((prev) => ({
      ...prev,
      latitudeDelta,
      longitudeDelta,
    }));
    // debounce = setTimeout(() => {
    // }, 100);
  };

  return (
    <>
      {/* <Text style={styles.paragraph}>{JSON.stringify(location ?? "")}</Text> */}
      {/* <Text style={styles.paragraph}>long: {location?.coords?.longitude}</Text> */}
      <MapView
        // mapType={Platform.OS == "android" ? "none" : "standard"}
        // region={location}
        provider={null}
        zoomEnabled={true}
        scrollEnabled={true}
        showsScale={true}
        ref={mapRef}
        style={styles.mapView}
        initialRegion={initialRegion}
        onRegionChangeComplete={onRegionChange}
      >
        <Marker
          title="user"
          // image="https://www.pngkey.com/png/full/122-1227642_cyan-dodgeball-solid-color-circle-png.png"
          // style={{ width: 20, height: 20 }}
          resizeMode="contain"
          coordinate={{
            latitude: location?.latitude ?? defaultLatitude,
            longitude: location?.longitude ?? defaultLongitude,
          }}
        >
          <Image
            source={require("../../assets/Vector.png")}
            style={styles.marker}
            // resizeMode="contain"
          />
        </Marker>
      </MapView>
      <Button
        title="Current"
        style={styles.button}
        onPress={goToCurrentLocation}
      />
    </>
  );
}

const styles = StyleSheet.create({
  mapView: {
    width: "100%",
    height: "70%",
  },
  paragraph: {
    fontSize: 18,
    textAlign: "center",
  },
  marker: {
    width: 20,
    height: 20,
  },
  button: {
    marginTop: 100,
  },
});
