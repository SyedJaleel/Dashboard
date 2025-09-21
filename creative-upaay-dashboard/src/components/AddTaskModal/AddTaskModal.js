import React, { useState, useEffect } from "react";
import "./AddTaskModal.css";

const AddTaskModal = ({ isOpen, onClose, onAddTask, onUpdateTask, editingTask }) => {
  const [taskContent, setTaskContent] = useState("");

  useEffect(() => {
    if (editingTask) {
      setTaskContent(editingTask.content);
    } else {
      setTaskContent("");
    }
  }, [editingTask]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (taskContent.trim() === "") return;

    if (editingTask) {
      onUpdateTask(editingTask.id, taskContent);
    } else {
      onAddTask(taskContent);
    }

    setTaskContent("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{editingTask ? "Edit Task" : "Add New Task"}</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="Enter task description..."
            value={taskContent}
            onChange={(e) => setTaskContent(e.target.value)}
          />
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="add-btn">
              {editingTask ? "Update Task" : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
