import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './TaskPlanner.scss';

const TaskPlanner = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [tasksByDate, setTasksByDate] = useState({});
  const [taskText, setTaskText] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

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

  const handleMoveTask = (date, taskId, newDate) => {
    const tasksForDate = tasksByDate[date] || [];
    const taskToMove = tasksForDate.find((task) => task.id === taskId);
    if (taskToMove) {
      const formattedDate = newDate.toISOString().split('T')[0];
      const tasksForNewDate = tasksByDate[formattedDate] || [];
      const updatedTasksForDate = tasksForDate.filter((task) => task.id !== taskId);
      const updatedTasksForNewDate = [...tasksForNewDate, { ...taskToMove, date: formattedDate }];
      setTasksByDate({
        ...tasksByDate,
        [date]: updatedTasksForDate,
        [formattedDate]: updatedTasksForNewDate,
      });
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Task Planner</h2>
      <div>Current Time: {currentTime.toLocaleTimeString()}</div>

      <div className="d-flex justify-content-center mt-3 mb-4">
        <div className="input-group input-group-sm custom-input-group">
          <input
            className="form-control m-2 custom-input"
            aria-label="Sizing example input"
            aria-describedby="inputGroup-sizing-sm"
            type="text"
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            placeholder="Enter task"
          />
        </div>
        <div className="input-group input-group-sm custom-input-group" style={{ zIndex: 100 }}>
          <DatePicker
            className="form-control m-2 custom-input"
            aria-label="Sizing example input"
            aria-describedby="inputGroup-sizing-sm"
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="EEE MMM dd yyyy"
          />
        </div>
      </div>
      <div className="d-flex justify-content-start">
        {!editingTaskId ? (
          <button className="btn btn-primary btn-sm m-2" onClick={handleAddTask}>
            Add Task
          </button>
        ) : (
          <button className="btn btn-primary btn-sm m-2" onClick={handleUpdateTask}>
            Update Task
          </button>
        )}
      </div>
      {selectedDate && (
        <div>
          <h3 className='h3 mb-4'>Tasks for {selectedDate.toDateString()}</h3>
          {tasksByDate[selectedDate.toISOString().split('T')[0]]?.map((task) => (
  <div className="d-flex justify-content-center align-items-md-center border border-dark-subtle mb-3" key={task.id}>
    <div className="d-flex flex-column">
      <span className='mb-2 mt-2' style={{ textDecoration: task.done ? 'line-through' : 'none' }}>
        {task.task}
      </span>

      <div className="d-flex justify-content-center align-items-md-center flex-wrap">
        {!editingTaskId && (
          <button
            className="btn btn-success btn-sm m-2 align-self-center"
            onClick={() => handleToggleTask(task.date, task.id)}
          >
            {task.done ? 'Undone' : 'Done'}
          </button>
        )}
        {editingTaskId === task.id ? (
          <button className="btn btn-primary btn-sm m-2 align-self-center" onClick={handleUpdateTask}>
            Save
          </button>
        ) : (
          <button
            className="btn btn-warning btn-sm m-2 align-self-center"
            onClick={() => handleEditTask(task.id)}
          >
            Edit
          </button>
        )}
        <button
          className="btn btn-danger btn-sm m-2 align-self-center"
          onClick={() => handleDeleteTask(task.date, task.id)}
        >
          Delete
        </button>
        <div className="d-flex justify-content-center align-items-center">
  <span className="m-3">Move to another date:</span>
  <DatePicker
    selected={null}
    onChange={(newDate) =>
      handleMoveTask(selectedDate.toISOString().split('T')[0], task.id, newDate)
    }
    dateFormat="EEE MMM dd yyyy"
  />
  </div>
  </div>
    </div>
  </div>
))}
        </div>
      )}
    </div>
  );
};

export default TaskPlanner;
