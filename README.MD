# Project 3



## Description

Project 3 is an app to manage costs and expenses among mates. It will let you to keep track of all your costs (the receipts you have paid for) and your expenses (the proportional part of a cost your friends owe to you). Or, who knows, maybe you are the defaulter here. An easy way to know who you owe money to or who owes you money. 

## User Stories

- **404:** As an anon/user I can see a 404 page if I try to reach a page that does not exist so that I know it's my fault

- **Signup:** As an anon I can sign up in the platform so that I can start using the app

- **Login:** As a user I can login to the platform so that I can manage my expenses

- **Logout:** As a user I can logout from the platform so no one else can use it

- **View/edit Profile** As a user I can edit and check my profile and it will be visible for all my groups members

- **Create/edit/delete group** As a user I can create groups to manage different expenses, edit and delete them

- **Add/delete Costs** As a user I can add and delete the costs I payed to/from my groups lists

- **Add/delete Expenses** As a user I can add and delete expenses to/from my lists

- **Arrangements** As a user I can check all the debts I have and all my pending incomes


  

## Backlog



# Client / Frontend

## React Router Routes (React App)

| Path      | Component  | Permissions             | Behavior                                                     |
| --------- | ---------- | ----------------------- | ------------------------------------------------------------ |
| `/`       | HomePage   | public `<Route>`        | Home page                                                    |
| `/signup` | SignupPage | anon only `<AnonRoute>` | Signup form, link to login, navigate to homepage after signup |
| `/login`  | LoginPage  | anon only `<AnonRoute>` | Login form, link to signup, navigate to homepage after login |
|           |            |                         |                                                              |
|           |            |                         |                                                              |
|           |            |                         |                                                              |
|           |            |                         |                                                              |
|           |            |                         |                                                              |
|           |            |                         |                                                              |
|           |            |                         |                                                              |
|           |            |                         |                                                              |
|           |            |                         |                                                              |
|           |            |                         |                                                              |
|           |            |                         |                                                              |

## Components

- LoginPage
- Navbar

## Services

- Auth Service

  - auth.login(user)
  - auth.signup(user)
  - auth.logout()
  - auth.me()
  - auth.getUser() // synchronous

  



# Server / Backend

## Models

User model

```
{
  username: {type: String, required: true, unique: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  image: {type: String, default: ""},
  phone: {type: Number},
  groups: {type: Array},
}
```

Group model

```
{
  name: {type: String},
  image: {type: String, default: ""},
  members: {type: Array},
  costs: {type: Array},
}
```

Cost model

```
{
  concept: {type: String, required: true},
  import: {type: Number, required: true},
  ticket: {type: string},
  group: {type: Schema.Types.objectId, ref: "Group"},
  buyer: {type: Schema.Types.objectId, ref: "User"},
  data: { type:Date, default: Date.now },
}
```

Expense model

```
{
  import: {type: Number},
  payed: {type: Boolean, default: false},
  cost: {type: Schema.Types.objectId, ref: "Cost"},
  user: {type: Schema.Types.objectId, ref: "User"},
}
```



## API Endpoints (backend routes)

| HTTP Method | URL                        | Request Body                                                 | Success status | Error Status | Description                                                  |
| ----------- | -------------------------- | ------------------------------------------------------------ | -------------- | ------------ | ------------------------------------------------------------ |
| POST        | `/auth/signup`             | {username, email, password}                                  | 201            | 404          | Checks if fields not empty (422) and user not exists (409), then create user with encrypted password, and store user in session |
| POST        | `/auth/login`              | {email, password}                                            | 200            | 401          | Checks if fields not empty (422), if user exists (404), and if password matches (404), then stores user in session |
| POST        | `/auth/logout`             | (empty)                                                      | 204            | 400          | Logs out the user                                            |
| GET         | `/profile`                 | Saved session                                                | 200            | 404          | Check if user is logged in and return profile page           |
| POST        | `/profile`                 | {image, phone}                                               | 200            | 404          | Create the user profile                                      |
| PUT         | `/profile`                 | {username, email, image, phone}                              | 200            | 400          | Update user profile                                          |
| POST        | `group/add`                | {name, members, image, users id array}                       | 200            | 400          | Create a group to share expenses with                        |
| PUT         | `group/edit/:id`           | {name, members, image, users id array}                       | 200            | 400          | Edit an existing group                                       |
| DELETE      | `/group/delete/:id`        | {id}                                                         | 200            | 400          | Delete an existing group                                     |
| GET         | `/group/show`              | {}                                                           |                | 400          | Show all the existing groups                                 |
| GET         | `/group/group-details/:id` | {id}                                                         |                | 400          | View group details page                                      |
| POST        | `/cost/create`             | {concept, description, import, image, user id (buyer), group id, array users id} | 200            | 400          | Introduce a cost                                             |
| DELETE      | `/cost/delete/:id`         | {id}                                                         | 200            | 400          | Delete an existing cost                                      |
| POST        | `/expense/create`          | {import, payed , cost id, user id, }                         | 200            | 400          | Set the expense for each group member                        |
| DELETE      | `/expense/delete/:id`      | {id}                                                         | 200            | 400          | Delete an existing expense                                   |
| GET         | /arrangements              |                                                              |                | 400          | Check all your debts and all your pending incomes            |



## Links

### Trello

Link to your trello board

https://trello.com/b/fmtoOs4Z/organitzaci%C3%B3-projecte-3

### Git

The url to your repository and to your deployed project

### Slides

The url to your presentation slides

