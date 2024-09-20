//questionnaire page!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, TextInput, TouchableOpacity, Alert, Linking, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styles from '../../styles/styles';
import { shareAsync } from 'expo-sharing';
import axios from 'axios';
import { copyAsync, documentDirectory, getContentUriAsync, getFileInfoAsync } from 'expo-file-system';
import * as FileSystem from 'expo-file-system';
import { Chip, RadioButton, Checkbox, Button } from 'react-native-paper';


const Page5 = () => {
  const [answer1, setAnswer1] = useState('');
  const [answer2, setAnswer2] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [downloadLink, setDownloadLink] = useState('');
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({
    Knisinėtojas: '',
    Valgytojas: '',
    Grobuonis: '',
  });
  const [selectedOptionsCheck, setSelectedOptionsCheck] = useState([]);
  const [selectedOptionsChips, setSelectedOptionsChips] = useState({
    Išmirė: [],
    Bjauriausias_kaimynas: [],
  });

  const [selectedOptionSpinner, setSelectedOptionSpinner] = useState('');
  const handleOptionChangeSpinner = (option) => {
    setSelectedOptionSpinner(option);
  };

  const handleOptionChangeChips = (question, option) => {
    setSelectedOptionsChips((prevState) => {
      const updatedOptions = [...prevState[question]];

      // Check if the option is already selected
      const optionIndex = updatedOptions.indexOf(option);
      if (optionIndex !== -1) {
        // If selected, remove it from the array
        updatedOptions.splice(optionIndex, 1);
      } else {
        // If not selected, add it to the array
        updatedOptions.push(option);
      }

      return {
        ...prevState,
        [question]: updatedOptions,
      };
    });
  };

  //for chip groups
  const options1 = ['Katė', 'Šernė', 'Erelis'];
  const options2 = ['Erelis', 'Katė', 'Šernė'];

  const handleAnswer1Change = (text) => {
    setAnswer1(text);
  };

  const handleAnswer2Change = (option) => {
    setAnswer2(option);
  };

  const handleColorSelection = (color) => {
    if (selectedColors.includes(color)) {
      setSelectedColors(selectedColors.filter((c) => c !== color));
    } else {
      setSelectedColors([...selectedColors, color]);
    }
  };

  const handleOptionChange = (question, option) => {
    setSelectedOptions((prevState) => ({
      ...prevState,
      [question]: option,
    }));
  };

  const handleCheckboxToggle = (option) => {
    if (selectedOptionsCheck.includes(option)) {
      setSelectedOptionsCheck(selectedOptionsCheck.filter((item) => item !== option));
    } else {
      setSelectedOptionsCheck([...selectedOptionsCheck, option]);
    }
  };



  const handleDownload = async () => {
    if (downloadLink) {
      try {
        const response = await axios.post(
          'https://api.dropboxapi.com/2/files/get_temporary_link',
          JSON.stringify({ path: downloadLink }),
          {
            headers: {
              Authorization: 'Bearer YOUR_DROPBOX_ACCESS_TOKEN', // Replace with your Dropbox access token, mine was s2.BeczJFdD5t_Nh36PnEr605r6ihFO2Njt8yE2MsH4bvGT5DK5tF1GlnXbp4jvmx1pADemS_SWB50etbAur8YTFVKJgJrQgZr4lyewXaTV3MRm9JHMvlI7JwCK4yON8NbYPgYpBe48
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.data && response.data.link) {
          const fileUrl = response.data.link;
          await Linking.openURL(fileUrl);
        } else {
          console.error('Failed to retrieve temporary download link from the response data.');
        }
      } catch (error) {
        console.error('Failed to open URL:', error);
      }
    } else {
      console.warn('Download link is undefined.');
    }
  };

  const handleSubmit = async () => {
    setSubmitted(true);
  
    // Generate the form data
    const formData = {
      "Labiausiai patikęs": answer1,
      "Mėgstantis knisinėti": answer2,
      "Mėgstantys pavalgyti": selectedColors,
      "Kuris gyvūnas": selectedOptions,
      "Nepasirodę gyvūnai": selectedOptionsCheck,
      "Kurie gyvūnai": selectedOptionsChips,
      "Labiausiai nepatikęs": selectedOptionSpinner,
    };
  
    // Generate the file contents
    const fileContents = JSON.stringify(formData, null, 2).replace(/\\n/g, '\n');
  
    if (Platform.OS === 'web') {
      // Web download
      try {
        const blob = new Blob([fileContents], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `tavoDuomenys_${new Date().toISOString().replace(/[-:.]/g, '')}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        console.log('File downloaded successfully on web.');
      } catch (error) {
        console.error('Failed to download file on web:', error);
      }
    } else {
      // Mobile download (Dropbox upload)
      const now = new Date();
      const formattedDate = now.toISOString().replace(/[-:.]/g, ''); // Remove special characters from the date
      const fileName = `tavoDuomenys_${formattedDate}.txt`;
  
      try {
        // Upload the file to Dropbox
        const response = await axios.post(
          'https://content.dropboxapi.com/2/files/upload',
          fileContents,
          {
            headers: {
              Authorization: 'Bearer YOUR_DROPBOX_ACCESS_TOKEN', // Replace with your Dropbox access token, mine was s2.BeczJFdD5t_Nh36PnEr605r6ihFO2Njt8yE2MsH4bvGT5DK5tF1GlnXbp4jvmx1pADemS_SWB50etbAur8YTFVKJgJrQgZr4lyewXaTV3MRm9JHMvlI7JwCK4yON8NbYPgYpBe48
              'Content-Type': 'application/octet-stream',
              'Dropbox-API-Arg': JSON.stringify({
                path: `/${fileName}`,
                mode: 'add',
                autorename: true,
                mute: false,
              }),
            },
          }
        );
  
        // Check if the response contains the download link
        if (response.data && response.data.path_lower) {
          // Extract the download link from the response data
          const downloadUrl = response.data.path_lower;
          setDownloadLink(downloadUrl); // Store the download link
  
          // Notify the user
          Alert.alert('Pavyko!', 'Data sėkmingai išsaugota', [
            { text: 'Gerai', onPress: () => console.log('OK Pressed') },
          ]);
        } else {
          console.error('Failed to retrieve download link from the response data.');
        }
      } catch (error) {
        console.error('Failed to upload file to Dropbox:', error);
      }
    }
  };

  const colors = ['Erelis', 'Katė', 'Šuo', 'Kiaulė', 'Višta'];

  return (
    <SafeAreaView style={{ flex: 1 }} >
      <ScrollView contentContainerStyle={styles.containerQ}>
        <Text style={styles.titleQ}>Klausimanija</Text>

        <Text style={styles.question}>Labiausiai patikęs gyvūnas:</Text>
        <TextInput
          style={styles.input}
          onChangeText={handleAnswer1Change}
          value={answer1}
          placeholder="Enter your answer"
        />

        <Text style={styles.question}>Gyvūnas, mėgstantis knisinėti:</Text>
        <TouchableOpacity
          style={[
            styles.radioButton,
            answer2 === 'Erelis' && styles.radioButtonSelected,
          ]}
          onPress={() => handleAnswer2Change('Erelis')}
        >
          <Text style={styles.radioButtonText}>Erelis</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.radioButton,
            answer2 === 'Katė' && styles.radioButtonSelected,
          ]}
          onPress={() => handleAnswer2Change('Katė')}
        >
          <Text style={styles.radioButtonText}>Katė</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.radioButton,
            answer2 === 'šernė' && styles.radioButtonSelected,
          ]}
          onPress={() => handleAnswer2Change('šernė')}
        >
          <Text style={styles.radioButtonText}>Šernė</Text>
        </TouchableOpacity>

        <Text style={styles.question}>Gyvūnai, mėgstantys pavalgyti:</Text>
        <View style={styles.chipContainer}>
          {colors.map((color) => (
            <Chip
              key={color}
              style={[
                styles.chip,
                selectedColors.includes(color) && styles.chipSelected,
              ]}
              onPress={() => handleColorSelection(color)}
              selected={selectedColors.includes(color)}
            >
              {color}
            </Chip>
          ))}
        </View>
        <Text style={styles.question}>Kuris gyvūnas..:</Text>
        <View style={styles.radioButtonGroup}>
          <View style={styles.questionGroup}>
            <Text style={styles.question}>Daugiausiai knisinėjo žemę:</Text>
            <View style={styles.radioButtonGroup}>
              <TouchableOpacity
                style={[
                  styles.radioButtonSingle,
                  selectedOptions.Knisinėtojas === 'Katė' && styles.radioButtonSelected,
                ]}
                onPress={() => handleOptionChange('Knisinėtojas', 'Katė')}
              >
                <Text style={styles.radioButtonText}>Katė</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.radioButtonSingle,
                  selectedOptions.Knisinėtojas === 'šernė' && styles.radioButtonSelected,
                ]}
                onPress={() => handleOptionChange('Knisinėtojas', 'šernė')}
              >
                <Text style={styles.radioButtonText}>Šernė</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.questionGroup}>
            <Text style={styles.question}>Daugiausiai valgė:</Text>
            <View style={styles.radioButtonGroup}>
              <TouchableOpacity
                style={[
                  styles.radioButtonSingle,
                  selectedOptions.Valgytojas === 'Katė' && styles.radioButtonSelected,
                ]}
                onPress={() => handleOptionChange('Valgytojas', 'Katė')}
              >
                <Text style={styles.radioButtonText}>Katė</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.radioButtonSingle,
                  selectedOptions.Valgytojas === 'šernė' && styles.radioButtonSelected,
                ]}
                onPress={() => handleOptionChange('Valgytojas', 'šernė')}
              >
                <Text style={styles.radioButtonText}>Šernė</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.questionGroup}>
            <Text style={styles.question}>Mito dvėselena:</Text>
            <View style={styles.radioButtonGroup}>
              <TouchableOpacity
                style={[
                  styles.radioButtonSingle,
                  selectedOptions.Grobuonis === 'Katė' && styles.radioButtonSelected,
                ]}
                onPress={() => handleOptionChange('Grobuonis', 'Katė')}
              >
                <Text style={styles.radioButtonText}>Katė</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.radioButtonSingle,
                  selectedOptions.Grobuonis === 'šernė' && styles.radioButtonSelected,
                ]}
                onPress={() => handleOptionChange('Grobuonis', 'šernė')}
              >
                <Text style={styles.radioButtonText}>Šernė</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.question}>
          <Text style={styles.question}>Pasakoje nepasirodę gyvūnai:</Text>
          <View style={styles.checkBoxContainer}>
            <Checkbox.Android
              status={selectedOptionsCheck.includes('Žirafa') ? 'checked' : 'unchecked'}
              onPress={() => handleCheckboxToggle('Žirafa')}
              color="blue"
              style={styles.checkBox}
            />
            <Text style={styles.checkBoxLabel}>Žirafa</Text>
          </View>
          <View style={styles.checkBoxContainer}>
            <Checkbox.Android
              status={selectedOptionsCheck.includes('Gyvatė') ? 'checked' : 'unchecked'}
              onPress={() => handleCheckboxToggle('Gyvatė')}
              color="blue"
              style={styles.checkBox}
            />
            <Text style={styles.checkBoxLabel}>Gyvatė</Text>
          </View>
          <View style={styles.checkBoxContainer}>
            <Checkbox.Android
              status={selectedOptionsCheck.includes('erelis') ? 'checked' : 'unchecked'}
              onPress={() => handleCheckboxToggle('erelis')}
              color="blue"
              style={styles.checkBox}
            />
            <Text style={styles.checkBoxLabel}>Erelis</Text>
          </View>
          <View style={styles.checkBoxContainer}>
            <Checkbox.Android
              status={selectedOptionsCheck.includes('zuvis') ? 'checked' : 'unchecked'}
              onPress={() => handleCheckboxToggle('zuvis')}
              color="blue"
              style={styles.checkBox}
            />
            <Text style={styles.checkBoxLabel}>Žuvis</Text>
          </View>
        </View>



        <Text style={styles.question}>Kurie gyvūnai..:</Text>
        <View style={styles.radioButtonGroup}>
          <View style={styles.questionGroup}>
            <Text style={styles.question}>Išmirė badu:</Text>
            <View style={styles.chipContainer}>
              {options1.map((option) => (
                <Chip
                  key={option}
                  style={[
                    styles.chip,
                    selectedOptionsChips.Išmirė.includes(option) && styles.chipSelected,
                  ]}
                  onPress={() => handleOptionChangeChips('Išmirė', option)}
                  selected={selectedOptionsChips.Išmirė.includes(option)}
                >
                  {option}
                </Chip>
              ))}
            </View>
          </View>

          <View style={styles.questionGroup}>
            <Text style={styles.question}>Bjauriausias kaimynas:</Text>
            <View style={styles.chipContainer}>
              {options2.map((option) => (
                <Chip
                  key={option}
                  style={[
                    styles.chip,
                    selectedOptionsChips.Bjauriausias_kaimynas.includes(option) && styles.chipSelected,
                  ]}
                  onPress={() => handleOptionChangeChips('Bjauriausias_kaimynas', option)}
                  selected={selectedOptionsChips.Bjauriausias_kaimynas.includes(option)}
                >
                  {option}
                </Chip>
              ))}
            </View>
          </View>
        </View>

        <View>
          <Text style={styles.question}>Labiausiai nepatikęs gyvūnas:</Text>
          <Picker
            selectedValue={selectedOptionSpinner}
            onValueChange={handleOptionChangeSpinner}
          >
            <Picker.Item label="Šernė" value="šernė" />
            <Picker.Item label="Katė" value="Katė" />
            <Picker.Item label="Erelis" value="erelis" />
          </Picker>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
        {/*
        {submitted && (
          <View style={styles.selectedValues}>
            <Text style={styles.selectedValueText}>Name: {answer1}</Text>
            <Text style={styles.selectedValueText}>Gender: {answer2}</Text>
            <Text style={styles.selectedValueText}>Color: {selectedColors}</Text>
            <Text style={styles.selectedValueText}>RadioGroup: {selectedOptions.question1} {selectedOptions.question2} {selectedOptions.question3}</Text>
            <Text style={styles.selectedValueText}>Checkbox: {selectedOptionsCheck}</Text>
            <Text style={styles.selectedValueText}>chipGroupsQuestion: {selectedOptionsChips.question1} {selectedOptionsChips.question2}</Text>
            <Text style={styles.selectedValueText}>Spinner: {selectedOptionSpinner}</Text>
          </View>
        )}
        */}

        {downloadLink !== '' && (
          <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
            <Text style={styles.downloadButtonText}>Download File</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Page5;




/*
  const saveDataWEB = () => {
    const data = {
      name: answer1,
      gender: answer2,
    };
  
    try {
      const jsonData = JSON.stringify(data);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
  
      const link = document.createElement('a');
      link.href = url;
      link.download = 'data.json';
      link.click();
  
      console.log('Data downloaded:', jsonData);
    } catch (error) {
      console.error('Failed to download data:', error);
    }
  };
  */