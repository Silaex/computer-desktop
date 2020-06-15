class Folder extends DesktopElement {
	constructor(coords) {
		super(coords, "Nouveau dossier", "images/folder/default-icon.svg", Folder);
		// Ajout du dossier à la liste système
		System.addFolder(this);

		this.storage = [];
		this.nodes.container.addEventListener("dblclick", () => this.openFolder());
	}

	// Méthode appelé lors du double click sur un dossier
	openFolder() {
		new WindowPanel(this, this.name, this.iconPath, Folder);		
	}

	addElementToStorage(element) {
		console.log("élement bien stocké !");
		this.storage.push(element);
		return this.storage;
	}
}
