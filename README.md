# RuTracker API

This is an unofficial RuTracker API written in Node.js.

## Routes

| Route                | Description | Category |
| -------------------- | ----------- | -------- |
| /api/v1/search       | RuTracker   | General  |
| /api/v1/searchbyhash | RuTracker   | General  |
| /api/v1/searchdb     | Database    | Database |

## Usage

requires Node version >=8.3.0

The API does not display any dead torrents in the search results.
If torrent available in db then return existing result(s) or if not avilable
in DB then scrape the site.

Payload example:

```
json
method: POST
/api/v1/search route:
{
    "search": "search query"
}

/api/v1/searchbyhash:
also user can search via hash to check for specific torrent
{
    "hash": "infohash"
}

/api/v1/searchdb route:
{
    "search": "search query"
}
```

## Requirements

1. Navigate to the cloned directory.
2. Install dependencies: `npm install`.
3. Create a `.env` or copy the `.env.sample` to `.env` using this command
   `cp .env.sample .env` file inside the directory and fill in all the details.

Example `.env` file:

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@serverip/dbname
PORT=15000
RUTRACKER=https://rutracker.org
COOKIE="Cookies must be in double quotes"
USER_AGENT="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36"
```

If you want to show debug logs then add this line in your .env file
`DEBUG=express:router node server.js`

To obtain the necessary details for the `.env` file:

1. Sign up for a free account on RuTracker.
2. Open the Network tab in your browser and grab your cookie.
3. Feel free to change the user agent as you like.
4. Make sure to place the values in the `.env` file.

## Run the Server

- For development environment: `npm run dev`
- For production environment: `npm run start`

You can also run the API using `pm2`. If you don't have `pm2` installed, install it using the following command: `npm i pm2 -g`. Ensure pm2 automatically starts up when the server restarts.

Follow these steps to spin up the server:
To launch the API, use: `npm run server:up`
To refresh the API, use: `npm run server:restart`
To shut down the API, use: `npm run server:down`

It's recommend to running the API with PM2. It allows you to keep your Node. js applications running continuously: PM2 can automatically restart your application if it crashes, and it can also automatically reload your application when you update your code

## Tech Stack

Built with:

- Node.js
- Express.js
- dotenv
- Mongoose
- Winston

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

Show your support by starring [⭐️](https://github.com/joybiswas007/rutracker-api/stargazers) this project!
