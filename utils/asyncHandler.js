//envuelve una funcion async de un controlador,
//si esa funcion lanza un error, lo manda con next al errorHandler en vez de dejarlo perdido
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = asyncHandler;