import React, { useState } from "react";
import { Typography, Grid, Paper } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

interface CryptoMarket {
    id: string;
    name: string;
}

interface CryptoCurrency {
    id: string;
    name: string;
    image: {
        small: string;
    };
    market_data: {
        current_price: {
            eur: number;
        };
    };
}

interface CryptoCurrencysProps {
    onChange: (crypto: CryptoMarket | null) => void;
    options: CryptoMarket[];
    cryptoData: CryptoCurrency | null; // Add cryptoData prop
}


const Item: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <Paper style={{ padding: '16px', textAlign: 'center', color: '#000' }}>
        {children}
    </Paper>
);

const CryptoCurrencys: React.FC<CryptoCurrencysProps> = ({ onChange, options }) => {
    const [cryptoData, setCryptoData] = useState<CryptoCurrency | null>(null);

    const handleCryptoSelect = async (crypto: CryptoMarket | null) => {
        onChange(crypto);
        if (crypto) {
            try {
                const response = await fetch(`https://api.coingecko.com/api/v3/coins/${crypto.id}`);
                const data = await response.json();
                setCryptoData(data);
            } catch (error) {
                console.error("Error fetching cryptocurrency data:", error);
            }
        }
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={8}>
                <Item>
                    <Autocomplete
                        disablePortal
                        id="crypto-combo-box"
                        options={options}
                        getOptionLabel={(option) => option.name}
                        sx={{ width: 300 }}
                        renderInput={(params) => <TextField {...params} label="Cryptocurrency" />}
                        onChange={(event, value) => handleCryptoSelect(value)}
                    />
                </Item>
            </Grid>
            <Grid item xs={4}>
                <Item>
                    {cryptoData && (
                        <>
                            <img src={cryptoData.image.small} alt={cryptoData.name} style={{ maxWidth: '100px' }} />
                            <Typography variant="h6">Current Price</Typography>
                            <Typography variant="body1">{cryptoData.name}: {cryptoData.market_data.current_price.eur}</Typography>
                        </>
                    )}
                </Item>
            </Grid>
        </Grid>
    );
}

export default CryptoCurrencys;
