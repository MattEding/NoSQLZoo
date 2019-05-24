// #1: Give the name and the per capita GDP for those countries with a population of at least 200 million. 
db.world.aggregate( [
    { $match: { population: { $gt: 2e8 } } },
    { $project: { 
        _id: 0, 
        name: 1, 
        capita_gdp: { $divide: [ '$gdp', '$population' ] } 
    } }
] );

// #2: Give the name and the population density of all countries in South America. 
db.world.aggregate( [
    { $match: { continent: 'South America' } },
    { $project: {
        _id: 0,
        name: 1,
        density: { $divide: [ '$population', '$area' ] }
    } }
] );

// #3: Give the name and the population density of all countries with name after V in the alphabet. 
db.world.aggregate( [
    { $match: {
        name: { $gt: 'V' },
        area: { $ne: 0 }
    } },
    { $project: {
        _id: 0,
        name: 1,
        density: { $divide: [ '$population', '$area' ] }
    } }
] );

// #4: Show the name and population in millions for the countries of the continent South America. 
//     Divide the population by 1000000 to get population in millions. 
db.world.aggregate( [
    { $match: { continent: 'South America'} },
    { $project: {
        _id: 0,
        name: 1,
        pop_million: { $divide: [ '$population', 1e6 ] }
    } }
] );

// #5: Show the name and population density for France, Germany, and Italy.
db.world.aggregate( [
    { $match: { name: { $or: [ 'France', 'Germany', 'Italy' ] } } },
    { $project: {
        _id: 0,
        name: 1,
        density: { $divide: [ '$population', '$area' ] }
    } }
] );

// #6: Order the continents by area from most to least. 
db.world.aggregate( [
    { $group: {
        _id: '$continent',
        area: { $sum: '$area' }
    } },
    { $sort: { area: -1 } }
] );

// #7: Show the only two continents with total area greater than 25000000 and then sort from largest to smallest. 
db.world.aggregate( [
    { $group: {
        _id: '$continent',
        area: { $sum: '$area' }
    } },
    { $match: { area: { $gt: 2.5e7 } } },
    { $sort: { area: -1 } }
] );

// #8: For each continent show the first and last country alphabetically.
db.world.aggregate( [
    { $group: {
        _id: '$continent',
        from: { $min: '$name' },
        to: { $max: '$name' }
    } },
    { $sort: { _id: 1 } }
] );

// #9: Group countries according to the first letter of the name as shown. Only give "U" through to "Z". 
//     You will need to use the $substr function and the $push aggregate function. 
db.world.aggregate( [
    { $group: {
        _id: { $substr: [ '$name', 0, 1 ] },
        list: { $push: '$name' }
    } },
    { $match: { _id: { $gte: 'U' } } },
    { $sort: { _id: 1 } }
]);

// #10: Combine North America and South America to America, and then list the continents by area. Biggest first. 
db.world.aggregate( [
    { $group: {
        _id: {
            $cond: [
                { $in: [ '$continent', [ 'North America', 'South America' ] ] }, 
                'America', 
                '$continent' 
            ]
        },
        area: { $sum: '$area' }
    } },
    { $sort: { area: -1 } }
] );

// #11: Show the name and the continent for countries beginning with N - but replace the continent Oceania with Australasia. 
db.world.aggregate( [
    { $match: { name: { $regex: '^N' } } },
    { $addFields: {
        continent: {
            $cond: [
                { $eq: [ '$continent', 'Oceania' ] }, 
                'Australasia', 
                '$continent'
            ]
        }
    } },
    { $project: {
        _id: 0,
        name: 1,
        continent: 1
    } }
] );

// #12: Show the name and the continent but:
//      - substitute Eurasia for Europe and Asia.
//      - substitute America - for each country in North America or South America or Caribbean.
//      - Only show countries beginning with A or B
db.world.aggregate( [
    { $match: { name: { $regex: '^[AB]' } } },
    { $addFields: {
        continent: {
            $switch: {
                branches: [
                    {
                        case: { $in: [ '$continent', [ 'Europe', 'Asia'] ] },
                        then: 'Eurasia'
                    },
                    {
                        case: { $in: [ '$continent', [ 'North America', 'South America', 'Caribbean' ] ] },
                        then: 'America'
                    }
                ],
                default: '$continent'
            }
        }
    } },
    { $project: {
        _id: 0,
        name: 1,
        continent: 1
    } }
] );

// #13: Put the continents right...
//      - Oceania becomes Australasia
//      - Countries in Eurasia and Turkey go to Europe/Asia
//      - Caribbean islands starting with 'B' go to North America, other Caribbean islands go to South America
//      Show the name, the original continent and the new continent of all countries.
db.world.aggregate( [
    { $addFields: {
        original: '$continent',
        new: {
            $switch: {
                branches: [
                    {
                        case: { $eq: [ '$continent', 'Oceania' ] },
                        then: 'Australasia'
                    },
                    {
                        case: { $in: [ '$continent', [ 'Eurasia', 'Turkey' ] ] },
                        then: 'Europe/Asia'
                    },
                    {
                        case: { $eq: [ '$continent', 'Caribbean' ] },
                        then: { 
                            $cond: [
                                { $eq: [ 'B', { $substr: [ '$name', 0, 1 ] } ] },
                                'North America',
                                'South America'
                            ]
                        }
                    }
                ],
                default: '$continent'
            }
        }
    } },
    { $project: {
        _id: 0,
        name: 1,
        original: 1,
        new: 1
    } }
] );