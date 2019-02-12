module.exports = {
    //recursively flattens a nested json object into a one dimensional array
    // input: json object and an array to push the object values into
    // output: none
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