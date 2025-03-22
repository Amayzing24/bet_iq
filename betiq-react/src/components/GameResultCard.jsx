import React from "react";

const GameResultCard = ({ team1, team2, overUnder }) => {
  return (
    <div className="bg-black text-white p-4 rounded-xl w-full max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <div className="text-xl font-bold text-yellow-400">{team1.name}</div>
        <div className="text-xl font-bold text-yellow-400">{team1.score}</div>
      </div>
      <div className="flex justify-between items-center mb-4">
        <div className="text-xl font-bold text-yellow-400">{team2.name}</div>
        <div className="text-xl font-bold text-yellow-400">{team2.score}</div>
      </div>

      <table className="w-full text-center mt-4 border-separate border-spacing-y-2">
        <thead>
          <tr className="text-green-400">
            <th>Moneyline</th>
            <th>Spread</th>
            <th>O/U {overUnder.total}</th>
          </tr>
        </thead>
        <tbody>
          <tr className="text-white">
            <td>{team1.moneyline}</td>
            <td>
              {team1.spread} ({team1.spreadOdds})
            </td>
            <td>O {overUnder.overOdds}</td>
          </tr>
          <tr className="text-white">
            <td>{team2.moneyline}</td>
            <td>
              {team2.spread} ({team2.spreadOdds})
            </td>
            <td>U {overUnder.underOdds}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default GameResultCard;