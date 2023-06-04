// import React, { useEffect } from "react";
// import { Platform } from "react-native";
// import * as Location from "expo-location";
// import { DeviceEventEmitter } from "react-native";

// const BACKGROUND_LOCATION_TASK_NAME = "background-location-task";

// const LocationTrackingComponent = () => {
//   useEffect(() => {
//     const handleLocationEvent = ({ latitude, longitude }) => {
//       // Handle received location event
//       console.log("Received location:", latitude, longitude);
//     };

//     DeviceEventEmitter.addListener("locationEvent", handleLocationEvent);

//     return () => {
//       DeviceEventEmitter.removeListener("locationEvent", handleLocationEvent);
//     };
//   }, []);

//   return <>{/* Your component JSX */}</>;
// };

// export default LocationTrackingComponent;
