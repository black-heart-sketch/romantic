import { useState } from 'react'
import './App.css'
import HeartsBg from './components/HeartsBg'
import ForgiveScreen from './components/ForgiveScreen'
import NoScreen from './components/NoScreen'
import RendezvousWizard from './components/RendezvousWizard'
import Envelope from './components/Envelope'

export default function App() {
  // 'ask' | 'no' | 'wizard' | 'envelope'
  const [screen, setScreen] = useState('ask')
  const [rendezvousData, setRendezvousData] = useState(null)

  return (
    <>
      <HeartsBg />
      <main className="scene">
        {screen === 'ask' && (
          <ForgiveScreen
            onYes={() => setScreen('wizard')}
            onNo={() => setScreen('no')}
          />
        )}
        {screen === 'no' && (
          <NoScreen onBack={() => setScreen('ask')} />
        )}
        {screen === 'wizard' && (
          <RendezvousWizard
            onComplete={(data) => {
              setRendezvousData(data)
              setScreen('envelope')
            }}
            onBack={() => setScreen('ask')}
          />
        )}
        {screen === 'envelope' && (
          <Envelope
            data={rendezvousData}
            onReset={() => setScreen('ask')}
          />
        )}
      </main>
    </>
  )
}
