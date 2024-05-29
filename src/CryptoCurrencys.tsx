import React, { useState } from "react";
import { Typography, Paper, Grid, Button } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CachedIcon from '@mui/icons-material/Cached';

interface CryptoMarket {
    id: string;
    name: string;
    image: {
        small: string;
    };
    current_price: {
        eur: number;
    };
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

    const handleCryptoSelect = (crypto: CryptoMarket | null) => {
        if (crypto) {
            const selectedCrypto = options.find((option) => option.id === crypto.id);
            if (selectedCrypto) {
                setCryptoData({
                    id: selectedCrypto.id,
                    name: selectedCrypto.name,
                    image: { small: selectedCrypto.image.small },
                    market_data: { current_price: { eur: selectedCrypto.current_price.eur } },
                });
            } else {
                setCryptoData(null);
            }
        }
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={8}>
                <Item>
                    <Autocomplete
                        disablePortal
                        id={`crypto-combo-box-${id}`}
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
                    {cryptoData && cryptoData.image.small && (
                        <img src={cryptoData.image.small} alt={cryptoData.name} style={{ maxWidth: '100px' }} />
                    )}
                    {!cryptoData?.image.small && <CachedIcon style={{ fontSize: 100 }} />}
                    {cryptoData && (
                        <>
                            <Typography variant="h6">Current Price</Typography>
                            <Typography variant="body1">
                                {cryptoData.name}: {cryptoData.market_data.current_price.eur}
                            </Typography>
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
