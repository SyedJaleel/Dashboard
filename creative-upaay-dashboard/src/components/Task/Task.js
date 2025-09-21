import React from "react";
import { Draggable } from "react-beautiful-dnd";
import "./Task.css";

const Task = ({ task, index, onEdit, onDelete }) => {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          className="task-card"
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <p>{task.content}</p>
          <div className="task-actions">
            <button className="edit-btn" onClick={() => onEdit(task)}>
              ✏️
            </button>
            <button className="delete-btn" onClick={() => onDelete(task.id)}>
              🗑️
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default Task;
