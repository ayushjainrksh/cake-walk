To view the live API, visit http://ec2-15-206-160-179.ap-south-1.compute.amazonaws.com:5000/api/v1/user/ping

## Problem statement
Mary enjoys baking and has earned the reputation of being a pro pastry chef among her friends and family. Her raisin cookies are especially famous. She now wishes to turn her talent into a business. She's accordingly looking to set-up an online shop where anyone can place an order for her cookies. She has formed her own delivery team and has a plan for her business. Only the technical aspect of the same is left to be built, which is something you shall take up.

## Cake Walk
Cake Walk is a collection of APIs to simplify food ordering and delivery mechanism. The list of features included in cake walk API are:
- An authentication mechanism requiring the users to sign in
- An online shop where the users can order cookies
- Assign orders to the available delivery executives automatically and efficiently
- The system can assign the delivery order to any delivery executive who is already on the way to deliver to another customer in the same area
- Users can check the ETA of the order
- Once the delivery executive marks an order as "delivered", the system should then be able to assign new orders to them.
- Implements access control to the API endpoints, allowing authorized users to make a request to the APIs
- Mary as a root user shall have access to all the APIs, and the delivery executive will only be able to make a request to the APIs that are used for fetching the orders and marking an order as delivered while the users can only access their own orders
- A dashboard where Mary can view all the orders with only Mary being authorized to use this dashboard
- Mary can create other root users. Root users can view the dashboard.

## Design
![cake walk design](https://github.com/ayushjainrksh/cake-walk/blob/master/static/cake-walk-design.png)

## Tech stack
- Backend - Node.js
- Database - Mongodb
- Deploy - AWS EC2

## Setup
> You can use the hosted APIs to test the application
1. Clone the repo
#### `git clone https://github.com/ayushjainrksh/cake-walk.git`
2. Install dependencies
#### `npm install`
3. Add env file
#### `touch .env`
4. Add following to env
```
JWT_ENCRYPTION = <encryption token>
JWT_EXPIRATION = <expiration time>
MONGO_URI = <add a mongodb atlas URI or you can leave it to use your local mongodb database>
```
5. Start the server
#### `npm start`

## APIs
### User
- `GET /api/v1/user/ping`
- `POST /api/v1/user/create`
- `POST /api/v1/user/createRootUser`
- `GET /api/v1/user/getAll`

### Item
- `POST /api/v1/item/create`
- `GET /api/v1/item/getAll`
- `GET /api/v1/item/:id`
 
### Order
- `POST /api/v1/order/place`
- `GET /api/v1/order/getAll`
- `GET /api/v1/order/:id`
- `PATCH /api/v1/order/:id/update`

## Instructions
To try out various APIs you would require different levels of access. The root user can only be created by a root user as suggested.
- For sample you can use root user with credentials:
```
email: mary@gmail.com
password: hello123
```
- Login as the root user with postman and copy the Bearer token from response.
> You must send the credentials as request body.
- Use this token as Authorization token in postman to make other requests such as `GET /api/v1/order/getAll`

> I have created most of the requests in postman. Let me know if you want me to invite you to collaborate in Postman.


Created with :heart: by Ayush Jain
