import React, { createContext, useState } from 'react';
import io from 'socket.io-client';
const socket = io(process.env.SERVER_URL);

export const GlobalContext = createContext();
export const GlobalProvider = ({ children }) => {
  const [user, setUser] = useState({
    name: '',
    gender: 'M',
    room: '', // Room name for game
  });

  // const socket = Socket();
  return (
    <GlobalContext.Provider value={{ socket, user, setUser }}>
      {children}
    </GlobalContext.Provider>
  );
};
