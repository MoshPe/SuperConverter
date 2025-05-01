import {useCallback, useEffect, useState} from "react";
import {Box, defineStyle, Field, Input, InputElement, Text} from "@chakra-ui/react";
import './GeoConvertComponent.css'
import {ConvertProps} from "./types";
import {main} from "../../wailsjs/go/models";
import Geo = main.Geo;
import DmmFoot = main.DmmFoot;
import {MoveToLocation} from "../../wailsjs/go/main/App";


export default function LocationProjector(props: ConvertProps) {
    const [latitude, setLatitude] = useState<number>(0);
    const [longitude, setLongitude] = useState<number>(0);
    const [altitude, setAltitude] = useState<number>(0);
    const [az, setAz] = useState<number>(0);
    const [el, setEl] = useState<number>(0);
    const [distance, setDistance] = useState<number>(0);

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
            Alt: altitude,
            Lat: latitude,
            Lng: longitude,
        });

        let convertedValue: DmmFoot;
        console.log(`Geo ${JSON.stringify(geo)} az ${az} el ${el} distance ${distance}`)
        convertedValue = await MoveToLocation(geo, az, el, distance)
        props.setResult(`${convertedValue.LatNS.Str}\n ${convertedValue.LonWE.Str}\n Foot: ${convertedValue.Foot}`);

    }, [latitude, longitude, altitude, az, el, distance, props.unit]);

    useEffect(() => {
        props.setHandleConvert(() => handleConvert);
        props.setResult("");
    }, [handleConvert, props.setHandleConvert]);

    return (
        <Field.Root>
            <Box pos="relative" w="full">
                <Text className={"text-shared text-converter"} fontSize={"medium"} textAlign={"left"}
                      fontWeight={"medium"}>
                    **Please note** that the calculation are based that the Azimuth and Elevation are from the north
                    clock-wise!
                </Text>
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
                <Box pos="relative">
                    <InputElement placement={"end"} zIndex="0">meters</InputElement>
                    <Input
                        type="number"
                        className={"peer"}
                        color={"black"}
                        defaultValue={0}
                        placeholder=""
                        onChange={(e) =>
                            setAltitude(parseFloat(e.target.value))
                        }
                        mb={5}
                        mt={5}
                    />
                    <Field.Label css={floatingStyles}>Altitude</Field.Label>
                </Box>
                <Box pos="relative">
                    <InputElement placement={"end"} zIndex="0">°</InputElement>
                    <Input
                        type="number"
                        className={"peer"}
                        color={"black"}
                        placeholder=""
                        onChange={(e) => setAz(parseFloat(e.target.value))}
                        mb={5}
                        mt={5}
                    />
                    <Field.Label css={floatingStyles}>Azimuth</Field.Label>
                </Box>
                <Box pos="relative">
                    <InputElement placement={"end"} zIndex="0">°</InputElement>
                    <Input
                        type="number"
                        className={"peer"}
                        color={"black"}
                        placeholder=""
                        onChange={(e) => setEl(parseFloat(e.target.value))}
                        mb={5}
                        mt={5}
                    />
                    <Field.Label css={floatingStyles}>Elevation</Field.Label>
                </Box>
                <Box pos="relative">
                    <InputElement placement={"end"} zIndex="0">km</InputElement>
                    <Input
                        type="number"
                        className={"peer"}
                        color={"black"}
                        placeholder=""
                        onChange={(e) => setDistance(parseFloat(e.target.value))}
                        mb={5}
                        mt={5}
                    />
                    <Field.Label css={floatingStyles}>Distance</Field.Label>
                </Box>
            </Box>
        </Field.Root>
    )
}
