class DesktopElement {
	constructor(coords, name, iconPath, type) {
		this.id 		= this._IdByType(type);
		this.type 		= type;
		this.isDragged 	= false;
		this.name 		= name;
		this.weight 	= 0;
		this.width 		= 128;
		this.height 	= 96;
		this.coords 	= 	{ 
								x: coords.x - (this.width / 2), 
								y: coords.y - (this.height / 2) 
							};
		this.iconPath 		= `url('${ iconPath }')`;
		this.nodes = {
			container 	: document.createElement("div"),
			icon 		: document.createElement("div"),
			name 		: document.createElement("div"),
		}

		this.nodes.container.className 				= "desktop-element";
		this.nodes.icon.style.backgroundImage		= this.iconPath;
		this.nodes.icon.style.backgroundPosition	= "center";
		this.nodes.icon.style.backgroundRepeat		= "no-repeat";
		this.nodes.icon.style.backgroundSize 		= "contain";
		this.nodes.icon.className 					= "desktop-element--icon";
		this.nodes.name.textContent 				= this.name;
		
		this.nodes.container.append(this.nodes.icon, this.nodes.name);

		this.setDimension(this.width, this.height);
		this.reposition(this.coords);
		System.desktop.append(this.nodes.container);

		// Affectation des évenements de Drag&Drop
		const self = this;
		// Cette propriète récupère le dossier sur lequel on est en survol au maintien d'un element
		this.folderWindowPanel = null;

		this.nodes.container.addEventListener("mousedown", function() { 
			self.isDragged = true; 
			System.setDraggedElement(self);
		});
		this.nodes.container.addEventListener("mouseup", function() { self._removeDragState(); });
		this.nodes.container.addEventListener("mouseleave", function() { self._removeDragState(); });
		this.nodes.container.addEventListener("mousemove", function(event) { self.dragAndDrop(event) });
	}

	// Méthode privée permettant l'initialisation d'un id en fonction de son Type
	_IdByType(type) {
		switch(type) {
			case File: 		return System.getFiles().length; break;
			case Folder: 	return System.getFolders().length; break;
		}
	}

	_removeDragState() {
		this.isDragged = false;
		System.setDraggedElement(null);
		System.removeTooltip();
		if (this.folderWindowPanel) {
			// Ajout de l'élément au stockage du dossier
			this.folderWindowPanel.parent.addElementToStorage(this);
			this.folderWindowPanel = null;
		}
	}

	// Méthode de déplacement des dossiers
	dragAndDrop({ x, y, currentTarget }) {
		if (this.isDragged) {
			const { clientWidth, clientHeight } = currentTarget;
			currentTarget.style.left 			= `${ x - (clientWidth / 2) }px`;
			currentTarget.style.top				= `${ y - (clientHeight / 2) }px`;
			currentTarget.style.zIndex			= 1000;
			this.nodes.container.style.filter	= "drop-shadow(2px 2px 5px #FFF)";
			// 
			this.folderWindowPanel = this._checkFolderStorage({ x, y });
		} else {
			currentTarget.style.zIndex			= 0;
			this.nodes.container.style.filter	= "none";
		}
	}

	// Setter pour la redimension
	setDimension(width, height) {
		this.width 					= width;
		this.height 				= height;
		this.nodes.container.style.width 	= `${ width }px`;
		this.nodes.container.style.height 	= `${ height }px`;
		return { width, height };
	}

	// Méthode de repositionnement
	reposition(newCoords) {
		this.coords = newCoords;
		this.nodes.container.style.left 	= `${newCoords.x}px`;
		this.nodes.container.style.top 		= `${newCoords.y}px`;
		return this.coords;
	}

	_checkFolderStorage({ x, y }) {
		// Check des collisions de zones des fenêtres et la position de la souris
		const foldersHovered = 	System.getWindowPanels().filter(wp => {
									const { offsetTop, offsetLeft, clientWidth, clientHeight } = wp.nodes.window;
									if (x >= offsetLeft && x <= (offsetLeft + clientWidth) && y >= offsetTop && y <= (offsetTop + clientHeight) && wp.type === Folder) {
										return wp;
									}
								});
		if (foldersHovered.length) {
			const coords = { x: x + (this.width / 2), y: y + (this.height / 2) }
			const firstPlanFolder = WindowPanel.getFirstPlanWindowPanel(foldersHovered);
			const tooltipText = "Déplacer dans " + firstPlanFolder.name;

			System.addTooltip(coords, tooltipText);
			// On retourne le dossier qui sera si l'utilisateur relâche le clic celui qui stockera l'élément séléctionné.
			return firstPlanFolder;
		} else {
			System.removeTooltip();
			return null;
		}
	}
}