import React, {useState} from 'react'
import "./Message.css"
import VolumeDownIcon from '@material-ui/icons/VolumeDown';
import Linkify from 'react-linkify';
import DeleteRoundedIcon from '@material-ui/icons/DeleteRounded'
import db from "./firebase"



function Message({objId, message, timestamp, user, userImage, translation, me, language, channelId}) {
    let self = me === user
    let uri = encodeURI(message)
    let audioTranslation = ""


    //let [lang, setLang] = useState('en');
    
    const getTranslation = (e, language) => {
        
        const lang = language
        const sentance = encodeURI(e.target.innerText)
        // voice response
        fetch(`https://microsoft-azure-translation-v1.p.rapidapi.com/Speak?text=${sentance}&language=${lang}`, {
            "method": "GET",
            "headers": {
                "x--host": "microsoft-azure-translation-v1.p.rapidapi.com",
                "x-rapidapi-key": process.env.REACT_APP_GOOGLE_API_KEY}})
        .then(response => { 
            audioTranslation = response.url
            play(response.url)
        })
        .catch(err => {console.log(err)});   
    }
    function play(url) {
        new Audio(url).play()
    }
    
    const deleteThis = (e) => {
        // e.target.parentElement.parentElement.remove()
        db.collection('rooms').doc(channelId).collection('messages').doc(e.target.parentElement.id).delete();
        // debugger
        // db.collection('rooms').doc(channelId).collection('messages').doc(docRef.id).update({objId: docRef.id})


    }

    return(
        self ? <div className="me"> 

            <DeleteRoundedIcon id={objId} className="del" onClick={(e) => deleteThis(e)}/>

                <span className="message_timestamp">
                    {" " + new Date(timestamp?.toDate()).toDateString()} {new Date(timestamp?.toDate()).toLocaleTimeString()}
                </span>
            <DeleteRoundedIcon className="del" onClick={(e) => deleteThis(e)}/>
            <div className="message_info">
                <h4>
                </h4>
            <Linkify><p class="my msg">{message}</p></Linkify>
            <pre>
            </pre>
            </div>
        </div>: <div className="message">
        <img src={userImage} alt=""/>
            <div className="message_info">
            <h4 class="time_sender">
                {user}
                <span className="message_timestamp">
                    {" " + new Date(timestamp?.toDate()).toDateString()} {new Date(timestamp?.toDate()).toLocaleTimeString()}
                </span>
            </h4>
            {/* ------------------------------------------------------------ */}

   {/* <span>{language === 'fil-PH' || language === 'gu' ? null : <VolumeDownIcon/>}</span><span class="msg" data-id={language} onClick={(e) => getTranslation(e, language)}><Linkify>{message}</Linkify></span> */}
           {console.log("Message equal to translation: ",message, translation) }
    <span>{language === 'fil-PH' || language === 'gu' || message === translation || translation === "" ? null : <VolumeDownIcon/>}</span>
    {message === translation || translation === "" ? <p><br></br><span class="msg same" data-id={language}>{message}</span></p> : <span class="msg" data-id={language} onClick={(e) => getTranslation(e, language)}>  {message}</span>}
            
            
            <div></div>
            <pre>
                <br></br>
                {message === translation || translation === "" ? null : <Linkify><code class="translate" > {translation.trim()}</code></Linkify>}
            </pre>
            
            <audio id="audio" src={audioTranslation}></audio>
        

            </div>
        </div>
    )
}

export default Message