/*
Import
*/
const UserModel = require('../../models/user.model');
const bcrypt = require('bcryptjs');
//

const register = (body, res) => {
	return new Promise((resolve, reject) => {
		UserModel.findOne({ email: body.email }, (error, user) => {
			if (error) return reject(error);
			else if (user)
				// Mongo Error
				return reject('User already exist');
			else {
				// Hash user password
				bcrypt
					.hash(body.password, 10)
					.then((hashedPassword) => {
						// Change user pasword
						body.password = hashedPassword;

						// Register new user
						UserModel.create(body)
							.then((mongoResponse) => resolve(mongoResponse))
							.catch((mongoResponse) => reject(mongoResponse));
					})
					.catch((hashError) => reject(hashError));
			}
		});
	});
};

const login = (body, req, res) => {
	return new Promise((resolve, reject) => {
		UserModel.findOne({ email: body.email }, (error, user) => {
			if (error) reject(error);
			else if (!user) reject('Unknow user');
			else {
				// Check password
				const validPassword = bcrypt.compareSync(body.password, user.password);
				if (!validPassword) reject('Password not valid');
				else {
					const userToken = user.generateJwt();

					// Set cookie
					res.cookie('VolumesToken', user.generateJwt(), { httpOnly: false });

					// Resolve user data
					resolve({ user, userToken });
				}
			}
		});
	});
};

const read = (body) => {
	return new Promise((resolve, reject) => {
		UserModel.findOne({ email: body.email }, (error, user) => {
			if (error) reject(error);
			else {
				// Mongo Error
				return resolve(user);
			}
		});
	});
};
//

/*
Export
*/
module.exports = {
	register,
	login,
	read
};
//
