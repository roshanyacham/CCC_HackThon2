import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const App = () => {
  const initialBallState = { x: 300, y: 200, speedX: 3, speedY: 3 };
  const initialPaddleState = { left: 150, right: 150 };
  const [ball, setBall] = useState(initialBallState);
  const [paddles, setPaddles] = useState(initialPaddleState);
  const [gameRunning, setGameRunning] = useState(false);
  const [score, setScore] = useState({ left: 0, right: 0 });
  const ballRef = useRef(null);

  useEffect(() => {
    let intervalId;
    if (gameRunning) {
      const handleKeyPress = (e) => {
        switch (e.key) {
          case 'ArrowUp':
            setPaddles((prev) => ({ ...prev, right: Math.max(prev.right - 20, 0) }));
            break;
          case 'ArrowDown':
            setPaddles((prev) => ({ ...prev, right: Math.min(prev.right + 20, 300) }));
            break;
          case 'w':
            setPaddles((prev) => ({ ...prev, left: Math.max(prev.left - 20, 0) }));
            break;
          case 's':
            setPaddles((prev) => ({ ...prev, left: Math.min(prev.left + 20, 300) }));
            break;
          default:
            break;
        }
      };
      const updateGame = () => {
        setBall((prevBall) => {
          const newBall = {
            ...prevBall,
            x: prevBall.x + prevBall.speedX,
            y: prevBall.y + prevBall.speedY,
          };
          if (newBall.y <= 0 || newBall.y >= 380) {
            newBall.speedY = -prevBall.speedY;
          }
          const ballRect = ballRef.current.getBoundingClientRect();
          const paddleLeftRect = document.getElementById('paddle-left').getBoundingClientRect();
          const paddleRightRect = document.getElementById('paddle-right').getBoundingClientRect();
          if (
            ballRect.left <= paddleLeftRect.right &&
            ballRect.top <= paddleLeftRect.bottom &&
            ballRect.bottom >= paddleLeftRect.top
          ) {
            newBall.speedX = Math.abs(prevBall.speedX);
          }
          if (
            ballRect.right >= paddleRightRect.left &&
            ballRect.top <= paddleRightRect.bottom &&
            ballRect.bottom >= paddleRightRect.top
          ) {
            newBall.speedX = -Math.abs(prevBall.speedX);
          }
          if (newBall.x <= 0) {
            setScore((prev) => ({ ...prev, right: prev.right + 1 }));
            resetBall('right');
            return prevBall;
          } else if (newBall.x >= 600) {
            setScore((prev) => ({ ...prev, left: prev.left + 1 }));
            resetBall('left');
            return prevBall;
          }
          return newBall;
        });
      };
      intervalId = setInterval(updateGame, 16);
      window.addEventListener('keydown', handleKeyPress);

      return () => {
        clearInterval(intervalId);
        window.removeEventListener('keydown', handleKeyPress);
      };
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [gameRunning]);
  const resetBall = (direction) => {
    setBall({
      x: 300,
      y: 200,
      speedX: direction === 'left' ? 3 : -3,
      speedY: Math.random() > 0.5 ? 3 : -3,
    });
  };
  const startGame = () => {
    resetBall('left');
    setGameRunning(true);
  };
  const restartGame = () => {
    setBall(initialBallState);
    setPaddles(initialPaddleState);
    setScore({ left: 0, right: 0 });
    setGameRunning(false);
  };
  const pauseGame = () => {
    setGameRunning(false);
  };
  return (
    <div className="App">
      <div className="ping-pong-container" tabIndex="0">
        <div className="score">
          <span>{score.left}</span>
          <span>{score.right}</span>
        </div>
        <div
          className="paddle paddle-left"
          id="paddle-left"
          style={{ top: `${paddles.left}px` }}
        ></div>
        <div
          className="paddle paddle-right"
          id="paddle-right"
          style={{ top: `${paddles.right}px` }}
        ></div>
        <div
          className="ball"
          ref={ballRef}
          style={{ top: `${ball.y}px`, left: `${ball.x}px` }}
        ></div>
        <div className="controls">
          <button onClick={startGame}>Start</button>
          <button onClick={restartGame}>Restart</button>
          <button onClick={pauseGame}>Pause</button>
        </div>
      </div>
    </div>
  );
};
export default App;
