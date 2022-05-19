import './App.css';
import { useEffect, useState } from 'react';
import database from './firebase';
import { onValue, ref, push } from 'firebase/database';

function App (){
  // set states and variables
  const [ text, setText] = useState([]);
  const [ name, setName] = useState("");
  const [ message, setMessage] = useState([]);
  let  messageArray = [];

  //  function to handle query submit button
  const handleAISubmit = (e) => {
    e.preventDefault()
     {name.length <= 2 ? alert("please put in a name") 
    :  
    handleAPICall();
    }
  }

  const handleTextInput = (e) => {
    e.preventDefault()
    console.log(e.target.value)
    setName(e.target.value)
  }

  // function to handle message save button and push to firebase
  const handleSaveMessage = (e) => {
    e.preventDefault();
    const savedMessage = e.target[0].value;
    { text.length === 0 ? alert("there are no messages to save") 
    :  
    push(ref(database), { savedMessage });
    renderData();
    }
  }
  // function to render data pulled from firebase
  const renderData = () => {
    onValue(ref(database), (data) => {
      const dataObject = data.val();
      for (let message in dataObject) {
        messageArray.push(dataObject[message])
        setMessage(messageArray);
      }
    })
  }
  
  // useEffect to render messages on page load
  useEffect(() => {
     renderData();
  }, [])

  // useEffect to fetch API calls on submit with query
  const handleAPICall = () => {
    const aiData = {
    prompt: `write a fWriiercely positive message that includes the persons ${name}.`,
    temperature: 0.9,
    max_tokens: 60,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0
  } 
    fetch("https://api.openai.com/v1/engines/text-curie-001/completions", {
    method: "POST",
    headers: {
      'Content-Type':  "application/json",
      Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`
        },
    body: JSON.stringify(aiData)
    })
    .then((res) => res.json())
    .then((resJson) => {
    let text = resJson.choices[0].text;
    setText(text);
  })
}

  return (
  <div className="App"> 
  <div className='body'>
    <header>
      <h1>Anti Burn Book<span className='emoji'>💋</span></h1>
    </header>
          <form className="generateAI" onSubmit={handleAISubmit}>
              <label htmlFor='query'><p>Have a burning hate, and by hate I mean LOVE, for someone you know? Write their name in the box and Regina, our AI, will write a lovely message about them to put in your not-so-burn-book.</p></label>
              <div className='flexContainer'>
                <input
                  type='text'
                  id='query'
                  placeholder='Name here'
                  onChange={handleTextInput}
                />
                <button type='submit'>Submit</button>
              </div>
          </form>
          <div className='aiMessageForm'>
          <form className="aiText" onSubmit={handleSaveMessage}>
              {/* <label htmlFor='aiText'></label> */}
              <textarea
                className='text'
                type='text'
                id='aiText'
                value= {text}
                readOnly
              />
              <button type='submit'>Save</button>
          </form>
          </div>
          <div className='arrayOfMessages wrapper'>
            <ul>
              {message.slice(0).reverse().map((item, id) => {
                return (
                  <li 
                  key={id} 
                  className="message">
                  {item.savedMessage}
                  </li>
                )
              })
            }
            </ul>
          </div>
    </div>
      <footer>
        <a href="https://www.judslee.ca/">Made by Judy Lee for the Shopify Fall 2022 Internship</a>
      </footer>
  </div>
  );
}

export default App;
