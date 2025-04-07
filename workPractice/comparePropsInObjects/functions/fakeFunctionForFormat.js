// Because mongo data have these objects that JS do not understand, so we change all of it to String
module.exports = {
    ObjectId: (value) => { return String(value) },
    ISODate: (value) => { return String(value) },
    NumberLong: (value) => { return String(value) },
    NumberInt: (value) => { return String(value) },
    Long: (value) => { return String(value) },
}