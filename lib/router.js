lm_app.router = {
    nav : function(route) {
    	 /*
        Some of the reactivity of Meteor.js depends on changing a Session attribute so
        resetting them guarantees that the view will update and only one view will be
        seen at a time.
         */

        lm_app.router.clear(function(){
        	/*
	        If 'route' is a string, show the corresponding view.
	         */
	        if(typeof route === 'string'){
	            switch (route) {
	                case "home" :
	                    Session.set("view_home",1);
	                    break;
	                case "make_template" :
	                    Session.set("make_template",1);
	        			Session.set("working_sheet",[]);
	                    break;
	            };
	        };
        });
    },
    clear : function(callback) {
    	Session.set("running_larp",null);
        Session.set("join_larp",null);
        Session.set("new_game",null);
        Session.set("pc",null);
        Session.set("template",null);
        Session.set("make_template",null);
        Session.set("working_sheet",null);
        Session.set("view_home",null);
    	callback();
    }
}