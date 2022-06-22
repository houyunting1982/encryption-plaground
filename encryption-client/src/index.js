import { CssBaseline } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom/client";
import CreditCard from "./componets/CreditCard";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <CssBaseline />
        <CreditCard />
    </React.StrictMode>
);
