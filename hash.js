const bcrypt = requiere('bcrypt')
const createHash = password => bcrypt.hashSync( password, bcrypt.genSaltSync(10))
const isValidPasword = (user, password) => bcrypt.compareSync(password, user.password)

module.exports = {
    createHash,
    isValidPasword
}