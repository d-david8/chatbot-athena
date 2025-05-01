import {createContext, useState} from 'react';
import {useEffect} from 'react';

// eslint-disable-next-line react-refresh/only-export-components
export const SelectedItemContext = createContext ();

// eslint-disable-next-line react/prop-types
export const SelectedItemProvider = ({children}) => {
  const [selectedItem, setSelectedItem] = useState (null);

  useEffect (
    () => {
      if (localStorage.getItem ('selectedItem') === null) {
        localStorage.setItem ('selectedItem', 'Bot');
      }
      if (selectedItem !== null) {
        if (
          localStorage.getItem ('selectedItem') === null ||
          localStorage.getItem ('selectedItem') === ''
        ) {
          setSelectedItem ('Bot');
        } else {
          localStorage.setItem ('selectedItem', selectedItem);
        }
      } else {
        setSelectedItem (localStorage.getItem ('selectedItem'));
      }
    },
    [selectedItem]
  );

  return (
    <SelectedItemContext.Provider value={{selectedItem, setSelectedItem}}>
      {children}
    </SelectedItemContext.Provider>
  );
};
