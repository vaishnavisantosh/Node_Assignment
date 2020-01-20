import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  const token = req.header('authorization');
  if (!token) return res.status(401).send('Access denied');

  try {
    const verfied = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verfied;
    next();
  } catch (err) {
    return res.status(400).send('invalid Token');
  }
  return res;
};

module.exports = auth;
