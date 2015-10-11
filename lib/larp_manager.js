lm_app = {
	getKeyByValue : function( arr, val ) {
	    for(var i=0;arr.length > i;i++){
	        if(arr[i].name == val) {
	            return i;
	        };
	    };
	}
};