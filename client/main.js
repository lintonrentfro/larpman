/*
 Startup
 */
Session.set("view_home",1);

/*
 Global Template Helpers
 */
 Handlebars.registerHelper("home", function() {
    if(Session.get("view_home")) {
        return true;
    };
});
Handlebars.registerHelper("connected", function() {
    return Meteor.status().connected;
});
Handlebars.registerHelper("characters", function() {
    if(Meteor.user()){
        var pcs = characters.find(
            {
                "owner" : Meteor.userId()
            }
        );
        if(pcs.count() > 0){
            return pcs;
        }
    };
});
Handlebars.registerHelper("my_larps_running", function() {
        var your_larps = larps.find(
            {
                "owner" : Meteor.userId()
            }
        );
        if(your_larps.count() > 0) {
            return your_larps;
        };
    
});
Handlebars.registerHelper("running_larp", function() {
    if(Session.get("running_larp")) {
        return larps.findOne(
            {
                "_id" : Session.get("running_larp")._id
            }
        );
    };
});
Handlebars.registerHelper("join_larp", function() {
    if(Session.get("join_larp")) {
        return Session.get("join_larp");
    };
});
Handlebars.registerHelper("pc", function() {
    if(Session.get("template")) {
        if(Session.get("pc")) {
            var pc = Session.get("pc");
            pc.html = lm_app.pcs.html(Session.get("template"),Session.get("pc"));
            return pc;
        };
    };
});
Handlebars.registerHelper("new_game", function() {
    if(Session.get("new_game")) {
        return true;
    };
});
Handlebars.registerHelper("make_template", function() {
    if(Session.get("make_template")) {
        return true;
    };
});

/*
 Global Key/Value Helper
 */
Handlebars.registerHelper('key_value', function(context, options) {
    var result = [];
    _.each(context, function(value, key, list) {
        result.push({key:key, value:value});
    });
    return result;
});

/*
 Nav
 */
 Template.nav.helpers({
    is_admin: function () {
        if(Meteor.user().username == 'larp_admin') {
            return 1;
        };
    },
    blank_sheets: function () {
        var blank_sheets = templates.find();
        if(blank_sheets.count() > 0) {
            return blank_sheets;
        };
    },
    larps_to_join: function () {
        var user = Meteor.user();
        if (user && user.username) {
            var larps_to_join = larps.find(
                {
                    "players.accepted" : 
                        { 
                            $ne : 
                                { 
                                    "id" : Meteor.userId(),
                                    "name" : user.username
                                }
                        },
                    "owner" : 
                        {
                            $ne : Meteor.userId()
                        }
                }
            );
            if(larps_to_join.count() > 0) {
                return larps_to_join;
            };
        };
    },
    my_templates: function () {
        if(Meteor.user().username == 'larp_admin') {
            var my_templates = templates.find(
                {
                    "owner" : Meteor.userId()
                }
            );
            if(my_templates.count() > 0) {
                return my_templates;
            };
        };
    }
});


Template.nav.events({
    "click #go_home" : function() {
        lm_app.router.nav("home");
    },
    "click #make_template" : function() {
        lm_app.router.nav("make_template");
    },
    "click .make_pc_from_template" : function() {
        var num_fields = this.data.length;
        var pc_fields = [];
        for(var i=0;num_fields>i;i++) {
            pc_fields[i] = "";
        };
        characters.insert(
            {
                "template" : this._id,
                "owner" : Meteor.userId(),
                "name" : prompt("Name"),
                "larp" : "",
                "location" : "",
                "data" : pc_fields
            }
        );
    },
    "click .load_character" : function() {
        var char = this;
        lm_app.router.clear(function() {
            Session.set("pc",char);
            var template = templates.findOne(
                {
                    "_id" : Session.get("pc").template
                }
            );
            Session.set("template",template);
        });
    },
    "click .remove_template" : function() {
        var template = this;
        lm_app.router.clear(function() {
            if(prompt("Enter 'yes' to delete character sheet.") == 'yes') {
                var template_id = template._id;
                templates.remove(
                    {
                        "_id" : template_id
                    }
                );
            };
        });
    },
    "click .make_larp" : function() {
        var template = this;
        lm_app.router.clear(function() {
            Session.set("template",template);
            Session.set("new_game",true);
        });
    },
    "click .my_larps_running" : function() {
        var larp = this;
        lm_app.router.clear(function() {
            Session.set("running_larp",larp);
        });
    },
    "click .join_larp" : function() {
        var larp = this;
        lm_app.router.clear(function() {
            Session.set("join_larp",larp);
        });
    }
});

/*
 New Game
 */
Template.new_game.events({
    "click #create_larp" : function() {
        var larp_name = document.getElementById('larp_name').value;
        var larp_desc = document.getElementById('larp_desc').value;
        larps.insert(
            {
                "owner" : Meteor.userId(),
                "title" : larp_name,
                "description" : larp_desc,
                "players" : 
                    {
                        "pending" : [],
                        "accepted" : []
                    },
                "locations" : []
            }
        );
        Session.set("new_game",null);
    }
});

/*
 Running the LARP
 */
Handlebars.registerHelper("gm_view_pc", function() {
    if(Session.get("gm_view_template")) {
        if(Session.get("gm_view_pc")){
            var pc = Session.get("gm_view_pc");
            pc.html = lm_app.pcs.gm_view_html(Session.get("gm_view_template"),Session.get("gm_view_pc"));
            pc.data = Session.get("gm_view_pc");
            return pc;
        };
    };
});
Template.running_larp.helpers({
    location_data: function () {
        var locations = function() {
            return larps.findOne
                (
                    {
                        "_id" : Session.get("running_larp")._id
                    }
                ).locations;
        };
        var add_pcs = function(data) {
            var new_array = [];
            for(var i=0;data.length > i;i++) {
                var player_array = characters.find
                    (
                        {
                            "larp" : Session.get("running_larp")._id,
                            "location" : data[i].name
                        }
                    ).fetch();
                new_array[i] = {
                    "name" : data[i].name,
                    "count" : characters.find
                        (
                            {
                                "location" : data[i].name
                            }
                        ).count(),
                    "description" : data[i].description,
                    "messages" : data[i].messages,
                    "players" : player_array
                };
            };
            return new_array;
        };
        return add_pcs(locations());
    },

    expanded_location_view: function() {
        if(Session.get("expand_location")) {
            return Session.get("expand_location");
        };
    }
});

Template.edit_location_status_form.helpers({
    active_loc_data: function () {
        if(Session.get("running_larp_location")) {
            return Session.get("running_larp_location").value;
        };
    }
});


Template.running_larp.events({
    "click .expand_location" : function() {
        if(Session.get("expand_location")) {
            if(Session.get("expand_location").name === this.name) {
                Session.set("expand_location",null);
            } else {
                Session.set("expand_location",this);
            };
        } else {
            Session.set("expand_location",this);
        };
    },
    "click .pc_detail" : function() {
        Session.set("gm_view_pc",this);
        Session.set("gm_view_template",templates.findOne({"_id":Session.get("gm_view_pc").template}));
    },
    "click #close_gm_view_pc" : function() {
        Session.set("gm_view_pc",null);
        Session.set("gm_view_template",null);
    },
    "click #update_larp" : function() {
        Session.set("edit_larp", null);
        var desc = document.getElementById('larp_description').value;
        var loc_speed = document.getElementById('location_speed').value;
        larps.update(
            {
                "_id" : Session.get("running_larp")._id
            },
            {
                $set :
                    {
                        "description" : desc,
                        "loc_speed" : loc_speed
                    }
            }
        );
    },
    "click #delete_larp" : function() {
        Session.set("edit_larp", null);
        if(prompt("Enter \"yes\" to Delete") == "yes") {
            larps.remove(
                {
                    "_id" : Session.get("running_larp")._id
                }
            );
        };
    },
    "click #edit_larp" : function() {
        Session.set("edit_larp", 1);
    },
    "click #edit_description" : function() {
        var larpID = Session.get("running_larp")._id;
        var locName = Session.get("running_larp_location").value.name;
        var locs = larps.findOne(
            {
                "_id" : larpID
            }
        ).locations;
        var locKey = function() {
            return lm_app.getKeyByValue(locs, locName);
        };

        var current_desc = function() {
            var old_desc = larps.findOne(
                {
                    "_id" : Session.get("running_larp")._id
                }
            );
            if(old_desc.locations[locKey()].desc){
                return old_desc.locations[locKey()].desc;
            } else {
                return "";
            };
        };

        var field = "locations." + locKey() + ".desc";
        var obj = {};
        obj[field] = prompt("Location Description: ", current_desc());
        larps.update(
            {
                _id: larpID
            },
            {
                $set: obj
            }
        );
    },
    "click #delete_location" : function() {
        if(prompt('Enter the word "yes" to delete this location') === "yes") {
            var loc = Session.get("running_larp_location").name;
            larps.update(
                {
                    "_id" : Session.get("running_larp")._id
                },
                { 
                    $pull :
                        { 
                            "locations" : 
                                {
                                    "name" : loc 
                                }
                        }
                }
            );
            Session.set("running_larp_location", null);
        };
    },
    "click #add_location" : function() {
        var larp_id = Session.get("running_larp")._id
        var location_name = prompt("Location Name");
        if(location_name) {
            var new_location = {
                "name" : location_name
            };
            larps.update(
                {
                    "_id" : larp_id
                },
                { 
                    $push : 
                        { 
                            "locations" : new_location
                        }
                }
            );
        };
    },
    "click .location" : function() {
        Session.set("running_larp_location",this);
        Session.set("sending_message", null);
    },
    "click #edit_location_status" : function() {
        Session.set("edit_location_status","1");
    },
    "click #message_location" : function() {
        var messaging = {
            "larp" : Session.get("running_larp"),
            "location" : Session.get("running_larp_location")
        };
        Session.set("sending_message", messaging);
        Session.set("running_larp_location",null);
    },
    "click .player_reject" : function() {
        larps.update(
            {
                "_id" : Session.get("running_larp")._id
            },
            {
                $pull :
                    {
                        "players.pending" : this.id
                    }
            }
        );
    },
    "click .player_accept" : function() {
        larps.update(
            {
                "_id" : Session.get("running_larp")._id
            },
            {
                $pull: 
                    {
                        "players.pending" : 
                            {
                                "id" : this.id
                            }
                    }
            }
        );
        var accepted = {
            "id" : this.id,
            "name" : this.name
        };
        larps.update(
            {
                "_id" : Session.get("running_larp")._id
            },
            {
                $push: 
                    {
                        "players.accepted" : accepted
                    }
            }
        );
    },
    "click .player_boot" : function() {
        if(prompt('Enter the word "kick" to kick this player') === "kick") {
            larps.update(
                {
                    "_id" : Session.get("running_larp")._id
                },
                {
                    $pull:
                        {
                            "players.accepted" :
                                {
                                    "id" : this.id
                                }
                        }
                }
            );
        };
    }
});

/*
 Update Location Status
 */
Template.edit_location_status_form.events({
    "click #update_location_status" : function() {
        var new_status = document.getElementById('new_status').value;
        var larpID = Session.get("running_larp")._id;
        var locName = Session.get("running_larp_location").value.name;
        var locs = larps.findOne(
            {
                "_id" : larpID
            }
        ).locations;
        var locKey = function() {
            return lm_app.getKeyByValue(locs, locName);
        };
        var field = "locations." + locKey() + ".stat";
        var obj = {};
        obj[field] = new_status;
        larps.update(
            {
                "_id" : larpID
            },
            {
                $set : obj
            }
        );
        Session.set("edit_location_status",null);
    },
});

/*
 Send Message
 */
Template.compose_message.events({
    "click #send_message" : function() {
        var location = Session.get("sending_message").location;
        // if the form is not empty
        if(document.getElementById('message_content').value != "") {
            var larp = Session.get("sending_message").larp._id;
            var message = {
                "message" : document.getElementById('message_content').value,
                "location" : location.value.name
            };
            // the characters who were in the location at this time
            var target_pcs = characters.find(
                {
                    "larp" : larp,
                    "location" : location.value.name
                },
                {
                    "_id" : 1
                }
            ).fetch();
            // an array of those character _ids
            var pc_ids = [];
            for(var i=0;target_pcs.length > i;i++) {
                pc_ids[i] = target_pcs[i]._id;
            };
            // send them the message
            for(var i=0;target_pcs.length > i;i++) {
                var pc_id = target_pcs[i]._id;
                characters.update(
                    {
                        "_id" : pc_id
                    },
                    {
                        $push:
                            {
                                "messages" : message
                            }
                    }
                );
            };
            // send a copy of the message to the larp document
            larps.update(
                {
                    "_id" : larp
                },
                {
                    $push:
                        {
                            "messages" : message
                        }
                }
            );
        };
        // change the session to change user's view back to currently viewed location
        Session.set("running_larp_location",location);
        Session.set("sending_message", null);
    }
});

/*
Playing a character.
 */
Template.sheet.helpers({
    sheet: function () {
        if(Session.get("pc_view") == "sheet") {
            return "btn-primary";
        };
    },
    locations: function () {
        if(Session.get("pc_view") == "locations") {
            return "btn-primary";
        };
    },
    messages: function () {
        if(Session.get("pc_view") == "messages") {
            return "btn-primary";
        };
    },
    set_larp: function () {
        if(Session.get("pc").larp === "") {
            if(Session.get("set_larp") == "set_larp") {
                return true;
            } else {
            return false;
            };
        } else {
            return false;
        };
    },
    location_data: function () {
        if(Meteor.user().username == 'larp_admin') {
            var locations = function() {
                return larps.findOne(
                    {
                        "_id" : Session.get("pc").larp
                    }
                ).locations;
            };
            var add_pcs = function(data) {
                var new_array = [];
                for(var i=0;data.length > i;i++) {
                    new_array[i] = {
                        "key" : i,
                        "name" : data[i].name,
                        "count" : characters.find({"location" : data[i].name}).count(),
                        "description" : data[i].description
                    };
                };
                return new_array;
            };
            return add_pcs(locations());
        } else {
            var still_accepted = larps.findOne(
                {
                    "_id" : Session.get("pc").larp,
                    "players.accepted" :
                        {
                            $elemMatch :
                            {
                                "id" : Session.get("pc").owner
                            }
                        }
                }
            );
            if(still_accepted) {
                var locations = function() {
                    return larps.findOne(
                        {
                            "_id" : Session.get("pc").larp
                        }
                    ).locations;
                };
                var add_pcs = function(data) {
                    var new_array = [];
                    for(var i=0;data.length > i;i++) {
                        new_array[i] = {
                            "key" : i,
                            "name" : data[i].name,
                            "count" : characters.find({"location" : data[i].name}).count(),
                            "description" : data[i].description
                        };
                    };
                    return new_array;
                };
                return add_pcs(locations());
            };
        };
    },
    location_pcs: function () {
        if(Session.get("pc").location) {
            return characters.find(
                {
                    "larp":Session.get("pc").larp,
                    "location":Session.get("pc").location
                }
            );
        };
    },
    sheet_pc: function () {
        return characters.findOne(
            {
                "_id" : Session.get("pc")._id
            }
        );
    },
    active_loc: function () {
        if(Session.get("pc").larp != ""){
            if(Session.get("pc").location != ""){
                return Session.get("pc").location;
            };
        };
    },
    sheet_larp: function () {
        if(Session.get("pc").larp != "") {
            var hasLarp = larps.findOne(
                {
                    "_id" : Session.get("pc").larp
                }
            );
            if(hasLarp) {
                return larps.findOne(
                    {
                        "_id" : Session.get("pc").larp
                    }
                );
            } else {
                characters.update(
                    {
                        "_id" : Session.get("pc")._id
                    },
                    {
                        $set :
                            {
                                "location":null,
                                "last_moved":null
                            }
                    }
                );
            };
        };
    },
    larp_info: function () {
        var this_pc = characters.findOne(
            {
                "_id" : Session.get("pc")._id
            }
        );
        var this_larp = larps.findOne(
            {
                "_id" : this_pc.larp
            }
        );
        var larp = {
            desc : this_larp.description,
            speed : this_larp.loc_speed
        };
        return larp;
    },
    message_data: function () {
        var this_pc = characters.findOne(
            {
                "_id" : Session.get("pc")._id
            }
        );
        var messages_array = [];
        if(this_pc.messages) {
            for(var i=0;this_pc.messages.length > i;i++) {
                messages_array[i] = {
                    location : this_pc.messages[i].location,
                    message : this_pc.messages[i].message
                };
            };
            return messages_array.reverse();
        };
    }
});

Template.sheet.events({
    "click .set_location" : function() {
        var min_time = larps.findOne(
            {
                "_id" : Session.get("pc").larp
            }
        ).loc_speed * 60000;
        var update = function(location) {
            var now = new Date();
            characters.update(
                {
                    "_id" : Session.get("pc")._id
                },
                {
                    $set :
                        {
                            "location" : location.name,
                            "last_moved" : now
                        }
                }
            );
            var char = characters.findOne(
                {
                    "_id" : Session.get("pc")._id
                }
            );
            Session.set("pc",char);
        };
        if(typeof Session.get("pc").last_moved != 'undefined') {
            var now = new Date();
            var last_moved = Session.get("pc").last_moved;
            if(now - last_moved < min_time) {
                alert("You have to spend at least " + min_time/60000 + "minute(s) in a location before moving.");
            } else {
                update(this);
            };
        } else {
            update(this);
        };
    },
    "click #set_larp" : function() {
        Session.set("set_larp","set_larp");
    },
    "click #pc_sheet" : function() {
        Session.set("pc_view","sheet");
    },
    "click #pc_locations" : function() {
        Session.set("pc_view","locations");
    },
    "click #pc_messages" : function() {
        Session.set("pc_view","messages");
    },
    "click #save_pc" : function() {
        var new_data = [];
        for(var i=0;Session.get("pc").data.length > i;i++) {
            var field = 'field_' + i;
            var element =  document.getElementById(field);
            if (typeof(element) != 'undefined' && element != null) {
                new_data[i] = document.getElementById(field).value;
            }
        };
        characters.update(
            {
                "_id" : Session.get("pc")._id
            },
            {
                $set: 
                    {
                        "data" : new_data
                    }
            }
        );
        var this_pc = characters.findOne(
            {
                "_id" : Session.get("pc")._id
            }
        )
        Session.set("pc",this_pc);
    },
    "click #delete_pc" : function() {
        if(prompt('Enter the word "DELETE" to delete this character') === "DELETE") {
            var del_id = Session.get("pc")._id
            characters.remove(
                {
                    "_id" : del_id
                }
            );
            Session.set("pc",null);
        };
    }
});

/*
Link character to larp.
 */


Template.set_larp_template.helpers({
    set_larp_choices: function () {
        if(Meteor.user().username == 'larp_admin') {
            return larps.find();
        } else {
            return larps.find(
                {
                    "players.accepted" :
                    {
                        $elemMatch :
                        {
                            "id" : Meteor.userId()
                        }
                    }
                }
            );
        };
    }
});



Template.set_larp_template.events({
    "click #link_to_larp" : function() {
        var larp = document.getElementById('larp').value;
        var your_pcs_in_larp = characters.find(
            {
                "owner" : Meteor.userId(),
                "larp" : larp
            }
        ).count();
        if(your_pcs_in_larp < 1) {
            characters.update(
                {
                    "_id" : Session.get("pc")._id},
                {
                    $set: 
                        {
                            "larp" : larp
                        }
                }
            );
        } else {
            if(Meteor.user().username == 'larp_admin') {
                characters.update(
                    {
                        "_id" : Session.get("pc")._id},
                    {
                        $set: 
                            {
                                "larp" : larp
                            }
                    }
                );
                var accepted = {
                    "id" : Session.get("pc")._id,
                    "name" : Session.get("pc").name
                };
                larps.update(
                    {
                        "_id" : larp
                    },
                    {
                        $push: 
                            {
                                "players.accepted" : accepted
                            }
                    }
                );
            } else {
                alert("You already have a character in that LARP.");
            };
        };
        var pcId = characters.findOne(
            {
                "_id" : Session.get("pc")._id
            }
        );
        Session.set("pc",pcId);
    }
});
Template.join_larp.events({
    "click #submit" : function() {
        var user = Meteor.users.findOne(
            {
                "_id" : Meteor.userId()
            }
        );
        var username = user.username;
        var pending = {
            "id" : Meteor.userId(),
            "name":username
        };
        var larpApplied = larps.findOne(
            {
                "_id" : Session.get("join_larp")._id,
                "players.pending" : pending
            }
        );
        var larpAccepted = larps.findOne(
            {
                "_id" : Session.get("join_larp")._id,
                "players.approved" : pending
            }
        );
        if(larpApplied){
            alert("you already applied to join this larp");
        } else if(larpAccepted){
            alert("you've already been accepted to play in this larp");
        } else {
            larps.update(
                {
                    "_id" : Session.get("join_larp")._id
                },
                {
                    $push:
                        {
                            "players.pending" : pending
                        }
                }
            );
            alert("you have now applied to join this larp");
        };
    }
});

/*
 Template Creation
*/
Template.make_template.helpers({
    sheet: function () {
        var obj = {};
        obj.choices = lm_app.pcs.choices();
        return obj;
    },
    template_preview: function () {
        if(Session.get("working_sheet")) {
            return lm_app.pcs.template_preview_html(Session.get("working_sheet"));
        };
    },
    temp_template: function () {
        var obj = {};
        obj.choices = lm_app.pcs.choices();
        return obj;
    }
});
Template.make_template.events({
    "click #add_field" : function() {
        var old_arr = [];
        var new_field = [];
        var make_element = function(callback) {
            var title = document.getElementById('field_title').value;
            switch(document.getElementById('field_type').value) {
                case "section_title":
                    new_field.push("section_title",title);
                    break;
                case "single_line":
                    new_field.push("single_line",title);
                    break;
                case "text_box":
                    new_field.push("text_box",title);
                    break;
            };
            callback();
        };
        var old_arr = function(callback) {
            old_arr = Session.get("working_sheet");
            callback();
        };
        var save_new_arr = function() {
            Session.set("working_sheet",old_arr);
        };
        var add_field = function(callback) {
            old_arr.push(new_field);
            callback();
        };
        old_arr(function() {
            make_element(function() {
                add_field(function() {
                    save_new_arr();
                });
            });
        });
    },
    "click #save_working_template" : function() {
        if(Meteor.user().username == 'larp_admin') {
            var title = document.getElementById('sheet_title').value;
            if(title) {
                var new_template = {
                    "title" : title,
                    "owner" : Meteor.userId(),
                    "data" : Session.get("working_sheet")
                };
                templates.insert(new_template);
                Session.set("make_template",null);
                Session.set("working_sheet",null);
            } else {
                alert("Please give this new character sheet a title before saving it.");
            };
        };
    }
});
