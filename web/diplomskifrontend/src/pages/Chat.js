import React, { useEffect, useState, useRef } from 'react'
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import userService from '../services/user.service';
import authService from '../services/auth.service';
import axios from 'axios';
import authHeader from '../services/auth-header';

var stompClient = null;
const Chat = () => {
    const pictureInput = useRef(null);
    const textArea = useRef(null);
    const [contacts, setContacts] = useState([]);
    const [messages, setMessages] = useState([]);
    const [ownPicture, setOwnPicture] = useState(require('../resources/avatar.webp'));
    const [userData, setUserData] = useState({
        username: authService.getCurrentUser().username,
        receivername: null,
        connected: false,
        subId: null,
        message: ''
    });
    useEffect(() => {
        if (userData.connected)
            return;
        connect();
        userService.getUserDetails(authService.getCurrentUser().username).then(details => {
            if (details.data.profilePicture == null)
                return;
            setOwnPicture(details.data.profilePicture);
        });
    }, []);

    function onClickContact(contact) {
        stompClient.unsubscribe('sub');
        setUserData({ ...userData, receivername: contact });
    }

    const connect = () => {
        let Sock = new SockJS('http://localhost:8080/ws');
        stompClient = over(Sock);
        stompClient.connect({}, onConnected, onError);
    }

    const onConnected = () => {
        setUserData({ ...userData, "connected": true });
        console.log("connected")
        userService.getContacts().then(contacts => {
            let newContacts = [];
            contacts.data.forEach(contact => {
                newContacts.push(contact.username);
            });
            if (newContacts.length != 0) {
                setUserData({ ...userData, receivername: newContacts[0] })
                setContacts(newContacts);
            }
        });

    }

    useEffect(() => {
        if (userData.receivername == null)
            return;
        console.log("receiver name changed, new is: " + userData.receivername);
        stompClient.subscribe('/user/' + userData.username + '-' + userData.receivername + '/private', onPrivateMessage, { id: 'sub' });

        axios.get("http://localhost:8080/message/" + userData.username + "/" + userData.receivername, { headers: authHeader() }).then(messages => {
            setMessages(messages.data);
        });
    }, [userData.receivername]);

    const onPrivateMessage = (payload) => {
        console.log(payload);
        var chatMessage = JSON.parse(payload.body);
        setMessages(prevMessages => [...prevMessages, chatMessage]);
    }

    const onError = (err) => {
        console.log(err);
    }

    function sendMessage(msg) {
        console.log('Send button click');
        if (!stompClient)
            return;
        var chatMessage = {
            senderName: userData.username,
            receiverName: userData.receivername,
            message: msg,
            status: "MESSAGE"
        };
        stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
        setMessages(prevMessages => [...prevMessages, chatMessage]);
    }

    function sendMessageImg(msg) {
        console.log('Send button click');
        if (!stompClient)
            return;
        var chatMessage = {
            senderName: userData.username,
            receiverName: userData.receivername,
            message: msg,
            status: "IMAGE"
        };
        stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
        setMessages(prevMessages => [...prevMessages, chatMessage]);
    }

    function onClickSend() {
        sendMessage(textArea.current.value);
    }
    function onClickLocation() {
        userService.getUserDetails(authService.getCurrentUser().username).then(details => {
            sendMessage(details.data.firstname + ' ' + details.data.lastname + ', ' + details.data.address + ', ' + details.data.city + ', ' + details.data.country + ', ' + details.data.phone);
        });
    }

    function onClickPhoto() {
        pictureInput.current.click();
    }

    function handlePictureChange(event) {
        let file = event.target.files[0];
        if (!file) {
            return;
        }
        var reader = new FileReader();
        reader.onloadend = function () {
            sendMessageImg(reader.result);
        }
        reader.readAsDataURL(file);
    }

    if (contacts.length == 0)
        return (
            <div className="h-full flex items-center justify-center">
                <h1 className="text-center font-bold text-4xl">No Chats :(</h1>
            </div>
        );

    return (
        <div className="drawer drawer-mobile h-full" >
            <input type="file" ref={pictureInput} onChange={handlePictureChange} accept="image/*" className="hidden" />
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content items-center">
                <label htmlFor="my-drawer-2" className="btn drawer-button lg:hidden mt-2">{userData.receivername}</label>
                <div className="w-full h-3/4 p-24 overflow-y-auto">
                    {/* Chat Begin */}

                    {messages.map(msg => (
                        <div className={msg.senderName == userData.username ? "chat chat-end" : "chat chat-start"}>
                            <div className="chat-image avatar">
                                <div className="w-10 rounded-full">
                                    <img src={msg.senderName == userData.username ? ownPicture : "https://placeimg.com/192/192/people"} />
                                </div>
                            </div>
                            <div className="chat-header">
                                {msg.senderName}
                            </div>
                            <div className="chat-bubble">{msg.status == 'IMAGE' ? <img className="w-52" src={msg.message} /> : msg.message}</div>
                        </div>
                    ))}



                    {/* Chat End */}
                </div>
                <div className="border-t w-full h-1/4 flex flex-row">
                    <div className="h-full w-9/12 p-5 flex justify-evenly align-middle">
                        <textarea ref={textArea} className="textarea h-full w-full" placeholder="Message"></textarea>
                    </div>
                    <div className="w-3/12">
                        <div className="flex justify-evenly align-middle h-1/3 pt-12">
                            <button className="btn btn-outline" onClick={onClickLocation}><svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M12 10c-1.104 0-2-.896-2-2s.896-2 2-2 2 .896 2 2-.896 2-2 2m0-5c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3m-7 2.602c0-3.517 3.271-6.602 7-6.602s7 3.085 7 6.602c0 3.455-2.563 7.543-7 14.527-4.489-7.073-7-11.072-7-14.527m7-7.602c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602" /></svg></button>
                            <button className="btn btn-outline" onClick={onClickPhoto}><svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M16.983 2l1.406 2.109c.371.557.995.891 1.664.891h3.93v17h-24v-17h5.93c.669 0 1.293-.334 1.664-.891l1.406-2.109h8zm3.07 4c-1.006 0-1.938-.5-2.496-1.337l-1.109-1.663h-6.93l-1.109 1.664c-.557.836-1.49 1.336-2.496 1.336h-4.93v15h22v-15h-2.93zm-7.053 1c3.311 0 6 2.689 6 6s-2.689 6-6 6-6-2.689-6-6 2.689-6 6-6zm0 1c2.76 0 5 2.24 5 5s-2.24 5-5 5-5-2.24-5-5 2.24-5 5-5zm0 2c1.656 0 3 1.344 3 3s-1.344 3-3 3-3-1.344-3-3 1.344-3 3-3zm0 1c1.104 0 2 .896 2 2s-.896 2-2 2-2-.896-2-2 .896-2 2-2zm-8-2c0-.552-.447-1-1-1-.553 0-1 .448-1 1s.447 1 1 1c.553 0 1-.448 1-1zm-3-6h3.001v1h-3.001v-1z" /></svg></button>
                            <button className="btn btn-outline" onClick={onClickSend}><svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M21.19 7h2.81v15h-21v-5h-2.81v-15h21v5zm1.81 1h-19v13h19v-13zm-9.5 1c3.036 0 5.5 2.464 5.5 5.5s-2.464 5.5-5.5 5.5-5.5-2.464-5.5-5.5 2.464-5.5 5.5-5.5zm0 1c2.484 0 4.5 2.016 4.5 4.5s-2.016 4.5-4.5 4.5-4.5-2.016-4.5-4.5 2.016-4.5 4.5-4.5zm.5 8h-1v-.804c-.767-.16-1.478-.689-1.478-1.704h1.022c0 .591.326.886.978.886.817 0 1.327-.915-.167-1.439-.768-.27-1.68-.676-1.68-1.693 0-.796.573-1.297 1.325-1.448v-.798h1v.806c.704.161 1.313.673 1.313 1.598h-1.018c0-.788-.727-.776-.815-.776-.55 0-.787.291-.787.622 0 .247.134.497.957.768 1.056.344 1.663.845 1.663 1.746 0 .651-.376 1.288-1.313 1.448v.788zm6.19-11v-4h-19v13h1.81v-9h17.19z" /></svg></button>
                        </div>
                        <div className="flex justify-evenly align-middle h-2/3 w-full p-10">
                            <button className="btn btn-primary h-full w-full" onClick={onClickSend}>Send</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="drawer-side border-r">
                <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
                <ul className="menu p-4 w-80 bg-base-100 text-base-content">
                    {
                        contacts.map(
                            contact => (
                                <li><a className={userData.receivername == contact ? "active" : ""} onClick={() => onClickContact(contact)}>{contact}</a></li>
                            )
                        )
                    }
                </ul>

            </div>
        </div >


        // <div className="container">
        //     {userData.connected && chats.size != 0 &&
        //         <div className="chat-box">
        //             <div className="member-list">
        //                 <ul>
        //                     {[...chats.keys()].filter(name => name != 'noContact').map((name, index) => (
        //                         <li onClick={() => { setTab(name) }} className={`member ${tab === name && "active"}`} key={index}>{name}</li>
        //                     ))}
        //                 </ul>
        //             </div>
        //             <div className="chat-content">
        //                 <ul className="chat-messages">
        //                     {[...chats.get(tab)].filter(chat => chat != 'noContact' && chat !== undefined).map((chat, index) => (
        //                         <li className={`message ${chat.senderName === userData.username && "self"}`} key={index}>
        //                             {chat.senderName !== userData.username && <div className="avatar">{chat.senderName}</div>}
        //                             <div className="message-data">{chat.message}</div>
        //                             {chat.senderName === userData.username && <div className="avatar self">{chat.senderName}</div>}
        //                         </li>
        //                     ))}
        //                 </ul>

        //                 <div className="send-message">
        //                     <input type="text" className="input-message" placeholder="enter the message" value={userData.message} onChange={handleMessage} />
        //                     <button type="button" className="send-button" onClick={sendValue}>send</button>
        //                 </div>
        //             </div>
        //         </div>}
        // </div>
    )
}

export default Chat;
