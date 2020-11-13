const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { saltHashPassword } = require('@root/lib/common/hashing')

let User = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  passHash: {
    type: String,
    required: true,
  },
  salt: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

User = mongoose.model('User', User)

User._create = (user, callback) => {
  User.create(user, err => {
    if (err) {
      console.log("Err on creating user:", err);
      if (err.code == 11000 && callback)
        return callback(false, "has_user_with_such_username")
    }
    if (callback)
      callback(true)
  });
};

User._update = (user) => new Promise(resolve => {
  const changedFields = {}
  if (user.username)
    changedFields.username = user.username
  if (user.isAdmin != null)
    changedFields.isAdmin = user.isAdmin
  User.findOneAndUpdate({id: user.id}, {$set: changedFields}, null, err => {
    if (err) {
      console.log('Err on updating user:', err)
      return reject(err)
    }
    return resolve({ok: true, message: 'user_modified_successfully'})
  })
})

User._getCut = (query) => new Promise(resolve => {
  User.find(query, (err, users) => {
    if (err) {
      console.log('Err on finding users:', err)
      throw err
    }
    resolve(users.map(user => ({
      id: user.id,
      username: user.username,
      isAdmin: user.isAdmin,
    })))
  })
})

User._getById = (id, callback) => {
  User.findOne({id}, (err, user) => {
    if (err)
      console.log('Err on finding user by username:', err);
    callback(user, err);
  });
};

User._getByUsername = (username, callback) => {
  User.findOne({username}, (err, user) => {
    if (err)
      console.log('Err on finding user by username:', err);
    callback(user);
  });
};

User._getLastId = (callback) => {
  User
    .find({})
    .sort({ id: -1 })
    .limit(1)
    .exec((err, user) => {
        if (err)
        console.log('Err on getting last user id:', err);
        callback(user[0] ? user[0].id : 0);
    });
}

User._register = ({username, password, isAdmin}) => new Promise((resolve, reject) => {
  User._getLastId(lastId => {
    const { salt, passwordHash } = saltHashPassword(password)
    User._create({
      id: lastId + 1,
      username,
      passHash: passwordHash,
      salt,
      isAdmin,
    }, function (ok, err) {
      if (err) {
        console.log('Err on getting last user id:', err)
        return reject(err)
      }
      resolve()
    })
  })
})

User._login = ({username, password}) => new Promise((resolve, reject) => {
  User._getByUsername(username, user => {
    if (!user)
      return reject(new Error('No user with such username.'))
    const { passwordHash } = saltHashPassword(password, user.salt)
    resolve(passwordHash)
  })
})

module.exports = User;
