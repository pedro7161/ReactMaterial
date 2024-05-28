import React from "react";
import { Typography, Container } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

interface CryptoMarket {
    id: string;
    name: string;
}

interface CryptoCurrencysProps {
    onChange: (crypto: CryptoMarket | null) => void;
    options: CryptoMarket[];
}

const CryptoCurrencys: React.FC<CryptoCurrencysProps> = ({ onChange, options }) => {
    return (
        <Container maxWidth="sm">
            <>
                <Autocomplete
                    disablePortal
                    id="crypto-combo-box"
                    options={options}
                    getOptionLabel={(option) => option.name}
                    sx={{ width: 300 }}
                    renderInput={(params) => <TextField {...params} label="Cryptocurrency" />}
                    onChange={(event, value) => onChange(value)}
                />
            </>
        </Container>
    );
}

export default CryptoCurrencys;
