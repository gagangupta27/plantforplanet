import {
  NativeModules,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import moment from 'moment';

const {HeadlessTask} = NativeModules;

const App = () => {
  // handles the button click
  // create an API Task node, every key in asyncstorage acts as an independent node for processing, alternative to a local db.

  const handleClick = async () => {
    let timeStamp = moment().valueOf();
    await AsyncStorage.setItem(
      `PENDING_API_CALL_${timeStamp}`,
      JSON.stringify({
        endpoint: 'https://webhook.site/91a15b47-3b3a-4df9-a2f9-385652a2aa87',
        createdOn: timeStamp,
        req: {},
        res: null,
        asyncKey: timeStamp,
      }),
    );
    HeadlessTask.startHeadlessTask(); // calls the background serivice to fetch the data
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handleClick}
        activeOpacity={0.8}
        style={styles.button}>
        <Text style={styles.buttonText}>Hit Me</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  button: {
    padding: 20,
    backgroundColor: '#000',
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
  },
});

export default App;
