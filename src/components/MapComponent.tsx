"use client";
import React from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "220px", // Fits within footer area
};

const defaultLocation = {
  lat: 23.9037,
  lng: 89.122,
};

type MapComponentProps = {
  location?: {
    lat: number;
    lng: number;
  };
};

const MapComponent: React.FC<MapComponentProps> = ({
  location = defaultLocation,
}) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={location} zoom={16}>
      <Marker position={location} />
    </GoogleMap>
  );
};

export default MapComponent;
