# The Nachrichten App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## 1. Get Started

i. Clone the Repo

`git clone <repo_url>`

ii. Enter into document

`cd <project-folder>`

## 2. Ensure Docker is installed and running

## 3. Build and run container

```
cp .env.development .env // to use environment variables
docker build -t news-app:dev .
docker run -p 3000:3000 news-app:dev
```

## 4. Access the app at:

```
http://localhost:3000/
```

## 5. Stop the container when done:

```
docker ps  # Get the container ID
docker stop <container_id>
```


That's all. Thank you!
