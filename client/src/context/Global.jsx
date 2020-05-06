import React, { createContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

export const GlobalContext = createContext();
export const GlobalProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: '',
    gender: 'M',
    room: '', // Room name for game
  });

  const socket = io(process.env.SERVER_URL);

  return (
    <GlobalContext.Provider value={{ socket, user, setUser }}>
      {children}
    </GlobalContext.Provider>
  );
};
