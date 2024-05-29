import React, { useState } from "react";
import { Typography, Paper, Grid, Button } from '@mui/material';
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
    id: number;
    options: CryptoMarket[];
    onRemove: (id: number) => void;
}

const Item: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <Paper style={{ padding: '16px', textAlign: 'center', color: '#000' }}>
        {children}
    </Paper>
);

const CryptoCurrencys: React.FC<CryptoCurrencysProps> = ({ id, options, onRemove }) => {
    const [cryptoData, setCryptoData] = useState<CryptoCurrency | null>(null);

    const handleCryptoSelect = async (crypto: CryptoMarket | null) => {
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
                        id={`${id}`}
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
                    <Button variant="contained" color="secondary" onClick={() => onRemove(id)}>
                        Remove
                    </Button>
                </Item>
            </Grid>
        </Grid>
    );
}

export default CryptoCurrencys;
