// #1: Show Germany instead of France. 
db.world.find( { name: 'Germany' } );

// #2: List all the countries in the continent of "Eurasia". 
db.world.find(
    { continent: 'Eurasia' }
).pretty();

// #3: Find the country with an area of exactly 43094. 
db.world.find(
    { area: 43094 }
).pretty();

// #4: Show each country with a population of over 250000000.
//     Sort the results alphabetically. 
db.world.find(
    { population: { $gt: 2.5e8 } },
    { _id: 0, name: 1 }
).sort(
    { name: 1 } 
).pretty();

// #5: List the countries that come after "S" in the alphabet. 
db.world.find(
    { name: { $gt: 'S' } },
    { _id: 0, name: 1 }
);

// #6: Find the name and capital cities for countries with a population of over 70 million. 
db.world.find(
    { population: { $gt: 7e7 } },
    { _id: 0, name: 1, capital: 1 }
);

// #7: Find the countries that have a population that is over 200 million or less than 20,000. 
db.world.find(
    { $or: [
        { population: { $gt: 2e8} },
        { population: { $lt: 2e4} }
    ] },
    { name: 1, population: 1, _id: 0 }
);
