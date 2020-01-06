const request = Npm.require('superagent')
const {BRANCH_API_URL, BRANCH_API_KEY} = Meteor.settings.public

const createLink = (dataAndMetadata, callback) => {
  const returnResult = (err, {body} = {}) => {
    if (err) { return callback(err) }
    return body ? callback(null, body.url.replace("http:","https:")) : callback(null, null)
  }

  return request.post(BRANCH_API_URL).send({
    branch_key: BRANCH_API_KEY,
    ...dataAndMetadata
  }).end(returnResult)
}

DeepLinks = {}
DeepLinks.createLink = Meteor.wrapAsync(createLink)

