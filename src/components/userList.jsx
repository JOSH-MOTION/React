import React, { useEffect } from 'react';
import Item from './item';
import useUsersStore from '@/store/useUsersStore';

const List = () => {
  const users = useUsersStore((state) => state.users);
  const fetchUsers =  useUsersStore((state) => state.fetchUsers)

  useEffect(()=>{
    fetchUsers();
  },[fetchUsers])

  return (
    <div>
      {users.map((user) => (
        <Item key={user.id} user={user} />
      ))}
    </div>
  );
};

export default List;
