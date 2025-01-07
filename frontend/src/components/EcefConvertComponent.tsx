import {Box, defineStyle, Field, Input, InputElement,} from "@chakra-ui/react";
import './GeoConvertComponent.css'
import React, {useCallback, useEffect, useState} from "react";
import {ConvertProps} from "./types";
import {
    ConvertDmsToDmm,
    ConvertDmsToEcef,
    ConvertDmsToGeo, ConvertEcefToDmm,
    ConvertEcefToDms,
    ConvertECEFToGeo
} from "../../wailsjs/go/main/App";
import {main} from "../../wailsjs/go/models";
import Switch from "react-switch";
import Geo = main.Geo;
import Dms = main.Dms;
import ECEF = main.ECEF;
import Dmm = main.Dmm;

const enum DmsConvertType {
    Geo = 'ecef_geo',
    Dms = 'ecef_dms',
    Dmm = 'ecef_dmm',
}

export default function EcefConvertComponent(props: ConvertProps) {
    const [x, setX] = useState<number>(0);
    const [y, setY] = useState<number>(0);
    const [z, setZ] = useState<number>(0);


    const floatingStyles = defineStyle({
        pos: "absolute",
        bg: "bg",
        marginTop: "20px",
        px: "0.5",
        top: "-3",
        insetStart: "2",
        fontWeight: "semibold",
        pointerEvents: "none",
        transition: "position",
        color: "fg",
        _peerPlaceholderShown: {
            color: "fg.muted",
            top: "2.5",
            insetStart: "3",
        },
        _peerFocusVisible: {
            color: "fg",
            top: "-3",
            insetStart: "2",
        },
    })

    const handleConvert = useCallback(async () => {
        if (!x || !y || !z) {
            props.setResult("Please enter a valid Ecef values");
            return;
        }

        const ecef: ECEF = new ECEF({
            X: x,
            Y: y,
            Z: z,
        }); 

        let convertedValue: Geo | Dmm | Dms;
        console.log(props.unit)
        switch (props.unit) {
            case DmsConvertType.Geo:
                convertedValue = await ConvertECEFToGeo(ecef);
                props.setResult(`Latitude: ${convertedValue.Lat}\n Longitude: ${convertedValue.Lng}\n Altitude: ${convertedValue.Alt}`);
                break;
            case DmsConvertType.Dms:
                convertedValue = await ConvertEcefToDms(ecef);
                props.setResult(`${convertedValue.LatNS.Str}\n ${convertedValue.LonWE.Str}`);
                break;
            case DmsConvertType.Dmm:
                convertedValue = await ConvertEcefToDmm(ecef);
                console.log(convertedValue)
                props.setResult(`${convertedValue.LatNS.Str}\n ${convertedValue.LonWE.Str}`);
                break;
            default:
                props.setResult(`Selected unit is not supported`);
                break;
        }

    }, [x, y, z, props.unit]);

    useEffect(() => {
        props.setHandleConvert(() => handleConvert);
        props.setResult("");
    }, [handleConvert, props.setHandleConvert]);

    return (
        <Field.Root>
            <Box pos="relative" w="full">
                <Box pos="relative">
                    <InputElement placement={"end"} zIndex="0">m</InputElement>
                    <Input
                        type="number"
                        className={"peer"}
                        color={"black"}
                        placeholder=""
                        onChange={(e) => setX(parseFloat(e.target.value))}
                        mb={5}
                        mt={5}
                    />
                    <Field.Label css={floatingStyles}>X</Field.Label>
                </Box>
                <Box pos="relative">
                    <InputElement placement={"end"} zIndex="0">m</InputElement>
                    <Input
                        type="number"
                        className={"peer"}
                        color={"black"}
                        placeholder=""
                        onChange={(e) => setY(parseFloat(e.target.value))}
                        mb={5}
                        mt={5}
                    />
                    <Field.Label css={floatingStyles}>Y</Field.Label>
                </Box>
                <Box pos="relative">
                    <InputElement placement={"end"} zIndex="0">m</InputElement>
                    <Input
                        type="number"
                        className={"peer"}
                        color={"black"}
                        placeholder=""
                        onChange={(e) => setZ(parseFloat(e.target.value))}
                        mb={5}
                        mt={5}
                    />
                    <Field.Label css={floatingStyles}>Z</Field.Label>
                </Box>
            </Box>
        </Field.Root>
    )
}