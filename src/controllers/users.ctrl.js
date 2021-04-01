const control = {};

control.register = (req, res) => {
    res.send('register');
}
control.signin = (req, res) => {
    res.send('signin');
}
control.signout = (req, res) => {
    res.send('signout');
}

module.exports = control;