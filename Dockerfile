FROM node:14-alpine

# Setup install dir
WORKDIR /tmp/gitlab

# Define the homepage for the react app
ENV HOMEPAGE=/pipelines

COPY . .

# Update browserlist
RUN npx update-browserslist-db@latest

RUN npm ci && npm run bootstrap:ci && \
  NODE_ENV=production \
  PUBLIC_URL=$HOMEPAGE/public \
  REACT_APP_HOMEPAGE=$HOMEPAGE \
  npm run build

RUN sh package.sh


FROM node:14-alpine

# Port to listen on
ENV PORT=3000
# Define the home page for the react app
ENV HOMEPAGE=/pipelines
# Wether to log out the env vars
ENV DEBUG=true
# The gitlab domain and app id for oauth
ENV GITLAB_DOMAIN=gitlab.mydomain.com
ENV GITLAB_APP_ID=MY_API_KEY
# Number of projects to fetch
ENV PROJECTS_NB=10


EXPOSE 3000

COPY --from=0 /etc/gitlab /etc/gitlab

WORKDIR /etc/gitlab

CMD ["node", "app.js"]