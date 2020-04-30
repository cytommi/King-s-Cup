import React, { createContext, useState } from 'react';
import io from 'socket.io-client';
import EventTypes from '../../../shared/EventTypes';
const socket = io(process.env.SERVER_URL);

export const GlobalContext = createContext();

// const Socket = () => {
// 	const socket = io(process.env.SERVER_URL);
// 	socket.on(EventTypes.server.BROADCAST.NEW_MEMBER, (msg) => {
// 		console.log(msg);
// 		console.log(`New member! I will return my info back to the server: ${user}`);
// 	});

// 	// socket.on(EventTypes.server.INFO_REQUEST, () => {
// 	// 	socket.emit(EventTypes.client.INFO_RESPONSE, user);
// 	// });

// 	return socket;
// };

export const GlobalProvider = ({ children }) => {
	const [ user, setUser ] = useState({
		name: '',
		gender: '',
		room: '' // Room name for game
	});

	// const socket = Socket();
	return <GlobalContext.Provider value={{ socket, user, setUser }}>{children}</GlobalContext.Provider>;
};
