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
	Deg       int
	Min       int
	Sec       float64
	direction string
	Str       string
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

type SEZ struct {
	South  float64
	East   float64
	Zenith float64
}

type Angle struct {
	Azimuth   float64
	Elevation float64
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
	latDeg, latMin, latSec, latDir, latDirection := latLonToDMS(geo.Lat, Latitude)
	lngDeg, lngMin, lngSec, lngDir, lngDirection := latLonToDMS(geo.Lng, Longitude)
	return Dms{
		LatNS: DmsAngle{
			Deg:       latDeg,
			Min:       latMin,
			Sec:       latSec,
			Str:       latDir,
			direction: latDirection,
		},
		LonWE: DmsAngle{
			Deg:       lngDeg,
			Min:       lngMin,
			Sec:       lngSec,
			Str:       lngDir,
			direction: lngDirection,
		},
	}
}

func (a *App) ConvertDmsToGeo(dms Dms) Geo {
	latDecimal := float64(dms.LatNS.Deg) + float64(dms.LatNS.Min)/60 + dms.LatNS.Sec/3600
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
			Str: fmt.Sprintf("%d°%f'%s", dms.LatNS.Deg, float64(dms.LatNS.Min)+(dms.LatNS.Sec/60), dms.LatNS.direction),
		},
		LonWE: DmmAngle{
			Deg: dms.LonWE.Deg,
			Min: float64(dms.LonWE.Min) + (dms.LonWE.Sec / 60),
			Str: fmt.Sprintf("%d°%f'%s", dms.LonWE.Deg, float64(dms.LonWE.Min)+(dms.LonWE.Sec/60), dms.LonWE.direction),
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

func (a *App) ConvertDmmToGeo(dmm Dmm) Geo {
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
	N := sma / math.Sqrt(1-(e2*math.Pow(math.Sin(latRad), 2)))

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

func latLonToDMS(degrees float64, geoType GeoCoordinate) (int, int, float64, string, string) {
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
	degAbs := math.Abs(degrees)
	deg := math.Floor(degAbs)
	minutes := (degAbs - deg) * 60
	m := math.Floor(minutes)
	seconds := (minutes - m) * 60
	sec := math.Round(seconds*1e4) / 1e4
	if sec == 60 {
		sec = 0
		m += 1
	}

	// Handle edge case where m = 60 due to rounding
	if m == 60 {
		m = 0
		deg += 1
	}
	// Format the result as DMS string
	dmsString := fmt.Sprintf("%d° %d' %f\" %s", int(deg), int(m), sec, direction)

	// Return both DMS string and the decimal degree (original value)
	return int(deg), int(m), sec, dmsString, direction
}

func toRadians(angle float64) float64 {
	return angle * (math.Pi / 180)
}

func RAEtoSEZ(distance float64, azimuth float64, elevation float64) SEZ {
	// Convert to radians
	azimuth = toRadians(azimuth)
	elevation = toRadians(elevation)

	//
	return SEZ{
		South:  -distance * math.Cos(elevation) * math.Cos(azimuth),
		East:   distance * math.Cos(elevation) * math.Sin(azimuth),
		Zenith: distance * math.Sin(elevation),
	}
}

func SEZtoECR(siteXYZ ECEF, geo Geo, sez SEZ) ECEF {

	var south = sez.South
	var east = sez.East
	var zenith = sez.Zenith

	// Compute needed math
	slat := math.Sin(toRadians(geo.Lat))
	slon := math.Sin(toRadians(geo.Lng))
	clat := math.Cos(toRadians(geo.Lat))
	clon := math.Cos(toRadians(geo.Lng))

	// Convert
	return ECEF{
		X: (slat * clon * south) + (-slon * east) + (clat * clon * zenith) + siteXYZ.X,
		Y: (slat * slon * south) + (clon * east) + (clat * slon * zenith) + siteXYZ.Y,
		Z: (-clat * south) + (slat * zenith) + siteXYZ.Z,
	}
}

func (a *App) MoveToLocation(geo Geo, az float64, el float64, distance float64) Geo {
	ecefLoc := a.ConvertGeoToECEF(geo)
	distance = distance * 1000

	sez := RAEtoSEZ(distance, az, el)
	movedEcef := SEZtoECR(ecefLoc, geo, sez)

	return a.ConvertECEFToGeo(movedEcef)
}

func (a *App) CalculateAzimuth(geo1, geo2 Geo) float64 {
	// Convert degrees to radians
	lat1 := geo1.Lat * math.Pi / 180.0
	lon1 := geo1.Lng * math.Pi / 180.0
	lat2 := geo2.Lat * math.Pi / 180.0
	lon2 := geo2.Lng * math.Pi / 180.0

	// Calculate the difference in longitudes
	deltaLon := lon2 - lon1

	// Calculate azimuth using the formula
	azimuth := math.Atan2(math.Sin(deltaLon)*math.Cos(lat2),
		math.Cos(lat1)*math.Sin(lat2)-math.Sin(lat1)*math.Cos(lat2)*math.Cos(deltaLon))

	// Convert azimuth from radians to degrees
	azimuth = azimuth * 180.0 / math.Pi

	// Normalize the azimuth to be between 0 and 360 degrees
	if azimuth < 0 {
		azimuth += 360
	}

	return azimuth
}

func (a *App) DistanceBetweenTwoPoints(geo1, geo2 Geo) float64 {
	R := 6371e3 // metres

	φ1 := geo1.Lat * math.Pi / 180 // φ, λ in radians
	φ2 := geo2.Lat * math.Pi / 180
	Δφ := (geo2.Lat - geo1.Lat) * math.Pi / 180
	Δλ := (geo2.Lng - geo1.Lng) * math.Pi / 180

	haversine := math.Sin(Δφ/2)*math.Sin(Δφ/2) +
		math.Cos(φ1)*math.Cos(φ2)*
			math.Sin(Δλ/2)*math.Sin(Δλ/2)
	c := 2 * math.Atan2(math.Sqrt(haversine), math.Sqrt(1-haversine))

	d := R * c // in metres

	return d
}

func (a *App) CalculateAzimuthAndElevation(geo1, geo2 Geo) Angle {
	EarthRadius := 6371.0

	// Convert degrees to radians
	lat1 := geo1.Lat * math.Pi / 180.0
	lon1 := geo1.Lng * math.Pi / 180.0
	lat2 := geo2.Lat * math.Pi / 180.0
	lon2 := geo2.Lng * math.Pi / 180.0

	// Calculate the difference in longitudes
	deltaLon := lon2 - lon1

	// Azimuth calculation (same as before)
	azimuth := math.Atan2(math.Sin(deltaLon)*math.Cos(lat2),
		math.Cos(lat1)*math.Sin(lat2)-math.Sin(lat1)*math.Cos(lat2)*math.Cos(deltaLon))

	// Convert azimuth from radians to degrees
	azimuth = azimuth * 180.0 / math.Pi
	if azimuth < 0 {
		azimuth += 360
	}

	// Calculate horizontal distance (d_h) using spherical law of cosines
	d_h := EarthRadius * math.Acos(math.Sin(lat1)*math.Sin(lat2)+math.Cos(lat1)*math.Cos(lat2)*math.Cos(deltaLon))

	// Elevation angle calculation
	elevation := math.Atan2(geo2.Alt-geo1.Alt, d_h)

	// Convert elevation from radians to degrees
	elevation = elevation * 180.0 / math.Pi

	return Angle{
		Azimuth:   azimuth,
		Elevation: elevation,
	}
}
