const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const saltRounds = 10;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },

    password: {
        type: String,
        required: true,
    }
});

UserSchema.pre('save', async function(next) { // this middleware is called before saving a user
    try {
        // console.log('called before saving a user')
        const salt = await bcrypt.genSalt(saltRounds);
        console.log(this.email, this.password);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword; 
        next();
        
    } catch(error) {
        next(error);
    }
});

UserSchema.post('save', async function(next) {
    try {
        console.log('Called after saving a user')
    } catch(error) {
        next(error);
    }
});

//                          mongodb will automatically change 'user' to plural (users)
const User = mongoose.model('user', UserSchema);

module.exports = User;