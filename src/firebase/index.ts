import {getAuth} from 'firebase/auth'
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAPCJTRk0NJoRtwcDWSwJ144NDI95pMcic",
  authDomain: "gym-training-d1df7.firebaseapp.com",
  projectId: "gym-training-d1df7",
  storageBucket: "gym-training-d1df7.appspot.com",
  messagingSenderId: "931800050959",
  appId: "1:931800050959:web:bb6e78e4df50d36f2ba27a"
};

 const app = initializeApp(firebaseConfig);
 const auth = getAuth(app)
 
 const db = getFirestore(app)

 export{auth, db}

 