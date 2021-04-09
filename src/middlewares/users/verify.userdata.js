/*Este archivo define un middleware que permite verificar que los 
datos ingresado para registrar un nuevo usuario son validos, por 
ejemplo que su password no sea menor a 8 caracteres, que el email cumpla
con la expresion regular 'emailRegex', etc*/

const ValidateFieldUser = (req, res, next) => {

    const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;

    const { email, password, confirmpass } = req.body;

    if (email.length == 0) {
        res.status(400).json({ message: 'Email is required' });
        return;
    }

    if (password.length == 0) {
        res.status(400).json({ message: 'Password is required' });
        return;
    }

    if(email.toString().match(emailRegex) === null) {
        res.status(400).json({
            message: 'Invalid email'
        });
        return;
    }

    if (password != confirmpass) {
        res.status(400).json({ message: 'Password not match' });
        return;
    }
    if (password.length < 8) {
        res.status(400).json({ message: 'Password must be at least 8 chars long' });
        return;
    }

    next();
}

module.exports = ValidateFieldUser;