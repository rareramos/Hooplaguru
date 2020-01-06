Cloudinary.customUpload = function (files, callback) {
  let haveFiles = files && files.length
  if (!haveFiles) {
    return
  }

  let uploadOptions = {
    width: Hoopla.photoSwipeSize,
    height: Hoopla.photoSwipeSize,
    crop: 'limit'
  }

  Cloudinary.upload(files, uploadOptions, function (error, result) {
    Session.set('overlayTemplate', null)

    if (error) {
      CrossPlatform.alert({msg: error, title: 'File Upload Error'})
    } else {
      callback({
        imageId: result.public_id,
        width:   result.width,
        height:  result.height,
      })
    }
  })
}
