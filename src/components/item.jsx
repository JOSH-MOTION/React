import { useState } from 'react'; 
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'; 
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'; 

// Item component displays user details and handles editing/deleting
const Item = (props) => {
  // State to control dialog visibility
   const [open, setOpen] = useState(false);
    const [name, setName] = useState(props.details.name);
  const [email, setEmail] = useState(props.details.email);

   // Handle name input changes
  const handleName = (event) => {
    setName(event.target.value);
  };

  // Handle email input changes
  const handleEmail = (event) => {
    setEmail(event.target.value);
  };

  // Handle form submission to edit user details
const handleEdit = ()=>{

let edit = {name:name,email:email}

 let newDetails = {...props.details,...edit}

  props.editUser(props.details.id,newDetails)

  setOpen(false)
}


  // Handle delete button click


  // Open the edit dialog
  const handleOpen = ()=> {
    setOpen(true)
  }
 

  return (
    <div className="flex items-center justify-between gap-4 p-5 mb-4 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
  {/* Left Section: Avatar + Name/Email */}
  <div className="flex items-center gap-4">
    {/* Initial circle avatar */}
    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 font-bold text-lg uppercase">
      {props.details.name.charAt(0)}
    </div>

    {/* Name and Email */}
    <div>
      <h3 className="text-base font-semibold text-gray-900">{props.details.name}</h3>
      <p className="text-sm text-gray-500">{props.details.email}</p>
    </div>
  </div>

  {/* Right Section: Action Buttons */}
  <div className="flex gap-2">
    <button
      onClick={handleOpen}
      className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-100 rounded-lg hover:bg-indigo-50 transition"
    >
      Edit
    </button>
    <button
     onClick={()=>props.deleteUser(props.details.id)}
      className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 border border-red-100 rounded-lg hover:bg-red-50 transition"
    >
      Delete
    </button>
  </div>

{/* Dialog for editing user details */}
         <Dialog open={open} onClose={() => setOpen(false)} className="relative z-10">
        <DialogBackdrop
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-[state=closed]:opacity-0 data-[state=open]:opacity-100"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[state=closed]:translate-y-4 data-[state=closed]:opacity-0 data-[state=open]:opacity-100 sm:my-8 sm:w-full sm:max-w-lg"
            >
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
                          onChange={handleName}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                          type="email"
                          value={email}
                          onChange={handleEmail}
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
                  className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
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