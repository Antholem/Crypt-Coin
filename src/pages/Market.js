import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { FormControl, InputLabel, MenuItem, Select, Stack, TableHead } from '@mui/material';
import Loading from '../components/Loading';
import MovingIcon from '@mui/icons-material/Moving';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { green, red } from '@mui/material/colors';
import useStore from '../store';

const columns = [
    { id: 'rank', label: '#', minWidth: 0 },
    { id: 'coin', label: 'Coin', minWidth: 170 },
    { id: 'price', label: 'Price', align: 'right', minWidth: 100 },
    { id: 'change', label: '24h Change', align: 'right', minWidth: 100 },
    { id: 'marketcap', label: 'Market Cap', align: 'right', minWidth: 100 },
];

function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, onPageChange } = props;

    const handleFirstPageButtonClick = (event) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onPageChange(event, Math.max(0, Math.ceil(count / 10) - 1));
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} aria-label="first page">
                {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / 10) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / 10) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
        </Box>
    );
}

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
};

export default function CustomPaginationActionsTable() {
    const { currency } = useStore((state) => state);
    const [page, setPage] = useState(0);
    const [coins, setCoins] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const currencySymbol = currency === 'eur' ? '€' : currency === 'jpy' ? '¥' : currency === 'php' ? '₱' : '$';

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * 10 - coins.length) : 0;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    useEffect(() => {
        const fetchCoins = async () => {
            try {
                const response = await fetch(
                    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=40&page=1&sparkline=false`
                );
                const data = await response.json();
                // Add rank property to each coin object
                const coinsWithRank = data.map((coin, index) => ({ ...coin, rank: index + 1 }));
                setCoins(coinsWithRank);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching coins:', error);
            }
        };

        fetchCoins();
    }, [currency]);

    return (
        <Fragment>
            <Box>
                Market Update ({currency})
            </Box>
            <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                        <TableHead sx={{ backgroundImage: 'linear-gradient(25deg, #2600fc, #ff00ea)' }}>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody sx={{ backgroundColor: '#0f051d' }}>
                            {!isLoading &&
                                coins.slice(page * 10, page * 10 + 10).map((coin) => (
                                    <TableRow key={coin.id} sx={{ '&:hover': { backgroundColor: '#200840', transition: '0.5s' } }}>
                                        <TableCell component="th" scope="row">
                                            {coin.rank}
                                        </TableCell>
                                        <TableCell>
                                            <Stack direction='row' spacing={1} alignItems='center'>
                                                <Box>
                                                    <img
                                                        src={coin.image}
                                                        alt={coin.name}
                                                        style={{ width: '24px', height: '24px', marginRight: '8px' }}
                                                    />
                                                </Box>
                                                <Box>
                                                    <Box sx={{ display: { xs: 'none', md: 'initial' } }}>
                                                        {coin.name}
                                                    </Box>
                                                    <Box sx={{ display: { xs: 'initial', md: 'none' } }}>
                                                        {coin.symbol.toUpperCase()}
                                                    </Box>
                                                </Box>
                                            </Stack>
                                        </TableCell>
                                        <TableCell align="right">
                                            {currencySymbol} {coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Box sx={{ color: coin.price_change_percentage_24h < 0 ? red[700] : green[500] }}>
                                                {coin.price_change_percentage_24h}%
                                            </Box>
                                        </TableCell>
                                        <TableCell align="right">
                                            {currencySymbol} {coin.market_cap.toLocaleString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            {isLoading && (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        <Loading />
                                    </TableCell>
                                </TableRow>
                            )}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: 53 * emptyRows }}>
                                    <TableCell colSpan={5} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    sx={{ border: 'none', mt: 2 }}
                    rowsPerPageOptions={[]}
                    colSpan={5}
                    count={coins.length}
                    rowsPerPage={10}
                    page={page}
                    onPageChange={handleChangePage}
                    ActionsComponent={TablePaginationActions}
                />
            </Box>
        </Fragment>
    );
}