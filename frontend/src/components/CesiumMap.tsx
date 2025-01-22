import React, {useCallback, useEffect, useState} from "react";
import * as Cesium from "cesium";
import {Cartesian3, Color, defined, Ray, ScreenSpaceEventHandler, ScreenSpaceEventType, Viewer} from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import './index.d'
import './CesiumMap.css'
import LocationProjector from "./LocationProjector";
import makeAnimated from "react-select/animated";

Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5MmE4OGNiNS0wNDI3LTQyNzYtOGI3Yy0yMjFjZThmYmQwMzUiLCJpZCI6MjY2NTMwLCJpYXQiOjE3MzU5MDc2MDd9.pBORuv4ekLdb4USMX11EuIMMN50QRTktcnP-_xXafTk';
window.CESIUM_BASE_URL = '/assets/cesium/Build/CesiumUnminified/'

const animatedComponents = makeAnimated();

const CesiumMap = () => {
        const [placingMarker, setPlacingMarker] = useState(false); // Track if we're placing a marker}
        const [viewerInstance, setViewer] = useState({} as Viewer);
        const [latLon, setLatLon] = useState({lat: 0, lon: 0});
        const [result, setResult] = useState<string>("");
        const [datasource, setDatasource] = useState< Cesium.CzmlDataSource | null>(null);
        const [handleConvert, setHandleConvert] = useState<() => void>(() => {
        });
        const stableSetHandleConvert = useCallback(setHandleConvert, []);


        useEffect(() => {
            const czmlFilePath = '/assets/greece_polygon.czml';

            Cesium.CzmlDataSource.load(czmlFilePath)
                .then(async (loadedDataSource) => {
                    setDatasource(loadedDataSource);
                })
                .catch((error) => {
                    console.error('Error loading CZML:', error);
                });
        }, []);




        useEffect(() => {
            // Ensure the DOM is ready before initializing Cesium
            const viewer = new Viewer("cesiumContainer", {
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

            viewer.imageryLayers.removeAll();
            viewer.scene.globe.baseColor = Cesium.Color.BLACK;


            // Add stars for a space effect (optional)
            viewer.scene.skyBox.show = false;
            viewer.scene.skyAtmosphere.show = false;

            // Cesium.createWorldTerrainAsync().then((result) => viewer.terrainProvider = result);
            let geojsonFilePath = '/assets/geojson/israel_polygon.geojson';
            Cesium.GeoJsonDataSource.load(geojsonFilePath, {
                stroke: Cesium.Color.BLUE,
                fill: Cesium.Color.CYAN.withAlpha(0.5),
                strokeWidth: 3
            })
                .then((dataSource) => {
                    viewer.dataSources.add(dataSource); // Add the GeoJSON data source to the viewer
                    // viewer.flyTo(dataSource); // Fly to the loaded data source
                })
                .catch((error) => {
                    console.error("Error loading GeoJSON:", error);
                });

            geojsonFilePath = '/assets/geojson/greece_polygon.geojson';
            Cesium.GeoJsonDataSource.load(geojsonFilePath, {
                stroke: Cesium.Color.BLACK,
                fill: Cesium.Color.PINK.withAlpha(0.5),
                strokeWidth: 3
            })
                .then((dataSource) => {
                    viewer.dataSources.add(dataSource); // Add the GeoJSON data source to the viewer
                    // viewer.flyTo(dataSource); // Fly to the loaded data source
                })
                .catch((error) => {
                    console.error("Error loading GeoJSON:", error);
                });

            geojsonFilePath = '/assets/geojson/italy_polygon.geojson';
            Cesium.GeoJsonDataSource.load(geojsonFilePath, {
                stroke: Cesium.Color.BLACK,
                fill: Cesium.Color.PINK.withAlpha(0.5),
                strokeWidth: 3
            })
                .then((dataSource) => {
                    viewer.dataSources.add(dataSource); // Add the GeoJSON data source to the viewer
                    // viewer.flyTo(dataSource); // Fly to the loaded data source
                })
                .catch((error) => {
                    console.error("Error loading GeoJSON:", error);
                });

            geojsonFilePath = '/assets/geojson/france_polygon.geojson';
            Cesium.GeoJsonDataSource.load(geojsonFilePath, {
                stroke: Cesium.Color.BLACK,
                fill: Cesium.Color.PINK.withAlpha(0.5),
                strokeWidth: 3
            })
                .then((dataSource) => {
                    viewer.dataSources.add(dataSource); // Add the GeoJSON data source to the viewer
                    // viewer.flyTo(dataSource); // Fly to the loaded data source
                })
                .catch((error) => {
                    console.error("Error loading GeoJSON:", error);
                });

            geojsonFilePath = '/assets/geojson/spain_polygon.geojson';
            Cesium.GeoJsonDataSource.load(geojsonFilePath, {
                stroke: Cesium.Color.BLACK,
                fill: Cesium.Color.PINK.withAlpha(0.5),
                strokeWidth: 3
            })
                .then((dataSource) => {
                    viewer.dataSources.add(dataSource); // Add the GeoJSON data source to the viewer
                    // viewer.flyTo(dataSource); // Fly to the loaded data source
                })
                .catch((error) => {
                    console.error("Error loading GeoJSON:", error);
                });

            geojsonFilePath = '/assets/geojson/germany_polygon.geojson';
            Cesium.GeoJsonDataSource.load(geojsonFilePath, {
                stroke: Cesium.Color.BLACK,
                fill: Cesium.Color.PINK.withAlpha(0.5),
                strokeWidth: 3
            })
                .then((dataSource) => {
                    viewer.dataSources.add(dataSource); // Add the GeoJSON data source to the viewer
                    // viewer.flyTo(dataSource); // Fly to the loaded data source
                })
                .catch((error) => {
                    console.error("Error loading GeoJSON:", error);
                });

            geojsonFilePath = '/assets/geojson/england_polygon.geojson';
            Cesium.GeoJsonDataSource.load(geojsonFilePath, {
                stroke: Cesium.Color.BLACK,
                fill: Cesium.Color.PINK.withAlpha(0.5),
                strokeWidth: 3
            })
                .then((dataSource) => {
                    viewer.dataSources.add(dataSource); // Add the GeoJSON data source to the viewer
                    // viewer.flyTo(dataSource); // Fly to the loaded data source
                })
                .catch((error) => {
                    console.error("Error loading GeoJSON:", error);
                });

            geojsonFilePath = '/assets/geojson/palestine_polygon.geojson';
            Cesium.GeoJsonDataSource.load(geojsonFilePath, {
                stroke: Cesium.Color.BLACK,
                fill: Cesium.Color.PINK.withAlpha(0.5),
                strokeWidth: 3
            })
                .then((dataSource) => {
                    viewer.dataSources.add(dataSource); // Add the GeoJSON data source to the viewer
                    // viewer.flyTo(dataSource); // Fly to the loaded data source
                })
                .catch((error) => {
                    console.error("Error loading GeoJSON:", error);
                });

            geojsonFilePath = '/assets/geojson/dead_sea_polygon.geojson';
            Cesium.GeoJsonDataSource.load(geojsonFilePath, {
                stroke: Cesium.Color.BLACK,
                fill: Cesium.Color.BLUE.withAlpha(0.5),
                strokeWidth: 3
            })
                .then((dataSource) => {
                    viewer.dataSources.add(dataSource); // Add the GeoJSON data source to the viewer
                    // viewer.flyTo(dataSource); // Fly to the loaded data source
                })
                .catch((error) => {
                    console.error("Error loading GeoJSON:", error);
                });

            geojsonFilePath = '/assets/geojson/kineret_polygon.geojson';
            Cesium.GeoJsonDataSource.load(geojsonFilePath, {
                stroke: Cesium.Color.BLACK,
                fill: Cesium.Color.BLUE.withAlpha(0.5),
                strokeWidth: 3
            })
                .then((dataSource) => {
                    viewer.dataSources.add(dataSource); // Add the GeoJSON data source to the viewer
                    // viewer.flyTo(dataSource); // Fly to the loaded data source
                })
                .catch((error) => {
                    console.error("Error loading GeoJSON:", error);
                });



            viewer.homeButton.viewModel.command.beforeExecute.addEventListener((e) => {
                e.cancel = true;
                viewer.scene.camera.flyTo({
                    destination: Cartesian3.fromDegrees(35.0297, 31.8078, 400000.0)
                })
            })

            viewer.camera.flyTo({
                destination: Cartesian3.fromDegrees(35.0297, 31.8078, 400000.0),
            });

            const handler = new ScreenSpaceEventHandler(viewer.canvas);

            handler.setInputAction((movement: any) => {
                const ray: Ray | undefined = viewer.camera.getPickRay(movement.endPosition);
                let cartesian = undefined;
                if (ray) {
                    cartesian = viewer.scene.globe.pick(ray, viewer.scene);
                }

                if (cartesian) {
                    const cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
                    const lon = Cesium.Math.toDegrees(cartographic.longitude);
                    const lat = Cesium.Math.toDegrees(cartographic.latitude);
                    setLatLon({lat, lon});
                }
            }, ScreenSpaceEventType.MOUSE_MOVE);

            setViewer(viewer);

            return () => {
                if (viewer && !viewer.isDestroyed()) {
                    viewer.destroy();
                }
            };
        }, [datasource]);

        return (
            <div id="CesiumMap">
                <div className="location-reference">
                    <LocationProjector unit={"move_location"} setHandleConvert={setHandleConvert} setResult={setResult}/>
                </div>
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
                        Lat: {latLon.lat.toFixed(4)}°, Lon: {latLon.lon.toFixed(4)}°
                    </div>
                </div>
            </div>
        );
    }
;

export default CesiumMap;
