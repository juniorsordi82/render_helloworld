process.env.CYCLIC_DB = "good-gold-zebra-kiltCyclicDB";
const dbDyn = require('@cyclic.sh/dynamodb');

async function tests() {
    let animals = dbDyn.collection('animals')

    // create an item in collection with key "leo"
    let leo = await animals.set('leo', {
        type: 'cat',
        color: 'orange'
    })

    // get an item at key "leo" from collection animals
    let item = await animals.get('leo')
    console.log(item)
}

module.exports = {
    tests
}