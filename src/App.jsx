import { useState } from "react";

export default function TaskApp() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    taskId: "",
    taskName: "",
    description: "",
    dueDate: "",
    status: "Pending",
    remarks: "",
  });
  const [editId, setEditId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDueDate, setFilterDueDate] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addOrUpdateTask = () => {
    if (!form.taskId || !form.taskName) return alert("Fill required fields");

    if (editId !== null) {
      const updatedTasks = tasks.map((task) =>
        task.taskId === editId ? form : task
      );
      setTasks(updatedTasks);
      setEditId(null);
    } else {
      setTasks([...tasks, form]);
    }

    setForm({
      taskId: "",
      taskName: "",
      description: "",
      dueDate: "",
      status: "Pending",
      remarks: "",
    });
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.taskId !== id));
  };

  const editTask = (task) => {
    setForm(task);
    setEditId(task.taskId);
  };

  const filteredTasks = tasks.filter((task) => {
    return (
      (filterStatus === "" || task.status === filterStatus) &&
      (filterDueDate === "" || task.dueDate === filterDueDate)
    );
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-lg w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Task Management App</h1>

        {/* Task Form */}
        <div className="flex flex-col gap-4 mb-4">
          <input name="taskId" value={form.taskId} onChange={handleChange} placeholder="Task ID" className="p-2 border rounded w-full" />
          <input name="taskName" value={form.taskName} onChange={handleChange} placeholder="Task Name" className="p-2 border rounded w-full" />
          <input name="description" value={form.description} onChange={handleChange} placeholder="Description" className="p-2 border rounded w-full" />
          <input name="dueDate" value={form.dueDate} onChange={handleChange} type="date" className="p-2 border rounded w-full" />
          <select name="status" value={form.status} onChange={handleChange} className="p-2 border rounded w-full">
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
          <input name="remarks" value={form.remarks} onChange={handleChange} placeholder="Remarks" className="p-2 border rounded w-full" />
          <button onClick={addOrUpdateTask} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">
            {editId ? "Update Task" : "Add Task"}
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6 mb-6">
          <div className="w-full">
            <label className="block text-sm font-medium mb-1">Filter by Due Date</label>
            <input type="date" value={filterDueDate} onChange={(e) => setFilterDueDate(e.target.value)} className="p-2 border rounded w-full" />
          </div>
          <div className="w-full">
            <label className="block text-sm font-medium mb-1">Filter by Status</label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="p-2 border rounded w-full">
              <option value="">All</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Task Grid */}
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Task ID</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Description</th>
                <th className="border p-2">Due Date</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Remarks</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center p-4 text-gray-500">
                    No tasks match the filters.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => (
                  <tr key={task.taskId} className="text-center">
                    <td className="border p-2">{task.taskId}</td>
                    <td className="border p-2">{task.taskName}</td>
                    <td className="border p-2">{task.description}</td>
                    <td className="border p-2">{task.dueDate}</td>
                    <td className="border p-2">{task.status}</td>
                    <td className="border p-2">{task.remarks}</td>
                    <td className="border p-2 space-x-2">
                      <button onClick={() => editTask(task)} className="text-blue-600 hover:underline">Edit</button>
                      <button onClick={() => deleteTask(task.taskId)} className="text-red-600 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
