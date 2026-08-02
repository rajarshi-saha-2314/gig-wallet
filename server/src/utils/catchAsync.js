// Express 4 doesn't forward rejected promises from async handlers to errorHandler
// on its own; wrapping routes with this sends them to next(err) instead of crashing.
export function catchAsync(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}
