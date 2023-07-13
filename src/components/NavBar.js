import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Logo from '../logo.png'
import { Link, useLocation } from 'react-router-dom';
import { MenuItem, Select, CardMedia } from '@mui/material';
import useStore from '../store';
import { grey } from '@mui/material/colors';

const drawerWidth = '100%';

function NavBar(props) {
    const currency = useStore((state) => state.currency);
    const setCurrency = useStore((state) => state.setCurrency);
    const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };

    const navItems = [
        { page: 'Home', path: '/' },
        { page: 'About', path: '/about' },
        { page: 'Market', path: '/market' }
    ];

    const currencies = [
        { name: 'USD', value: 'usd' },
        { name: 'EUR', value: 'eur' },
        { name: 'JPY', value: 'jpy' },
        { name: 'PHP', value: 'php' },
    ];

    const location = useLocation(); // useLocation for routing

    const path = location.pathname;

    const handleChangeCurrency = (e) => {
        const selectedCurrency = e.target.value;
        setCurrency(selectedCurrency);
        localStorage.setItem('currency', selectedCurrency);
    };

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ my: 2 }}>
                Crypt-Coin
            </Typography>
            <Divider />
            <List>
                {navItems.map((item) => (
                    <ListItem key={item.page} disablePadding>
                        <ListItemButton
                            sx={{ textAlign: 'center' }}
                            component={Link}
                            to={item.path}
                            selected={item.path === path}
                        >
                            <ListItemText primary={item.page} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar component="nav" color='inherit'>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <CardMedia omponent='img' image={Logo} sx={{ width: 20, height: 20, mr: 1 }} />
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                    >
                        
                        Crypt-Coin
                    </Typography>
                    <Box sx={{ display: { xs: 'none', sm: 'block' }, flexGrow: 1 }}>
                        {navItems.map((item) => (
                            <Typography
                                sx={{
                                    cursor: 'pointer',
                                    textDecoration: 'none',
                                    mx: 2,
                                    transition: '0.5s',
                                    color:
                                        item.path === path ||
                                            (item.path === '/market' && path === '/market/') ||
                                            (item.path === '/market' && path.startsWith('/market/'))
                                            ? '#ff00ea' // Highlight specific links based on path value
                                            : grey[50],
                                    '&:hover': {
                                        color: '#ff00ea',
                                    },
                                }}
                                variant="body1"
                                key={item.page}
                                component={Link}
                                to={item.path}
                                selected={item.path === path}
                            >
                                {item.page}
                            </Typography>
                        ))}

                    </Box>
                    <Select
                        variant="outlined"
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Currency"
                        onChange={handleChangeCurrency}
                        value={currency}
                        style={{ width: 100, height: 40, marginLeft: 15 }}
                    >
                        {currencies.map((currency) => (
                            <MenuItem value={currency.value}>
                                {currency.name}
                            </MenuItem>
                        ))}
                    </Select>
                </Toolbar>
            </AppBar>
            <Box component="nav">
                <Drawer
                    anchor={'top'}
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, },
                    }}
                >
                    {drawer}
                </Drawer>
            </Box>
            <Toolbar />
        </Box>
    );
}

NavBar.propTypes = {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window: PropTypes.func,
};

export default NavBar;
