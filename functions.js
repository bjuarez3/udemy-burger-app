module.exports = {
    flattenObjectToArray : (object, array) => {
        Object.values(object).map((value) => {
            if(typeof(value) != 'object' ){
                array.push(value)
            }
            else {
                module.exports.flattenObjectToArray(value, array)
            }
        })
    }
}