import React, { useState } from 'react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    id: "",
    name: "",
    description: "",
    dueDate: "",
    status: "",
    remarks: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addTask = () => {
    if (!form.name || !form.dueDate) return;
    setTasks([...tasks, { ...form, id: Date.now() }]);
    setForm({ id: "", name: "", description: "", dueDate: "", status: "", remarks: "" });
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Task Manager</h1>
      <div className="grid grid-cols-1 gap-4 mb-6">
        <input name="name" placeholder="Task Name" value={form.name} onChange={handleChange} className="border p-2 rounded" />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="border p-2 rounded" />
        <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} className="border p-2 rounded" />
        <select name="status" value={form.status} onChange={handleChange} className="border p-2 rounded">
          <option value="">Select Status</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
        <input name="remarks" placeholder="Remarks" value={form.remarks} onChange={handleChange} className="border p-2 rounded" />
        <button onClick={addTask} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add Task</button>
      </div>

      <table className="w-full table-auto border border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2 py-1">Task Name</th>
            <th className="border px-2 py-1">Description</th>
            <th className="border px-2 py-1">Due Date</th>
            <th className="border px-2 py-1">Status</th>
            <th className="border px-2 py-1">Remarks</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td className="border px-2 py-1">{task.name}</td>
              <td className="border px-2 py-1">{task.description}</td>
              <td className="border px-2 py-1">{task.dueDate}</td>
              <td className="border px-2 py-1">{task.status}</td>
              <td className="border px-2 py-1">{task.remarks}</td>
              <td className="border px-2 py-1">
                <button onClick={() => deleteTask(task.id)} className="text-red-600 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
