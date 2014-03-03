/**
 * New comment creation button
 *
 * @class NewButtonView
 * @extends Backbone.View
 * @author Bodnar Istvan <istvan@gawker.com>
 */
/*global CommentModel, FormView */

define(["backbone","model/commentmodel","view/formview"], function(Backbone, CommentModel, FormView) {
	var NewButtonView = Backbone.View.extend(
	/** @lends NewButtonView.prototype */
		{	
			
			/**
			 * The map of delegated event handlers
			 * @type Object
			 */
			events: {
				'click': 'handleClick'
			},
			
			/**
			 * Initialize view, make sure button has a comment collection to work with
			 */
			initialize: function () {
				if (this.collection === undefined) {
					throw 'NoCollectionDefined';
				} else {
					this.collection.on('createComment', this.createComment, this);
				}
			},
			
			handleClick: function(e) {
				e.preventDefault();
				var $formOpen = $('.form-open'),
					$editOpen = $('.edit-comment');
				
 				if ($formOpen.length === 0 ){
 				
					this.collection.trigger('createComment', this);
					
				} else if ($editOpen.length > 0) {
					
					$('.yes').trigger('click');
					this.collection.trigger('createComment', this);
					$('body,html').animate({ scrollTop: 0 }, 800);
				}
				
			},
			
			/**
			 * Click event handler that first creates a new empty comment model, and assigns the model to a FormView instance.
			 * FormView will handle internally new comment creation and existing comment editing.
			 * @returns {Boolean} Returns false to stop propagation
			 */
			createComment: function () {
								
				// create new comment model
				var comment = new CommentModel({}),
					// init FormView
					formview = new FormView({model: comment}),
					$bodySection = $('.body');
				
				// render form view right after new button
				// if a comment form does not already exist
				$bodySection.prepend(formview.render().$el);
				
				var newTitle = 'New Comment',
					title = formview.$el.find('.title').html(newTitle),
					wrapperClass = formview.$el.removeClass('edit-comment').addClass('create-comment');
					
				formview.model.set({
					title: title,
					wrapperClass: wrapperClass
				});
				
				// add saved model to collection after form was submitted successfully
				formview.on('success', this.handleFormSuccess, this);
				
				// finally, return false to stop event propagation
				return false;
			},
			
			/**
			 * Method to handle FormView success event
			 * @param {CommentModel} model Model data returned by FormViews save request
			 */
			handleFormSuccess: function (model) {
				this.collection.add(model);
			}
		
		}
	);

	return NewButtonView;
});