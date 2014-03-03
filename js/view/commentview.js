/**
 * Comment controller and view
 * DOM event and comment model event handlers should live here.
 * This view handles comment edit, delete and the sample text reverse actions, also
 * listens to model change and destroy events to update the view in DOM.
 *
 * @class CommentView
 * @extends Backbone.View
 * @author Bodnar Istvan <istvan@gawker.com>
 */
/*global Mustache, FormView */
define(["backbone","view/formview"], function(Backbone, FormView) {
	var CommentView = Backbone.View.extend(
	/** @lends CommentView.prototype */
		{
			/**
			 * Html tag name of the container element that'll be created when initializing new instance.
			 * This container is then accessible via the this.el (native DOM node) or this.$el (jQuery node)
			 * variables.
			 * @type String
			 */
			tagName: 'li',
		
			/**
			 * CSS class name of the container element
			 * @type String
			 */
			className: 'comment',
			
			/**
			 * The map of delegated event handlers
			 * @type Object
			 */
			 events: {
				'click .edit': 'edit',
				'click .delete': 'delete',
				'click .reverse': 'reverse'
			},
			
			/**
			 * View init method, subscribing to model events
			 */
			initialize: function () {
				this.model.on('success', this.render, this);
				this.model.on('destroy', this.remove, this);
			},
			
			/**
			 * Render the new comment DOM element from a template using Mustache
			 * @returns {CommentView} Returns the view instance itself, to allow chaining view commands.
			 */
			render: function () {
				// template is rendered in the main html, inside a <script /> tag with the specified id
				var template = $('#comment-template').text();
	
				// variables passed to the template for rendering
				var template_vars = {
					author: this.model.get('author'),
					text: this.model.get('text')
				};
				
				// set the inner html of the container element to the Mustache rendered output
				this.$el.html(Mustache.to_html(template, template_vars)).hide();
				this.$el.fadeIn();

				return this;
			},
			
			/**
			 * Edit button click handler
			 * @returns {Boolean} Returns false to stop propagation
			 */
			edit: function (e) {
				e.preventDefault();
				
				var $formOpen = $('.form-open'),
					$createCommentOpen = $('.create-comment');
				
				if ( $formOpen.length === 0 || $createCommentOpen.length > 0 ) {

					if ($createCommentOpen.length > 0) {						
						console.log('hi')
						$('.cancel').trigger('click');
						setTimeout(function(){
							$(this).trigger('edit');
						}, 500);
						$('body,html').animate({ scrollTop: 0 }, 800);
					}
					
					// create new FormView instance to edit the comment
					var formview = new FormView({model: this.model}),
						author = this.$el.find('.byline').html(),
						text = this.$el.find('.text').html();
					
					// reset the field when edit is opened again
					this.model.set({
						author: author,
						text: text
					});
					
					// insert FormView instance after the comment container
					this.$el.append(formview.render().$el);
					
					// listen to save success event to handle successful form submit event
					formview.on('success', this.handleEditSuccess, this);
					
					// listen to cancel event to handle cancel form submit event
					formview.on('cancel', this.handleEditCancel, this);
					
					// listen to cancel no event to handle cancel form submit event
					formview.on('cancelNo', this.handleCancelNo);
					
				}				

			},
			
			/**
			 * Delete button click handler
			 * @returns {Boolean} Returns false to stop propagation
			 */
			delete: function (e) {
				e.preventDefault();
				var $formOpen = $('.form-open'), 
					$createCommentOpen = $('.create-comment');
				
				if ( $formOpen.length === 0 || $createCommentOpen.length > 0 ) {
					console.log('comment open');
					// delete model from memory
					this.model.id = undefined;
					this.model.destroy();
					
				} else {
				
					this.handleEditCancel(this.model);
					
				}
	
				// note: since the view is subscribed to the models 'destroy' event, view will be also removed
				// automatically, no need to delete container form DOM
			},
			
			/**
			 * "Reverse" button click handler
			 * @returns {Boolean} Returns false to stop propagation
			 */
			 reverse: function (e) {
				e.preventDefault();
				
				// run the models sample text reverse method
				this.model.reverseText();
			},
			
			/**
			 * Handles form save success event of the Edit Comment form
			 * @params {CommentModel} model Model returned by successful comment "save" action
			 */
			handleEditSuccess: function (model) {
				
				// create a new update that is removed after 5 seconds
				var update = this.$el.find('.update'),
					icon = '<span class="icon icon-checkmark"></span>',
					updateText = 'Comment by ' + model.get('author') + ' is saved.';

				this.model.trigger('update', this.$el);
				// append notification to edited comments container element
				update.html(icon + updateText).addClass('error').fadeIn('fast', function(){
					// remove notification after 5 seconds
					setTimeout(function () {
						update.fadeOut('slow');
					}, 5000);
				});		
			},
			
			/**
			 * Handles form cancel event of the Edit Comment Form
			 * @params FormView returned by cancel comment "cancel" action
			 */
			handleEditCancel: function (form) {
				
				// variables
				var $notification = $('.notification'),
					icon = '<span class="icon icon-warning"></span>',
					errorText = 'Are you sure you wanna cancel your changes?',
					$btnsSubmitCancel = $('.btns-submit-cancel'),
					$btnsYesNo = $('.btns-yes-no');
				
				// change the form buttons
				$btnsSubmitCancel.fadeOut('slow', function() {
					// fade in the notification
					$notification.html(icon + errorText).addClass('error').fadeIn('slow');
					$btnsYesNo.fadeIn('slow');
				});
				
				return false;
			},
			
			/**
			 * Handles form cancel No event of the Edit Comment Form "Cancel" Btn
			 */
			handleCancelNo: function () {
				var $notification = $('.notification'),
					$btnsSubmitCancel = $('.btns-submit-cancel'),
					$btnsYesNo = $('.btns-yes-no');
				
				
				$notification.fadeOut(400).removeClass('error');
				$btnsYesNo.fadeOut(400, function() {					
					// change the form buttons
					$btnsSubmitCancel.fadeIn();
				});
				
				return false;
			},

			
			/**
			 * Override the default view remove method with custom actions
			 */
			remove: function () {
				
				// remove container element from DOM
				this.$el.fadeOut(400, function() {
					$(this).remove();
				});
			}
		}
	);

	return CommentView;
});