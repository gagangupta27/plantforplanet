const {
  default: AsyncStorage,
} = require('@react-native-async-storage/async-storage');

module.exports = async data => {
  // network broadcast or the manual button triggers the background service task with respective connection data
  if (data?.hasInternet != true) {
    return;
  }
  // 'isProcessing' key for when background serivce is active
  let isProcessing = await AsyncStorage.getItem('isProcessing');
  if (isProcessing) {
  } else {
    try {
      const fetchData = async () => {
        // fetched all nodes/keys which match the pattern and works on a single key
        await AsyncStorage.setItem('isProcessing', new Date().toString());
        let keys = await AsyncStorage.getAllKeys();
        keys = keys.filter(key => key.includes('PENDING_API_CALL'));
        if (keys.length) {
          await (async () => {
            let itemKey = keys[0];
            const data = JSON.parse(await AsyncStorage.getItem(itemKey));
            try {
              const url = data?.endpoint;
              const options = {
                method: 'GET',
                headers: {},
              };

              const response = await fetch(url, options);
              console.log(response.status);
              if ([200].includes(response.status)) {
                await AsyncStorage.setItem(
                  `PENDING_API_CALL_${data?.asyncKey}`,
                  JSON.stringify({...data, res: true}),
                );
                await AsyncStorage.removeItem(itemKey);
                await fetchData(); // recursively calls itself and repeats the process till all keys are processed
              } else {
                await AsyncStorage.setItem(
                  `PENDING_API_CALL_${data?.asyncKey}`,
                  JSON.stringify({...data, isError: true}),
                );
                await AsyncStorage.removeItem('isProcessing');
              }
            } catch (err) {
              await AsyncStorage.setItem(
                `PENDING_API_CALL_${data?.asyncKey}`,
                JSON.stringify({...data, isError: true, err}),
              );
              await AsyncStorage.removeItem('isProcessing');
            }
          })();
        }
      };

      await fetchData();
      await AsyncStorage.removeItem('isProcessing');
    } catch (err) {
      await AsyncStorage.removeItem('isProcessing');
    }
  }
};
