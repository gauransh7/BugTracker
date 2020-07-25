# BugTracker
BugTracker solves the problem of testing by managing many applications and associated bugs in an organized way with regular updates in status during different testing stages.

#### Front-end(bugtracker) is build with :

- [React](https://reactjs.org/)
- [Redux](https://redux.js.org/)


#### Back-end(imgsummer2020) is build with :

- [Django](https://www.djangoproject.com/)
- [Django REST framework](https://www.django-rest-framework.org/)

# SETUP for Backend :

1. Prerequisites:

    * Python 3
    * pip
    * MySql
    * Docker

1. Setup a virtual environment:

    ```
    python3 -m venv bug_tracker_env
    ```

1. Activate the virtual environment:

    ```
    source bug_tracker_env/bin/activate
    ```

1. Create a MySql database named BugTracker.

1. Run the following command to install all the required dependencies:

    ```
    pip install -r requirements.txt
    ```

1.  Inside folder /imgsummer2020/imgsummer2020 create a file .env and store the following credentials inside it:

    ```
    SECRET_KEY=your-secret-key
    DB_USER=username
    DB_PASSWORD=password
    EMAIL_USER=hostuseremail
    EMAIL_PASSWORD=hostuserpassword
    CLIENT_ID=clientidofapplication
    CLIENT_SECRET=clientsecretofapplication
    ```

    **NOTE:** Take a look at .env.example for the format of .env file

1. Navigate back to the base directory for the app where manage.py file is located and make the database migrations using following command:

    ```
    python manage.py migrate
    ```

1. Start a Redis server on port 6379 using the following command:

    ```
    docker run -p 6379:6379 -d redis:5
    ```

1. Start the backend server:

    ```
    python mange.py runserver
    ```