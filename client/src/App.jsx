import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

/*
  1. create a function 'App'
  2. create state vars
  3. fn to run when the button is clicked (use async-await)
  4. send req to backend to connect
  5. convert res to json
  6. update UI state
*/

function App() {
  const [input, setInput] = useState("");                     //to store i/p
  const [reply, setReply] = useState("");                     //to store backend response

  const sendMessage = async ()=>{
    const res = await fetch("http://localhost:5000/message",{
      method: "POST",
      headers: {
        "Content-Type":"application/json"
      },
      body: JSON.stringify({message:input})
    });

    const data = await res.json();
    setReply(data.reply);
  };
  
  
  return (
    <>
      <div style = {{textAlign:"center", marginTop:"50px"}}>
        <h1>Real-Time AI Meeting Assistant</h1>
        <input value={input} onChange={(e)=>setInput(e.target.value)} placeholder="type something..." />
        <button onClick={sendMessage}>Send</button>
        <p>{reply}</p>
      </div>
    </>
  );
}

export default App;
