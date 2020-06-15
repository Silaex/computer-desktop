/*
*	Cette classe représente les petits indices ou "mini fenêtre pop-up" d'informations qui apparaissent lors du survol d'élément par exemple
*/

class Tooltip {
	constructor(coords, text) {
		this.coords = coords;
		this.text = text;
		this.nodes = {
			container: document.createElement("div")
		}

		this.nodes.container.id 			= "tooltip";
		this.nodes.container.textContent 	= this.text;
		this.reposition(this.coords);

		System.desktop.appendChild(this.nodes.container);
	}

	reposition(newCoords) {
		this.coords = newCoords;
		this.nodes.container.style.left = `${newCoords.x}px`;
		this.nodes.container.style.top 	= `${newCoords.y}px`;
		return this.coords;
	}

	remove() {
		this.nodes.container.remove();
	}
}