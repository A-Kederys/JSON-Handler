import React from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import styles from '../styles/styles';

const Landing = ({ handlePress }) => {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/homeCat.jpg')} style={styles.image} />
      <Text style={styles.title}> Erelis, katė ir šernė</Text>
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>Klausimynas</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Landing;