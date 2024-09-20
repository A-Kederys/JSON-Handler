import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import styles from '../styles/styles';

const Reader = () => {
  const [fileContents, setFileContents] = useState([]);
  const [blockCount, setBlockCount] = useState(1);

  const handleFileSelection = async () => {
    try {
      const file = await DocumentPicker.getDocumentAsync({ type: 'text/plain' });
      if (file.type === 'success') {
        const response = await fetch(file.uri);
        const content = await response.text();
        setFileContents((prevFileContents) => [...prevFileContents, content]);
        setBlockCount((prevBlockCount) => prevBlockCount + 1);
      }
    } catch (error) {
      console.error('Failed to select file:', error);
    }
  };

  const clearFileContents = () => {
    setFileContents([]);
    setBlockCount(1);
  };

  const renderFileContent = (content) => {
    if (!content) {
      return null;
    }
  
    try {
      const formData = JSON.parse(content);   {/*parsing*/}
      //console.log(formData)
      return Object.entries(formData).map(([key, value]) => {   {/*mapping each entry in formData using object.entries */}
      //console.log(Object.entries(formData))
        const decodedKey = decodeURIComponent(key);
        if (key === 'Mėgstantys pavalgyti' || key === 'Nepasirodę gyvūnai') {
          //console.log(key)
          //console.log(Object.values(value))
          return (
            <View key={key}>
              <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{decodedKey}</Text>
              <Text style={{ fontSize: 16 }}>
                {Object.values(value).map((item, index) => (
                  <React.Fragment key={index.toString()}>
                    {index > 0 && ', '}
                    {capitalizeFirstLetter(decodeURIComponent(item))}
                  </React.Fragment>
                ))}
              </Text>
            </View>
          );
        }
  
      if (typeof value === 'object' && value !== null) {{/*radio butten group and chip groups*/}
          return (
            <View key={key}>
              <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{decodedKey}</Text>{/*main questionss*/}
              {Object.entries(value).map(([nestedKey, nestedValue]) => {
                //console.log(Object.entries(value))
                const decodedNestedKey = decodeURIComponent(nestedKey);
                const decodedNestedValue = decodeURIComponent(nestedValue);
                return (
                  <View key={nestedKey}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', marginLeft: 20 }}>{/*nested questions under the main questionss*/}
                      {capitalizeFirstLetter(decodedNestedKey)}
                    </Text>
                    <Text style={{ fontSize: 16, marginLeft: 20 }}>
                      {capitalizeFirstLetter(decodedNestedValue)}
                    </Text>
                  </View>
                );
              })}
            </View>
          );
        }
  {/*for no arrays (text, radio and spinner)*/}
        return ( 
          <View key={key}>
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{decodedKey}</Text>
            <Text style={{ fontSize: 16 }}>{capitalizeFirstLetter(decodeURIComponent(value))}</Text>
          </View>
        );
      });
    } catch (error) {
      console.error('Failed to parse file content:', error);
      return (
        <View>
          <Text>Error: Failed to parse file content.</Text>
        </View>
      );
    }
  };
  
  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      {fileContents.map((content, index) => (
        <View key={index} style={{ marginBottom: 16, }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', borderBottomWidth: 5, borderTopWidth: 5, textAlign: 'center', marginTop: 5, marginBottom: 10 }}>Failas Nr. {index + 1}</Text>
          <View style={{ marginTop: 8 }}>{renderFileContent(content)}</View>
        </View>
      ))}
      <Button title="Pasirinkti failą" onPress={handleFileSelection} />
      {fileContents.length > 0 && (
        <Button title="Pasirinkti kitą failą" onPress={handleFileSelection} />
      )}
      {fileContents.length > 0 && (
        <Button title="Išvalyti failus" onPress={clearFileContents} />
      )}
    </View>
  );
};

export default Reader;

