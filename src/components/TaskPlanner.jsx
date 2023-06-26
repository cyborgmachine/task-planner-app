import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const TaskPlanner = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [tasksByDate, setTasksByDate] = useState({});
  const [taskText, setTaskText] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleAddTask = () => {
    if (selectedDate && taskText.trim() !== '') {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      const tasksForDate = tasksByDate[formattedDate] || [];
      const newTask = { id: Date.now(), task: taskText, date: formattedDate, done: false };
      const updatedTasks = [...tasksForDate, newTask];
      setTasksByDate({ ...tasksByDate, [formattedDate]: updatedTasks });
      setTaskText('');
    }
  };

  const handleEditTask = (taskId) => {
    const tasksForDate = tasksByDate[selectedDate.toISOString().split('T')[0]] || [];
    const taskToEdit = tasksForDate.find((task) => task.id === taskId);
    if (taskToEdit) {
      setEditingTaskId(taskId);
      setTaskText(taskToEdit.task);
    }
  };

  const handleUpdateTask = () => {
    if (selectedDate && taskText.trim() !== '' && editingTaskId) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      const tasksForDate = tasksByDate[formattedDate] || [];
      const updatedTasks = tasksForDate.map((task) =>
        task.id === editingTaskId ? { ...task, task: taskText } : task
      );
      setTasksByDate({ ...tasksByDate, [formattedDate]: updatedTasks });
      setTaskText('');
      setEditingTaskId(null);
    }
  };

  const handleDeleteTask = (date, taskId) => {
    const tasksForDate = tasksByDate[date] || [];
    const updatedTasks = tasksForDate.filter((task) => task.id !== taskId);
    setTasksByDate({ ...tasksByDate, [date]: updatedTasks });
    setTaskText('');
    setEditingTaskId(null);
  };

  const handleToggleTask = (date, taskId) => {
    const tasksForDate = tasksByDate[date] || [];
    const updatedTasks = tasksForDate.map((task) =>
      task.id === taskId ? { ...task, done: !task.done } : task
    );
    setTasksByDate({ ...tasksByDate, [date]: updatedTasks });
  };

  return (
    <div>
      <h2>Task Planner</h2>
      <DatePicker selected={selectedDate} onChange={handleDateChange} />
      <div>
        <input
          type="text"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          placeholder="Enter task"
        />
        {!editingTaskId ? (
          <button onClick={handleAddTask}>Add Task</button>
        ) : (
          <button onClick={handleUpdateTask}>Update Task</button>
        )}
      </div>
      {selectedDate && (
        <div>
          <h3>Tasks for {selectedDate.toISOString().split('T')[0]}</h3>
          {tasksByDate[selectedDate.toISOString().split('T')[0]]?.map((task) => (
            <div key={task.id}>
              {editingTaskId === task.id ? (
                <input
                  type="text"
                  value={taskText}
                  onChange={(e) => setTaskText(e.target.value)}
                />
              ) : (
                <span>{task.task}</span>
              )}
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => handleToggleTask(task.date, task.id)}
              />
              {editingTaskId === task.id ? (
                <button onClick={handleUpdateTask}>Save</button>
              ) : (
                <button onClick={() => handleEditTask(task.id)}>Edit</button>
              )}
              <button onClick={() => handleDeleteTask(task.date, task.id)}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskPlanner;
