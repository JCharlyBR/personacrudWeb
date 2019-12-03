var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb+srv://root:<p4oBFJ4GDN6vRNud>@cluster0-c5uy1.mongodb.net/test?retryWrites=true&w=majority');

//mongodb+srv://root:<password>@cluster0-c5uy1.mongodb.net/test?retryWrites=true&w=majority




var Schema = mongoose.Schema;

var BlogSchema = new Schema({
	nombre: String,
	apellidoPaterno: String,
	apellidoMaterno: String,
	ocupacion: String,
	email: String
});

mongoose.model('Blog', BlogSchema);

var Blog = mongoose.model('Blog');
//
/*
var blog = new Blog({
	nombre: 'Juan Carlos',
	apellidoPaterno: 'Benitez',
	apellidoMaterno: 'Reyes',
	ocupacion: 'Estudiante',
	email: 'juancarlos@gmail.com'	
});

blog.save();*/
//
var app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

// ROUTES
app.use(require('./server.js'));
//app.use('server', require('server'));
app.get('/api/blogs', function(req, res) {
	Blog.find(function(err, docs) {
		docs.forEach(function(item) {
			console.log("Received a GET request for _id: " + item._id);
		})
		res.send(docs);
	});
});

app.post('/api/blogs', function(req, res) {
	console.log('Received a POST request:')
	for (var key in req.body) {
		console.log(key + ': ' + req.body[key]);
	}
	var blog = new Blog(req.body);
	blog.save(function(err, doc) {
		res.send(doc);
	});
});

app.delete('/api/blogs/:id', function(req, res) {
	console.log('Received a DELETE request for _id: ' + req.params.id);
	Blog.remove({_id: req.params.id}, function(err, doc) {
		res.send({_id: req.params.id});
	});
});

app.put('/api/blogs/:id', function(req, res) {
	console.log('Received an UPDATE request for _id: ' + req.params.id);
	Blog.update({_id: req.params.id}, req.body, function(err) {
		res.send({_id: req.params.id});
	});
});

var port = 3000;

app.listen(port);
console.log('server on ' + port);