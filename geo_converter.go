package main

import (
	"fmt"
	u "github.com/bcicen/go-units"
	"math"
)

type Geo struct {
	Lat float64
	Lng float64
	Alt float64
}

type GeoCoordinate int

const (
	Latitude = iota
	Longitude
)

type DmsAngle struct {
	Deg int
	Min int
	Sec float64
	Str string
}
type DmmAngle struct {
	Deg int
	Min float64
	Str string
}
type Dms struct {
	LatNS DmsAngle
	LonWE DmsAngle
}
type Dmm struct {
	LatNS DmmAngle
	LonWE DmmAngle
}

type ECEF struct {
	X float64
	Y float64
	Z float64
}

var (
	DegUnit u.Unit
	RadUnit u.Unit
)

func Init() {
	DegUnit = u.NewUnit("Degree", "deg")
	RadUnit = u.NewUnit("Radian", "rad")
	u.NewConversionFromFn(DegUnit, RadUnit, func(val float64) float64 {
		return val * (math.Pi / 180)
	}, "Degrees × (π/180)")
	u.NewConversionFromFn(RadUnit, DegUnit, func(val float64) float64 {
		return val * (180 / math.Pi)
	}, "Radians  × (180/π)")
}

func (a *App) ConvertGeoToDms(geo Geo) Dms {
	fmt.Println("Convert Geo to Dms")
	latDeg, latMin, latSec, latDir := latLonToDMS(geo.Lat, Latitude)
	lngDeg, lngMin, lngSec, lngDir := latLonToDMS(geo.Lng, Longitude)
	return Dms{
		LatNS: DmsAngle{
			Deg: latDeg,
			Min: latMin,
			Sec: latSec,
			Str: latDir,
		},
		LonWE: DmsAngle{
			Deg: lngDeg,
			Min: lngMin,
			Sec: lngSec,
			Str: lngDir,
		},
	}
}

func (a *App) ConvertDmsToGeo(dms Dms) Geo {
	latDecimal := float64(dms.LatNS.Deg) + float64(dms.LatNS.Min)/60 + dms.LatNS.Sec/3600
	fmt.Println(dms)
	if dms.LatNS.Str == "S" {
		latDecimal = -latDecimal
	}

	lngDecimal := float64(dms.LonWE.Deg) + float64(dms.LonWE.Min)/60 + dms.LonWE.Sec/3600
	if dms.LonWE.Str == "W" {
		lngDecimal = -lngDecimal
	}

	return Geo{
		Lat: latDecimal,
		Lng: lngDecimal,
		Alt: 0,
	}
}

func (a *App) ConvertDmsToDmm(dms Dms) Dmm {
	return Dmm{
		LatNS: DmmAngle{
			Deg: dms.LatNS.Deg,
			Min: float64(dms.LatNS.Min) + (dms.LatNS.Sec / 60),
			Str: dms.LatNS.Str,
		},
		LonWE: DmmAngle{
			Deg: dms.LonWE.Deg,
			Min: float64(dms.LonWE.Min) + (dms.LonWE.Sec / 60),
			Str: dms.LonWE.Str,
		},
	}
}

func (a *App) ConvertGeoToDmm(geo Geo) Dmm {
	dms := a.ConvertGeoToDms(geo)
	return a.ConvertDmsToDmm(dms)
}

func (a *App) ConvertEcefToDmm(ecef ECEF) Dmm {
	dms := a.ConvertEcefToDms(ecef)
	return a.ConvertDmsToDmm(dms)
}

func (a *App) ConvertDmmToDms(dmm Dmm) Dms {

	latMinutes := int(dmm.LatNS.Min)
	lonMinutes := int(dmm.LonWE.Min)

	return Dms{
		LatNS: DmsAngle{
			Deg: dmm.LatNS.Deg,
			Min: latMinutes,
			Sec: math.Round(dmm.LatNS.Min-float64(latMinutes)) * 60,
			Str: dmm.LatNS.Str,
		},
		LonWE: DmsAngle{
			Deg: dmm.LonWE.Deg,
			Min: lonMinutes,
			Sec: math.Round(dmm.LonWE.Min-float64(lonMinutes)) * 60,
			Str: dmm.LonWE.Str,
		},
	}
}

func (a *App) ConverDmmToGeo(dmm Dmm) Geo {
	dms := a.ConvertDmmToDms(dmm)
	return a.ConvertDmsToGeo(dms)
}

func (a *App) ConvertDmmToEcef(dmm Dmm) ECEF {
	dms := a.ConvertDmmToDms(dmm)
	return a.ConvertDmsToEcef(dms)
}

func (a *App) ConvertGeoToECEF(geo Geo) ECEF {
	// WGS84 ellipsoid parameters
	sma := 6378137.0         // Semi-major axis (meters)
	f := 1.0 / 298.257223563 // Flattening
	e2 := 2*f - f*f          // Eccentricity squared

	// Convert latitude, longitude to radians
	latRad := geo.Lat * math.Pi / 180.0
	lonRad := geo.Lng * math.Pi / 180.0

	// Calculate the prime vertical radius of curvature
	N := sma / math.Sqrt(1-e2*math.Sin(latRad)*math.Sin(latRad))

	// Calculate ECEF coordinates
	X := (N + geo.Alt) * math.Cos(latRad) * math.Cos(lonRad)
	Y := (N + geo.Alt) * math.Cos(latRad) * math.Sin(lonRad)
	Z := ((1-e2)*N + geo.Alt) * math.Sin(latRad)

	return ECEF{
		X: X,
		Y: Y,
		Z: Z,
	}
}

func (a *App) ConvertECEFToGeo(ecef ECEF) Geo {
	// WGS84 ellipsoid parameters
	sma := 6378137.0         // Semi-major axis (meters)
	f := 1.0 / 298.257223563 // Flattening
	e2 := 2*f - f*f          // Eccentricity squared

	// Calculate longitude (simple inverse tangent)
	lon := math.Atan2(ecef.Y, ecef.X)

	// Calculate the initial approximation of latitude
	rho := math.Sqrt(ecef.X*ecef.X + ecef.Y*ecef.Y)
	lat := math.Atan2(ecef.Z, rho*(1-e2)) // Initial approximation for latitude

	// Iteratively refine latitude using Newton's method
	N := sma / math.Sqrt(1-e2*math.Sin(lat)*math.Sin(lat))
	alt := rho/math.Cos(lat) - N

	// Start refining latitude using an iterative method
	for {
		// Update N and altitude
		N = sma / math.Sqrt(1-e2*math.Sin(lat)*math.Sin(lat))
		newLat := math.Atan2(ecef.Z+e2*N*math.Sin(lat), rho)

		// Check for convergence (if the latitude does not change significantly, break the loop)
		if math.Abs(newLat-lat) < 1e-10 {
			break
		}
		lat = newLat
	}

	// Convert latitude and longitude from radians to degrees
	latDeg := lat * 180.0 / math.Pi
	lonDeg := lon * 180.0 / math.Pi

	// Return the geographic coordinates
	return Geo{
		Lat: latDeg,
		Lng: lonDeg,
		Alt: alt,
	}
}

func (a *App) ConvertDmsToEcef(dms Dms) ECEF {
	geo := a.ConvertDmsToGeo(dms)
	return a.ConvertGeoToECEF(geo)
}

func (a *App) ConvertEcefToDms(ecef ECEF) Dms {
	geo := a.ConvertECEFToGeo(ecef)
	return a.ConvertGeoToDms(geo)
}

func latLonToDMS(degrees float64, geoType GeoCoordinate) (int, int, float64, string) {
	// Determine direction (N/S for latitude, E/W for longitude)
	var direction string
	if geoType == Latitude {
		if degrees < 0 {
			direction = "S"
		} else {
			direction = "N"
		}
	} else {
		if degrees < 0 {
			direction = "W"
		} else {
			direction = "E"
		}
	}

	// Extract the degrees, minutes, and seconds
	deg := int(degrees)
	minutes := (degrees - float64(deg)) * 60
	m := int(minutes)
	seconds := (minutes - float64(m)) * 60
	sec := seconds

	// Format the result as DMS string
	dmsString := fmt.Sprintf("%d°%d'%f\"%s", deg, m, sec, direction)

	// Return both DMS string and the decimal degree (original value)
	return deg, m, sec, dmsString
}
