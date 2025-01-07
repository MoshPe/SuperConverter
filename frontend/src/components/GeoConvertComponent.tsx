import {Box, defineStyle, Field, Input, InputElement} from "@chakra-ui/react";
import './GeoConvertComponent.css'
import {useCallback, useEffect, useState} from "react";
import {ConvertProps} from "./types";
import {ConvertGeoToDmm, ConvertGeoToDms, ConvertGeoToECEF} from "../../wailsjs/go/main/App";
import {main} from "../../wailsjs/go/models";
import Geo = main.Geo;
import Dms = main.Dms;
import ECEF = main.ECEF;
import Dmm = main.Dmm;

const enum GeoConvertType {
    DMS = 'geo_dms',
    ECEF = 'geo_ecef',
    DMM = 'geo_dmm',
}

export default function GeoConvertComponent(props: ConvertProps) {
    const [latitude, setLatitude] = useState<number>(0);
    const [longitude, setLongitude] = useState<number>(0);
    const [altitude, setAltitude] = useState<number>(0);


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
        if (!latitude || !longitude) {
            props.setResult("Please enter a valid number");
            return;
        }

        const geo: Geo = new Geo({
            Alt: 0,
            Lat: latitude,
            Lng: longitude,
        });

        let convertedValue: Dms | Dmm | ECEF;

        switch (props.unit) {
            case GeoConvertType.DMS:
                convertedValue = await ConvertGeoToDms(geo);
                props.setResult(`${convertedValue.LatNS.Str}\n ${convertedValue.LonWE.Str}`);
                break;
            case GeoConvertType.ECEF:
                geo.Alt = altitude;
                console.log(geo)
                convertedValue =  await ConvertGeoToECEF(geo);
                props.setResult(`X: ${convertedValue.X}\n Y: ${convertedValue.Y}\n Z: ${convertedValue.Z}`);
                break;
            case GeoConvertType.DMM:
                convertedValue =  await ConvertGeoToDmm(geo);
                props.setResult(`${convertedValue.LatNS.Str}\n ${convertedValue.LonWE.Str}`);
                break;
            default:
                props.setResult(`Selected unit is not supported`);
                break;
        }


    }, [latitude, longitude, props.unit]);

    useEffect(() => {
        props.setHandleConvert(() => handleConvert);
        props.setResult("");
    }, [handleConvert, props.setHandleConvert]);

    return (
        <Field.Root>
            <Box pos="relative" w="full">
                <Box pos="relative">
                    <InputElement placement={"end"} zIndex="0">°</InputElement>
                    <Input
                        type="number"
                        className={"peer"}
                        color={"black"}
                        placeholder=""
                        onChange={(e) => setLatitude(parseFloat(e.target.value))}
                        mb={5}
                        mt={5}
                    />
                    <Field.Label css={floatingStyles}>Latitude</Field.Label>
                </Box>
                <Box pos="relative">
                    <InputElement placement={"end"} zIndex="0">°</InputElement>
                    <Input
                        type="number"
                        className={"peer"}
                        color={"black"}
                        placeholder=""
                        onChange={(e) => setLongitude(parseFloat(e.target.value))}
                        mb={5}
                        mt={5}
                    />
                    <Field.Label css={floatingStyles}>Longitude</Field.Label>
                </Box>
                {(props.unit === GeoConvertType.ECEF) && (
                    <Box pos="relative">
                        <InputElement placement={"end"} zIndex="0">meters</InputElement>
                        <Input
                            type="number"
                            className={"peer"}
                            color={"black"}
                            placeholder=""
                            onChange={(e) => setAltitude(parseFloat(e.target.value))}
                            mb={5}
                            mt={5}
                        />
                        <Field.Label css={floatingStyles}>Altitude</Field.Label>
                    </Box>
                )}
            </Box>
        </Field.Root>
    )
}