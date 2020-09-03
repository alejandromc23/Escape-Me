const buildError = require('./error-builder')

module.exports = {
    DuplicityError: buildError('DuplicityError'),
    VoidError: buildError('VoidError'),
    UnexistenceError: buildError('UnexistenceError'),
    CredentialsError: buildError('CredentialsError'),
    ValueError: buildError('ValueError')
}