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
		//Uncomment this to delete the database before running
		//indexedDB.deleteDatabase("testdb");
		
		var openRequest = window.indexedDB.open("testdb", 7) //Parameters db name and version
		var newTable = false;
		
		//Called when db version changes
		openRequest.onupgradeneeded = function(e) {
			addText("Upgrading...");
			
			var preDb = e.target.result;
			
			//Create an object store if it doesn't exist already
			if (!preDb.objectStoreNames.contains("colours")) {
				preDb.createObjectStore("colours", {autoIncrement: true});
				newTable = true;
			}
		}
		
		openRequest.onsuccess = function(e) {
			addText("indexedDB opened. ");
			db = e.target.result;
			if (newTable) {
				populateDb();
			}
			document.querySelector("#addButton").addEventListener("click", addColourFromInput, false);
			document.querySelector("#getButton").addEventListener("click", getColourFromInput, false);
		}
		
		openRequest.onerror = function(e) {
			addText("Error: " + e.currentTarget.error.message);
		}
	}	
	
},false);

function addText(text) {
	if (!hello_el) {
		var hello_el = document.getElementById("hello");
	}
	hello_el.innerHTML = hello_el.innerHTML + text;
}

//Creates some sample data
function populateDb() {
	var colours = [];
	colours[0] = {
		name:"red",
		hex:"FF0000"
	}
	colours[1] = {
		name:"orange",
		hex:"FFA500"
	}
	colours[2] = {
		name:"yellow",
		hex:"FFFF00"
	}
	colours[3] = {
		name:"green",
		hex:"008000"
	}
	colours[4] = {
		name:"blue",
		hex:"0000FF"
	}
	colours[5] = {
		name:"purple",
		hex:"800080"
	}
	
	for (var i = 0; i < colours.length; i++) {
		addColour(colours[i]);
	}
}
	

function addColour(colour) {
		
	//Params: Array of tables (just one table in this case), readwrite or readonly
	var transaction = db.transaction(["colours"], "readwrite");
	//Get objectStore from transaction
	var store = transaction.objectStore("colours");
	
	//Add a colour to db
	//Params: Colour object, id (obviously shouldn't be hardcoded)
	var request = store.add(colour);
	
	request.onerror = function() {
		addText("Error adding colour to database.");
	}
	
	request.onsuccess = function() {
		addText("Successfully added " + colour.name + " to database. ")
	}
}

function addColourFromInput() {
	var name = document.querySelector("#name").value;
	var hex = document.querySelector("#hex").value;
	
	var colour = {
		name: name,
		hex: hex
	}
	addColour(colour);
}

function getColourFromInput(e) {
	var key = document.querySelector("#key").value;
	if(key === "" || isNaN(key)) return;
	
	var transaction = db.transaction(["colours"],"readonly");
    var store = transaction.objectStore("colours");
 
    var request = store.get(Number(key));
	
	request.onsuccess = function(e) {
		var result = e.target.result;
		if (result) {
			str = "<p>The colour is <span style='color:#" + result.hex + ";'>" + result.name + "</span>.</p>";
		}
		else {
			str = "No colour has that id.";
		}
		document.querySelector("#colourResult").innerHTML = str;
	}
}