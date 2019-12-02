Backbone.Model.prototype.idAttribute = '_id';

// Backbone Model

var Blog = Backbone.Model.extend({
	defaults: {
		nombre: '',
		apellidoPaterno: '',
		apellidoMaterno: '',
		ocupacion: '',
		email: ''

	}
});

// Backbone Collection

var Blogs = Backbone.Collection.extend({
	url: 'http://localhost:3000/api/blogs'
});


// instantiate a Collection

var blogs = new Blogs();

// Backbone View for one blog

var BlogView = Backbone.View.extend({
	model: new Blog(),
	tagName: 'tr',
	initialize: function() {
		this.template = _.template($('.blogs-list-template').html());
	},
	events: {
		'click .edit-blog': 'edit',
		'click .update-blog': 'update',
		'click .cancel': 'cancel',
		'click .delete-blog': 'delete',
		'click .pdf-blog': 'pdf'
	
	},
	edit: function() {
		$('.edit-blog').hide();
		$('.delete-blog').hide();
		this.$('.update-blog').show();
		this.$('.cancel').show();
		this.$('.pdf-blog').show();
		

		var nombre = this.$('.nombre').html();
		var apellidoPaterno = this.$('.apellidoPaterno').html();
		var apellidoMaterno = this.$('.apellidoMaterno').html();
		var ocupacion = this.$('.ocupacion').html();
		var email = this.$('.email').html();

		this.$('.nombre').html('<input type="text"  id="nombre" class="form-control nombre-update" value="' + nombre + '">');
		this.$('.apellidoPaterno').html('<input type="text" id="apellidoPaterno" class="form-control apellidoPaterno-update" value="' + apellidoPaterno + '">');
		this.$('.apellidoMaterno').html('<input type="text" id="apellidoMaterno" class="form-control apellidoMaterno-update" value="' + apellidoMaterno + '">');
		this.$('.ocupacion').html('<input type="text" id="ocupacion" class="form-control ocupacion-update" value="' + ocupacion + '">');
		this.$('.email').html('<input type="text" id="email" class="form-control email-update" value="' + email + '">');
	},
	update: function() {
		this.model.set('nombre', $('.nombre-update').val());
		this.model.set('apellidoPaterno', $('.apellidoPaterno-update').val());
		this.model.set('apellidoMaterno', $('.apellidoMaterno-update').val());
		this.model.set('ocupacion', $('.ocupacion-update').val());
		this.model.set('email', $('.email-update').val());

		this.model.save(null, {
			success: function(response) {
				alert('ACTUALIZADO CORRECTAMENTE');
				console.log('ACTUALIZADO CORRECTAMENTE PERSONA CON _id: ' + response.toJSON()._id);
			},
			error: function(err) {
				alert('FALLO AL ACTUALIZAR');
				console.log('ACTUZALIZACION FALLIDA, INTENTE MAS TARDE!');
			}
		});
	},
	cancel: function() {
		blogsView.render();
	},

	pdf: function() {
		
	},

	delete: function() {
		this.model.destroy({
			success: function(response) {
				alert('ELIMINACION CORRECTA PERSONA: '+ response.toJSON()._id);
				console.log('ELIMINACION CORRECTA PERSONA _id: ' + response.toJSON()._id);
			},
			error: function(err) {
				alert('ELIMINACIÓN FALLIDA, INTENTE MAS TARDE');
				console.log('ELIMINACION FALLIDA, INTENTE MAS TARDE!');
			}
		});
	},

	
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});

// Backbone View for all blogs

var BlogsView = Backbone.View.extend({
	model: blogs,
	el: $('.blogs-list'),
	initialize: function() {
		var self = this;
		this.model.on('add', this.render, this);
		this.model.on('change', function() {
			setTimeout(function() {
				self.render();
			}, 30);
		},this);
		this.model.on('remove', this.render, this);

		this.model.fetch({
			success: function(response) {
				_.each(response.toJSON(), function(item) {
					console.log('Successfully GOT blog with _id: ' + item._id);
				})
			},
			error: function() {
				alert('fallo');
				console.log('Failed to get blogs!');
			}
		});
	},
	render: function() {
		var self = this;
		this.$el.html('');
		_.each(this.model.toArray(), function(blog) {
			self.$el.append((new BlogView({model: blog})).render().$el);
		});
		return this;
	}
});

var blogsView = new BlogsView();

$(document).ready(function() {
	$('.add-blog').on('click', function() {
		var blog = new Blog({
			nombre: $('.nombre-input').val(),
			apellidoPaterno: $('.apellidoPaterno-input').val(),
			apellidoMaterno: $('.apellidoMaterno-input').val(),
			ocupacion: $('.ocupacion-input').val(),
			email: $('.email-input').val()
		});
		$('.nombre-input').val('');
		$('.apellidoPaterno-input').val('');
		$('.apellidoMaterno-input').val('');
		$('.ocupacion-input').val('');
		$('.email-input').val('');
		blogs.add(blog);
		blog.save(null, {
			success: function(response) {
				alert('insercion correcta');
				console.log('Successfully SAVED blog with _id: ' + response.toJSON()._id);
			},
			error: function() {
				console.log('Failed to save blog!');
			}
		});
	});
})