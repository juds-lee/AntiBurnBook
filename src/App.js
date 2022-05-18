import './App.css';
import { useEffect, useState } from 'react';
import database from './firebase';
import { onValue, ref, push } from 'firebase/database';

function App (){
  const [ text, setText] = useState([]);
  const [ query, setQuery] = useState("");
  const [ message, setMessage] = useState([]);
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
      const  messageArray = [];
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
       Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`
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
    <header>
      <h1>Burn Book</h1>
    </header>
    <div>
      <p></p>
    </div>
      <form className="generateAI" onSubmit={handleAISubmit}>
          <label htmlFor='query'></label>
          <input
            type='text'
            id='query'
            placeholder='Who would you like to write a letter about?'
          />
          <button type='submit'>Submit</button>
      </form>
      <div className='aiMessageForm'>
       <form className="aiText" onSubmit={handleSaveMessage}>
          <label htmlFor='aiText'></label>
          <input
            type='text'
            id='aiText'
            value= {text}
            readOnly
          />
          <button type='submit'>Save</button>
      </form>
      </div>
      <div className='arrayOfMessage'>
        <ul>
          {message.map((item, id) => {
            return (
              <li key={id} className='message'>{item.savedMessage}</li>
            )
          })
        }
        </ul>
      </div>
    </div>
  );
}

export default App;
