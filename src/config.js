import firebase from "firebase";
require('firebase/firestore');
class config {
  constructor() {
    const firebaseConfig = {
      apiKey: "AIzaSyBSRs-ll1xLW1fX9szifAVlMSfSm6E2PiY",
      authDomain: "bedsheet-store.firebaseapp.com",
      databaseURL: "https://bedsheet-store.firebaseio.com",
      projectId: "bedsheet-store",
      storageBucket: "bedsheet-store.appspot.com",
      messagingSenderId: "336427616245",
      appId: "1:336427616245:web:2d4a924595a27ccae302bc",
      measurementId: "G-JYJXWTXM7E"
    };
  const app = !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app();
}
get db()
{
  return firebase.database();
}
get fire()
{
  return firebase.storage();
}
get fireS()
{
  return firebase.firestore();
}
get timestamp() {
  return Date.now();
}
get pageSize()
{
  return 15;
}
}
config.shared = new config();
export default config;

