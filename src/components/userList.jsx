import React from 'react';
import Item from './item';
import useUsersStore from '@/store/usersStore';


const List = () => {
  const users = useUsersStore((state)=> state.users)


  return (
    <div>
      {users.map((user) => (
        <Item key={user.id} user={user} />
      ))}
    </div>
  );
};

export default List;
