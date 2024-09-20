import React, { useState } from 'react';
import { View, SafeAreaView, ScrollView } from 'react-native';
import Landing from '../Landing'
import Page5 from '../Pages/Page5'
import { StackActions } from '@react-navigation/native';
import styles from '../styles/styles';
import { Stack } from 'expo-router';

const Home = () => {
  const [page, setPage] = useState('landing');

  const handlePress = () => {
    setPage('page5');
  };

  const handleBack = () => {
    setPage('landing');
  };
  const CustomHeader = () => (
    <View style={{ height: 30, backgroundColor: 'white' }}>

    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          header: () => <CustomHeader />, // Use the custom header component
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false} scrollEnabled={true}>
        <View>
          {page === 'landing' && <Landing handlePress={handlePress} />}
          {page === 'page5' && <Page5 />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
