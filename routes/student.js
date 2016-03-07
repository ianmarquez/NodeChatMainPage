module.exports = function(){
	var express = require("express");
	var app = new express.Router();
	var http = require('http');
	var cookieParser = require('cookie-parser');
	var bodyParser = require('body-parser');

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));

	var connection  = require('express-myconnection'); 
	var mysql = require('mysql');

	var pool = mysql.createPool({
		connectionLimit : 100, //important
		host     : 'localhost',
		user     : 'root',
		password : 'usbw',
		database : 'materialize'
	});

	app.get('/getStudents',function(req,res){
		pool.getConnection(function(err, connection){
			var selectAllStudents = 'SELECT * FROM studentstbl';
			if(err){
				res.json({"code" : 100, "status" : "Error in connection database"});
				return;
			}else{
				connection.query(selectAllStudents, function(err, rows){
					if(!err){
						res.json(rows);
					}else{
						res.json({"code" : 100, "status" : "Error in executing query"});
					}
				});
			}
		});
	});
	app.post('/addStudent', function(req,res){
		pool.getConnection(function(err, connection){
			if(err){
				res.json({"code" : 100, "status" : "Error in connection database"});
				return;
			}else{
				var firstname = req.body.firstname;
				var lastname = req.body.lastname;
				var email = req.body.email;
				var contactno = req.body.contactno;

				var insertStudent = 'INSERT INTO studentstbl(firstName,lastName,contactNo,emailAddress) VALUE("'+firstname+'","'+lastname+'","'+contactno+'","'+email+'")';
				connection.query(insertStudent, function(err, rows){
					if(!err){
						res.json({"code" : 300, "status" : "Student Successfully Inserted"});
					}else{
						res.json({"code" : 100, "status" : "Error in executing query"});
					}
				});
			}
		});
		
	});
	app.post('/updateStudent', function(req,res){
		pool.getConnection(function(err, connection){
			if(err){
				res.json({"code" : 100, "status" : "Error in connection database"});
				return;
			}else{
				var id = req.body.id;
				var firstname = req.body.firstname;
				var lastname = req.body.lastname;
				var email = req.body.email;
				var contactno = req.body.contactno;

				var updateStudent = 'UPDATE studentstbl SET firstName="' + firstname +'", lastName="' + lastname+ '", contactNo ="' + contactno + '", emailaddress ="' + email + '" WHERE studID=' + id;
				connection.query(updateStudent, function(err, rows){
					if(!err){
						res.json({"code" : 300, "status" : "Student Successfully Updated"});
					}else{
						res.json({"code" : 100, "status" : "Error in executing query"});
					}
				});
			}
		});
	});
	app.post('/deleteStudent', function(req, res){
		pool.getConnection(function(err, connection){
			if(err){
				res.json({"code" : 100, "status" : "Error in connection database"});
				return;
			}else{
				var id = req.body.id;
				var deleteStudent = 'DELETE FROM studentstbl WHERE studID = "' + id + '"';
				connection.query(deleteStudent, function(err, rows){
					if(!err){
						res.json({"code" : 300, "status" : "Student Successfully Deleted"});
					}else{
						res.json({"code" : 100, "status" : "Error in executing query"});
					}
				});
			}
		});
		
	});

	return app;
}();