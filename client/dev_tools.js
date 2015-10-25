dev_tools = {
	test_users : function() {
		var test_users = [
			{
	    		username : "larp_admin",
	    		password : "coffee"
    		},
			{
				username : "patrick",
	    		password : "coffee"
			},
			{
				username : "jonathan",
	    		password : "coffee"
			},
			{
				username : "brent",
	    		password : "coffee"
			},
			{
				username : "marina",
	    		password : "coffee"
			},
			{
				username : "lavar",
	    		password : "coffee"
			}
		];
		return test_users;
	},
	create_test_users : function() {
		var test_users = dev_tools.test_users();
		for(var i=0;test_users.length > i;i++) {
			Accounts.createUser(
		    	{
		    		username : test_users[i].username,
		    		password : test_users[i].password
	    		}
			);
		};
		Meteor.logout();
	},
	test : function(){
		var test_users = dev_tools.test_users();
		for(var i=0;test_users.length > i;i++) {
			console.log(test_users[i]);
		};
	}
};
// dev_tools.create_admin();
// dev_tools.create_test_users();
// dev_tools.test();