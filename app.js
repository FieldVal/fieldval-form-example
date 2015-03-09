var FieldVal = require('fieldval');
var BasicVal = FieldVal.BasicVal;
 
var express = require('express');
var bodyParser = require('body-parser');
 
var app = express();
app.use(bodyParser.json());
app.use(express.static('./public'))

app.post('/sign_up', function (req, res) {
    
    var validator = new FieldVal(req.body);
   
    //Password validation
    var password = validator.get("password", BasicVal.string(), BasicVal.min_length(8))    
	validator.get("password_repeat", BasicVal.string(), function(value) {
		//Validating "password_repeat" only if password was provided
		if (password && password != value) {
			return {
				error: 1000,
				error_message: "Password does not match"
			}
		}
	})

    //Date of birth validation
	validator.get('date_of_birth', BasicVal.date('yyyy-MM-dd'));

    //Address object validation
    validator.get("address", BasicVal.object(), function(value) {
    	var inner_validator = new FieldVal(value);
    	inner_validator.get("street", BasicVal.string());
    	inner_validator.get("city", BasicVal.string());
    	inner_validator.get("postal_code", BasicVal.string());
    	return inner_validator.end();
    });

    //Email validation
    validator.get_async("email", [BasicVal.email(), function(value, emit, callback) {
        //Imitating asynchronous database call
        setTimeout(function() {
            callback({
                error: 1001,
                error_message: "Email already exists"
            })
        }, 5);
    }]);
    
    validator.end(function(error) {
	    if (error) {
	        res.json(error);
	     } else {
		    res.json({success:true})	
	     }
    });
    
})

app.set('port', process.env.PORT || 3000); 
app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));

});