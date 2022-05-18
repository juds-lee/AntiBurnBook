import './App.css';
import { useEffect, useState } from 'react';
import database from './firebase';
import { onValue, ref, push } from 'firebase/database';

function App (){
  const apiKey =  "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"
  const [ text, setText] = useState([]);
  const [ query, setQuery] = useState("");
  const [ message, setMessage] = useState([]);
  const  messageArray = [];
  const data = {
    prompt: `write a fiercely positive message that includes the persons ${query}.`,
    temperature: 0.9,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0
  } 

  const handleAISubmit = (e) => {
    e.preventDefault()
    console.log("imclicked")
    setQuery(e.target[0].value)
  }
  
  const handleSaveMessage = (e) => {
    e.preventDefault();
    const savedMessage = e.target[0].value;
    push(ref(database), { savedMessage });
    console.log(savedMessage)
    renderData()
  }

  const renderData = () => {
    onValue(ref(database), (data) => {
      const dataObject = data.val()
      for (let message in dataObject) {
        messageArray.push(dataObject[message])
        setMessage(messageArray)
      }
    })
  }

  useEffect(() => {
     renderData()
  }, [])

  useEffect(() => {
      fetch("https://api.openai.com/v1/engines/text-curie-001/completions", {
      method: "POST",
      headers: {
        'Content-Type':  "application/json",
        Authorization: `Bearer ${apiKey}`
          },
      body: JSON.stringify(data)
    })
      .then((res) => res.json())
      .then((resJson) => {
      let text = resJson.choices[0].text
      setText(text)
      console.log(text)
    })
  }, [query])

  return (
  <div className="App"> 
    <header><h1>Burn Book</h1></header>
      <form className="generateAI" onSubmit={handleAISubmit}>
          <label htmlFor='query'></label>
          <input
            type='text'
            id='query'
            placeholder='Who would you like to write a letter about?'
          />
          <button type='submit'>Submit</button>
      </form>
      <div>
       <form className="aiText" onSubmit={handleSaveMessage}>
          <label htmlFor='aiText'></label>
          <input
            type='text'
            id='aiText'
            placeholder='Who would you like to message a letter about?'
            value= {text}
            readOnly
          />
          <button type='submit'>Save</button>
      </form>
      </div>
      <div>
        <ul>
        {message.map((item) => {
          return (
            <li>{item.savedMessage}</li>
          )
        })

        }
        </ul>
      </div>
    </div>
  );
}

export default App;
