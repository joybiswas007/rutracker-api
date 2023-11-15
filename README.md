# RuTracker API

This is an unofficial RuTracker API written in Express.js.

## Routes

| Route                | Description | Category |
| -------------------- | ----------- | -------- |
| /api/v1/search       | RuTracker    | General  |

## Usage

The API does not display any dead torrents in the search results.

Payload example:

```
json
{
    "search": "search query"
}
```

## Requirements

1. Navigate to the cloned directory.
2. Install dependencies: `npm install`.
3. Create a `.env` file inside the directory and fill in all the details.

Example `.env` file:
```PORT=15000
RUTRACKER=https://rutracker.org
COOKIE="Paste your cookie here inside double quotes"
USER_AGENT="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36"
```

To obtain the necessary details for the `.env` file:
1. Sign up for a free account on RuTracker.
2. Open the Network tab in your browser and grab your cookie.
3. Feel free to change the user agent as you like.
4. Make sure to place the values inside double quotes in the `.env` file.

### Start server

To run the server locally, use the following command: `npm run dev`.
On the server, use: `npm run start`.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

Show your support by starring [⭐️](https://github.com/joybiswas007/rutracker-api/stargazers) this project!