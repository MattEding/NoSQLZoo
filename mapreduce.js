// #1: Use a map function to get the names of countries in Europe.
db.world.mapReduce(
    function() {
        if (this.continent === 'Europe'){
            emit(this.name, null);
        }
    },
    function(key, val) {
        return val;
    },
    { out: { inline: 1 } }
);

// #2: Use the previous answer to find the population of the world to the nearest million.
db.world.mapReduce(
    function() {
        emit(null, this.population);
    },
    function(key, val) {
        return Math.round(Array.sum(val) / 1e6) * 1e6;
    },
    { out: { inline: 1 } }
);

// #3: For each letter, determine how many country names begin with that letter.
db.world.mapReduce(
    function() {
        emit(this.name[0], 1);
    },
    function(key, val) {
        return Array.sum(val);
    },
    { out: { inline: 1 } }
);

// #4: Show the number of countries in each continent.
db.world.mapReduce(
    function() {
        emit(this.continent, 1);
    },
    function(key, val) {
        return Array.sum(val);
    },
    { out: { inline: 1 } }
);

// #5: Show the name and area of the smallest 3 countries by area. Ignore records where the area is 0 or null.
// NOTE: I could not figure out how to do with mapReduce; easy with aggregate
// TODO: https://stackoverflow.com/questions/42265002/how-to-sort-and-limit-result-mapreduce-in-mongodb
db.world.aggregate(
    { $match: { area: { $nin: [ 0, null ] } } },
    { $project: {
        _id: 0,
        name: 1,
        area: 1
    } },
    { $sort: { area: 1 } },
    { $limit: 3 }
);

// #6: For each continent, find the first and last country alphabetically.
db.world.mapReduce(
    function() {
        emit(this.continent, { first: this.name, last: this.name });
    },
    function(key, emits) {
        arr = Array();
        for (var i in emits) {
            arr.push(emits[i].first);
        }
        arr.sort();
        return { first: arr[0], last: arr[arr.length-1] };
    },
    { out: { inline: 1 } }
);

// #7: Return country names or capital cities that start with a letter 'M' as keys, use null as the value.
db.world.mapReduce(
    function() {
        let capital = this.capital;
        if (capital[0] === 'M') {
            emit(capital, null);
        }
        let name = this.name;
        if (name[0] === 'M') {
            emit(name, null);
        }
    },
    function(key, emits) {
        return null;
    },
    { out: { inline: 1 } }
);

// #8: For each letter in the alphabet find the amount of cities that start with that letter.
//     Additionally, find the two cities that come first and last alphabetically for that letter.
// db.world.mapReduce(
//     function() {
//         emit(this.capital[0], { count: 1, first: this.captial, last: this.capital });
//     },
//     function(key, emits) {
//         let total = 0;
//         let arr = Array();
//         for (var i in emits) {
//             total++;
//             arr.push(emits[i].first);
//         }
//         arr.sort();
//         return { first: arr[0], last: arr[arr.length-1], count: total };
//     },
//     { out: { inline: 1 } }
// );

// #10: Show country count for countries in the following ranges:
//      [0, 1e6, 2e6, 3e6, 5e6, 1e7, 1.5e7, inf]