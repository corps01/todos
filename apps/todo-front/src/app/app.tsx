import { createTheme, ThemeProvider } from '@mui/material';
import { amber, blue, green } from '@mui/material/colors';
import TodoList from './views/TodosList';

const theme = createTheme({
  palette: {
    primary: blue,
    secondary: green,
  }
});


export function App() {
  return (
    <ThemeProvider theme={theme}>
    <TodoList/>
    </ThemeProvider>
  );
}

export default App;
