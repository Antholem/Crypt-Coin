import React from 'react';
import Logo from '../logo.png';
import useStore from '../store';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { AppBar, Box, CssBaseline, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText, Toolbar, Typography, MenuItem, Select, CardMedia } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { grey } from '@mui/material/colors';

const drawerWidth = '100%';

function NavBar(props) {
    const location = useLocation();
    const path = location.pathname;
    const { window } = props;
    const currency = useStore((state) => state.currency);
    const setCurrency = useStore((state) => state.setCurrency);
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };

    const navItems = [
        { page: 'Home', path: '/' },
        { page: 'About', path: '/about' },
        { page: 'Market', path: '/market' },
    ];

    const currencies = [
        { name: 'USD', value: 'usd' },
        { name: 'EUR', value: 'eur' },
        { name: 'JPY', value: 'jpy' },
        { name: 'PHP', value: 'php' },
    ];

    const handleChangeCurrency = (e) => {
        const selectedCurrency = e.target.value;
        setCurrency(selectedCurrency);
        localStorage.setItem('currency', selectedCurrency);
    };

    const style = {
        logoContainer: {
            cursor: 'pointer',
            width: 20,
            height: 20,
            mr: 1,
        },
        title: {
            cursor: 'pointer',
            flexGrow: 1,
            textDecoration: 'none',
            color: grey[50],
        },
        navLink: {
            cursor: 'pointer',
            textDecoration: 'none',
            mx: 2,
            transition: '0.5s',
        },
        select: {
            width: 100,
            height: 40,
            marginLeft: 15,
        },
        drawer: {
            textAlign: 'center',
        },
        drawerItem: {
            textAlign: 'center',
        },
    };

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={style.drawer}>
            <Typography variant='h6' sx={{ my: 2 }}>
                Crypt-Coin
            </Typography>
            <Divider />
            <List>
                {navItems.map((item) => (
                    <ListItem key={item.page} disablePadding>
                        <ListItemButton
                            sx={style.drawerItem}
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

    const container =
        window !== undefined ? () => window().document.body : undefined;

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar component='nav' color='inherit'>
                <Toolbar>
                    <IconButton
                        color='inherit'
                        aria-label='open drawer'
                        edge='start'
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <CardMedia
                        component={Link}
                        to={'/'}
                        image={Logo}
                        sx={style.logoContainer}
                    />
                    <Typography
                        component={Link}
                        to={'/'}
                        variant='h6'
                        sx={style.title}
                    >
                        Crypt-Coin
                    </Typography>
                    <Box sx={{ display: { xs: 'none', sm: 'block' }, flexGrow: 1 }}>
                        {navItems.map((item) => (
                            <Typography
                                sx={{
                                    ...style.navLink, color:
                                        item.path === path ||
                                            (item.path === '/market' && path === '/market/') ||
                                            (item.path === '/market' && path.startsWith('/market/'))
                                            ? '#ff00ea'
                                            : grey[50],
                                    '&:hover': {
                                        color: '#ff00ea',
                                    }}}
                                variant='body1'
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
                        variant='outlined'
                        labelId='demo-simple-select-label'
                        id='demo-simple-select'
                        label='Currency'
                        onChange={handleChangeCurrency}
                        value={currency}
                        style={style.select}
                    >
                        {currencies.map((currency) => (
                            <MenuItem value={currency.value} key={currency.name}>
                                {currency.name}
                            </MenuItem>
                        ))}
                    </Select>
                </Toolbar>
            </AppBar>
            <Box component='nav'>
                <Drawer
                    anchor={'top'}
                    container={container}
                    variant='temporary'
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
            </Box>
            <Toolbar />
        </Box>
    );
}

NavBar.propTypes = { window: PropTypes.func };

export default NavBar;
