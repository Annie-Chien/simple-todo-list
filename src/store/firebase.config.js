import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAsFDH5qc1BqGi2yPTaCu8BDG6nSSuIt34',
  authDomain: 'todo-list-9b7fb.firebaseapp.com',
  projectId: 'todo-list-9b7fb',
  storageBucket: 'todo-list-9b7fb.appspot.com',
  messagingSenderId: '162959691035',
  appId: '1:162959691035:web:6268b8907af7bfc38fd7be',
  databaseURL:
    'https://todo-list-9b7fb-default-rtdb.asia-southeast1.firebasedatabase.app',
};

//Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
export const auth = getAuth();
