import { useState } from 'react'; // Import useState for managing users state
import Form from './components/form'; // Import Form component for adding new users
import List from './components/userList'; // Import List component for displaying users
import { v4 as uuidv4 } from 'uuid';

// App component manages the user list and provides functions for adding, editing, and deleting users
const App = () => {
  // State to manage the list of users with initial sample data
  const [users, setUsers] = useState([
    { name: "John", email: "john@gmail.com", id: uuidv4() },
    { name: "Lois", email: "Lois@gmail.com" , id : uuidv4() },
    { name: "Peter", email: "Peter@gmail.com", id: uuidv4() },
  ]);

  console.log(users);
  // Function to add a new user to the users list
  const addNewUser = (newUser) => {
    setUsers([...users, newUser]); // Append new user to existing list
  };

  // Function to edit an existing user based on index
const editUser = (userId, newDetails) =>{
  let arr = users.map((user)=>{
    if (user.id == userId){
        return newDetails
    }else{
      return user
    }
  })
  setUsers(arr)
}

 

  // Function to delete a user based on index
 const deleteUser = (userId) =>{
 let filteredArray = users.filter((user)=>{
 if (user.id !== userId){
    return user
    }
 })
 setUsers(filteredArray)
 }

  return (
    // Grid layout to display Form and List side by side
    <div className="grid grid-cols-2">
      {/* Form component for adding new users */}
      <Form addUser={addNewUser} />
      {/* List component to display users, passing users array and edit/delete functions */}
      <List usersList={users} editedUser={editUser} deletedUser={deleteUser} />
    </div>
  );
};

export default App;