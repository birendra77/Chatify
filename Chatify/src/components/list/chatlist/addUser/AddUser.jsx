// import React from 'react'
// import "./addUser.css"
// import { arrayUnion, collection, query, serverTimestamp, where } from "firebase/firestore";
// import { db } from '../../../../lib/firebase';
// import { useState } from 'react';
// import { getDoc, setDoc } from 'firebase/firestore';
// import { useUserStore } from '../../../../lib/userStore';
// import { updateDoc } from 'firebase/firestore';
// import { doc } from 'firebase/firestore';


// const AddUser = () => {
//   const [user, setUser] = useState(null)
//   const { currentUser } = useUserStore()

//   const handleSearch = async (e) => {
//     e.preventDefault()
//     const formData = new FormData(e.target)
//     const username = formData.get('username')

//     try {
//       const userRef = collection(db, "users");

//       const q = query(userRef, where("username", "==", username));
//       const querySnapShot = await getDoc(q);
//       if (!querySnapShot.empty) {
//         setUser(querySnapShot.docs[0].data())

//       }

//     } catch (error) {
//       console.error(error)

//     }
//   }

//   const handleAdd = async () => {

//     const chatRef = collection(db, "chats");
//     const userChatsRef = collection(db, "userchats");


//     try {

//       const newChatRef = doc(chatRef)
//       await setDoc(newChatRef, {
//         craetedAt: serverTimestamp(),
//         messages: [],
//       })

//       console.log(newChatRef.id)

//       // // Update the userChats collection for both users
//       // const currentUserChatRef = doc(db, "userChats", currentUser.id);
//       // const userChatRef = doc(db, "userChats", user.id);

//       // // Ensure userChats documents exist
//       // await setDoc(currentUserChatRef, { chats: [] }, { merge: true });
//       // await setDoc(userChatRef, { chats: [] }, { merge: true });
      

//       // await updateDoc(currentUserChatRef, {
//       //   chats: arrayUnion({
//       //     chatId: newChatRef.id,
//       //     lastMessage: "",
//       //     receiverId: user.id,
//       //     updatedAt: Date.now(),
//       //   }),
//       // });

//       // await updateDoc(userChatRef, {
//       //   chats: arrayUnion({
//       //     chatId: newChatRef.id,
//       //     lastMessage: "",
//       //     receiverId: currentUser.id,
//       //     updatedAt: Date.now(),
//       //   }),
//       // });






//       await  updateDoc(doc(userChatsRef,user.id),{
//         chats:arrayUnion({
//           chatId:newChatRef.id,
//           lastMessage:"",
//           reciverId:currentUser.id,
//           updatedAt:Date.now()
//         })
//       })

//       await  updateDoc(doc(userChatsRef,currentUser.id),{
//         chats:arrayUnion({
//           chatId:newChatRef.id,
//           lastMessage:"",
//           reciverId:user.id,
//           updatedAt:Date.now()
//         }),
//       })


//     } catch (error) {
//       console.error(error)
//     }
//   }

//   return (
//     <div className='addUser'>
//       <form  onSubmit={handleSearch}>
//         <input type="text" placeholder='Username' name='username' />
//         <button>Search</button>
//       </form>
//       {user && <div className="user">
//         <div className="detail">
//           <img src={user.avatar || "./avatar.png"} alt="" />
//           <span>{user.username}</span>
//         </div>
//         <button onClick={handleAdd}>Add User</button>
//       </div>}
//     </div>
//   )
// }

// export default AddUser




import React from 'react';
import "./addUser.css";
import { arrayUnion, collection, query, serverTimestamp, where, getDocs, setDoc, updateDoc, doc } from "firebase/firestore";
import { db } from '../../../../lib/firebase';
import { useState } from 'react';
import { useUserStore } from '../../../../lib/userStore';

const AddUser = () => {
  const [user, setUser] = useState(null);
  const { currentUser } = useUserStore();

  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get('username');

    try {
      const userRef = collection(db, "users");

      const q = query(userRef, where("username", "==", username));
      const querySnapShot = await getDocs(q); // Use getDocs for queries
      if (!querySnapShot.empty) {
        setUser(querySnapShot.docs[0].data());
      }

    } catch (error) {
      console.error(error);
    }
  };

  const handleAdd = async () => {

    const chatRef = collection(db, "chats");
    const userChatsRef = collection(db, "userchats");

    try {

      const newChatRef = doc(chatRef);
      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      console.log(newChatRef.id);

      await updateDoc(doc(userChatsRef, user.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: currentUser.id,
          updatedAt: Date.now()
        })
      });

      await updateDoc(doc(userChatsRef, currentUser.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: user.id,
          updatedAt: Date.now()
        }),
      });

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='addUser'>
      <form onSubmit={handleSearch}>
        <input type="text" placeholder='Username' name='username' />
        <button>Search</button>
      </form>
      {user && <div className="user">
        <div className="detail">
          <img src={user.avatar || "./avatar.png"} alt="" />
          <span>{user.username}</span>
        </div>
        <button onClick={handleAdd}>Add User</button>
      </div>}
    </div>
  );
};

export default AddUser;



