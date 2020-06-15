class SystemManager {
	constructor() {
		this.desktop 		= document.createElement("main");
		this.desktop.id 	= "desktop";
		document.querySelector("body").appendChild(this.desktop);
		document.body.addEventListener("click", () => { if (this.contextMenu) this.contextMenu.remove(); });

		// Proprietés
		this.contextMenu 	= null;
		this.tooltip		= null;
		this.windowPanels	= [];
		this.files 			= [];
		this.folders 		= [];
		this.draggedElement	= null;
	}

	setDraggedElement(element) {
		this.draggedElement = element;
		return element;
	}

	getDraggedElement() {
		return this.draggedElement;
	}

	getFiles() {
		return this.files;
	}

	getFolders() {
		return this.folders;
	}

	getWindowPanels() {
		return this.windowPanels;
	}

	addFile(file) {
		checkDataType(file, File);
		this.files.push(file);
		return this.files;
	}

	addFolder(folder) {
		checkDataType(folder, Folder);
		this.folders.push(folder);
		return this.folders;
	}

	addWindowPanel(windowPanel) {
		checkDataType(windowPanel, Window);
		this.windowPanels.push(windowPanel);
		return this.windowPanels;
	}

	refreshContextMenu(menu) {
		checkDataType(menu, ContextMenu);
		if (this.contextMenu !== null) {
			this.contextMenu.remove();
		}
		this.contextMenu = menu;
	}

	/*
	* 	Méthode d'ajout de l'indice de la souris 
	*	(ex: << Ajouter ce fichier à ce dossier >> lors du survol d'un dossier en déplacant un fichier au-dessus)
	*/
	addTooltip(coords, text) {
		// Si l'indice est déjà existant est que le texte est le même alors seul le repositionnement est nécessaire
		if (this.tooltip && this.tooltip.text === text) {
			this.tooltip.reposition(coords);
		} else {
			if (this.tooltip) this.tooltip.remove();
			this.tooltip = new Tooltip(coords, text);
		}
		return this.tooltip;
	}

	removeTooltip() {
		if (this.tooltip) this.tooltip.remove();
		this.tooltip = null;
	}
}

const MENUSLIST = {
	desktop: [
		{ text: "Nouveau dossier", command: function(coords) { new Folder(coords); } 	},
		{ text: "Nouveau fichier", command: function(coords) { new File(coords); } 		}
	],
}

class ContextMenu {
	constructor(coords) {
		// Noeuds HTML
		this.container 				= document.createElement("div");
		this.container.id 			= "context-menu";
		this.container.addEventListener("click", function() { this.remove() });

		for (let i = 0; i < MENUSLIST.desktop.length; i++) {
			const option  = MENUSLIST.desktop[i];
			this.container.appendChild(new ContextMenuOption(option.text, option.command));
		}

		// Affichage du menu sur le bureau
		System.desktop.append(this.container);
		this.container.style.left 	= `${coords.x}px`;
		this.container.style.top 	= `${coords.y}px`;
	}

	remove() {
		this.container.remove();
	}
}

class ContextMenuOption {
	constructor(text, command) {
		this.option 				= document.createElement("div");
		this.option.className 		= "context-menu--option";
		this.option.textContent		= text;
		this.option.addEventListener("click", command);
		return this.option;
	}
}

const System = new SystemManager();

// Fonction de vérification de type (Classe) - Sert à vérifier que la donnée entrante est conforme à ce que l'on souhaite.
function checkDataType(data, typeWanted) {
	if (!data instanceof typeWanted) {
		throw Error(`Adding from a wrong instance. [ wanted: ${typeWanted.name}, given: ${data.constructor.name} ]`);
	}
}

document.oncontextmenu = function(event) {
	const { x, y } = event;

	System.refreshContextMenu(new ContextMenu({ x, y }));
	return false;
}