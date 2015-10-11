characters = new Meteor.Collection("characters");
characters.allow({
    insert: function (userId, doc) {
        return true;
    },
    update: function(userId, doc) {
        return true;
    },
    remove: function(userId, doc) {
        return true;
    }
});
templates = new Meteor.Collection("templates");
templates.allow({
    insert: function (userId, doc) {
        return true;
    },
    update: function(userId, doc) {
        return true;
    },
    remove: function(userId, doc) {
        return true;
    }
});
larps = new Meteor.Collection("larps");
larps.allow({
    insert: function (userId, doc) {
        return true;
    },
    update: function(userId, doc) {
        return true;
    },
    remove: function(userId, doc) {
        return true;
    }
});

