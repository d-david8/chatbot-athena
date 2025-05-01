import {createContext, useState} from 'react';
import {useEffect} from 'react';

// eslint-disable-next-line react-refresh/only-export-components
export const LogedUserContext = createContext ();

// eslint-disable-next-line react/prop-types
export const LogedUserContextProvider = ({children}) => {
  const [logedUser, setLogedUser] = useState (null);

  useEffect (
    () => {
      if (logedUser !== null) {
        localStorage.setItem ('logedUser', JSON.stringify (logedUser));
      } else {
        setLogedUser (JSON.parse (localStorage.getItem ('logedUser')));
      }
    },
    [logedUser]
  );

  return (
    <LogedUserContext.Provider value={{logedUser, setLogedUser}}>
      {children}
    </LogedUserContext.Provider>
  );
};
