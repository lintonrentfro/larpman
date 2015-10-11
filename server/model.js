Meteor.publish("characters", function(){
	return characters.find();
});
Meteor.publish("templates", function(){
    return templates.find();
});
Meteor.publish("larps", function(){
    return larps.find();
});