import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import NavBar from './components/NavBar';
import Market from './pages/Market';
import About from './pages/About';
import Coin from './pages/Coin';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0f051d',
      paper: '#0f051d',
    },
  },
  typography: {
    fontFamily: ['Space Grotesk', 'sans-serif'].join(','),
  },
});

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/market" element={<Market />} />
          <Route path="/market:id" element={<Coin />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
