# FI - React app

## AI-driven Fitness Indicator (Opportunities against Volunteers) - FI
Lead: [matt-stedman](https://github.com/Matt-Stedman/)

### Why
Find the best suited opportunities for volunteers, and re-design how these best fits are shown on the platform.

### How
Produce an overall score and breakdown of all the elements of a post, with a rational behind it. Also have it tweakable with 👍 and 👎 ratings of the score.

### What
Goodsted simplifies opportunity posting with AI-powered assistance. As users create their opportunity posts, the AI system provides helpful suggestions to enhance the quality and effectiveness of the listings. By reducing the effort required to create compelling posts, Goodsted empowers opportunity posters to focus on the core details that matter, ultimately attracting more volunteers and maximizing the impact of their initiatives.

## To run

This is a ReactJS Front-end only application.
To run, first ensure you have `npm` installed, then run `npm run i` to install all dependencies.

Once all dependencies are installed you can run `npm run start` to start the service.

## Backend

We don't have a backend per-se, all queries are stored within the [OpenAI Functions](./src/functions/OpenAi.js), with OpenAI rendering all the results in their API.
We do have a Google Cloud Function running as a Proxy to provide unrestricted access to this front end (otherwise we'll cause OpenAI API Key leaks), which is super not secure!, but works for now (and is at least limited in cost!).

### You will need

We require an OpenAI API key in the `secrets.js` file. You can generate your own OpenAI api key by signined up on [the Open AI API website](https://openai.com/blog/openai-api).

Your `secrets.js` file will look like:
```js
export const OPEN_AI_API_KEY = "YOUR OPENAI API KEY";
```

## React pre-amble
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
