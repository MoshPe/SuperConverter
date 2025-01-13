package main

import (
	"context"
	"fmt"
	u "github.com/bcicen/go-units"
)

var (
	KM    u.Unit
	Miles u.Unit
	Meter u.Unit
	Foot  u.Unit
)

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	KM = u.KiloMeter
	Miles = u.Mile
	Meter = u.Meter
	Foot = u.Foot
	Init()
}

type UnitValue struct {
	Val float64
	Str string
}

func (a *App) ConvertDistanceUnit(value float64, unitName string) UnitValue {
	var val u.Value
	var err error
	unit, err := u.Find(unitName)
	if err != nil {
		fmt.Printf("Unit %s not found!\n", unitName)
		return UnitValue{
			Val: 0,
			Str: "",
		}
	}

	switch unit.Name {
	case KM.Name:
		val, err = u.ConvertFloat(value, unit, Miles)
		if err != nil {
			fmt.Println("error converting KM to Miles")
			return UnitValue{
				Val: 0,
				Str: "",
			}
		}
	case Miles.Name:
		val, err = u.ConvertFloat(value, unit, KM)
		if err != nil {
			fmt.Println("error converting Miles to KM")
			return UnitValue{
				Val: 0,
				Str: "",
			}
		}
	case RadUnit.Name:
		val, err = u.ConvertFloat(value, unit, DegUnit)
		if err != nil {
			fmt.Println("error converting Rad to Degree")
			return UnitValue{
				Val: 0,
				Str: "",
			}
		}
	case DegUnit.Name:
		val, err = u.ConvertFloat(value, unit, RadUnit)
		if err != nil {
			fmt.Println("error converting Deg to Rad")
			return UnitValue{
				Val: 0,
				Str: "",
			}
		}
	case Meter.Name:
		val, err = u.ConvertFloat(value, unit, Foot)
		if err != nil {
			fmt.Println("error converting Meter to Foot")
			return UnitValue{
				Val: 0,
				Str: "",
			}
		}
	case Foot.Name:
		val, err = u.ConvertFloat(value, unit, Meter)
		if err != nil {
			fmt.Println("error converting Foot to Meter")
			return UnitValue{
				Val: 0,
				Str: "",
			}
		}
	}
	return UnitValue{
		Val: val.Float(),
		Str: val.String(),
	}
}
