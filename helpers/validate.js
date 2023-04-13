const validator = require('validator');

const validate = (params) =>
{
    let result = false;

    let name =  !validator.isEmpty(params.name) &&
                validator.isLength(params.name, {min: 3, max: undefined}) &&
                /^[a-zA-Z ]*$/.test(params.name);

    let nick =  !validator.isEmpty(params.nick) &&
                validator.isLength(params.nick, {min: 2, max: 60});

    let email = !validator.isEmpty(params.email) &&
                validator.isEmail(params.email);

    let password = !validator.isEmpty(params.password);

    if(params.surname)
    {
        let surname =   !validator.isEmpty(params.surname) && 
                        validator.isLength(params.surname, {min: 3, max: undefined}) &&
                        /^[a-zA-Z ]*$/.test(params.surname);

        if(!surname)
        {
            throw new Error('Error - Validation failed. Incorrect surname.');
        }
        else
        {
            console.log('Validate successfuly with surname');
        }
    }

    if(!name || !nick || !email || !password)
    {
        throw new Error('Error - Validation failed.');
    }
    else
    {
        console.log('Validate successfuly');
        result = true;
    }
    return result;
}

module.exports = validate;