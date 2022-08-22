export type LogService = typeof LogService;

export type LogServiceInstance = {
  info: (message: string) => void;
  error: (message: string) => void;
};

export function LogService(scope: string, color: string) {
  // const logService = { info: () => {}, error: () => {} };
  const logService = {
    info: (message: string) =>
      console.log(
        scope + "%c" + " " + message,
        `color: ${color ? color : "teal"}`
      ),
    error: (message: string) =>
      console.error(
        scope + "%c" + " " + message,
        `color: ${color ? color : "red"}`
      ),
  };

  Object.freeze(logService);

  return logService;
}
