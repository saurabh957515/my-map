import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import MyMap from './MyMap'
import MyGoogleMap from './MyGoogleMap'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* <MyGoogleMap /> */}
      <MyMap />
    </>
  )
}

export default App
