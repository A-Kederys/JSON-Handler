import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';

export default function App() {
  const [jsonData, setJsonData] = useState(null);

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({ type: 'application/json' });
    if (!result.cancelled) {
      setJsonData(result);
    }
  };

  const saveFile = async () => {
    if (jsonData) {
      const downloadsDirectory = `${FileSystem.documentDirectory}../Download/`;
      const fileName = jsonData.name;
      const fileUri = jsonData.uri;
      const destinationUri = `${downloadsDirectory}${fileName}`;

      try {
        await FileSystem.copyAsync({ from: fileUri, to: destinationUri });
        console.log(`File saved to ${destinationUri}`);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const shareFile = async () => {
    if (jsonData) {
      await Sharing.shareAsync(jsonData.uri, { mimeType: 'application/json', dialogTitle: 'Share JSON file' });
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Pick a JSON file" onPress={pickDocument} />
      {jsonData && <Text style={styles.fileName}>{jsonData.name}</Text>}
      {jsonData && <Button title="Save file to Downloads" onPress={saveFile} />}
      {jsonData && <Button title="Share file" onPress={shareFile} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 20,
  },
});