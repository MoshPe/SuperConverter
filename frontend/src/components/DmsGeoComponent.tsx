import {Box, defineStyle, Field, Input, InputElement, NativeSelectField, NativeSelectRoot,} from "@chakra-ui/react";
import './GeoDmsComponent.css'
import React, {useCallback, useEffect, useState} from "react";
import {ConvertProps, DmsAngle} from "./types";
import {ConvertDmsToGeo} from "../../wailsjs/go/main/App";
import {main} from "../../wailsjs/go/models";
import Switch from "react-switch";
import Geo = main.Geo;
import Dms = main.Dms;

export default function DmsGeoComponent(props: ConvertProps) {
    const [latNS, setLatNS] = useState<DmsAngle>({} as DmsAngle);
    const [lonWE, setLonWE] = useState<DmsAngle>({} as DmsAngle);
    const [isLatNSChecked, setIsLatNSChecked] = useState(false);
    const [isLonWEChecked, setIsLonWEChecked] = useState(false);


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
        if (!latNS || !lonWE) {
            props.setResult("Please enter a valid dms values");
            return;
        }

        const dms: Dms = new Dms({
            LatNS: {
                ...latNS,
                Str: isLatNSChecked ? 'S' : 'N',
            },
            LonWE: {
                ...lonWE,
                Str: isLonWEChecked ? 'W' : 'E',
            },
        });

        const convertedValue: Geo = (
            await ConvertDmsToGeo(dms)
        );
        props.setResult(`Latitude: ${convertedValue.Lat} \n Longitude: ${convertedValue.Lng} \n Altitude: ${convertedValue.Alt}`);
    }, [isLatNSChecked, isLonWEChecked, latNS, lonWE, props.unit]);

    useEffect(() => {
        props.setHandleConvert(() => handleConvert);
        props.setResult("");
    }, [handleConvert, props.setHandleConvert]);

    return (
        <Field.Root>
            <Box pos="relative" w="full">
                <div className={"dms-inputs"}>
                    <span className={"value-text text-shared"}>North-South (Latitude)</span>
                    <Switch
                        checked={isLatNSChecked}
                        onChange={(checked) => setIsLatNSChecked(checked)}
                        handleDiameter={28}
                        offColor="#000000"
                        onColor="#D3D3D3"
                        offHandleColor="#D3D3D3"
                        onHandleColor="#000000"
                        height={40}
                        width={70}
                        borderRadius={6}
                        activeBoxShadow="0px 0px 1px 2px #fffc35"
                        uncheckedIcon={
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: "100%",
                                    fontSize: 15,
                                    color: "white",
                                    paddingRight: 2
                                }}
                            >
                                N
                            </div>
                        }
                        checkedIcon={<div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "100%",
                                fontSize: 15,
                                color: "black",
                                paddingRight: 2
                            }}
                        >
                            S
                        </div>
                        }
                        uncheckedHandleIcon={
                            <div/>
                        }
                        checkedHandleIcon={
                            <div/>
                        }
                        className="react-switch"
                        id="small-radius-switch"
                    />
                </div>
                <div className={"dms-inputs"}>
                    <Box pos="relative">
                        <InputElement placement={"end"} zIndex="0">°</InputElement>
                        <Input
                            type="number"
                            className={"peer"}
                            color={"black"}
                            placeholder=""
                            onChange={(e) => {
                                latNS.Deg = parseFloat(e.target.value)
                                setLatNS(latNS)
                            }
                            }
                            mb={5}
                            mt={5}
                        />
                        <Field.Label css={floatingStyles}>Degrees</Field.Label>
                    </Box>
                    <Box pos="relative">
                        <InputElement placement={"end"} zIndex="0">'</InputElement>
                        <Input
                            type="number"
                            className={"peer"}
                            color={"black"}
                            placeholder=""
                            onChange={(e) => {
                                latNS.Min = parseFloat(e.target.value)
                                setLatNS(latNS)
                            }}
                            mb={5}
                            mt={5}
                        />
                        <Field.Label css={floatingStyles}>Minutes</Field.Label>
                    </Box>
                    <Box pos="relative">
                        <InputElement placement={"end"} zIndex="0">"</InputElement>
                        <Input
                            type="number"
                            className={"peer"}
                            color={"black"}
                            placeholder=""
                            onChange={(e) => {
                                latNS.Sec = parseFloat(e.target.value)
                                setLatNS(latNS)
                            }}
                            mb={5}
                            mt={5}
                        />
                        <Field.Label css={floatingStyles}>Seconds</Field.Label>
                    </Box>
                </div>
                <div className={"dms-inputs"}>
                    <span className={"value-text text-shared"}>West-East (Longitude)</span>
                    <Switch
                        checked={isLonWEChecked}
                        onChange={(isChecked) => setIsLonWEChecked(isChecked)}
                        handleDiameter={28}
                        offColor="#000000"
                        onColor="#D3D3D3"
                        offHandleColor="#D3D3D3"
                        onHandleColor="#000000"
                        height={40}
                        width={70}
                        borderRadius={6}
                        activeBoxShadow="0px 0px 1px 2px #fffc35"
                        uncheckedIcon={
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    height: "100%",
                                    fontSize: 15,
                                    color: "white",
                                    paddingRight: 2
                                }}
                            >
                                E
                            </div>
                        }
                        checkedIcon={<div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                height: "100%",
                                fontSize: 15,
                                color: "black",
                                paddingRight: 2
                            }}
                        >
                            W
                        </div>
                        }
                        uncheckedHandleIcon={
                            <div/>
                        }
                        checkedHandleIcon={
                            <div/>
                        }
                        className="react-switch"
                        id="small-radius-switch"
                    />
                </div>
                <div className={"dms-inputs"}>
                    <Box pos="relative">
                        <InputElement placement={"end"} zIndex="0">°</InputElement>
                        <Input
                            type="number"
                            className={"peer"}
                            color={"black"}
                            placeholder=""
                            onChange={(e) => {
                                lonWE.Deg = parseFloat(e.target.value)
                                setLonWE(lonWE)
                            }}
                            mb={5}
                            mt={5}
                        />
                        <Field.Label css={floatingStyles}>Degrees</Field.Label>
                    </Box>
                    <Box pos="relative">
                        <InputElement placement={"end"} zIndex="0">'</InputElement>
                        <Input
                            type="number"
                            className={"peer"}
                            color={"black"}
                            placeholder=""
                            onChange={(e) => {
                                lonWE.Min = parseFloat(e.target.value)
                                setLonWE(lonWE)
                            }}
                            mb={5}
                            mt={5}
                        />
                        <Field.Label css={floatingStyles}>Minutes</Field.Label>
                    </Box>
                    <Box pos="relative">
                        <Input
                            type="number"
                            className={"peer"}
                            color={"black"}
                            placeholder=""
                            onChange={(e) => {
                                lonWE.Sec = parseFloat(e.target.value)
                                setLonWE(lonWE)
                            }}
                            mb={5}
                            mt={5}
                        />
                        <Field.Label css={floatingStyles}>Seconds</Field.Label>
                    </Box>
                </div>
            </Box>
        </Field.Root>
    )
}