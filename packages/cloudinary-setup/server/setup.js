Cloudinary.config({
  cloud_name: Meteor.settings.public.CLOUDINARY_CLOUND_NAME,
  api_key:    Meteor.settings.CLOUDINARY_API_KEY,
  api_secret: Meteor.settings.CLOUDINARY_API_SECRET
})
