var express = require('express');

var router = express.Router();

//fake database
var todoItems= [
			{ id: 1, desc: 'foo' },
			{ id: 1, desc: 'bar' },
			{ id: 1, desc: 'baz' }
		];

// get homepage
router.get('/', function(req, res){
//load data from DB here
	res.render('index', {
		title: 'Crush',
		items: todoItems
	})
});

router.post('/add', function(req, res){
	var newItem = req.body.newItem;
	console.log(newItem);

	todoItems.push({
		id: todoItems.length + 1,
		desc: newItem
	})

	res.redirect('/');
	console.log('posted')
})

module.exports = router; 