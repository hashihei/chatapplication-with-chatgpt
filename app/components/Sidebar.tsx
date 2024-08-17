"use client";

import { collection, onSnapshot, orderBy, query, where, Timestamp, addDoc, serverTimestamp } from "firebase/firestore";
import React, { useEffect, useState } from 'react';
import { CiLogout } from "react-icons/ci";
import { auth, db } from "../firebase";
import { stringify } from "querystring";
import { SiAdobelightroomclassic } from "react-icons/si";
import { unsubscribe } from "diagnostics_channel";
import { useAppContext } from "../context/AppContext";
import { DiVim } from "react-icons/di";

type Room = {
    id: string;
    name: string;
    createdAt: Timestamp;
}

const Sidebar = () => {
    const { user, userId, setSelectedRoom, setSelectRoomName } = useAppContext();
    const [rooms, setRooms] = useState<Room[]> ([]);

    useEffect(() => {
        if(user){
            const fetchRooms = async () => {
                const roomCollectionRef = collection(db, "rooms");
                const q = query(
                    roomCollectionRef,
                    where("userId", "==", userId),
                    orderBy("createdAt")
                );
                
                const unsubscribe = onSnapshot(q, (snapshot) => {
                    const newRooms: Room[] = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        name: doc.data().name,
                        createdAt: doc.data().createdAt,
                        //スプレッド構文
                    }));
                    setRooms(newRooms);
    
                });
    
                //メモリリークしないようにunsubscribe(); を実施
                return () => {
                    unsubscribe();
                };
            };
            fetchRooms();
        }
    }, [userId]);

    const selectRoom = (roomId: string, roomName: string) => {
        setSelectedRoom(roomId);
        setSelectRoomName(roomName);
    }

    const addNewRoom = async() => {
        const roomName = prompt("ルーム名を入力してください");
        if(roomName) {
            const newRoomRef = collection(db, "rooms");
            await addDoc(newRoomRef, {
                name: roomName,
                userId: userId,
                createdAt: serverTimestamp(),
            })
        }
    }

    const handleLogout = () => {
        auth.signOut();
    }

    return (
        <div className="bg-blue-500 h-full overflow-y-auto px-5 flex flex-col">
            <div className="flex-grow">
                <div onClick={addNewRoom} className='cursol-pointer flex justify-evenly item-center border mt-2 rounded-md hover:bg-blue-800 duration-150'>
                    <span className="text-white p-4 text-2xl">+</span>
                    <h1 className='text-white text-xl font-semibold p-4'>New Chat</h1>
                </div>
                <ul>
                    {rooms.map((room) => (
                        <li 
                            key={room.id} 
                            className="cursor-pointer border-b p-4 text-slate-100 hover:bg-slate-500 duration-75 "
                            onClick={() => selectRoom(room.id, room.name)}
                        >
                            {room.name}
                        </li>

                    ))}
                    {/* <li className='cursor-pointer border-b p-4 text-slate-100 hover:bg-slate-500 duration-75'>Room 2</li>
                    <li className='cursor-pointer border-b p-4 text-slate-100 hover:bg-slate-500 duration-75'>Room 3</li> */}
                </ul>
            </div>

            {user && <div className="mb-2 p-4 text-slate-100 text-lg font-medium">{user.email}</div>}

            <div onClick={() => handleLogout()} className='flex items-center justify-evenly text-2xl mb-2 cursor-pointer p-4 text-slate-100 hover:bg-slate-700 duration-150 rounded'>
                <CiLogout />
                <span>ログアウト</span>
            </div>
        </div>
    );
}

export default Sidebar