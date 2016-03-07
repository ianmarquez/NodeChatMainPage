//configure dependencies
var express = require('express');
var path = require('path');
var app = express();

//required to render ejs pages
app.set('view engine','ejs');
app.use(express.static('public'));

app.use('/student', require('./routes/student'))

app.get('/',function(req,res){
	res.render('pages/index');
});

//start server
app.listen(8081, function () {
  console.log("Example app listening at port 8081");
});
