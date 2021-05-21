export function validateSession(req, res, next) {
  if (req.isAuthenticated()) return next();

  res.redirect('/login');
}

export function redirectToActiveSession(req, res, next) {
  if (req.isAuthenticated()) res.redirect('/');

  return next();
}
