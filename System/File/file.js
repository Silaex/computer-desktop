/*
*	Contient tout le fonctionnement des fichiers
*/

class File extends DesktopElement {
	constructor(coords) {
		super(coords, "Nouveau fichier", "images/file/text-icon.svg", File);
		// Ajout du dossier à la liste système
		System.addFile(this);
	}
}
