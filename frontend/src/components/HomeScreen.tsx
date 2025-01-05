import React from "react";
import { Link } from "react-router-dom";
import "./HomeScreen.css";

const HomeScreen = () => {
    return (
        <div className="home-container">
            <div className="hero">
                <h1 className="title">Geo Converter</h1>
                <p className="description">
                    Effortlessly convert and visualize geospatial data. Switch between simple conversions and advanced calculations.
                </p>
                <div className="buttons">
                    <Link to="/simple" className="button simple-button">
                        Simple Converter
                    </Link>
                    <Link to="/advanced" className="button advanced-button">
                        Advanced Converter
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HomeScreen;
