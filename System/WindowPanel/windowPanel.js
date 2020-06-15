/*
*	Cette classe représente la fenêtre classique du bureau (Mère de l'interface graphique des dossiers ou autres applications).
*/

class WindowPanel {
	constructor(parent, name, iconPath, type) {
		this.parent		= parent;
		this.type		= type;
		this.id 		= System.getWindowPanels().length;
		this.isDragged 	= false;
		this.zIndex		= 10;
		this.width 		= 500;
		this.height		= 300;
		this.name 		= name;
		this.iconPath 	= iconPath;
		this.nodes = {
			window 		: document.createElement("div"),
			infoBar		: document.createElement("div"),
			icon		: document.createElement("div"),
			name		: document.createElement("div"),
			closeButton : document.createElement("div"),
			content		: document.createElement("div"),
		}
		this.nodes.window.className		= "window";
		this.nodes.infoBar.className	= "window--info-bar";
		// Icône
		this.nodes.icon.className		= "window--icon";
		// Nom de la fenêtre
		this.nodes.name.className			= "window--name";
		this.nodes.name.textContent			= this.name;
		this.nodes.closeButton.className 	= "window--close";
		this.nodes.closeButton.textContent	= "X";
		this.nodes.content.className		= "window--content";

		// Ajout au système
		System.addWindowPanel(this);

		// Style
		this.nodes.window.style.width 	= `${ this.width }px`;
		this.nodes.window.style.height 	= `${ this.height }px`;
		this.nodes.window.style.zIndex	= this._bringToFirstPlan();

		this.nodes.icon.style.backgroundImage		= this.iconPath;
		this.nodes.icon.style.backgroundPosition	= "center";
		this.nodes.icon.style.backgroundRepeat	= "no-repeat";
		this.nodes.icon.style.backgroundSize 		= "contain";

		// Imbrication des noeuds HTML
		this.nodes.window.append(this.nodes.infoBar, this.nodes.content);
		this.nodes.infoBar.append(this.nodes.icon, this.nodes.name, this.nodes.closeButton);

		// Ajout au bureau
		System.desktop.append(this.nodes.window);

		// Evenements
		const self = this;
		this.nodes.closeButton.addEventListener("click", function() { self.close() });

		// Drag&Drop
		this.nodes.window.addEventListener("mousedown", function() { self.isDragged = true; self._bringToFirstPlan(); });
		this.nodes.window.addEventListener("mouseup", function() { self.isDragged = false; });
		this.nodes.window.addEventListener("mouseleave", function() { self.isDragged = false; });
		this.nodes.window.addEventListener("mousemove", function(event) { self.dragAndDrop(event); });
	}

	// Méthode servant à ramener la fenêtre au premier plan
	_bringToFirstPlan() {
		let mostSeenWindow = null;
		let maxIndex = 0;
		for (let windowPanel of System.getWindowPanels()) {
			if (windowPanel.zIndex > maxIndex) {
				mostSeenWindow = windowPanel;
				maxIndex = windowPanel.zIndex;
			}
		}
		if (mostSeenWindow.id !== this.id) {
			this.zIndex = mostSeenWindow.zIndex + 1 || 10;
		}
		return this.zIndex;
	}

	static getFirstPlanWindowPanel(windowPanels) {
		let firstPlanWindowPanel = null;
		let max = 0;
		for (let i = 0; i < windowPanels.length; i++) {
			const element = windowPanels[i];
			if (element.zIndex > max) {
				max = element.zIndex;
				firstPlanWindowPanel = element;
			}
		}
		return firstPlanWindowPanel;
	}

	// Méthode de déplacement des dossiers
	dragAndDrop({ x, y, currentTarget }) {
		if (this.isDragged) {
			const { clientWidth, clientHeight } = currentTarget;
			currentTarget.style.left 			= `${ x - (clientWidth / 2) }px`;
			currentTarget.style.top				= `${ y - (clientHeight / 2) }px`;
			currentTarget.style.zIndex			= this.zIndex + 1;
		} else {
			currentTarget.style.zIndex			= this.zIndex;
		}
	}

	close() {
		// @TODO: Imaginer à ajouter une fenêtre de confirmation
		this.nodes.window.remove();
	}
}