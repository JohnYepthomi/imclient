export default class UserService {
  constructor(userInfo, LogService) {
    this._id = userInfo.credential.username;
    this._password = userInfo.credential.password;
    this._domain = userInfo.domain;
    this._service = userInfo.service;
    this._resource = userInfo.resource;
    this._logger = LogService("UserService -> ", "violet");
  }

  getId() {
    return this._id;
  }

  getDomain() {
    return this._domain;
  }

  getResource() {
    return this._resource;
  }

  getService() {
    return this._service;
  }

  getPassword() {
    return this._password;
  }
}
