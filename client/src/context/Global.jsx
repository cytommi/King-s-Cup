import React, { createContext, useState } from 'react';
import io from 'socket.io-client';
import EventTypes from '../../../shared/EventTypes';
export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
	const [ user, setUser ] = useState({
		name: '',
		gender: ''
	});

	const Socket = () => {
		const socket = io(process.env.SERVER_URL);
		socket.on(EventTypes.server.BROADCAST.NEW_MEMBER, (msg) => console.log(msg));
		socket.on(EventTypes.server.INFO_REQUEST, () => {
			socket.emit(EventTypes.client.INFO_RESPONSE, user);
		});
		return socket;
	};

	const socket = Socket();
	return <GlobalContext.Provider value={{ socket, user, setUser }}>{children}</GlobalContext.Provider>;
};
