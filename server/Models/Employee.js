const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const bcrypt = require('bcryptjs')
const Schema = new mongoose.Schema({
    name: String,
    email: String,
    password: {

    },
    confirmpassowrd: Number,
    Token: [
        {
            token: {}
        }
    ],

})
Schema.pre('save', async function (next) {
    // console.log(`before hasinhi ${this.password}`)
    this.password = await bcrypt.hash(this.password, 10)
    // console.log(`after hasinhi ${this.password}`)
    next()

})

Schema.methods.generateAuthToken = async function () {
    try {
        const toooken = jwt.sign({ id: this._id.toString() }, 'mynameismmuahhaadbkabdkbcsabcajbkjabsdkcacxakbxkakxbakk')

        this.Token = this.Token.concat({ token: toooken })

        await this.save()
        return toooken;
    } catch { }
}

const data = new mongoose.model('data', Schema)
module.exports = data;
