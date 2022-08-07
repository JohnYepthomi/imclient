state.directMessages.forEach((userdata, usersIdx) => {
  usridx = usersIdx;
  foundJID = Object.keys(userdata)[0];
  foundMsg = state.directMessages[usersIdx][foundJID];
});
