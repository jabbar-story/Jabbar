const firebaseConfig = { databaseURL: "https://project1-c5c36-default-rtdb.firebaseio.com/" };
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const db = firebase.database();
