const control = {};

control.index = (req, res) => {
  res.json({ message: "Hello world" });
};

module.exports = control;