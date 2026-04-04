package main

import (
	"html/template"
	"log"
	"net/http"
)

type Product struct {
	ID          int
	Name        string
	Description string
	Category    string
	Image       string
	Price       float64
}

type PageData struct {
	Title    string
	Subtitle string
	Message  string
	Products []Product
}

var tmpl = template.Must(template.ParseFiles("templates/index.html"))

func homeHandler(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/" {
		http.NotFound(w, r)
		return
	}

	data := PageData{
		Title:    "Sushi Kiosk",
		Subtitle: "Haz tu pedido en segundos",
		Message:  "Proyecto realizado con Go y Docker por los alumnos Jordi, Lluis Lorenzo y Maurycy Duda",
		Products: []Product{
			{ID: 1, Name: "Nigiri Salmón", Description: "2 piezas de nigiri con salmón fresco.", Category: "nigiri", Image: "/static/img/products/nigiri-salmon.jpg", Price: 4.90},
			{ID: 2, Name: "Nigiri Atún", Description: "2 piezas de nigiri con atún premium.", Category: "nigiri", Image: "/static/img/products/nigiri-tuna.jpg", Price: 5.20},
			{ID: 3, Name: "Maki Aguacate", Description: "8 piezas de maki vegetariano.", Category: "maki", Image: "/static/img/products/maki-avocado.jpg", Price: 6.50},
			{ID: 4, Name: "Maki Spicy Tuna", Description: "8 piezas con toque picante.", Category: "maki", Image: "/static/img/products/maki-spicy-tuna.jpg", Price: 7.80},
			{ID: 5, Name: "Combo Tokyo", Description: "12 piezas surtidas del chef.", Category: "combo", Image: "/static/img/products/combo-tokyo.jpg", Price: 13.90},
			{ID: 6, Name: "Combo Osaka", Description: "16 piezas variadas con maki y nigiri.", Category: "combo", Image: "/static/img/products/combo-osaka.jpg", Price: 17.50},
			{ID: 7, Name: "Mochi Matcha", Description: "Postre suave con té matcha.", Category: "postre", Image: "/static/img/products/mochi-matcha.jpg", Price: 4.20},
			{ID: 8, Name: "Tarta de Queso", Description: "Porción cremosa estilo japonés.", Category: "postre", Image: "/static/img/products/japanese-cheesecake.jpg", Price: 4.80},
			{ID: 9, Name: "Té Verde Frío", Description: "Bebida refrescante sin gas.", Category: "bebida", Image: "/static/img/products/iced-green-tea.jpg", Price: 2.90},
			{ID: 10, Name: "Ramune", Description: "Refresco japonés icónico.", Category: "bebida", Image: "/static/img/products/ramune.jpg", Price: 3.50},
		},
	}

	err := tmpl.Execute(w, data)
	if err != nil {
		http.Error(w, "Error al cargar la página", http.StatusInternalServerError)
		log.Println("Error ejecutando template:", err)
	}
}

func main() {
	fs := http.FileServer(http.Dir("static"))
	http.Handle("/static/", http.StripPrefix("/static/", fs))
	http.HandleFunc("/", homeHandler)

	log.Println("Servidor corriendo en http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}