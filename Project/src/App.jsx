import React from 'react'
import './App.css'
import va from './assets/ai.png'
import { FaMicrophone } from "react-icons/fa6";
import { datacontext } from './context/UserContext.jsx'
import { useContext } from 'react';
import speakimage from './assets/speak.gif'
import aiVoice from './assets/aiVoice.gif'

const App = () => {
  let { recognition, speaking, setSpeaking, prompt, setPrompt, response, setResponse } = useContext(datacontext);

  return (
    <div className='w-full h-screen overflow-hidden flex flex-col items-center justify-start p-2 gap-1'>
      <img src={va} alt="Image" className=" h-2/3 mx-auto border-0"/>
     
      <span className='text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500 text-2xl'>Akira: Empowering your every command with precision and grace.</span>
      {!speaking ?
        <button className=' flex items-center px-8 py-2 border-none outline-none bg-gradient-to-r from-cyan-400 to-pink-500 text-white text-xl cursor-pointer rounded-lg mt-5 shadow-md' onClick={() => {
          setPrompt("Listening");
          setSpeaking(true);
          setResponse(false);
          recognition.start();
        }}>Click here <FaMicrophone /></button> :
        <div>
          {!response ? <img src={speakimage} alt="speakimg" className='w-24' /> : <img src={aiVoice} alt='responseimg' className='w-1/2 h-24' />}
          <p className='text-xl text-white text-center px-10'>{prompt}</p>
        </div>}
    </div>
  )
}

export default App
