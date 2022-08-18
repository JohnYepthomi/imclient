export default function base64encoder(image) {
  let base64String = "";
  var reader = new FileReader();

  reader.onload = function() {
    base64String = reader.result.replace("data:", "").replace(/^.+,/, "");
  };
  reader.readAsDataURL(image);

  return base64String;
}
