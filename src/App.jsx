import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import MyMap from './MyMap'
import MyGoogleMap from './MyGoogleMap'
import ArcGisMap from './Canvas/Index'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* <MyGoogleMap /> */}
      <ArcGisMap/>
      {/* <MyMap /> */}
    </>
  )
}

export default App
