package main

import (
	"context"
	"fmt"
	u "github.com/bcicen/go-units"
)

var (
	KM    u.Unit
	Miles u.Unit
)

// App struct
type App struct {
	ctx context.Context
}

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
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

func (a *App) Say(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
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
	if unit.Name == KM.Name {
		val, err = u.ConvertFloat(value, unit, Miles)
		if err != nil {
			fmt.Println("error converting KM to Miles")
			return UnitValue{
				Val: 0,
				Str: "",
			}
		}
	} else {
		val, err = u.ConvertFloat(value, unit, KM)
		if err != nil {
			fmt.Println("error converting Miles to KM")
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
