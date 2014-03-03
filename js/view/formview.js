/**
 * Comment form controller and view
 *
 * @class FormView
 * @extends Backbone.View
 * @author Bodnar Istvan <istvan@gawker.com>
 */
/*global Mustache, CommentView, CommentModel */

define(["backbone","view/commentview"], function(Backbone, CommentView) {
	var FormView = Backbone.View.extend(
	/** @lends FormView.prototype */
		{
			/**
			 * Html tag name of the container element that'll be created when initializing new instance.
			 * This container is then accessible via the this.el (native DOM node) or this.$el (jQuery node)
			 * variables.
			 * @type String
			 */
			tagName: 'div',
		
			/**
			 * CSS class name of the container element
			 * @type String
			 */
			className: 'commentform edit-comment',
			
			/**
			 * The map of delegated event handlers
			 * @type Object
			 */
			events: {
				'click .submit': 'submitBtn',
				'click .cancel': 'cancelBtn',
				'click .yes': 'yesBtn',
				'click .no': 'noBtn'
			},
			
			/**
			 * View init method, subscribing to model events
			 */
			initialize: function () {
				this.model.on('update', this.updateFields, this);
				this.model.on('clear', this.remove, this);
			},
			
			/**
			 * Render form element from a template using Mustache
			 * @returns {FormView} Returns the view instance itself, to allow chaining view commands.
			 */
			render: function () {
				var template = $('#form-template').text(),
					$appWrapper = $('#application'),
					template_vars = {
						author: this.model.get('author'),
						text: this.model.get('text'),
						title: this.model.get('title'),
						wrapperClass: this.model.get('wrapperClass')
					};
				this.$el.html(Mustache.to_html(template, template_vars)).hide();
				this.$el.fadeIn();
				
				// addclass formOpen to application wrapper
				$appWrapper.addClass('form-open');
				
				return this;
			},
		
			/**
			 * Submit button click handler
			 * Sets new values from form on model, triggers a success event and cleans up the form
			 * @returns {Boolean} Returns false to stop propagation
			 */
			submitBtn: function (e) {
				e.preventDefault();
				 
				var name = this.$el.find('.author').val(),
					text = this.$el.find('.text').val();
				
				if (name === '' || text === '') {
					// variables
					var $notification = $('.notification'),
						icon = '<span class="icon icon-warning"></span>',
						errorText = 'Whoops!  You must enter both a name and comment.';
						
					$notification.html(icon + errorText).addClass('error').fadeIn('slow');
					
				} else {
					// set values from form on model
					this.model.set({
						author: name,
						text: text
					});
					
					// set an id if model was a new instance
					// note: this is usually done automatically when items are stored in an API
					if (this.model.isNew()) {
						this.model.id = Math.floor(Math.random() * 1000);
					}
					
					// trigger the 'success' event on form, with the returned model as the only parameter
					this.trigger('success', this.model);
					
					// trigger the 'clear' event to trigger the remove method
					this.model.trigger('clear', this);
					
				}
			},
			
			/**
			* Cancel button click handler
			* Cleans up form view from DOM
			* @returns {Boolean} Returns false to stop propagation
			*/
			cancelBtn: function (e) {
				e.preventDefault();
				
				var text = this.$el.find('.text').val(),
					author = this.$el.find('.author').val(), 
					title = this.$el.find('.title').html(),
					createTitle = 'New Comment';
				
				// if the text and author fields are empty
				// or this is a New Comment, remove the node from the DOM	
				if (text === '' && author === '' || title === createTitle){

					// trigger the 'clear' event to trigger the remove method
					this.model.trigger('clear', this);
				
				} else {
				// Otherwise this is an Edit Comment
				
					// set values from form on model
					this.model.set({
						author: author,
						text: text
					});
					
					// trigger the 'cancel' event on form, 
					// with the returned model form as the only parameter
					this.trigger('cancel', this.$el);
					
				}
			},
			
			/**
			* No button click handler
			* Cleans up form view from DOM
			* @returns {Boolean} Returns false to stop propagation
			*/
			noBtn: function (e) {
				e.preventDefault();
				
				// trigger the 'cancel' event on form, with the returned model form as the only parameter
				this.trigger('cancelNo', this.$el);
			},
			
			/**
			* Yes button click handler
			* Cleans up form view from DOM
			* @returns {Boolean} Returns false to stop propagation
			*/
			yesBtn: function (e) {
				e.preventDefault();
				var self = this,
					$editOpen = $('.edit-comment'),
					appWrapper = $('#application'),
					$editParentComment = this.$el.closest('.comment'),
					$createComment = $('.create-comment');
					
				if ( $editOpen.length === 0 ) {
				
					console.log('yesBtn if');
					this.$el.fadeOut(400, function() {
						// trigger the 'clear' event to trigger the remove method
						self.model.trigger('clear', self);
					});
					
				} else {
					console.log('yesBtn else');
					// removeClass formOpen to application wrapper
					appWrapper.removeClass('form-open');
					
					this.model.id = undefined;
					this.model.trigger('clear', this);
					
					if ($createComment === 0 ){
						$editParentComment.remove();
					}
				}
			},
			
			
			/**
			 * Update view if the model changes, helps keep two edit forms for the same model in sync
			 * @returns {Boolean} Returns false to stop propagation
			 */
			updateFields: function (e) {
				// update the fields
				e.find('.byline').html(this.model.get('author'));
				e.find('.text').html(this.model.get('text'));
				return false;
			},
			
			/**
			 * Override the default view remove method with custom actions
			 */
			remove: function () {
				var appWrapper = $('#application');
				
				// removeClass formOpen to application wrapper
				appWrapper.removeClass('form-open');
				
				
				// delete container form DOM
				this.$el.remove();
				
				// unsubscribe from all model events with this context
				this.model.off(null, null, this);
				
				// call backbones default view remove method
				Backbone.View.prototype.remove.call(this);
				
			}
		}
	);

	return FormView;
});