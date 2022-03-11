import React, { useState, useContext } from 'react';
import { View, Image, Button, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MarkerContext } from '../global.js';
import { addImage } from '../db/db.js';

function MapImagePicker(props) {
  let { markers } = useContext(MarkerContext);
  let marker = markers[props.markerIndex];
  const [images, setImage] = marker.images ? useState(marker.images) : useState([]);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      addImage(images, setImage, { markerId: marker.id, uri: result.uri });
      markers[props.markerIndex].images = [...images, result.uri];
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      <ScrollView>
          {images.map((image, index) => image && <Image key={index} source={{ uri: image }} style={{ width: 200, height: 200 }} />)}
      </ScrollView>
    </View>
  );
}

export default function SetupMarkerScreen({ route }) {
  const { markerIndex } = route.params;
  return (
    <MapImagePicker markerIndex={markerIndex}/>
  )
}
