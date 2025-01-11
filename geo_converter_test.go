package main

import (
	"fmt"
	u "github.com/bcicen/go-units"
	"github.com/stretchr/testify/assert"
	"testing"
)

const (
	EarthRadius = 6378.1           // Radius of Earth in km
	a           = 6378137.0        // Semi-major axis (meters)
	b           = 6356752.3142     // Semi-minor axis (meters)
	e2          = 0.00669437999014 // Eccentricity squared
)

func testConversions(t *testing.T) {
	val := u.NewValue(30, DegUnit)
	assert.Equal(t, 0.5235987755982988, val.MustConvert(RadUnit).Float())
	assert.Equal(t, 0.5235987755982988, u.MustConvertFloat(30, DegUnit, RadUnit).Float())
}

func TestConversionValues(t *testing.T) {
	testConversions(t)
}

//func TestConvertGeoToECEF(t *testing.T) {
//
//}

func TestApp_ConvertGeoToECEF(t *testing.T) {
	app := &App{}
	lat, lon, alt := 35.1, 31.1, 250.0

	ecef := app.ConvertGeoToECEF(Geo{
		Lat: lat,
		Lng: lon,
		Alt: alt,
	})

	assert.Equal(t, 4473361.97, ecef.X)
	assert.Equal(t, 2698504.46, ecef.Y)
	assert.Equal(t, 3647092.90, ecef.Z)
}

func TestApp_ConvertGeoToECEF2(t *testing.T) {
	app := &App{}

	geo := app.ConvertECEFToGeo(ECEF{
		X: 4473361.97,
		Y: 2698504.46,
		Z: 3647092.90,
	})

	assert.Equal(t, 35.1000000, geo.Lat)
	assert.Equal(t, 31.1000000, geo.Lng)
	assert.Equal(t, 250.00, geo.Alt)
}

func TestConvertGeoToDms(t *testing.T) {
	app := &App{}
	lat, lon := 56.543483, 59.687450
	dms := app.ConvertGeoToDms(Geo{
		Lat: lat,
		Lng: lon,
		Alt: 0,
	})
	assert.Equal(t, 56, dms.LatNS.Deg)
	assert.Equal(t, 32, dms.LatNS.Min)
	assert.Equal(t, 36.53880000000697, dms.LatNS.Sec)
	assert.Equal(t, "56°32'36.538800\"N", dms.LatNS.Str)
	assert.Equal(t, 59, dms.LonWE.Deg)
	assert.Equal(t, 41, dms.LonWE.Min)
	assert.Equal(t, 14.819999999994025, dms.LonWE.Sec)
	assert.Equal(t, "59°41'14.820000\"E", dms.LonWE.Str)
}

func TestConvertDmsToGeo(t *testing.T) {
	app := &App{}
	// 47.087345, 20.689055
	dms := Dms{
		LatNS: DmsAngle{
			Deg: 47,
			Min: 05,
			Sec: 14.4,
			Str: "47°05'14.4\"N",
		},
		LonWE: DmsAngle{
			Deg: 20,
			Min: 41,
			Sec: 20.6,
			Str: "20°41'20.6\"E",
		},
	}
	geo := app.ConvertDmsToGeo(dms)
	assert.Equal(t, 47.08733333333333, geo.Lat)
	assert.Equal(t, 20.689055555555555, geo.Lng)
}

func TestApp_MoveToLocation(t *testing.T) {
	app := &App{}
	lat, lon, alt := 37.7749, -122.4194, 0.0 // San Francisco
	azimuth, elevation := 0.0, 0.0           // 30° azimuth, 1° elevation
	distance := 10000.0                      // 10 km

	// Convert initial location to ECEF coordinates
	ecef := app.ConvertGeoToECEF(Geo{
		Lat: lat,
		Lng: lon,
		Alt: alt,
	})

	sez := RAEtoSEZ(distance, azimuth, elevation)
	newEcef := SEZtoECR(ecef, Geo{
		Lat: lat,
		Lng: lon,
		Alt: alt,
	}, sez)

	geo := app.ConvertECEFToGeo(newEcef)

	// Output the new location
	fmt.Printf("New location: %f° N, %f° E, Altitude: %f meters\n", geo.Lat, geo.Lng, geo.Alt)

	fmt.Printf("X: %f Y: %f Z: %f\n", newEcef.X, newEcef.Y, newEcef.Z)
}

//func TestConvertECEFToGeo(t *testing.T) {
//
//}
