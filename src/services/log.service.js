export function LogService(scope, color) {
  // const logService = { info: () => {}, error: () => {} };
  const logService = {
    info: (message) =>
      console.log(
        scope + "%c" + " " + message,
        `color: ${color ? color : "teal"}`
      ),
    error: (message) =>
      console.error(
        scope + "%c" + " " + message,
        `color: ${color ? color : "red"}`
      ),
  };

  Object.freeze(logService);

  return logService;
}
