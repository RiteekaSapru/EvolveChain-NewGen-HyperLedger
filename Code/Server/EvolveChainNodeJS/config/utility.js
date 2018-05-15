var dateFormat = require('dateformat');

module.exports =  {
    nowDate: function()
    {
        return dateFormat(new Date(),  "isoUtcDateTime");
    },
    replacedata: function(shortcodearr,strbody)
    {
    	if(shortcodearr!= null)
    		{
				for (key in shortcodearr) { 		
					strbody = strbody.replace(new RegExp(key, 'g'), shortcodearr[key]); 
				}				
    		}		
		return strbody;
    },
    removenull(obj) {
        console.log(obj);
        for (var propName in obj) { 
            if (obj[propName] === null || obj[propName] === undefined || obj[propName] === '') {
                delete obj[propName];
            }
        }
    }

     
}