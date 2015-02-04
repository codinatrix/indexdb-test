document.addEventListener("DOMContentLoaded", function() {
	
	var idbSupported = false;
	
	
	if(typeof window.indexedDB !== 'undefined') {
		idbSupported = true;
		addText("indexedDB is supported. ")
	} else {
		idbSupported = false;
		addText("indexedDB is not supported.")
	}
	
	if (idbSupported) {
		var openRequest = window.indexedDB.open("testdb", 3) //Parameters db name and version
		
		//Called when db version changes
		openRequest.onupgradeneeded = function(e) {
			addText("Upgrading...");
			
			var preDb = e.target.result;
			
			//Create an object store if it doesn't exist already
			if (!preDb.objectStoreNames.contains("colours")) {
				preDb.createObjectStore("colours")
			}
		}
		
		openRequest.onsuccess = function(e) {
			addText("indexedDB opened. ");
			db = e.target.result;
			addColour();
		}
		
		openRequest.onerror = function(e) {
			addText("Error :(")
		}
	}	
	
},false);

function addText(text) {
	if (!hello_el) {
		var hello_el = $("#hello");
	}
	hello_el.append(text);
}

//Creates some sample data
function getColourData() {
	var colours = {};
	colours['red'] = {
		name:"red",
		hex:"FF0000"
	}
	colours['orange'] = {
		name:"orange",
		hex:"FFA500"
	}
	colours['yellow'] = {
		name:"yellow",
		hex:"FFFF00"
	}
	colours['green'] = {
		name:"green",
		hex:"008000"
	}
	colours['blue'] = {
		name:"blue",
		hex:"0000FF"
	}
	colours['purple'] = {
		name:"purple",
		hex:"800080"
	}
	
	return colours;
}
	

function addColour(e) {
	
	colours = getColourData();
	
	//Params: Array of tables (just one table in this case), readwrite or readonly
	var transaction = db.transaction(["colours"], "readwrite");
	//Get objectStore from transaction
	var store = transaction.objectStore("colours");
	
	//Add a colour to db
	//Params: Colour object, id (obviously shouldn't be hardcoded)
	var request = store.add(colours['red'], 1);
	var request = store.add(colours['orange'], 2);
	
	request.onerror = function(e) {
		addText("Error: " + e.target.error.name + " ");
	}
	
	request.onsuccess = function(e) {
		addText("Successfully added colour to database. ")
	}
}


