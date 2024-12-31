import React from 'react'
import {createRoot} from 'react-dom/client'
import './style.css'
import ConverterApp from './App'
import {ChakraProvider, defaultSystem} from "@chakra-ui/react";

const container = document.getElementById('root')

const root = createRoot(container!)

root.render(
    <React.StrictMode>
        <ChakraProvider value={defaultSystem}>
            <ConverterApp/>
        </ChakraProvider>
    </React.StrictMode>
)
