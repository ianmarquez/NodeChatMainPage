module.exports = function(){
	const express = require("express");
	const app = new express.Router();
	const bodyParser = require('body-parser');

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));

	const connection  = require('express-myconnection'); 
	const mysql = require('mysql');

	const pool = mysql.createPool({
		connectionLimit : 100, //important
		host     : 'localhost',
		user     : 'root',
		password : 'usbw',
		database : 'materialize'
	});

	app.get('/getStudents',function(req,res){
		pool.getConnection(function(err, connection){
			const selectAllStudents = 'SELECT * FROM studentstbl';
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
				const firstname = req.body.firstname;
				const lastname = req.body.lastname;
				const email = req.body.email;
				const contactno = req.body.contactno;

				const insertStudent = 'INSERT INTO studentstbl(firstName,lastName,contactNo,emailAddress) VALUE("'+firstname+'","'+lastname+'","'+contactno+'","'+email+'")';
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
				const id = req.body.id;
				const firstname = req.body.firstname;
				const lastname = req.body.lastname;
				const email = req.body.email;
				const contactno = req.body.contactno;

				const updateStudent = 'UPDATE studentstbl SET firstName="' + firstname +'", lastName="' + lastname+ '", contactNo ="' + contactno + '", emailaddress ="' + email + '" WHERE studID=' + id;
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
	app.post('/deconsteStudent', function(req, res){
		pool.getConnection(function(err, connection){
			if(err){
				res.json({"code" : 100, "status" : "Error in connection database"});
				return;
			}else{
				const id = req.body.id;
				const deconsteStudent = 'DEconstE FROM studentstbl WHERE studID = "' + id + '"';
				connection.query(deconsteStudent, function(err, rows){
					if(!err){
						res.json({"code" : 300, "status" : "Student Successfully Deconsted"});
					}else{
						res.json({"code" : 100, "status" : "Error in executing query"});
					}
				});
			}
		});
		
	});

	return app;
}();