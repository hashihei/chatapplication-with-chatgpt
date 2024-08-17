"use client";

import React, { useEffect, useRef, useState } from 'react'
import { FaPaperPlane } from "react-icons/fa";
import { db } from '../firebase';
import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, Timestamp } from 'firebase/firestore';
import { useAppContext } from '../context/AppContext';
import OpenAI from 'openai';
import LoadingIcons from 'react-loading-icons'

type Message = {
    text: string;
    sender: string;
    createdAt: Timestamp;
};

const Chat = () => {    

    const openai = new OpenAI({
        apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
        dangerouslyAllowBrowser: true
    });

    const { selectedRoom, selectRoomName } = useAppContext();
    const [inputMessage, setInputMessage] = useState<string>("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>();

    const scrollDiv = useRef<HTMLDivElement>(null);

    //各roomにおけるメッセージを取得
    useEffect(() => {
        if(selectedRoom){
            const fetchMessages = async () => {
                const roomDocRef = doc(db, "rooms", selectedRoom);
                const messageCollectionRef = collection(roomDocRef, "messages");
                
                const q = query(messageCollectionRef, orderBy("createdAt"));

                const unsubscribe = onSnapshot(q, (snapshot) => {
                   const newMessages = snapshot.docs.map((doc) => doc.data() as Message);
                   setMessages(newMessages);
                });
    
                //メモリリークしないようにunsubscribe(); を実施
                return () => {
                    unsubscribe();
                };
            };
            fetchMessages();
        }        
    }, [selectedRoom]);

    useEffect(() => {
        if(scrollDiv.current) {
            const element = scrollDiv.current;
            element.scrollTo({
                top: element.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [messages]);


    const sendMessage = async () => {
        if (!inputMessage.trim()) return;
        console.log(inputMessage.trim())

        const messageData = {
            text: inputMessage,
            sender: "user",
            createdAt: serverTimestamp(),
        };

        //メッセージをfirestoreに保存
        //selectedRoom! とすることで、null値が許容されるようになる
        const roomDocRef = doc(db, "rooms", selectedRoom!);
        const messageCollectionRef = collection(roomDocRef, "messages");
        await addDoc(messageCollectionRef, messageData);

        setInputMessage("");
        setIsLoading(true);

        //OpenAI からの返信
        const gptResponse = await openai.chat.completions.create({
            messages: [{role: "user", content: inputMessage}],
            model: "gpt-4o-mini",
        });

        setIsLoading(false);
        
        const botResponse = gptResponse.choices[0].message.content;
        await addDoc(messageCollectionRef, {
            text: botResponse,
            sender: "bot",
            createdAt: serverTimestamp(),
        });

    };

    return (
        <div className="bg-gray-500 h-full p-4 flex flex-col">
            <h1 className='text-2xl text-white font-semibold mb-4'>{selectRoomName}</h1>
            <div className="flex-grow overflow-y-auto mb-4" ref={scrollDiv}>
                {messages.map((message, index) => (
                        <div key={index} className={message.sender === "user" ? "text-right" : "text-left"}>
                            <div
                                className={
                                    message.sender === "user"
                                    ? "bg-blue-500 inline-block rounded px-4 py-2 mb-2"
                                    : "bg-green-500 inline-block rounded px-4 py-2 mb-2"
                                }
                            >
                             <p className='text-white'>{message.text}</p>
                            </div>
                        </div>
                ))}
            
                {isLoading && <LoadingIcons.TailSpin />}

            </div>
            <div className='flex-shrink-0 relative'>
                <input
                    type="text"
                    placeholder='send a message'
                    className='border-2 rounded w-full pr-10 focus:outline-none p-2'
                    onChange={(e) => setInputMessage(e.target.value)}
                    value={inputMessage}
                    onKeyDown={(e) => {
                        if(e.key === "Enter"){
                            sendMessage();
                        }
                    }}
                />
                <button
                className='absolute right-5 flex items-center inset-y-0'
                onClick={() => sendMessage()}
                >
                    <FaPaperPlane />
                </button>
            </div>
        </div>
    )
}

export default Chat