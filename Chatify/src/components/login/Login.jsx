import React from 'react'
import { useState } from 'react'
import "./login.css"
import { toast } from 'react-toastify'
import { createUserWithEmailAndPassword ,signInWithEmailAndPassword} from 'firebase/auth'
import { auth} from '../../lib/firebase'
import { db } from '../../lib/firebase'
import { doc,   } from "firebase/firestore";
import {upload} from '../../lib/upload';
import { setDoc } from 'firebase/firestore'



const Login = () => {

  const [avatar, setAvatar] = useState({
    file: null,
    url: ""
  });

  const [loading,setLoading] = useState (false)

  const handleAvatar = (e) => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0])
      })
    }
  }

  
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true)
    const formData = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(formData);
    
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      
      const imgUrl = await upload(avatar.file);
      
      await setDoc(doc(db, "users", res.user.uid), {
        username,
        email,
        avatar:imgUrl,
        id: res.user.uid,
        blocked: [],
      });
      
      
      
      await setDoc(doc(db, "userchats", res.user.uid), {
        chats: [],
      });
      
      
      toast.success("Registration successful")
      
      
    }
    catch (error) {
      toast.error(error.message)
      console.log(error)
    }finally{
      setLoading(false)
    }
    // toast.success("Hello")
  }



  
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);

    try {

      await signInWithEmailAndPassword(auth, email, password);      
 
      
    } catch (error) {
      console.log(error)
      toast.error(error.message)
      
    }
    finally{
      setLoading(false);
    }
    // toast.success("Hello")
  }
  
  return (
    <div className='login'>
      <div className="item">
        <h2>Welcome back</h2>
        <form action="" onSubmit={handleLogin}>
          <input type="text" placeholder='Email' name='email' />
          <input type="password" placeholder='Password' name='password' />
          <button disabled ={loading}>{loading ? "loading":"Sign In"}</button>
        </form>
      </div>

      <div className="seperator"></div>

      <div className="item">
        <h2>Create an Account</h2>
        <form action="" onSubmit={handleRegister}>
          <label htmlFor="file">
            <img src={avatar.url || "./avatar.png"} alt="" />
            Upload an image</label>
          <input type="file" id='file' style={{ display: "none" }} onChange={handleAvatar} />
          <input type="text" placeholder='Username' name='username' />
          <input type="text" placeholder='Email' name='email' />
          <input type="password" placeholder='Password' name='password' />
          <button disabled ={loading}>{loading ? "loading":"Sign Up"}</button>

        </form>
      </div>

    </div>
  )
}

export default Login



// import React, { useState } from 'react';
// import "./login.css";
// import { toast } from 'react-toastify';
// import { createUserWithEmailAndPassword } from 'firebase/auth';
// import { auth, db, storage } from '../../lib/firebase'; // Ensure you import storage
// import { doc, setDoc } from "firebase/firestore";
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// import {upload} from '../../lib/upload'



// const Login = () => {
//   const [avatar, setAvatar] = useState({
//     file: null,
//     url: ""
//   });

//   const handleAvatar = (e) => {
//     if (e.target.files[0]) {
//       setAvatar({
//         file: e.target.files[0],
//         url: URL.createObjectURL(e.target.files[0])
//       });
//     }
//   };

//   const handleLogin = (e) => {
//     e.preventDefault();
//   };

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     const formData = new FormData(e.target);
//     const { username, email, password } = Object.fromEntries(formData);

//     try {
//       const res = await createUserWithEmailAndPassword(auth, email, password);

//       const imgUrl = await upload(avatar.file)

//       const userRef = doc(db, "users", res.user.uid);
//       const userChatsRef = doc(db, "userchats", res.user.uid);

//       let avatarURL = "";
//       if (avatar.file) {
//         const avatarRef = ref(storage, `avatars/${res.user.uid}`);
//         await uploadBytes(avatarRef, avatar.file);
//         avatarURL = await getDownloadURL(avatarRef);
//       }

//       await setDoc(userRef, {
//         username,
//         email,
//         avatar:imgUrl,
//         id: res.user.uid,
//         blocked: [],
//         avatar: avatarURL
//       });

//       await setDoc(userChatsRef, {
//         chats: [],
//       });

//       toast.success("Registration successful");
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   return (
//     <div className='login'>
//       <div className="item">
//         <h2>Welcome back</h2>
//         <form onSubmit={handleLogin}>
//           <input type="text" placeholder='Email' name='email' />
//           <input type="password" placeholder='Password' name='password' />
//           <button>Sign In</button>
//         </form>
//       </div>

//       <div className="seperator"></div>

//       <div className="item">
//         <h2>Create an Account</h2>
//         <form onSubmit={handleRegister}>
//           <label htmlFor="file">
//             <img src={avatar.url || "./avatar.png"} alt="avatar" />
//             Upload an image
//           </label>
//           <input type="file" id='file' style={{ display: "none" }} onChange={handleAvatar} />
//           <input type="text" placeholder='Username' name='username' />
//           <input type="text" placeholder='Email' name='email' />
//           <input type="password" placeholder='Password' name='password' />
//           <button>Sign Up</button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Login;
