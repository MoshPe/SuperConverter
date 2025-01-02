package main

import (
	u "github.com/bcicen/go-units"
	"github.com/stretchr/testify/assert"
	"testing"
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

//func TestConvertECEFToGeo(t *testing.T) {
//
//}
