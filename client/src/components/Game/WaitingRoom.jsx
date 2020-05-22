import React from 'react';
import Spinner from 'react-spinkit';
import '../../styling/waitingRoom.scss';

const WaitingRoom = () => (
  <div id="waiting-room">
    <h1>Waiting for next round to begin... Take this time to hydrate.</h1>
    <Spinner name="pacman" color="#71bbff" fadeIn="1" className="spinner" />
  </div>
);
export default WaitingRoom;
