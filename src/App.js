import React, { useState, useEffect } from 'react';
import logo from './assets/logo.png';
//import './App.css';

function App() {
  const [tasks, setTasks] = useState(() => {
    const stored = localStorage.getItem('tasks');
    return stored ? JSON.parse(stored) : [];
  });
  const [task, setTask] = useState({
    id: '',
    name: '',
    description: '',
    dueDate: '',
    status: 'Pending',
    remarks: ''
  });
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDue, setFilterDue] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleChange = e => {
    const { name, value } = e.target;
    setTask(prev => ({ ...prev, [name]: value }));
  };

  const addOrUpdateTask = () => {
    if (editingId !== null) {
      setTasks(prev =>
        prev.map(t => (t.id === editingId ? { ...task, id: editingId } : t))
      );
      setEditingId(null);
    } else {
      const newTask = { ...task, id: Date.now().toString() };
      setTasks(prev => [...prev, newTask]);
    }
    setTask({
      id: '',
      name: '',
      description: '',
      dueDate: '',
      status: 'Pending',
      remarks: ''
    });
  };

  const editTask = id => {
    const toEdit = tasks.find(t => t.id === id);
    setTask(toEdit);
    setEditingId(id);
  };

  const deleteTask = id => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const filtered = tasks.filter(t =>
    (t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase())) &&
    (filterStatus ? t.status === filterStatus : true) &&
    (filterDue ? t.dueDate === filterDue : true)
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedTasks = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const statusColor = status => {
    if (status === 'Pending') return 'text-red-600';
    if (status === 'In Progress') return 'text-green-600';
    if (status === 'Completed') return 'text-blue-600';
    return '';
  };

  return (
    <div className="min-h-screen p-4 bg-gray-100">

      {/* Logo */}
      <div className="flex justify-center mb-4">
        <img src={logo} alt="Ronix Infotech Logo" className="h-16" />
      </div>

      {/* Heading */}
      <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg shadow-md">
        Task Management App
      </h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name or description"
          className="p-2 border rounded w-full"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <input
          type="date"
          className="p-2 border rounded"
          value={filterDue}
          onChange={e => setFilterDue(e.target.value)}
        />
        <select
          className="p-2 border rounded"
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
        >
          <option value="">All Status</option>
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>
      </div>

      {/* Task Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input name="name" value={task.name} onChange={handleChange} placeholder="Task Name" className="p-2 border rounded" />
        <input name="description" value={task.description} onChange={handleChange} placeholder="Description" className="p-2 border rounded" />
        <input name="dueDate" type="date" value={task.dueDate} onChange={handleChange} className="p-2 border rounded" />
        <select name="status" value={task.status} onChange={handleChange} className="p-2 border rounded">
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>
        <input name="remarks" value={task.remarks} onChange={handleChange} placeholder="Remarks" className="p-2 border rounded md:col-span-2" />
        <button onClick={addOrUpdateTask} className="bg-blue-600 text-white py-2 px-4 rounded md:col-span-2">
          {editingId ? 'Update Task' : 'Add Task'}
        </button>
      </div>

      {/* Tasks Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white rounded shadow-md">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2">Task Name</th>
              <th className="p-2">Description</th>
              <th className="p-2">Due Date</th>
              <th className="p-2">Status</th>
              <th className="p-2">Remarks</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTasks.map(t => (
              <tr key={t.id} className="border-t">
                <td className="p-2">{t.name}</td>
                <td className="p-2">{t.description}</td>
                <td className="p-2">{t.dueDate}</td>
                <td className={`p-2 font-semibold ${statusColor(t.status)}`}>{t.status}</td>
                <td className="p-2">{t.remarks}</td>
                <td className="p-2">
                  <button onClick={() => editTask(t.id)} className="text-yellow-600 mr-2">Edit</button>
                  <button onClick={() => deleteTask(t.id)} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
            {paginatedTasks.length === 0 && (
              <tr>
                <td className="p-2 text-center text-gray-500" colSpan="6">No tasks found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Footer */}
      <footer className="text-center mt-10 text-sm text-gray-500">
        Developed by <span className="font-semibold text-blue-600">Ronix Infotech</span>
      </footer>
    </div>
  );
}

export default App;
