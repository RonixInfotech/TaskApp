import React, { useState } from 'react';

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [form, setForm] = useState({
    id: null,
    name: "",
    description: "",
    dueDate: "",
    status: "",
    remarks: ""
  });
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDueDate, setFilterDueDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addOrUpdateTask = () => {
    if (!form.name || !form.dueDate || !form.status) return;

    if (form.id === null) {
      const updated = [...tasks, { ...form, id: Date.now() }]; setTasks(updated); localStorage.setItem('tasks', JSON.stringify(updated));
    } else {
      const updated = tasks.map(t => t.id === form.id ? form : t); setTasks(updated); localStorage.setItem('tasks', JSON.stringify(updated));
    }

    setForm({ id: null, name: "", description: "", dueDate: "", status: "", remarks: "" });
  };

  const editTask = (task) => {
    setForm(task);
  };

  const deleteTask = (id) => {
    const updated = tasks.filter(t => t.id !== id); setTasks(updated); localStorage.setItem('tasks', JSON.stringify(updated));
  };

  const filteredTasks = tasks
    .filter(t => (!filterStatus || t.status === filterStatus))
    .filter(t => (!filterDueDate || t.dueDate === filterDueDate))
    .filter(t => t.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const pagedTasks = filteredTasks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const statusBadge = (status) => {
    let color = "gray";
    if (status === "Pending") color = "red";
    if (status === "In Progress") color = "green";
    if (status === "Completed") color = "blue";
    return <span className={`text-${color}-600 font-semibold`}>{status}</span>;
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Task Manager</h1>

      {/* Add Task Form */}
      <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2">
        <input name="name" placeholder="Task Name" value={form.name} onChange={handleChange} className="border p-2 rounded" />
        <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} className="border p-2 rounded" />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="border p-2 rounded col-span-full" />
        <select name="status" value={form.status} onChange={handleChange} className="border p-2 rounded">
          <option value="">Select Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <input name="remarks" placeholder="Remarks" value={form.remarks} onChange={handleChange} className="border p-2 rounded" />
        <button onClick={addOrUpdateTask} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 col-span-full">
          {form.id === null ? "Add Task" : "Update Task"}
        </button>
      </div>

      {/* Filter/Search */}
      <div className="flex flex-wrap gap-2 mb-4">
        <input type="text" placeholder="Search Task Name" value={search} onChange={(e) => setSearch(e.target.value)} className="border p-2 rounded" />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="border p-2 rounded">
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <input type="date" value={filterDueDate} onChange={(e) => setFilterDueDate(e.target.value)} className="border p-2 rounded" />
      </div>

      {/* Tasks Table */}
      <table className="w-full table-auto border border-collapse text-sm">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">Description</th>
            <th className="border px-2 py-1">Due Date</th>
            <th className="border px-2 py-1">Status</th>
            <th className="border px-2 py-1">Remarks</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pagedTasks.map((task) => (
            <tr key={task.id}>
              <td className="border px-2 py-1">{task.name}</td>
              <td className="border px-2 py-1">{task.description}</td>
              <td className="border px-2 py-1">{task.dueDate}</td>
              <td className="border px-2 py-1">{statusBadge(task.status)}</td>
              <td className="border px-2 py-1">{task.remarks}</td>
              <td className="border px-2 py-1 flex flex-col md:flex-row gap-2">
                <button onClick={() => editTask(task)} className="text-green-600 hover:underline">Edit</button>
                <button onClick={() => deleteTask(task.id)} className="text-red-600 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50">Prev</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50">Next</button>
      </div>
    </div>
  );
}

export default App;
