Meteor.methods({
  seed: function(token){
    if (token !== 'd5dbbc28-1185-46b7-8ff6-5ffef5dcf703') {
      return
    }

    CoverPhotoCategories.remove({})

    let categories = [
      'baby',
      'bachelor',
      'bachelorette',
      'birthday',
      'business',
      'food-drink',
      'holidays',
      'sports',
      'travel',
      'wedding',
    ]

    let categoryNames = {
      'baby':         'Baby',
      'bachelor':     'Bachelor',
      'bachelorette': 'Bachelorette',
      'birthday':     'Birthday',
      'business':     'Business',
      'food-drink':   'Food & Drink',
      'holidays':     'Holidays',
      'sports':       'Sports',
      'travel':       'Travel',
      'wedding':      'Wedding',
    }

    let getImageIdsByCategory = Meteor.wrapAsync(function (category, callback) {
      Cloudinary.api.resources(
        function (result) {
          callback(null, lodash.map(result.resources, 'public_id'))
        },
        {
          type: 'upload',
          prefix: 'event-cover-photos/' + category
        }
      )
    })

    categories.forEach(function (category) {
      let imageIds = getImageIdsByCategory(category)

      CoverPhotoCategories.insert({
        name: categoryNames[category],
        imageIds,
        previewImageId: lodash.first(imageIds)
      })
    })
  }
})
