import React, { useState, useMemo, useEffect  } from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { default as MapScreen } from './screens/home-map-screen.js';
import { default as SetupMarkerScreen } from './screens/setup-marker-screen.js';
import { openDatabase, addMarker, addImage, loadMarker, loadImages } from './db/db.js';

import { MarkerContext, Stack } from './global.js';


const region = {
  latitude: 56.755289,
  longitude: 54.118699,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
}

openDatabase();


function App() {
  let [markers, setMarkers] = useState([]);
  const value = useMemo(
    () => ({ markers, setMarkers }),
    [markers]
  );

  useEffect(() => {
    loadMarker((markers) => {
      markers.map(m => {
        loadImages(m.id, (images) => {
          m.images = images;
          setMarkers([...markers, m]);
        });
      });
    })
  }, []);

  return (
    <MarkerContext.Provider value={value}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Map" component={MapScreen} initialRegion={region} />
          <Stack.Screen name="Marker" component={SetupMarkerScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </MarkerContext.Provider>
  );
}

export default App;