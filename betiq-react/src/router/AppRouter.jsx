import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import GameDetailsPage from "../pages/GameDetailsPage";
import TodaysDetailsPage from "../pages/TodaysDetailsPage";
import RiskIQPage from "../pages/RiskIQPage";
import LoginPage from "../pages/LoginPage";
import CreateAccountPage from "../pages/CreateAccount";
import ActiveGames from "../pages/ActiveGames";
import NewsPage from "../pages/NewsPage";
import ModelPerf from "../pages/ModelPerf";

function PrivateRoute({ children }) {
  return children; // Always render the children components without authentication
}

export default function AppRouter() {
  return (
    <Routes>
      {/* Default route redirects to home */}
      <Route path="/" element={<ActiveGames />} />
      
      {/* Login and Create Account Pages are accessible */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/create-account" element={<CreateAccountPage />} />
      <Route path="/active-games" element={<ActiveGames />} />

      {/* Protected Routes (Now always accessible) */}
      <Route path="/home" element={<ActiveGames />} />
      <Route path="/game/:gameId" element={<GameDetailsPage />} />
      <Route path="/today/:gameId" element={<TodaysDetailsPage />} />
      <Route path="/risk" element={<RiskIQPage />} />
      <Route path="/news" element={<NewsPage />} />
      <Route path="/model-perf" element={<ModelPerf />} />
    </Routes>
  );
}
