import { StyleSheet } from "react-native-web";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    question: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    subQuestion: {
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 4,
    },
    answer: {
      fontSize: 14,
      marginBottom: 4,
    },
    errorText: {
      fontSize: 14,
      color: 'red',
      textAlign: 'center',
      marginTop: 16,
    },
  });

  export default styles