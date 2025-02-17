import React from "react"
import { Routes, Route } from "react-router-dom"
import HomePage from "../pages/HomePage"
import GameDetailsPage from "../pages/GameDetailsPage"
import TodaysDetailsPage from "../pages/TodaysDetailsPage"
import RiskIQPage from "../pages/RiskIQPage"

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/game/:gameId" element={<GameDetailsPage />} />
      <Route path="/today/:gameId" element={<TodaysDetailsPage />} />
      <Route path="/risk" element={<RiskIQPage />} />
    </Routes>
  )
}
