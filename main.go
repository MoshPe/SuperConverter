package main

import (
	"embed"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"net/http"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// Create an instance of the app structure
	app := NewApp()
	//
	//go func() {
	//	http.Handle("/map/", http.StripPrefix("/map/", http.FileServer(http.Dir("./public/map"))))
	//	err := http.ListenAndServe(":8080", nil)
	//	if err != nil {
	//		println("Static file server failed:", err.Error())
	//	}
	//}()

	// Create application with options
	err := wails.Run(&options.App{
		Title:  "Super-Converter",
		Width:  1525,
		Height: 900,
		AssetServer: &assetserver.Options{
			Assets: assets,
			Middleware: func(next http.Handler) http.Handler {
				return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
					switch {
					case r.URL.Path == "/map" || r.URL.Path == "/map/" || len(r.URL.Path) > 5 && r.URL.Path[:5] == "/map/":
						http.StripPrefix("/map/", http.FileServer(http.Dir("./map-server/map"))).ServeHTTP(w, r)
						return
					case r.URL.Path == "/terrain" || r.URL.Path == "/terrain/" || len(r.URL.Path) > 9 && r.URL.Path[:9] == "/terrain/":
						http.StripPrefix("/terrain/", http.FileServer(http.Dir("./map-server/terrain"))).ServeHTTP(w, r)
						return
					default:
						next.ServeHTTP(w, r)
					}
				})
			},
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
