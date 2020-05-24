import React, { useContext } from 'react';
import { GameContext } from '../../../context/Game';
import '../../../styling/game/questionmaster.scss';

const QuestionMaster = () => {
  const [gameState, dispatch] = useContext(GameContext);
  return (
    <div id="question-master">
      {gameState.questionMaster && (
        <>
          <h2>Question Master</h2>
          <div id="question-master-container">
            <h3 className={`${gameState.questionMaster.split('_')[1]}`}>
              {gameState.questionMaster.split('_')[0]}
            </h3>
          </div>
        </>
      )}
    </div>
  );
};

export default QuestionMaster;
