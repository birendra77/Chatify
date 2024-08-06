import { create } from 'zustand'
import { db } from './firebase';
import {doc,getDoc} from "firebase/firestore"
import { useUserStore } from './userStore';


export const useChatStore = create((set) => ({
  chatId: null,
  user:null,
  isCurrentUserBlocked:false,
  isReciverBlocked:false,
  changeChat:(chatId,user)=>{
    const currentUser=useUserStore.getState().currentUser

    // Check if current user is blocked
    if(user.blocked.includes(currentUser.id)){
      return set({
        chatId,
        user:null,
        isCurrentUserBlocked:true,
        isReciverBlocked:false,
      })
    }
    // Check if reciver is blocked
    else if(currentUser.blocked.includes(user.id)){
      return set({
        chatId,
        user:user,
        isCurrentUserBlocked:false,
        isReciverBlocked:true,
      })
    }
    else{

    return set({
      chatId,
      user,
      isCurrentUserBlocked:false,
      isReciverBlocked:false,
    })
  }

},
  changeBlock: ()=>{
    set(state=>({...state, isReciverBlocked: !state.isReciverBlocked}))
  }
}))