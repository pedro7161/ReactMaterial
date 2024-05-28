import React, { useState, useEffect } from "react";
import { Typography, Container } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import axios from 'axios';

const CryptoCurrencys = ({ onCryptoSelect }) => {
    const [cryptoList, setCryptoList] = useState([]);
    const [loading, setLoading] = useState(true);
   
    useEffect(() => {
        const fetchCryptos = async () => {
            try {
                const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
                    params: {
                        vs_currency: 'eur',
                        order: 'market_cap_desc',
                        sparkline: false,
                    },
                });
                setCryptoList(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching the cryptocurrencies", error);
                setLoading(false);
            }
        };

        fetchCryptos();
    }, []);

    const handleCryptoSelect = (crypto) => {
        onCryptoSelect(crypto);
    };

    return (
        <Container maxWidth="sm">
            {loading ? (
                <Typography variant="h6" align="center">Loading...</Typography>
            ) : (
                <Autocomplete
                    disablePortal
                    id="crypto-combo-box"
                    options={cryptoList}
                    getOptionLabel={(option) => option.name}
                    sx={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label="Cryptocurrency" />}
                    onChange={(event, value) => handleCryptoSelect(value)}
                />
            )}
        </Container>
    );
}

export default CryptoCurrencys;
