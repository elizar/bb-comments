(function (w, $, Backbone, _) {

  'use strict';

  var Comment = Backbone.Model.extend({idAttribute: '_id'}),
  Comments = Backbone.Collection.extend({
    model: Comment,
    url: 'http://localhost:9090/comments'
  });

  var CommentView = Backbone.View.extend({

    tagName: 'li',
    template: $('#comment-template').html(),
    initialize: function () {
      var self = this;
      self.listenTo(self.model, 'change:votes', self.render);
    },
    events: {
      'click .upvote': 'handleUpVote',
      'click .delete': 'handleDelete'
    },
    handleUpVote: function () {
      var self = this;
      self.model.sync('update', self.model, {
        success: function (c) {
          if (c.error || c.errors) {
            return false;
          }
          return self.model.set(c);
        }
      });
    },
    handleDelete: function () {
      var self = this;
      self.model.sync('delete', self.model, {
        success: function (c) {
          self.model.collection.remove(self.model);
          self.removeView();
        }
      });
    },
    render: function (e) {
      if (e && e.preventDefault) {
        e.preventDefault();
      }
      var _tmpl = _.template(this.template);
      this.$el.html(_tmpl(this.model.toJSON()));
      return this;
    },
    removeView: function () {
      this.$el.hide(300, function () {
        this.remove();
      });
    }

  });

  var AppView = Backbone.View.extend({
    el: '#comments',
    events: {
      'submit form': 'handleSubmit'
    },
    initialize: function () {
      var self = this;
      self.comment_list = $('#comment_list');
      self.author = $('form input[name=author]');
      self.comment = $('form textarea');
      self.comment_count = $('#comment_count');

      self.listenTo(self.collection, 'add', self.addComment);
      self.listenTo(self.collection, 'all', self.render);

    },
    handleSubmit: function (e) {
      var self = this;
      e.preventDefault();
      var commentEntry = {};
      commentEntry.author = self.author.val().trim();
      commentEntry.comment = self.comment.val().trim();
      commentEntry.votes = 0;
      self.collection.add(commentEntry);
    },
    render: function (e) {
      var self = this;
      self.comment_count.text(self.collection.length);
    },
    addComment: function (comment) {
      var self = this;
      if (comment.get('_id')) {
        // handle db adding
        var view = new CommentView({
          model: comment
        });
        return self.comment_list.append(view.render().el);
      }
      self.collection.sync('create', comment, {
        success: function (c) {

          if (c.error || c.errors) {
            // remove temporarily added model
            return self.collection.remove(comment);
          }
          comment.set(c);
          var view = new CommentView({
            model: comment
          });

          // Reset input values
          console.log(comment);
          $('form input[type=text], form textarea').val('');
          self.comment_list.append(view.render().el);
        }
      });
    }
  });

  w.onload = function () {
    if (w.document.readyState === 'complete') {
      // Start the app
      var comments = new Comments();
      var app = new AppView({
        collection: comments
      });
      comments.fetch();
    }
  };
})(window, $, Backbone, _);
