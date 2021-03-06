import { createContext, useContext, useCallback, useState } from "react";
import api from "../services/api";
import queryString from "query-string";

const TasksContext = createContext();

export function TasksProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");
  const getTasks = useCallback(async () => {
    try {
      const res = await api.get("/tasks");
      if (res.status === 200) {
        setTasks(res.data);
        setError(false);
      }
    } catch (error) {
      setError(error.response.data.message);
    }
  }, []);

  const deleteTask = useCallback(
    async (id) => {
      try {
        const res = await api.delete(`/tasks/${id}`);
        if (res.status === 200) {
          const currentTasks = tasks;
          const newTasks = currentTasks.filter((task) => task.id !== id);
          setTasks(newTasks);
          setError(false);
        }
      } catch (error) {
        setError(error.response.data.message);
      }
    },
    [tasks]
  );

  const createTask = useCallback(
    async (title, description) => {
      try {
        const res = await api.post(`/tasks/`, { title, description });
        if (res.status === 201) {
          const currentTasks = tasks;
          const newTasks = [...currentTasks, res.data];
          setTasks(newTasks);
          setError(false);
        }
      } catch (error) {
        setError(error.response.data.message);
      }
    },
    [tasks]
  );

  const getTasksFiltered = useCallback(async (status, search) => {
    try {
      const queryObj = {};

      if (status.length) {
        queryObj.status = status;
      }

      if (search.length) {
        queryObj.search = search;
      }
      const queryStr = queryString.stringify(queryObj);
      const res = await api.get("/tasks" + (queryStr ? `?${queryStr}` : ""));
      const newTasks = res.data;
      setTasks(newTasks);
      setError(false);
    } catch (error) {
      setError(error.response.data.message);
    }
  }, []);

  const handleStatusChange = useCallback(async (id, status) => {
    try {
      await api.patch(`/tasks/${id}/status`, { status });
      setError(false);
    } catch (error) {
      setError(error.response.data.message);
    }
  }, []);

  return (
    <TasksContext.Provider
      value={{
        tasks,
        error,
        getTasks,
        deleteTask,
        createTask,
        handleStatusChange,
        getTasksFiltered,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error("useTasks must be used within a TasksProvider  ");
  }
  return context;
}
