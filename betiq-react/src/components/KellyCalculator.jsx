import { useState } from 'react'

export default function KellyCalculator() {
  const [bankroll, setBankroll] = useState('')
  const [odds, setOdds] = useState('')
  const [prob, setProb] = useState('')
  const [result, setResult] = useState(0)
  const [fraction, setFraction] = useState(0)

  const calculateBet = () => {
    const br = parseFloat(bankroll) || 0
    const p = parseFloat(prob) / 100 || 0
    let decimalOdds = 0
    if (odds.startsWith('+')) {
      decimalOdds = parseInt(odds) / 100 + 1
    } else {
      decimalOdds = 100 / Math.abs(parseInt(odds)) + 1
    }
    const b = decimalOdds - 1
    const q = 1 - p
    const k = (b * p - q) / b
    const bet = Math.max(0, k * br)
    setResult(bet)
    setFraction(k)
  }

  return (
    <div className="flex flex-col items-center p-4 bg-gray-800 rounded-lg">
      <h1 className="text-xl mb-4">BetIQ: Kelly Criterion Calculator</h1>
      <label className="mb-1">Enter Your Bankroll ($)</label>
      <input type="number" value={bankroll} onChange={e => setBankroll(e.target.value)} placeholder="1000" className="text-black p-1 rounded mb-3 w-3/4"/>
      <label className="mb-1">Enter American Odds (+XXX or -XXX)</label>
      <input type="text" value={odds} onChange={e => setOdds(e.target.value)} placeholder="+150 or -200" className="text-black p-1 rounded mb-3 w-3/4"/>
      <label className="mb-1">Enter Win Probability (%)</label>
      <input type="number" value={prob} onChange={e => setProb(e.target.value)} placeholder="60" className="text-black p-1 rounded mb-3 w-3/4"/>
      <button onClick={calculateBet} className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-white">Calculate Bet</button>
      <div className="bg-gray-700 p-2 mt-4 rounded text-center w-3/4">
        Suggested Bet: ${result.toFixed(2)}
        <br/>
        ({(fraction * 100).toFixed(1)}% of bankroll)
      </div>
    </div>
  )
}
