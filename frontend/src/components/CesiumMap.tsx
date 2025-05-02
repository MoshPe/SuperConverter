import React, {useCallback, useEffect, useRef, useState} from "react";
import * as Cesium from "cesium";
import {Cartesian3, Ray, ScreenSpaceEventHandler, ScreenSpaceEventType, Viewer} from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import './index.d'
import './CesiumMap.css'
import {Box, Button, Center, defineStyle, Field, Input, InputElement, Text} from "@chakra-ui/react";
import {ConvertDistanceUnit, ConvertDmmToGeo, MoveToLocation} from "../../wailsjs/go/main/App";
import {main} from "../../wailsjs/go/models";
import Geo = main.Geo;
import DmmFoot = main.DmmFoot;
import Dmm = main.Dmm;

window.CESIUM_BASE_URL = '/assets/cesium/Build/CesiumUnminified/'

function reverseText(str: string | null) {
    return str ? str.split('').reverse().join('') : '';
}

function extractHeName(str: string) {
    const regex = /"name:he"=>"([^"]+)"/;  // Match "name:he"=>"value"

    const match = str.match(regex);
    if (match) {
        return match[1];  // Return the captured value (the name in Hebrew)
    }
    return null;  // Return null if "name:he" is not found
}

const CesiumMap = () => {
        const [latLonAlt, setLatLonAlt] = useState({lat: 0, lon: 0, alt: 0});
        const [latitude, setLatitude] = useState<number>(0);
        const [longitude, setLongitude] = useState<number>(0);
        const [altitude, setAltitude] = useState<number>(0);
        const [firstPointName, setFirstPointName] = useState<string>("First Point")
        const [secondPointName, setSecondPointName] = useState<string>("Second Point")
        const [az, setAz] = useState<number>(0);
        const [el, setEl] = useState<number>(0);
        const [distance, setDistance] = useState<number>(0);
        const [result, setResult] = useState<string>("");
        const viewerRef = useRef<Cesium.Viewer | null>(null);
        const markerRef = useRef<Cesium.Entity | null>(null);
        const secondMarkerRef = useRef<Cesium.Entity | null>(null);
        const circleRef = useRef<Cesium.Entity | null>(null);

        useEffect(() => {
            if (viewerRef.current) {
                return;
            }

            // Ensure the DOM is ready before initializing Cesium
            console.log("Creating viewer")
            viewerRef.current = new Viewer("cesiumContainer", {
                creditContainer: document.createElement("div"), // Suppress credits
                terrainProvider: new Cesium.EllipsoidTerrainProvider(), // Flat terrain
                animation: false,
                shouldAnimate: true,
                sceneModePicker: false,
                navigationHelpButton: false,
                selectionIndicator: false,
                timeline: false,
                homeButton: true,
                fullscreenButton: true,
                geocoder: false,
                baseLayerPicker: false,
            });

            if (viewerRef.current === null)
                return;

            viewerRef.current.imageryLayers.removeAll();
            viewerRef.current.scene.globe.baseColor = Cesium.Color.BLACK;


            // Add stars for a space effect (optional)
            viewerRef.current.scene.skyBox.show = true;
            viewerRef.current.scene.skyAtmosphere.show = true;

            const imageryProvider = new Cesium.UrlTemplateImageryProvider({
                url: '/map/{z}/{x}/{y}.png',
                maximumLevel: 18,
                tilingScheme: new Cesium.WebMercatorTilingScheme(),
                credit: "Local Map"
            });

            viewerRef.current.imageryLayers.addImageryProvider(imageryProvider);

            Cesium.CesiumTerrainProvider.fromUrl('/terrain/', {
                requestVertexNormals: true,
                requestWaterMask: false,
                credit: "Me",
            }).then(terrainProvider => {
                // @ts-ignore
                viewerRef.current.terrainProvider = terrainProvider;
            });

            Cesium.GeoJsonDataSource.load('/assets/location.geojson', {
                clampToGround: true,
                markerSize: 0,           // disables the marker
                stroke: Cesium.Color.TRANSPARENT,
                fill: Cesium.Color.TRANSPARENT
            }).then(dataSource => {
                // @ts-ignore
                viewerRef.current.dataSources.add(dataSource);

                // Apply label adjustments
                addLabelToGeoJson(dataSource);
            });

            viewerRef.current.homeButton.viewModel.command.beforeExecute.addEventListener((e) => {
                e.cancel = true;
                // @ts-ignore
                viewerRef.current.scene.camera.flyTo({
                    destination: Cartesian3.fromDegrees(35.0297, 31.8078, 400000.0)
                })
            })

            viewerRef.current.camera.flyTo({
                destination: Cartesian3.fromDegrees(35.0297, 31.8078, 400000.0),
            });

            const handler = new ScreenSpaceEventHandler(viewerRef.current.canvas);

            handler.setInputAction((movement: any) => {
                // @ts-ignore
                const ray: Ray | undefined = viewerRef.current.camera.getPickRay(movement.endPosition);
                let cartesian = undefined;
                if (ray) {
                    // @ts-ignore
                    cartesian = viewerRef.current.scene.globe.pick(ray, viewerRef.current.scene);
                }

                if (cartesian) {
                    // @ts-ignore
                    const cartographic = viewerRef.current.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
                    const lon = Cesium.Math.toDegrees(cartographic.longitude);
                    const lat = Cesium.Math.toDegrees(cartographic.latitude);
                    const alt = cartographic.height;
                    setLatLonAlt({lat, lon, alt});
                }
            }, ScreenSpaceEventType.MOUSE_MOVE);

            return () => {
                if (import.meta.env.MODE !== 'development') {
                    viewerRef.current?.destroy();
                    viewerRef.current = null;
                }
            };
        }, []);

        function addLabelToGeoJson(dataSource: any) {
            const entities = dataSource.entities.values;

            for (const entity of entities) {
                const props = entity.properties;
                if (props && props.name) {
                    // Create label graphics
                    entity.label = new Cesium.LabelGraphics({
                        text: reverseText(extractHeName(props.other_tags.getValue())),  // RTL adjustment if necessary
                        font: '22px bold sans-serif',
                        fillColor: Cesium.Color.WHITE,
                        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                        outlineWidth: 3,
                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                        horizontalOrigin: Cesium.HorizontalOrigin.RIGHT,

                        // Custom distance-based visibility
                        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
                            0.0, 50000.0  // Cities visible up to 50 km
                        ),

                        // Apply different scale for each feature type
                        scaleByDistance: new Cesium.NearFarScalar(
                            1000, 1.5,     // Zoom in to 1 km: 1.5x larger
                            100000, 0.5    // Zoom out beyond 100 km: 0.5x smaller
                        ),
                    });

                    // Adjust for different settlement types (city, town, village)
                    if (props.place && props.place.getValue() === "city") {
                        entity.label.distanceDisplayCondition = new Cesium.DistanceDisplayCondition(0.0, 500000.0);  // Cities, max 50 km
                        entity.label.scaleByDistance = new Cesium.NearFarScalar(9000, 1.5, 100000, 0.9);  // Larger for cities
                    } else if (props.place && props.place.getValue() === "town") {
                        entity.label.distanceDisplayCondition = new Cesium.DistanceDisplayCondition(0.0, 120000.0);  // Towns, max 30 km
                        entity.label.scaleByDistance = new Cesium.NearFarScalar(9000, 1.4, 200000, 0.8);  // Slightly smaller for towns
                    } else {
                        entity.label.distanceDisplayCondition = new Cesium.DistanceDisplayCondition(0.0, 50000.0);  // Villages, max 10 km
                        entity.label.scaleByDistance = new Cesium.NearFarScalar(9000, 1.2, 100000, 0.7);  // Smaller for villages
                    }
                }
            }
        }

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
                setResult("Please enter a valid number");
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
            setResult(`${convertedValue.LatNS.Str}\n ${convertedValue.LonWE.Str}\n Foot: ${convertedValue.Foot}`);
            await setSecondPoint(convertedValue);
        }, [latitude, longitude, altitude, az, el, distance]);

        const setSecondPoint = async (secondPointDmmFoot: DmmFoot) => {
            if (!viewerRef.current) return;

            const viewer = viewerRef.current;

            let convertedGeoValue = await ConvertDmmToGeo(Dmm.createFrom({
                LatNS: secondPointDmmFoot.LatNS,
                LonWE: secondPointDmmFoot.LonWE
            }))

            let convertedMeterValue = await ConvertDistanceUnit(secondPointDmmFoot.Foot, "foot");


            let newValue = calculateSecondPoint();
            const position = Cartesian3.fromDegrees(newValue.longitude, newValue.latitude, newValue.altitude);

            if (secondMarkerRef.current) {
                secondMarkerRef.current.position = new Cesium.ConstantPositionProperty(position);
                if (secondMarkerRef.current.label) {
                    secondMarkerRef.current.label.text = new Cesium.ConstantProperty(secondPointName);
                }
                secondMarkerRef.current.name = secondPointName
            } else {
                secondMarkerRef.current = viewer.entities.add({
                    name: secondPointName,
                    position,
                    point: {
                        pixelSize: 20,
                        color: Cesium.Color.YELLOWGREEN,
                        outlineColor: Cesium.Color.WHITE,
                        outlineWidth: 2,
                        disableDepthTestDistance: Number.POSITIVE_INFINITY, // ensures visibility
                    },
                    label: {
                        text: secondPointName,
                        font: "22px sans-serif",
                        fillColor: Cesium.Color.WHITE,
                        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                        outlineWidth: 2,
                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                        pixelOffset: new Cesium.Cartesian2(0, -20),
                    },
                });

            }
        }

        const calculateSecondPoint = () => {
            const startCartographic = Cesium.Cartographic.fromDegrees(longitude, latitude, altitude);
            const startCartesian = Cesium.Ellipsoid.WGS84.cartographicToCartesian(startCartographic);
            const azimuthRad = Cesium.Math.toRadians(az);     // degrees from North
            const elevationRad = Cesium.Math.toRadians(el); // degrees above horizon

            // Local direction in ENU frame
            const x = Math.cos(elevationRad) * Math.sin(azimuthRad); // East
            const y = Math.cos(elevationRad) * Math.cos(azimuthRad); // North
            const z = Math.sin(elevationRad);                         // Up

            const enuDirection = new Cesium.Cartesian3(x, y, z);
            Cesium.Cartesian3.normalize(enuDirection, enuDirection);

            const enuToFixed = Cesium.Transforms.eastNorthUpToFixedFrame(startCartesian);
            const worldDirection = Cesium.Matrix4.multiplyByPointAsVector(enuToFixed, enuDirection, new Cesium.Cartesian3());
            Cesium.Cartesian3.normalize(worldDirection, worldDirection);

            const offset = Cesium.Cartesian3.multiplyByScalar(worldDirection, distance * 1000, new Cesium.Cartesian3());
            const endCartesian = Cesium.Cartesian3.add(startCartesian, offset, new Cesium.Cartesian3());

            const endCartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(endCartesian);
            const endLat = Cesium.Math.toDegrees(endCartographic.latitude);
            const endLon = Cesium.Math.toDegrees(endCartographic.longitude);
            const endHeight = endCartographic.height;
            return {
                latitude: endLat,
                longitude: endLon,
                altitude: endHeight
            }
        }

        useEffect(() => {
            if (!viewerRef.current) return;

            const viewer = viewerRef.current;

            const position = Cartesian3.fromDegrees(longitude, latitude, altitude);

            if (markerRef.current) {
                markerRef.current.position = new Cesium.ConstantPositionProperty(position);
                if (markerRef.current.label) {
                    markerRef.current.label.text = new Cesium.ConstantProperty(firstPointName);
                }
                markerRef.current.name = firstPointName
            } else {
                markerRef.current = viewer.entities.add({
                    name: firstPointName,
                    position,
                    point: {
                        pixelSize: 20,
                        color: Cesium.Color.RED,
                        outlineColor: Cesium.Color.WHITE,
                        outlineWidth: 2,
                        disableDepthTestDistance: Number.POSITIVE_INFINITY, // ensures visibility
                    },
                    label: {
                        text: firstPointName,
                        font: "22px sans-serif",
                        fillColor: Cesium.Color.WHITE,
                        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                        outlineWidth: 2,
                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                        pixelOffset: new Cesium.Cartesian2(0, -20),
                    },
                });

            }

            const outlinePositions = createCircleOutline(position, distance * 1000); // 1 km radius

            if (circleRef.current && circleRef.current.polyline) {
                circleRef.current.polyline.positions = new Cesium.ConstantProperty(outlinePositions);
            } else {
                circleRef.current =  viewer.entities.add({
                    polyline: {
                        positions: outlinePositions,
                        width: 5,
                        material: Cesium.Color.YELLOW,
                        clampToGround: true,
                    },
                });
            }

        }, [latitude, longitude, altitude, distance, firstPointName])

        function createCircleOutline(center: Cartesian3, radiusMeters: number, segments = 64): Cartesian3[] {
            const positions: Cartesian3[] = [];
            const cartographicCenter = Cesium.Cartographic.fromCartesian(center);
            const ellipsoid = Cesium.Ellipsoid.WGS84;

            for (let i = 0; i <= segments; i++) {
                const angle = (i / segments) * 2 * Math.PI;
                const offsetLat = radiusMeters / ellipsoid.maximumRadius * Math.cos(angle);
                const offsetLon = radiusMeters / (ellipsoid.maximumRadius * Math.cos(cartographicCenter.latitude)) * Math.sin(angle);

                const lat = cartographicCenter.latitude + offsetLat;
                const lon = cartographicCenter.longitude + offsetLon;

                const pos = Cesium.Cartesian3.fromRadians(lon, lat, cartographicCenter.height);
                positions.push(pos);
            }

            return positions;
        }

        return (
            <div id="CesiumMap">
                <Center bg="gray.50" className={"location-reference"}>
                    <Field.Root>
                        <Box pos="relative" w="full">
                            <Text className={"text-shared text-converter"} fontSize={"medium"} textAlign={"left"}
                                  fontWeight={"medium"}>
                                **Please note** that the calculation are based that the Azimuth and Elevation are from
                                the
                                north
                                clock-wise!
                            </Text>
                            <Box pos="relative">
                                <Input
                                    type="string"
                                    className={"peer"}
                                    color={"black"}
                                    placeholder=""
                                    onChange={(e) => setFirstPointName(e.target.value)}
                                    mb={5}
                                    mt={5}
                                />
                                <Field.Label css={floatingStyles}>First Point Name</Field.Label>
                            </Box>
                            <Box pos="relative">
                                <Input
                                    type="string"
                                    className={"peer"}
                                    color={"black"}
                                    placeholder=""
                                    onChange={(e) => setSecondPointName(e.target.value)}
                                    mb={5}
                                    mt={5}
                                />
                                <Field.Label css={floatingStyles}>Second Point Name</Field.Label>
                            </Box>
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
                            <Button colorScheme="light" width="100%" onClick={handleConvert}>
                                Convert
                            </Button>
                            {result && (
                                <Text className={"text-shared text-result"}>
                                    {result.split('\n').map((line, index) => (
                                        <span key={index}>
                                {line}
                                            <br/>
                            </span>
                                    ))}
                                </Text>
                            )}
                        </Box>
                    </Field.Root>
                </Center>
                <div id="CesiumMapContainer" className="cesiumMapContainer">
                    <div id="cesiumContainer" className={"CesiumMap"}></div>
                    <div
                        style={{
                            bottom: 10,
                            color: "white",
                            padding: "5px",
                            zIndex: 10,
                            borderRadius: "5px",
                            width: "100%"
                        }}
                    >
                        Lat: {latLonAlt.lat.toFixed(4)}°, Lon: {latLonAlt.lon.toFixed(4)}° Alt: {latLonAlt.alt.toFixed(4)} m
                    </div>
                </div>
            </div>
        );
    }
;

export default CesiumMap;
