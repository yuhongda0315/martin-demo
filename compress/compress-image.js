function compressImage(file, options, callback){

  var getWH = (image) => {
    var maxWidth = options.maxWidth;
    var maxHeight = options.maxHeight;

    var width = image.width;
    var height = image.height;

    if (image.width > maxWidth) {
      height = height * (maxWidth / width);
      width = maxWidth;
    }

    return {
      width,
      height
    }
  };

  var canvas = document.createElement("canvas");
  var context = canvas.getContext('2d');

  var reader=new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function(event){
        var img = new Image();
        img.onload = function() {
          var WH = getWH(img);
          let width = WH.width;
          let height = WH.height;

          canvas.width = width;
          canvas.height = height;

          context.drawImage(img, 0, 0, width, height);
          try {
              var base64 = canvas.toDataURL(file.type, options.encoder);
              var reg = new RegExp('^data:image/[^;]+;base64,');
              base64 = base64.replace(reg, '');
              callback(base64);
          } catch (e) {
              throw new Error(e);
          }
        };
        img.src = event.target.result;
    };
}
