import { createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import App from './App';
import Result from './pages/Result';
import MiniGame from './pages/miniGame';
import LeaderboardPage from './pages/LeaderboardPage';

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/test', element: <App /> },
  { path: '/result', element: <Result /> },
  { path: '/result/:character', element: <Result /> },
  { path: '/mini-game', element: <MiniGame /> },
  { path: '/leaderboard', element: <LeaderboardPage /> },
]);

export default router;
