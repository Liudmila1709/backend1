
const bodyParser = require('body-parser')
const express = require('express')
const { USERS } = require('./db')
const { randomUUID } = require('crypto')
const { authorizationMiddleware } = require('./middlewares')

const app = express()

app.listen(8080,() => {
    console.log(`Server was started`);
});

app.get('/', (req, res) => {
    res.send('Hi')
})



// Express body-parser is an npm module used to process data sent in an HTTP request body.
app.use(bodyParser.json)
/**
 * app.use - add new middleware
 */

//to create user
app.post('/users', (req, res) => {
    const {body} = req
} )
// body object allows you to retrieve data sent in the request body
const isUserExist = USERS.some(el => el.login == body.login)

if (isUserExist){
    return res.status(404).send({
        message: `User with login ${body.login} already exists`
    });
}

USERS.push(body);
console.log('User was created', JSON.stringify(body));
res.status(201).send({message: 'User was created'});
// to user log-in in sistem 
app.post('/login', (req, res) => {
    const { body } = req;
    //код const { body } = req; означає, що з об'єкта req витягується властивість body, і її значення присвоюється змінній з іменем body

    const user = USERS.find(el => el.login === body.login && el.password === body.password);
    if (!user) {
        return res.status(400).send({message: 'user was not found'})
    }
});
//ця частина потрібна потрібна вже на самому сайті?
// create unique id for our user
const id = randomUUID();
user.id = id // try user.id = nameId
res.status(200).send({message: 'user was logged-in' , id}) // try res.status(200).send({message: 'user was logged-in' , nameId})

// for do order in our site to user can do his trip (this is point A and this is point B)
//create order
app.post('/orders', authorizationMiddleware, (req, res) => {// we do not have base of data than we need authorizationMiddleware
    const { body , data: {user}} = req;// оголошуємо яким буде запит?
    const order = { ...body, login: user.login}
    ORDERS.push(order);
    res.status(200).send({message: 'order was created', order})
});

// get all orger our user

// app.get('/orders', authorizationMiddleware, (_req) => { ... });: Цей рядок встановлює маршрут для обробки GET-запитів на шлях '/orders'. Він також вказує на те, що перед обробкою запиту, потрібно спочатку виконати middleware (проміжний обробник) з назвою 'authorizationMiddleware'.
// const { data: { user } } = req;: Цей рядок використовує деструктуризацію для отримання об'єкта user з властивості data, яка міститься в об'єкті req. Це передбачається, що після проходження через middleware authorizationMiddleware, дані про користувача були додані до об'єкта запиту req.
// const orders = ORDERS.filter(el => el.login === user.login);: Цей рядок фільтрує масив ORDERS, щоб вибрати лише ті замовлення, для яких логін користувача (записаний у властивості login) збігається з логіном поточного користувача, який був отриманий з об'єкта user.

app.get('/orders', authorizationMiddleware, (req, res) => {
    const {data: {user}} = req;
    const orders = ORDERS.filter(el => el.login === user.login); // ті що є в масиві і ті що ввів конкретний користувач припустимо він у нас один
    return res.status(200).send(orders);
});

//get last 5 orders of our user

app.get('/lastOrders', authorizationMiddleware, (req, res) => {
    const {data: {user}} = req
    const orders = ORDERS.filter(el => el.login === user.login);
    if (orders.length > 0 ) {
        const lastorders = orders.slice(-5);
        //slice method return us some elements of array
        return res.status(200).send(lastorders)
    }else{
        return res.status(400).send('user does not have any orders')
    }
})
