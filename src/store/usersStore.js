import { create }from 'zustand';
import {v4 as uuidv4} from 'uuid'

const useUsersStore = create((set)=>({

users:[
    
],
  

//adding new user
addNewUser:(newUser)=>
    set((state)=>({
        users:[...state.users,{...newUser,id:uuidv4()}]
    })),


    //editing user
    editUser: (userId,newDetails)=>
        set((state)=>({
            users: state.users.map((user)=>
            user.id === userId ? newDetails : user
            ),
        })),


        //deleting a User
        deleteUser:(userId) =>
            set((state)=> ({
                users: state.users.filter((user)=> user.id !==userId)
            }))

}))





export default useUsersStore