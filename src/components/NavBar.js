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
import Button from '@mui/material/Button';
import { Link, useLocation } from 'react-router-dom';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import useStore from '../store';

const drawerWidth = '100%';

function NavBar(props) {
    const { currency, setCurrency } = useStore();
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
        setCurrency(e.target.value);
    };

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ my: 2 }}>
                MUI
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
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ display: { xs: 'none', sm: 'block' } }}
                    >
                        MUI
                    </Typography>
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
                    <Box  sx={{ flexGrow: 1}}>
                        
                    </Box>
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        {navItems.map((item) => (
                            <Button
                                key={item.page}
                                sx={{ color: '#fff' }}
                                component={Link}
                                to={item.path}
                                selected={item.path === path}
                            >
                                {item.page}
                            </Button>
                        ))}
                    </Box>
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
