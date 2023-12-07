const express = require("express");
const app = express();

// Allow json to Upcoming json request

app.use(express.json());

app.listen(8000, () => {
  console.log("Server is Started");
});

let tasks = [{ id: "1", title: "Task 1", description: "Going to GYM" }];

// 1. GET /tasks
app.get("/tasks", (req, res) => {
  res.json(tasks).sendStatus(200);
});

// 2. Add a Task

app.post("/tasks", (req, res) => {
  const title = req.body.title;
  const description = req.body.description;

  //user misses a required field when creating or updating a task so we used this condition for that.

  if (title && description) {
    tasks.push({
      // id shuld be unic so i used this method it create a new id any time when i create a new task
      id: (tasks.length + 1).toString(),

      title: title,
      description: description,
    });
    res
      .send({
        success: true,
        message: "Task Added Successfully",
      })
      .sendStatus(201);
  } else {
    res
      .send({
        success: false,
        message: "Validation error",
        errors: [
          {
            filed: "All filled are required",
            message: "cannot be null",
          },
        ],
      })
      .sendStatus(400);
  }
});

//3.Delet the tasks

// endpoint to remove a task from the tasks array based on its id.
// Find the index of the task with the given ID
app.delete("/tasks/:id", (req, res) => {
  const taskId = req.params.id;

  const initialTasksLength = tasks.length;

  tasks = tasks.filter((task) => task.id != taskId);

  if (tasks.length < initialTasksLength) {
    // Task was deleted successfully
    return res
      .send({
        success: true,
        message: "Task deleted successfully",
      })
      .status(200);
  } else {
    // Task with the specified ID was not found
    return res
      .send({
        success: true,
        message: "Task not found",
      })
      .status(404);
  }
});

// 4.Update the Task

app.put("/tasks/:id", (req, res) => {
  const taskId = req.params.id;
  const updatedTask = req.body;

  const index = tasks.findIndex((task) => task.id === taskId);

  if (index === -1) {
    return res
      .send({
        success: true,
        message: "Task not found",
      })
      .status(404);
  }

  tasks[index] = {
    //spred oprater used only  for tasks  &remaing Key & other data will be same
    ...tasks[index],
    ...updatedTask,
  };
  res
    .send({
      success: true,
      message: "Task Updated successfully",
    })
    .status(200);
});

// 5. Retrieve a specific task by ID.

app.get("/tasks/:id", (req, res) => {
  const taskId = req.params.id;

  const task = tasks.find((task) => task.id === taskId);

  if (!task) {
    return res.status(404).send({
      success: false,
      message: "Task not found",
    });
  }

  res.json(task);
});
