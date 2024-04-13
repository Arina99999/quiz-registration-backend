
# Quiz Management System

This Quiz Management System is a Node.js Express application designed to manage users, teams, and quizzes. It offers a simple in-memory storage solution, which is initialized from and backed up to a JSON file. The system allows the creation, retrieval, and deletion of user and team entities, and the management of quiz events.

## Features

- **User Management**: Create, retrieve, and delete users. Each user can optionally be a team leader.
- **Team Management**: Create, retrieve, and delete teams. Teams are linked to users and a specific quiz.
- **Quiz Management**: Create, retrieve, and delete quizzes. Quizzes include details like title, description, location, theme, and associated teams.

## Installation

To run this project, you will need Node.js and npm installed. Follow these steps to set it up locally:

1. Clone the repository:
   ```bash
   git clone [your-repository-link]
   cd [repository-name]
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```

## Usage

The server runs on `http://localhost:3000`. Below are the API endpoints available:

### Users

- **GET /users**: Retrieves all users.
- **GET /users/:id**: Retrieves a single user by ID.
- **POST /users**: Creates a new user.
  - Body:
    ```json
    {
      "id": "user1",
      "name": "John Doe",
      "password": "123456",
      "isTeamLeader": false
    }
    ```
- **DELETE /users/:id**: Deletes a user by ID.

### Teams

- **GET /teams**: Retrieves all teams.
- **POST /teams**: Creates a new team.
  - Body:
    ```json
    {
      "id": "team1",
      "name": "Team Alpha",
      "user_list": ["user1", "user2"],
      "quiz_id": "quiz1",
      "creator_id": "user1"
    }
    ```
- **DELETE /teams/:id**: Deletes a team by ID.

### Quizzes

- **GET /quiz**: Retrieves all quizzes.
- **POST /quiz**: Creates a new quiz.
  - Body:
    ```json
    {
      "id": "quiz1",
      "title": "Fun Quiz Night",
      "description": "A fun quiz for everyone!",
      "date": "2024-05-01",
      "team_list": ["team1"],
      "location": "Downtown Hall",
      "theme": "General Knowledge"
    }
    ```
- **DELETE /quiz/:id**: Deletes a quiz by ID.

## Data Persistence

Data is saved to and loaded from `data.json` in the root directory. Ensure that this file is writable. The system saves data on exit but does not handle more dynamic persistence between requests.

## Contributing

Contributions are welcome. Please fork the repository and submit a pull request with your changes.

## License

Distributed under the MIT License. See `LICENSE` for more information.
