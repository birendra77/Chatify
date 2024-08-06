// import AddUser from "./addUser/AddUser";
// import "./chatlist.css"
// import { useState } from 'react'
// import { useUserStore } from "../../../lib/userStore";
// import { doc, onSnapshot } from "firebase/firestore"
// import { useEffect } from "react";
// import { getDoc } from "firebase/firestore";
// import { db } from "../../../lib/firebase";
// import { useChatStore } from "../../../lib/chatStore";

// const Chatlist = () => {
//     const [chats, setChats] = useState([]);
//     const [addMode, setAddMode] = useState(false);


//     const { currentUser } = useUserStore();
//     const { chatId,changeChat } = useChatStore();

//     useEffect(() => {
//         const unSub = onSnapshot(
//             doc(db, "userchats", currentUser.id),
//              async (res) => {
//             // setChats(doc.data())
//             const items = res.data().chats;

//             const promises = items.map(async (item) => {
//                 const userDocRef = doc(db, "users", item.reciverId)
//                 const userDocSnap = await getDoc(userDocRef)

//                 const user = userDocSnap.data()

//                 return { ...item, user }
//             });

//             const chatData = await Promise.all(promises)
//             setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt))
//         });

//         return () => {
//             unSub()
//         }
//     }, [currentUser.id])

//     // console.log(chats)



//     const handleSelect=async (chat)=>{
//         changeChat(chat.chatId, chat.user)
//     }


//     return (
//         <div className="chatList">
//             <div className="search">
//                 <div className="searchBar">
//                     <img src="./search.png" alt="" />
//                     <input type="text" placeholder="Search" />
//                 </div>
//                 <img src={addMode ? "./minus.png" : "./plus.png"}
//                     alt=""
//                     className="add"
//                     onClick={() => setAddMode((prev) => !prev)} />
//             </div>


//             {chats.map((chat) => (



//                 <div className="item" key={chat.chatId} onClick={()=>handleSelect(chat)}>
//                     <img src={chat.user.avatar || "./avatar.png"} alt="" />
//                     <div className="texts">
//                         <span>{chat.user.username}</span>
//                         <p>{chat.lastMessage}</p>
//                     </div>
//                 </div>


//             ))}


//             {/* <div className="item">
//                 <img src="./avatar.png" alt="" />
//                 <div className="texts">
//                     <span>Jane Doe</span>
//                     <p>Hello</p>
//                 </div>
//             </div>
//             <div className="item">
//                 <img src="./avatar.png" alt="" />
//                 <div className="texts">
//                     <span>Jane Doe</span>
//                     <p>Hello</p>
//                 </div>
//             </div>
//             <div className="item">
//                 <img src="./avatar.png" alt="" />
//                 <div className="texts">
//                     <span>Jane Doe</span>
//                     <p>Hello</p>
//                 </div>
//             </div> */}
//             {addMode && <AddUser />}

//         </div>
//     )
// }

// export default Chatlist






import React, { useState, useEffect } from 'react';
import AddUser from "./addUser/AddUser";
import "./chatlist.css";
import { useUserStore } from "../../../lib/userStore";
import { doc, onSnapshot, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useChatStore } from "../../../lib/chatStore";

const Chatlist = () => {
    const [chats, setChats] = useState([]);
    const [addMode, setAddMode] = useState(false);
    const [input, setInput] = useState("");
    const { currentUser } = useUserStore();
    const { chatId, changeChat } = useChatStore();

    useEffect(() => {
        if (!currentUser || !currentUser.id) {
            console.error("currentUser or currentUser.id is undefined");
            return;
        }

        const unSub = onSnapshot(
            doc(db, "userchats", currentUser.id),
            async (res) => {
                if (!res.exists()) {
                    console.error("Document does not exist");
                    return;
                }

                const items = res.data().chats;
                const promises = items.map(async (item) => {
                    try {
                        const userDocRef = doc(db, "users", item.receiverId);
                        const userDocSnap = await getDoc(userDocRef);

                        if (!userDocSnap.exists()) {
                            console.error("User document does not exist");
                            return null;
                        }

                        const user = userDocSnap.data();
                        return { ...item, user };
                    } catch (error) {
                        console.error("Error fetching user data:", error);
                        return null;
                    }
                });

                const chatData = await Promise.all(promises);
                const filteredChatData = chatData.filter(chat => chat !== null); // Filter out any null values
                setChats(filteredChatData.sort((a, b) => b.updatedAt - a.updatedAt));
            }
        );

        return () => {
            unSub();
        };
    }, [currentUser.id]);

    const handleSelect = async (chat) => {

        const userChats = chats.map(item => {
            const { user, ...rest } = item;
            return rest;
        })

        const chatIndex = userChats.findIndex(item => item.chatId === chat.chatId);

        userChats[chatIndex].isSeen = true

        const userChatsRef = doc(db, "userchats", currentUser.id);

        try {
            await updateDoc(userChatsRef, {
                chats: userChats,

            })
            changeChat(chat.chatId, chat.user)
        } catch (error) {
            console.log(error);
        }

    }

    const filteredChats=chats.filter(c=>c.user.username.toLowerCase().includes(input.toLocaleLowerCase()))

    return (
        <div className="chatList">
            <div className="search">
                <div className="searchBar">
                    <img src="./search.png" alt="" />
                    <input type="text" placeholder="Search" onChange={(e ) => setInput(e.target.value)}/>
                </div>
                <img
                    src={addMode ? "./minus.png" : "./plus.png"}
                    alt=""
                    className="add"
                    onClick={() => setAddMode((prev) => !prev)}
                />
            </div>

            {filteredChats.map((chat) => (
                <div className="item" key={chat.chatId} onClick={() => handleSelect(chat)}
                    style={
                        { backgroundColor: chat?.isSeen ? "transparent" : "#5183fe" }
                    }
                >
                    <img src={chat.user.blocked.includes(currentUser.id) ? "./avatar.png" : chat.user.avatar || "./avatar.png"} alt="" />
                    <div className="texts">
                        <span>{chat.user.blocked.includes(currentUser.id) ? "user" : chat.user.username}</span>
                        <p>{chat.lastMessage}</p>
                    </div>
                </div>
            ))}

            {addMode && <AddUser />}
        </div>
    );
};

export default Chatlist;
