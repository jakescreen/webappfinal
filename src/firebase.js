

import * as firebase from 'firebase';
const firebaseConfig = {
    apiKey: "AIzaSyDVyMlWDeOUw9otUXq4wekPEZRCrl3uDq4",
    authDomain: "reddit-clone-13d7b.firebaseapp.com",
    databaseURL: "https://reddit-clone-13d7b.firebaseio.com",
    projectId: "reddit-clone-13d7b",
    storageBucket: "reddit-clone-13d7b.appspot.com",
    messagingSenderId: "53260074452",
    appId: "1:53260074452:web:07ccdbc1f7cf3fa4732a41",
    measurementId: "G-MH63RT3EDK"
  };

firebase.initializeApp(firebaseConfig);

  export default firebase;