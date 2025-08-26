import React from 'react';
import TaskItem from './TaskItem';

const TaskList = (props) => {
  return (
    <div>
      {props.tasksList.map((task) => (
        <TaskItem
          key={task.id}
          details={task}
          editTask={props.editedTask}
          deleteTask={props.deletedTask}
        />
      ))}
    </div>
  );
};

export default TaskList;