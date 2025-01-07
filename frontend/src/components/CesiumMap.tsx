import React, {useEffect, useState} from "react";
import * as Cesium from "cesium";
import {Cartesian3, Color, defined, Ray, ScreenSpaceEventHandler, ScreenSpaceEventType, Viewer} from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import './index.d'
import './CesiumMap.css'

Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5MmE4OGNiNS0wNDI3LTQyNzYtOGI3Yy0yMjFjZThmYmQwMzUiLCJpZCI6MjY2NTMwLCJpYXQiOjE3MzU5MDc2MDd9.pBORuv4ekLdb4USMX11EuIMMN50QRTktcnP-_xXafTk';
window.CESIUM_BASE_URL = './node_modules/cesium/Build/CesiumUnminified/'

const CesiumMap = () => {
    const [placingMarker, setPlacingMarker] = useState(false); // Track if we're placing a marker}
    const [viewer, setViewer] = useState({} as Viewer);
    const [latLon, setLatLon] = useState({lat: 0, lon: 0});

    useEffect(() => {
        // Ensure the DOM is ready before initializing Cesium
        const viewer = new Viewer("cesiumContainer", {
            // Disable the default widgets (including the bottom bar)
            animation: false,
            sceneModePicker: false,
            navigationHelpButton: true,
            infoBox: false,
            selectionIndicator: false,
            timeline: false,
            homeButton: true,
            fullscreenButton: true,
            geocoder: false
        });

        const czmlFilePath = 'frontend/src/assets/simple.czml';

        Cesium.CzmlDataSource.load(czmlFilePath).then(async function (dataSource) {
            // Add the loaded data source to the viewer
            viewer.dataSources.add(dataSource).then(console.log);

            // Adjust the viewer's camera to fit the data source
            await viewer.zoomTo(dataSource);
        }).catch(function (error) {
            console.error('Error loading CZML:', error);
        });

        setViewer(viewer);

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


        return () => {
            if (viewer && !viewer.isDestroyed()) {
                viewer.destroy();
            }
        };
    }, []);

    const handlePlaceMarkerClick = () => {
        setPlacingMarker(true); // Activate marker placement mode
        document.body.style.cursor = 'crosshair'; // Change the cursor to + (crosshair)

        if (viewer) {
            const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);
            handler.setInputAction((click: any) => {
                if (placingMarker) {
                    const ray = viewer.camera.getPickRay(click.position);
                    let result: Cartesian3 | undefined = undefined
                    if (ray) {
                        result = viewer.scene.globe.pick(ray, viewer.scene);
                    }

                    console.log(result);

                    if (result != undefined && defined(result)) {
                        // Place a marker at the clicked position
                        const cartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(result);
                        const position = Cartesian3.fromRadians(
                            cartographic.longitude,
                            cartographic.latitude,
                            cartographic.height
                        );

                        viewer.entities.add({
                            position,
                            point: {
                                pixelSize: 10,
                                color: Color.RED,
                                outlineColor: Color.WHITE,
                                outlineWidth: 2,
                            },
                        });
                    }

                    // Reset cursor and mode after placing marker
                    setPlacingMarker(false);
                    document.body.style.cursor = 'default'; // Change the cursor back to default
                }
            }, ScreenSpaceEventType.LEFT_CLICK);
        }
    };

    return (
        <div id="CesiumMap">
            <div id="CesiumMapContainer" className="cesiumMapContainer">
                <div className="cesium-toolbar">
                    <button
                        id="placeMarkerButton"
                        onClick={handlePlaceMarkerClick}
                        style={{
                            position: 'absolute',
                            top: '10px',
                            right: '120px', // Position it near the home button
                            padding: '10px',
                            background: 'rgba(0, 0, 0, 0.7)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            zIndex: '10',
                        }}
                    >
                        Place Marker
                    </button>
                </div>
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
};

export default CesiumMap;
