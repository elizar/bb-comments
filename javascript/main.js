(function() {
	// prevent global chaos
  'use strict';

  var Comment = Backbone.Model.extend({}),
      Comments = Backbone.Collection.extend({
    model: Comment,
    url: 'http://localhost:3000/comments'
  });

  var CommentView = Backbone.View.extend({

    tagName: 'li',

    template: $('#comment-template').html(),

    initialize: function() {
      var self = this;
      self.listenTo(self.model, 'all', self.render);
    },

    events: {
      'click .upvote': 'handleUpVote',
      'click .delete': 'handleDelete'
    },

    handleUpVote: function() {

    },

    handleDelete: function() {
      var self = this;
      self.model.collection.sync('delete', self.model, {
        success: function(c) {
          self.removeView();
        }
      });
    },

    render: function(e) {
      if (e && e.preventDefault) {
        e.preventDefault();
      }
      var _tmpl = _.template(this.template);
      this.$el.html(_tmpl(this.model.toJSON()));
      return this;
    },

    removeView: function() {
      this.$el.hide(300, function() {
        this.remove();
      });
    }


  });

  var AppView = Backbone.View.extend({
    el: '#comments',

    events: {
      'submit form': 'handleSubmit'
    },

    initialize: function() {
      var self = this;
      self.comment_list = $('#comment_list');
      self.author = $('form input[name=author]');
      self.comment = $('form textarea');
      self.comment_count = $('#comment_count');

      self.listenTo(self.collection, 'add', self.addComment);
    },

    handleSubmit: function(e) {
      var self = this;
      e.preventDefault();
      var commentEntry = {};
      commentEntry.author = self.author.val().trim();
      commentEntry.comment = self.comment.val().trim();
      commentEntry.votes = 0;
      self.collection.add(commentEntry);
    },

    addComment: function(comment) {
      var self = this;
      if (comment.get('_id')) {
        // handle db adding
        var view = new CommentView({
          model: comment
        });
        return self.comment_list.append(view.render().el);
      }
      self.collection.sync('create', comment, {
        success: function(c) {
          console.log(c);
          if (c.error || c.errors) {
            // remove temporarily added model
            return self.collection.remove(comment);
          } else {

            // Don't have to fetch from server anymore just
            var view = new CommentView({
              model: comment
            });

            // Reset input values
            $('form input[type=text], form textarea').val('');
            self.comment_list.append(view.render().el);
            return;

          }
        }
      });
    }
  });

  window.onload = function() {
    if (document.readyState === 'complete') {
      // Start the app
      var comments = new Comments();
      var app = new AppView({
        collection: comments
      });
      comments.fetch();
    }
  };
})();
