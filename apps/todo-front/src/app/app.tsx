// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.scss';
import NxWelcome from './nx-welcome';
import TodoList from './views/TodosList';

export function App() {
  return (
    <>
    <h1>Todos</h1>
    <TodoList/>
    </>
  );
}

export default App;
