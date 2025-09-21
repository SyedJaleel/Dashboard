import React from 'react'
import './TaskCard.css'

const TaskCard = ({task}) => {
  return (
    <div className='task-card'>
      <p>{task.content}</p>
    </div>
  )
}

export default TaskCard
