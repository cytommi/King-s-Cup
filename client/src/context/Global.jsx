import React, { createContext, useState, useEffect } from 'react';
import io from 'socket.io-client';
const socket = io(process.env.SERVER_URL);

const initialState = {
  name: '',
  gender: 'M',
  room: '', // Room name for game
};

export const GlobalContext = createContext();
export const GlobalProvider = ({ children }) => {
  const [user, setUser] = useState(initialState);

  const resetUser = () => {
    setUser(initialState);
  };

  return (
    <GlobalContext.Provider value={{ socket, user, setUser, resetUser }}>
      {children}
    </GlobalContext.Provider>
  );
};
