import { arrayUnion, updateDoc } from "firebase/firestore";
import { useChatStore } from "../../lib/chatStore";
import { auth } from "../../lib/firebase"
import "./detail.css"
import React from 'react'

const Detail = () => {

  const {chatId,user,isCurrentUserBlocked,isReciverBlocked,changeBlock} =
  useChatStore();

  const {currentUser}= useChatStore();

  const handleBlock =async () => {
    if(!user) return;

    const userDocRef=doc(db,"users",currentUser.id);

    try {
      await updateDoc(userDocRef,{
        blocked:isReciverBlocked ? arrayRemove (user.id) :arrayUnion(user.id),
      })
      changeBlock()
    } catch (error) {
      console.log(error) 
    }
  }


  return (
    <div className="detail">
      <div className="user">
        <img src={user?.avatar || "./avatar.png"} alt="" />
        <h2>{user ?.username}</h2>
        <p>Lorem ipsum dolor sit amet </p>
      </div>
      <div className="info">

        <div className="option">
          <div className="title">
            <span>Chat Settings</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>



        <div className="option">
          <div className="title">
            <span>Privacy & Help</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>


        <div className="option">
          <div className="title">
            <span>Shared Photos</span>
            <img src="./arrowDown.png" alt="" />
          </div>
              <div className="photos">



                <div className="photoItem">
                  <div className="photoDetails">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTj6kdEqRfw88vxwcsKj_JcssNzTDzH9y7HHQ&s" alt="" />
                    <span>photo_2024_2.png</span>
                  </div>
                  <img src="./download.png" alt="" className="icon"/>
                </div>



                <div className="photoItem">
                  <div className="photoDetails">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTj6kdEqRfw88vxwcsKj_JcssNzTDzH9y7HHQ&s" alt="" />
                    <span>photo_2024_2.png</span>
                  </div>
                  <img src="./download.png" alt="" className="icon"/>
                </div>


                <div className="photoItem">
                  <div className="photoDetails">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTj6kdEqRfw88vxwcsKj_JcssNzTDzH9y7HHQ&s" alt="" />
                    <span>photo_2024_2.png</span>
                  </div>
                  <img src="./download.png" alt="" className="icon"/>
                </div>


                <div className="photoItem">
                  <div className="photoDetails">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTj6kdEqRfw88vxwcsKj_JcssNzTDzH9y7HHQ&s" alt="" />
                    <span>photo_2024_2.png</span>
                  </div>
                  <img src="./download.png" alt="" className="icon"/>
                </div>


            </div>
          
        </div>


        <div className="option">
          <div className="title">
            <span>Shared Files</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>

        <button onClick={handleBlock}>{
          isCurrentUserBlocked? "You are Blocked!" : isReciverBlocked ?"userBlocked": "Block user"
  
      }</button>

        <button  className="logout" onClick={()=>auth.signOut()}>Logout</button>

      </div>
    </div>
  )
}

export default Detail
