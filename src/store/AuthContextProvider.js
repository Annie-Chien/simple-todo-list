import { createContext, useState, useEffect } from 'react';
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';

////////////////////////////////////////////////////////////////////
export const AuthContext = createContext();
const auth = getAuth();
////////////////////////////////////////////////////////////////////

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState({}); //儲存使用者資料
  const [isLoading, setIsLoading] = useState(true); //等待 firebase 回傳使用者資料
  const provider = new GoogleAuthProvider();

  //Goole 登入
  const googleSignIn = () => {
    return signInWithPopup(auth, provider);
  };

  //DEMO 模式（使用預設測試帳號登入）
  const visitorSignIn = () => {
    const email = 'test123@test.com';
    const password = 'test123';
    return signInWithEmailAndPassword(auth, email, password);
  };

  //登出
  const userSignOut = () => {
    return signOut(auth);
  };
  //偵測使用者狀態：登入或登出
  useEffect(() => {
    const removeListener = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
        const userData = {
          uid: user.uid,
          authName: user.displayName,
        };
        setUser(userData);
        setIsLoading(false);
      } else {
        setUser({});
      }

      console.log('auth state changed!', user);
    });
    return () => removeListener();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, googleSignIn, visitorSignIn, userSignOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
