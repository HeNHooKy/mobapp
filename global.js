import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export const MarkerContext = React.createContext({
    markers: [],
    setMarkers: () => {},
  });
export const Stack = createNativeStackNavigator();