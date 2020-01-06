if (Meteor.isClient) {
  EventImages.insertFromFiles = function (files, eventId, activityList,module, insertCallback, cloudinaryCallback) {

    _.toArray(files).forEach((file) => {

      if(file.type.indexOf('image/') >= 0)
      {
          let _id;
          const blob = URL.createObjectURL(file);
          const tempBlobImage = new Image();
          tempBlobImage.src = blob;

          tempBlobImage.onload = function() {
            const width = this.width;
            const height = this.height;
            const uploadStatus = true;
            EventImages.insert({eventId, blob, width, height, uploadStatus, 'activityId' : activityList}, function(err, success){
              
              if (err){
                CrossPlatform.alert(err);
              } else {
                _id = success;
                const blobImage = { blob, width, height }
                insertCallback && insertCallback(success, blobImage);
                setTimeout(function(){
                  if(module == 'wall') {
                    $("#meida_loader_swiper").html('<div class="loaderDiv"><div class="loader" id="media-loader"></div></div>');
                  }
                },10);

                Cloudinary.customUpload([file], function (image) {
              
                  EventImages.update(
                    {_id}, { $set: { ...image,blob: "", uploadStatus:false } },
                    function (error, eventImageId) {
                      if (error) {
                        CrossPlatform.alert(error);
                      } else {
                        $("#meida_loader_swiper").html('');
                        cloudinaryCallback && cloudinaryCallback(image);
                      }
                    }
                  )
                });
              }
            });
          }
      }
      else
      {

          let fileSize = Math.ceil(files[0].size/1024/1024);
          if(fileSize >= 40) {
            CrossPlatform.alert({
                msg: 'Max file size is 40MB.',
            });
            insertCallback && insertCallback(success, '');
            return false;
          }
             
          var checkType = {resource_type: 'video'};
          //console.log(file);return false;
          Session.set('overlayTemplate', 'Loading');
          Cloudinary.upload([file], checkType, (err, res,success) => {
            
            if (!err) 
            {
              var orientation = 1;
              var isVideo = 1;

              EventImages.insert({eventId: eventId, imageId:res.public_id,userId:Meteor.userId(),width:res.width, height:res.height, isVideo:isVideo}, function(err, success){

                  //console.log('Insert Successfully.');
                  Session.set('overlayTemplate', null);
                  insertCallback && insertCallback(success, '');

              });
              
            } else {
              CrossPlatform.alert(err);
            }  
          });


        /*S3.upload({
                files:[file]
            },function(e,res){
              if(!e) {
                var orientation = 1;
                var isVideo = 1;
                var imageId = res.relative_url;
                var width = 320;
                var height = 170;
                var isVideo = isVideo;

                const blobImage = { imageId, width, height,isVideo }
                EventImages.insert({eventId: eventId, imageId, userId:Meteor.userId(),width, height, orientation:'', isVideo, 'activityId' : activityList}, function(err, success){

                    Session.set('overlayTemplate', null);
                    insertCallback && insertCallback(success, blobImage);
                });
              }
        });*/
      }
    });
  };

  EventImages.insertFromCoverFiles = function (files, eventId, insertCallback, cloudinaryCallback) {
    _.toArray(files).forEach((file) => {

      if(file.type.indexOf('image/') >= 0)
      {
          let _id;
          const blob = URL.createObjectURL(file);
          const tempBlobImage = new Image();

            tempBlobImage.src = blob;
            tempBlobImage.onload = function() {
              const width = this.width;
              const height = this.height;

              Events.update (eventId, {
                  $set: {blobCover: blob,coverPhotoId: ''}
                }, function(err, success){
                if (err){
                  CrossPlatform.alert(err);
                } else {
                  _id = success;
                  const blobImage = { blob, width, height }

                  insertCallback && insertCallback(success, blobImage);
                }

                Cloudinary.customUpload([file], function (image) {

                  var isVideo = 0;
                  Events.update(
                    eventId, { $set: { coverPhotoId: image.imageId, isVideo: isVideo, blobCover: "" } },
                    function (error, eventImageId) {
                      if (error) {
                        CrossPlatform.alert(error);
                      } else {

                        cloudinaryCallback && cloudinaryCallback(image);
                      }
                    }
                  )
                });
              });
            }

      } else {

          let fileSize = Math.ceil(files[0].size/1024/1024);
          if(fileSize >= 40) {
            CrossPlatform.alert({
                msg: 'Max file size is 40MB.',
            });
            insertCallback && insertCallback(success, '');
            return false;
          }

          Session.set('overlayTemplate', 'Loading');

           var checkType = {resource_type: 'video'};
          //console.log(file);return false;
          Cloudinary.upload([file], checkType, (err, res,success) => {
            
            if (!err) 
            {
              var isVideo = 1;

              Events.update(
                eventId, { $set: { coverPhotoId: res.public_id, isVideo: isVideo} },
                function (error, success) {

                  if (error) {
                    CrossPlatform.alert(error);
                  } else {
                    Session.set('overlayTemplate', null);
                    insertCallback && insertCallback(success, '');
                  }
                });
            } else {
              CrossPlatform.alert(err);
            }  
          });



           /*S3.upload({
                  files:[file]
              },function(e,res){
                if(!e) {
                  var isVideo = 1;

                  Events.update(
                    eventId, { $set: { coverPhotoId: res.relative_url, isVideo: isVideo} },
                    function (error, success) {

                      if (error) {
                        CrossPlatform.alert(error);
                      } else {
                        Session.set('overlayTemplate', null);
                        insertCallback && insertCallback(success, '');
                      }
                    });
                }
          });*/
      }
    });
  };

  EventImages.dataURLtoFile = function (dataurl, filename) {

    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
  };

  EventImages.deletePhotos = function (file) {
    
    /*if(file.isVideo == 1) {
      S3.delete(file.imageId,function(error, response){

          if(error){
            CrossPlatform.alert({msg: 'File Delete Error'})
          } else {
            //callback(response)
          }
      });
    } else {*/
      Cloudinary.delete(file.imageId, function(error, response){

          if(error){
            //CrossPlatform.alert({msg: 'File Delete Error'})
          } else {
            //callback(response)
          }
      });
    /*}*/
  }
}
 

