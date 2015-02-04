document.addEventListener("DOMContentLoaded", function() {
	
	var idbSupported = false;
	var hello_el = $("#hello");
	
	if(typeof window.indexedDB !== 'undefined') {
		idbSupported = true;
		hello_el.text("indexedDB is supported. ")
	} else {
		idbSupported = false;
		hello_el.text("indexedDB is not supported.")
	}
	
	if (idbSupported) {
		var openRequest = window.indexedDB.open("testdb", 1) //Parameters db name and version
		
		//Called when db version changes
		openRequest.onupgradeneeded = function(e) {
			hello_el.append("Upgrading...");
			
			var preDb = e.target.result;
			
			//Create an object store if it doesn't exist already
			if (!preDb.objectStoreNames.contains("colours")) {
				preDb.createObjectStore("colours")
			}
		}
		
		openRequest.onsuccess = function(e) {
			hello_el.append("indexedDB opened.");
			db = e.target.result;
		}
		
		openRequest.onerror = function(e) {
			hello_el.append("Error :(")
		}
	}	
	
},false);

//Creates some sample data
function getColourData() {
	var colours = {};
	colours['red'] = {
		name:"red"
		hex:"FF0000"
	}
	colours['orange'] = {
		name:"orange"
		hex:"FFA500"
	}
	colours['yellow'] = {
		name:"yellow"
		hex:"FFFF00"
	}
	colours['green'] = {
		name:"green"
		hex:"008000"
	}
	colours['blue'] = {
		name:"blue"
		hex:"0000FF"
	}
	colours['purple'] = {
		name:"purple"
		hex:"800080"
	}
}
	