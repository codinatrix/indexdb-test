document.addEventListener("DOMContentLoaded", function() {
	
	var idbSupported = false;
	var hello_el = $("#hello");
	
	if("indexedDB" in window) {
		idbSupported = true;
		hello_el.text("indexedDB is supported. ")
	} else {
		idbSupported = false;
		hello_el.text("indexedDB is not supported.")
	}
	
	if (idbSupported) {
		var openRequest = indexedDB.open("testdb", 1) //Parameters db name and version
		
		openRequest.onupgradeneeded = function(e) {
			hello_el.append("Upgrading...");
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
	

