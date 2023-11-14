## RuTracker API

Unofficial rutracker API written in Express.js.

## Route

| Route                            | Description     | Category |
| -------------------------------- | --------------- | -------- |
| /api/v1/search                   | RuTracker       | General  |


## Usage

Api doesn't show any dead torrents in search result.

Payload examples:

```
*routes:
method: POST
Content-Type: application/json

{
    "search": "search query"
}
```

## Requirements

Navigate to the cloned directory

Install dependencies: `npm install`

Create a `.env` file inside the directory and fill in all the details.

Example `.env` file:

```
PORT=15000
RUTRACKER=https://rutracker.org
COOKIE="Paste your cookie here inside double quotes"
USER_AGENT="Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36"

```
First signup for a free account on rutracker and open Network tab
from browser and grab your cookie. And feel free to change the
user agent as you like. Make sure to place them inside double quotes
in the .env file.

### Start server

To run the server locally, use the following command: `npm run dev`
<br>On server: `npm run start`

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

Show your support by starring [⭐️](https://github.com/joybiswas007/rutracker-api/stargazers) this project!
