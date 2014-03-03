/**
 * Application controller view
 * Starts application, inits a new CommentCollection collection, assigns the empty list to 
 * a CommentlistView controller, also inits a NewButtonView instance to handle new comment insertion.
 * 
 * Check index.html to find the place where App is initialized, it's right after the container
 * DOM node is rendered.
 *
 * @class App
 * @extends Backbone.View
 * @author Bodnar Istvan <istvan@gawker.com>
 */
/*global CommentCollection, CommentlistView, FormView, NewButtonView, RandomButtonView */

/**
 * In lieu of adding additional comments about performance optimization, as that is not my specialty, 
 * I have instead removed all html from the js and reworked the markup to be more semantic.
 * In addition, I have improved the user experience to be more intuitive and less jarring,
 * as well as enhanced the design, look and feel and added a custom icon font.  
 * Let me know if you have any questions.  
 * Thanks! 
 * Lynn
 * lynn@lynnwashere.com
 */




define(
	['backbone',
	 'model/commentcollection',
	 'view/listview',
	 'view/formview',
	 'view/newbuttonview',
	 'view/randombuttonview'
	 ],
	function (Backbone, CommentCollection, CommentlistView, FormView, NewButtonView, RandomButtonView) {
			
		var App = Backbone.View.extend(
		/** @lends App.prototype */
			{
				/**
				 * Initialize new application instance
				 */
				initialize: function () {
					
					// create empty comment collection
					var collection = new CommentCollection();
				
					// bind the NewButtonView to the already rendered 'newcomment' DOM element, we'll need to know the
					// collection to work with so FormView can insert the new comment properly
					new NewButtonView({collection: collection, el: this.$el.find('.newcomment')});
					
					// bind the RandomButtonView to the already rendered 'randomcomment' DOM element
					new RandomButtonView({collection: collection, el: this.$el.find('.randomcomment')});
		
					// create comment list view, assign our empty collection
					var listview = new CommentlistView({collection: collection, el: this.$el.find('.commentlist')});
					listview.render();
					
					$('.randomcomment').trigger('click');
				}
			}
		);
		
		return App;
	}
);


/**
 * Documentation related comments
 */
/**
 * @name Backbone
 * @class Backbone
 * Application is a Backbone based application
 * @link http://documentcloud.github.com/backbone/
 */


/**
 * @name Backbone.Model
 * @class Backbone.Model
 * Backbone model superclass
 * @link http://documentcloud.github.com/backbone/
 */

/**
 * @name Backbone.Collection
 * @class Backbone.Collection
 * Backbone collection superclass
 * @link http://documentcloud.github.com/backbone/
 */

/**
 * @name Backbone.View
 * @class Backbone.View
 * By default all views extend Backbone.View
 * @link http://documentcloud.github.com/backbone/
 */

 