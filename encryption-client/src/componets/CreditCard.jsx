import React from "react";
import Center from "./Center";
import * as jose from "jose";
import { useEffect, useState } from "react";
import {
    Button,
    FormControlLabel,
    Grid,
    Paper,
    Radio,
    RadioGroup,
    TextField,
    Typography,
} from "@mui/material";
import useForm from "../hooks/useForm";
import { Box } from "@mui/system";
import { createAPIEndpoint, EndPoints } from "../api";

const getFreshCreditCardModel = () => ({
    cardholderName: "",
    number: "",
    cvc: "",
    expMonth: 0,
    expYear: 0,
    zip: "",
});

const CreditCard = () => {
    const api = createAPIEndpoint(EndPoints.Security);

    const [secondaryKey, setSecondaryKey] = useState(null);
    const [primaryKey, setPrimaryKey] = useState(null);
    const [selectedKey, setSelectedKey] = useState("primary");
    const [jwe, setJwe] = useState(null);
    const [decryptedData, setDecryptedData] = useState({});
    useEffect(() => {
        api.getPrimaryKey().then((key) => setPrimaryKey(key.data));
        api.getSecondaryKey().then((key) => setSecondaryKey(key.data));
    }, [api]);

    const { values, handleInputChange, handleNumberChange } = useForm(
        getFreshCreditCardModel
    );

    const handlerRadioChange = (e) => {
        setSelectedKey(e.target.value);
    };
    const handleClick = async (e) => {
        e.preventDefault();

        const algorithm = "RSA-OAEP";

        const publicKey = await jose.importSPKI(
            selectedKey === "primary" ? primaryKey : secondaryKey,
            algorithm
        );
        const serializedText = JSON.stringify(values);

        const jweToken = await new jose.CompactEncrypt(
            new TextEncoder().encode(serializedText)
        )
            .setProtectedHeader({ alg: "RSA-OAEP", enc: "A256CBC-HS512" })
            .encrypt(publicKey);
        setJwe(jweToken);
        var res = await api.postCard({ data: jweToken });
        setDecryptedData(res.data);
    };
    return (
        <Center>
            <Paper sx={{ p: { xs: 2, md: 3 }, width: "600px" }}>
                <Typography variant='h4' align='center' gutterBottom>
                    Encryption POC
                </Typography>
                <Typography variant='h6' gutterBottom>
                    Payment Method
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label='Name on card'
                            name='cardholderName'
                            fullWidth
                            autoComplete='off'
                            variant='standard'
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label='Card number'
                            name='number'
                            fullWidth
                            autoComplete='off'
                            variant='standard'
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <TextField
                            label='Month'
                            name='expMonth'
                            fullWidth
                            autoComplete='off'
                            variant='standard'
                            onChange={handleNumberChange}
                        />
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <TextField
                            label='Year'
                            name='expYear'
                            fullWidth
                            autoComplete='off'
                            variant='standard'
                            onChange={handleNumberChange}
                        />
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <TextField
                            label='CVC'
                            name='cvc'
                            fullWidth
                            autoComplete='off'
                            variant='standard'
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <TextField
                            label='Zip Code'
                            name='zip'
                            fullWidth
                            autoComplete='off'
                            variant='standard'
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <RadioGroup
                            onChange={handlerRadioChange}
                            row
                            defaultValue='primary'
                            name='key-selection'>
                            <FormControlLabel
                                value='primary'
                                control={<Radio />}
                                label='Use Primary Key'
                                checked={selectedKey === "primary"}
                            />
                            <FormControlLabel
                                value='secondary'
                                control={<Radio />}
                                label='Use Secondary Key'
                                checked={selectedKey === "secondary"}
                            />
                        </RadioGroup>
                    </Grid>
                </Grid>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                        variant='contained'
                        onClick={handleClick}
                        sx={{ mt: 3, ml: 1 }}>
                        Submit
                    </Button>
                </Box>
            </Paper>
            <Paper
                sx={{
                    mt: 4,
                    p: { xs: 2, md: 3 },
                    width: "600px",
                    minHeight: "200px",
                    overflow: "auto",
                }}>
                <Typography variant='h5'>Jwe Token:</Typography>
                <Typography variant='body2' gutterBottom>
                    {jwe}
                </Typography>
                <Typography variant='h5'>Decrypted Data:</Typography>

                {Object.keys(decryptedData).map((key) => (
                    <Typography variant='body2' gutterBottom key={key}>
                        {`[${key}] : ${decryptedData[key]}`}
                    </Typography>
                ))}
            </Paper>
        </Center>
    );
};

export default CreditCard;
