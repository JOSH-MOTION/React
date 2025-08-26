import React from 'react';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function Form(props) {
  const [description, setDescription] = useState('');

  const handleDescription = (event) => {
    setDescription(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!description.trim()) return; // Prevent empty submissions
    const newTask = {
      description: description,
      isCompleted: false,
      id: uuidv4(),
    };
    props.addTask(newTask);
    setDescription(''); // Clear input after submission
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-slate-200 flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl space-y-6 transition-all duration-300">
        <h2 className="text-3xl font-semibold text-slate-800 text-center">Add Task</h2>
        <div>
          <label className="block text-sm font-medium text-slate-600">Task Description</label>
          <input
            onChange={handleDescription}
            value={description}
            name="description"
            type="text"
            required
            className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white font-medium py-3 rounded-xl hover:bg-indigo-700 shadow-md transition"
        >
          Add Task
        </button>
      </form>
    </div>
  );
}