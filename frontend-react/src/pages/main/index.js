import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core";
import { useAuth } from "../../hooks/auth";
import { useTasks } from "../../hooks/tasks";
import { useEffect } from "react";
const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

export default function Main() {
  const classes = useStyles();
  const { user } = useAuth();
  const { getTasks, tasks } = useTasks();

  useEffect(() => {
    try {
      getTasks();
    } catch (error) {
      console.log(error);
    }
  }, [getTasks]);
  return (
    <Box display="flex" justifyContent="space-evenly">
      <div>
        <h1>Tasks Managment</h1>
        <p>
          Hello <span>{user.username}</span>
        </p>
      </div>
      <Button variant="contained" color="primary" className={classes.button}>
        Create New Task
      </Button>
    </Box>
  );
}
