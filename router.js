const usersController = require('./components/users/users.controller');
const authContoller = require('./components/auth/auth.controller');
const checksController = require('./components/checks/checks.controller');
const auth = require('./helpers/auth');

module.exports = {
	post: {
		'users': usersController.createOne,
		'login': authContoller.login,
		'checks': auth(checksController.createOne),
	},
	get: {
		'users': auth(usersController.findAll),
		'checks/:id': auth(checksController.findOne),
		'checks': auth(checksController.findByUse),
	},
	put: {
		'checks/:id': auth(checksController.updateOne),
		'/profile': auth(usersController.updateOne)
	},
	delete: {
		'checks/:id': auth(checksController.deleteOne),
		'users': auth(usersController.deleteOne)
	}
};