const throwNotInitialized = () => {
  throw new Error("DI: service missing, init error");
};

export default {
  StanzaService: throwNotInitialized,
  ClientService: throwNotInitialized,
  UserService: throwNotInitialized,
};
