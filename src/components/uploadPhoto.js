import { Alert } from 'react-native';
import config from '../config';
function uploadPhoto(uri, uploadUri) {
  // Alert.alert("please upload");
  return new Promise(async (res, rej) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    // Alert.alert(uri);
    const ref = config.shared.fire.ref(uploadUri);
    // Alert.alert(uploadUri);
    const unsubscribe = ref.put(blob).on(
      'state_changed',
      state => {},
      err => {
        unsubscribe();
        rej(err);
        Alert.alert("upload error: "+err.message);
      },
      async () => {
        unsubscribe();
        const url = await ref.getDownloadURL();
        // Alert.alert("upload url:"+url);
        res(url);
      },
    );
  });
}

export default uploadPhoto;
