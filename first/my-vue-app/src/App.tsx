import { useState } from 'react'

import './App.css'

function App() {
  // const [count, setCount] = useState(0)
  const jobs = ['Forritari','Bakari', 'Þjónn']

  return (
    <>
      <div>

      <h1>Resume</h1>
      <div className='card'>
        <ul>
        {
          jobs.map((job,index) => (
            <div>
            <li key={index}>{job}</li>
          </div>
          )

          )
        }
        </ul>
      </div>

      </div>
 
    </>
  )
}

export default App
