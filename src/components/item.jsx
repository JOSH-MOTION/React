import React, { useState, useEffect } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import useUsersStore from '@/store/usersStore';


const Item = ({ user }) => {
 const editUser = useUsersStore((state)=> state.editUser)
 const deleteUser = useUsersStore((state)=> state.deleteUser)

  const [open, setOpen] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  // Update local state if the user prop changes
  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
  }, [user]);

  const handleEdit = () => {
    const updatedUser = { ...user, name, email };
    editUser(user.id, updatedUser);
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <div className="flex items-center justify-between gap-4 p-5 mb-4 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center gap-4">
        {/* Avatar circle example: first letter of name */}
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 font-bold text-lg uppercase">
          {user.name.charAt(0)}
        </div>

        <div>
          <h3 className="text-base font-semibold text-gray-900">{user.name}</h3>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleOpen}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-100 rounded-lg hover:bg-indigo-50 transition"
        >
          Edit
        </button>
        <button
          onClick={() => deleteUser(user.id)}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 border border-red-100 rounded-lg hover:bg-red-50 transition"
        >
          Delete
        </button>
      </div>

      <Dialog open={open} onClose={() => setOpen(false)} className="relative z-10">
        <DialogBackdrop className="fixed inset-0 bg-gray-500/75 transition-opacity" />
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <ExclamationTriangleIcon aria-hidden="true" className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                      Edit User
                    </DialogTitle>
                    <div className="mt-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={handleEdit}
                  className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-500 sm:ml-3 sm:w-auto"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Item;
