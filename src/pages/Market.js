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
import { Stack, TableHead, Typography } from '@mui/material';
import Loading from '../components/Loading';
import MovingIcon from '@mui/icons-material/Moving';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { green, red } from '@mui/material/colors';
import useStore from '../store';
import { Link } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';

const columns = [
    { id: 'rank', label: '#', minWidth: 0 },
    { id: 'coin', label: 'Coin', minWidth: 0 },
    { id: 'price', label: 'Price', align: 'right', minWidth: 0 },
    { id: 'change', label: '24h Change', align: 'right', minWidth: 0 },
    { id: 'marketcap', label: 'Market Cap', align: 'right', minWidth: 0 },
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

    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));

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
        <Box sx={{ p: 3 }}>
            <Stack direction='column' spacing={2}>
                <Box>
                    <Typography sx={{ textAlign: 'center' }} variant='h4'>
                        Market Update
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
                            <TableHead sx={{ backgroundImage: 'linear-gradient(25deg, #2600fc, #ff00ea)' }}>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            align={isMobile ? 'center' : column.align}
                                            style={{ minWidth: column.minWidth }}
                                        >
                                            {column.id === 'change' && isMobile
                                                ? '24h'
                                                : column.id === 'marketcap' && isMobile
                                                    ? 'Mkt Cap'
                                                    : column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody sx={{ backgroundColor: '#0f051d' }}>
                                {!isLoading &&
                                    coins.slice(page * 10, page * 10 + 10).map((coin) => (
                                        <TableRow
                                            key={coin.id}
                                            component={Link}
                                            to={`/market/${coin.id}`}
                                            sx={{ cursor: 'pointer', textDecoration: 'none', '&:hover': { backgroundColor: '#200840', transition: '0.5s', } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {coin.rank}
                                            </TableCell>
                                            <TableCell>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Box>
                                                        <Stack>
                                                            <img
                                                                src={coin.image}
                                                                alt={coin.name}
                                                                style={{ width: '24px', height: '24px', marginRight: { xs: 0, md: 8 } }}
                                                            />
                                                        </Stack>
                                                    </Box>
                                                    <Box>
                                                        {isMobile ? (
                                                            coin.symbol.toUpperCase()
                                                        ) : (
                                                            <Stack direction="row" alignItems='center'>
                                                                <Box>
                                                                   {coin.name}
                                                                    <Typography pl={2} variant='caption' color='text.secondary'>
                                                                    {coin.symbol.toUpperCase()}
                                                                    </Typography>
                                                                </Box>
                                                            </Stack>
                                                        )
                                                        }
                                                    </Box>
                                                </Stack>
                                            </TableCell>
                                            <TableCell align="right">
                                                {currencySymbol}{coin.current_price.toLocaleString(undefined, { minimumFractionDigits: isMobile ? 1 : 2, maximumFractionDigits: isMobile ? 1 : 2 })}
                                            </TableCell>
                                            <TableCell align="right">
                                                <Box sx={{ color: coin.price_change_percentage_24h < 0 ? red[500] : green[400] }}>
                                                    {isMobile ? (
                                                        <Fragment>
                                                            {coin.price_change_percentage_24h.toFixed(1)}%
                                                        </Fragment>
                                                    ) : (
                                                        <Fragment>
                                                            {coin.price_change_percentage_24h < 0 ? (
                                                                <Stack direction="row" justifyContent='flex-end' alignItems='center' spacing={1}>
                                                                    <Box>
                                                                        {coin.price_change_percentage_24h}%
                                                                    </Box>
                                                                    <Box>
                                                                        <TrendingDownIcon sx={{ fontSize: '1em' }} />
                                                                    </Box>
                                                                </Stack>
                                                            ) : (
                                                                <Stack direction="row" justifyContent='flex-end' alignItems='center' spacing={1}>
                                                                    <Box>
                                                                        {coin.price_change_percentage_24h}%
                                                                    </Box>
                                                                    <Box>
                                                                        <MovingIcon sx={{ fontSize: '1em' }} />
                                                                    </Box>
                                                                </Stack>
                                                            )}
                                                        </Fragment>
                                                    )}
                                                </Box>
                                            </TableCell>
                                            <TableCell align="right">
                                                {currencySymbol}{coin.market_cap.toLocaleString()}
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
                </Box>
            </Stack>
            <TablePagination
                sx={{ border: 'none', mt: 2, display: 'flex', justifyContent: {xs: 'center', md: 'flex-end' }}}
                rowsPerPageOptions={[]}
                colSpan={5}
                count={coins.length}
                rowsPerPage={10}
                page={page}
                onPageChange={handleChangePage}
                ActionsComponent={TablePaginationActions}
            />
        </Box>
    );
}
