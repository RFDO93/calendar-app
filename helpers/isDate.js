const {isValid} = require('date-fns')

const funIsDate = (value) => {

  if(!value) {
    return false
  }

  return isValid(value)
}

module.exports = {
  funIsDate
}