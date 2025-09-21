import React, {useState} from 'react'
import {DragDropContext} from 'react-beautiful-dnd'
import Column from '../components/Column/Column'
import AddTaskModal from '../components/AddTaskModal/AddTaskModal'
import './dashboard.css'

const initialData = {
  tasks: {
    'task-1': {id: 'task-1', content: 'Design login page'},
    'task-2': {id: 'task-2', content: 'Build Navbar'},
    'task-3': {id: 'task-3', content: 'Integrate API'},
    'task-4': {id: 'task-4', content: 'Write tests'},
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'To Do',
      taskIds: ['task-1', 'task-2'],
    },
    'column-2': {
      id: 'column-2',
      title: 'In Progress',
      taskIds: ['task-3'],
    },
    'column-3': {
      id: 'column-3',
      title: 'Done',
      taskIds: ['task-4'],
    },
  },
  columnOrder: ['column-1', 'column-2', 'column-3'],
}

const Dashboard = () => {
  const [data, setData] = useState(initialData)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  const onDragEnd = result => {
    const {destination, source, draggableId} = result
    if (!destination) return

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    const start = data.columns[source.droppableId]
    const finish = data.columns[destination.droppableId]

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds)
      newTaskIds.splice(source.index, 1)
      newTaskIds.splice(destination.index, 0, draggableId)

      const newColumn = {...start, taskIds: newTaskIds}
      setData({
        ...data,
        columns: {...data.columns, [newColumn.id]: newColumn},
      })
      return
    }

    const startTaskIds = Array.from(start.taskIds)
    startTaskIds.splice(source.index, 1)

    const newStart = {...start, taskIds: startTaskIds}

    const finishTaskIds = Array.from(finish.taskIds)
    finishTaskIds.splice(destination.index, 0, draggableId)

    const newFinish = {...finish, taskIds: finishTaskIds}

    setData({
      ...data,
      columns: {
        ...data.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    })
  }

  const handleAddTask = taskContent => {
    const newTaskId = `task-${Date.now()}`
    const newTask = {id: newTaskId, content: taskContent}

    setData(prevData => {
      const updatedTasks = {...prevData.tasks, [newTaskId]: newTask}
      const updatedColumn = {
        ...prevData.columns['column-1'],
        taskIds: [...prevData.columns['column-1'].taskIds, newTaskId],
      }

      return {
        ...prevData,
        tasks: updatedTasks,
        columns: {...prevData.columns, 'column-1': updatedColumn},
      }
    })
  }

  const handleUpdateTask = (taskId, newContent) => {
    setData(prevData => ({
      ...prevData,
      tasks: {
        ...prevData.tasks,
        [taskId]: {...prevData.tasks[taskId], content: newContent},
      },
    }))
  }

  const handleDeleteTask = taskId => {
    setData(prevData => {
      const updatedTasks = {...prevData.tasks}
      delete updatedTasks[taskId]

      const updatedColumns = {}
      for (const colId in prevData.columns) {
        updatedColumns[colId] = {
          ...prevData.columns[colId],
          taskIds: prevData.columns[colId].taskIds.filter(id => id !== taskId),
        }
      }

      return {...prevData, tasks: updatedTasks, columns: updatedColumns}
    })
  }

  return (
    <div className='dashboard'>
      <div className='dashboard-header'>
        <h2>Project Dashboard</h2>
        <button
          className='add-task-btn'
          onClick={() => {
            setEditingTask(null)
            setIsModalOpen(true)
          }}
        >
          + Add Task
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        {data.columnOrder.map(columnId => {
          const column = data.columns[columnId]
          const tasks = column.taskIds.map(taskId => data.tasks[taskId])

          return (
            <Column
              key={column.id}
              column={column}
              tasks={tasks}
              onEdit={task => {
                setEditingTask(task)
                setIsModalOpen(true)
              }}
              onDelete={handleDeleteTask}
            />
          )
        })}
      </DragDropContext>

      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddTask={handleAddTask}
        onUpdateTask={handleUpdateTask}
        editingTask={editingTask}
      />
    </div>
  )
}

export default Dashboard
