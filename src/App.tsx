import './App.css';
import React, { useState, useEffect, useRef } from "react";
import axios from 'axios'
import * as rsa from './rsa'
import * as bigintConversion from 'bigint-conversion'
//import * as BlindSignature from 'blind-signatures'

function App() {
  const apiServer ="http://localhost:3001/";
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [messagetxt, setmessagetxt] = useState<String>("");
  const textAreaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setmessagetxt(event.target.value);
  };

  //const BlindSignature = require('blind-signatures');
  const [messagecypher, setMessagecypher] = useState('');
  let pubkey: rsa.MyRsaPupblicKey;

  useEffect(() => {
    if (textareaRef && textareaRef.current) {
      textareaRef.current.style.height = "0px";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = scrollHeight + "px";
    }
  }, [messagetxt]);

  const getserverpublickey = async () => {
    const res = await axios.get(`${apiServer}rsapubkey`);
    // res.data es un json
    pubkey = rsa.MyRsaPupblicKey.fromJSON(res.data);
    console.log(pubkey);
  }

  const blindMessage = async () => {
    getserverpublickey();
  //   const blinded = BlindSignature.blind({
  //     message: messagetxt,
  //     N: pubkey.n,
  //     E: pubkey.e,
  //   }); 
  //   setMessagecypher(blinded);
   }

  const sendMessage = async () => {
    if (messagetxt==="")
      alert('enter a message');
    else
      await axios.post(`http://localhost:3001/decrypt`,{text: messagecypher});
  }

  const verifyMessage = async () => {
  }


  return (
    <div className="App">
      <header className="App-header">
        <p>
          Enter here the message.
        </p>
        
        <textarea
        ref={textareaRef}
        style={styles.textareaDefaultStyle}
        onChange={textAreaChange}
        
      ></textarea>
      <div>
      <button className='blindbtn' onClick={ () => blindMessage()} >blind</button>
      </div>  
      <br />
     
      <div>
      <textarea
        ref={textareaRef}
        style={styles.textareaDefaultStyle}
        onChange={textAreaChange}
        value={messagecypher}
        className='cyphertxt'
      ></textarea>
      </div>
      <div>
      <button className='sendbtn' onClick={() => sendMessage()}>send to be signed</button>
      </div>
      <br />
      <div>
      <textarea
        ref={textareaRef}
        style={styles.textareaDefaultStyle}
        onChange={textAreaChange}
        value={"signed message: "}
        className='cyphertxt'
      ></textarea>
      </div>
      <div>
      <button className='verifybtn' onClick={() => verifyMessage()}>verify</button>
      </div>

      </header>
      
    </div>
  );
  
}

export default App;

const styles: { [name: string]: React.CSSProperties } = {
  container: {
    marginTop: 50,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  textareaDefaultStyle: {
    padding: 5,
    width: 400,
    display: "block",
    resize: "none",
    backgroundColor: "#eee",
  },
};