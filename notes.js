const meal = {
    _id: 1,
    food: [1, 2],
    date: ISODate(),
}

const food = {
    _id: 1,
    description: 'French Fries',
    calories: 400,
    servingSize: '1 cup',
    image: 'fry.jpg',
}

const food = {
    _id: 2,
    description: 'Ketchup',
    calories: 20,
    servingSize: '1 squeeze',
    image: 'ket.jpg',
}


db.meal.insert(food)
db.meal.insert(meal)



db.meal.remove({})
db.food.remove({})



// ALTER USER 'eden'@'localhost' IDENTIFIED WITH mysql_native_password BY '1425-Avon';