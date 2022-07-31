export function LogService(scope, color) {
  //const logService = { info: () => {}, error: () => {} };
  const logService = {
    info: (message) =>
      console.log(
        "%c" + scope + " " + message,
        `color: ${color ? color : "teal"}`
      ),
    error: (message) =>
      console.error(
        "%c" + scope + " " + message,
        `color: ${color ? color : "red"}`
      ),
  };

  Object.freeze(logService);

  return logService;
}
