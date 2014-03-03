// Config RequireJs
requirejs.config({
    //By default load any module IDs from lib
    baseUrl: 'lib',
    //except, if the module ID starts with "app",
    //"model" or "view" load it from the 
    //corresponding js/ directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        app: '../js/app',
        model: '../js/model',
        view: '../js/view'
    },
    shim: {
	    'underscore': {
	      	exports: '_'
	    },
	    'backbone': {
	      	deps: ["underscore", "jquery"],
	      	exports: 'Backbone'
	    }
  	}
});

// Start the main app logic.
requirejs(
	['jquery', 
	 'underscore',
	 'json2',
	 'backbone',
	 'mustache',
	 'app/app'
	 ],
	 
	function ($, _, JSON, Backbone, Mustache, App) {
	    //jQuery, canvas and the app/sub module are all
	    //loaded and can be used here now.
	    new App({
	    	el: $('#application')
		});
	}
);