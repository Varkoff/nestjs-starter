# https://www.tomray.dev/nestjs-docker-production

# BUILD FOR PRODUCTION
FROM node:18-bullseye-slim As build

# Install openssl for Prisma
RUN apt-get update && \
    apt-get install -y openssl

# Create app directory
WORKDIR /myapp

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY --chown=node:node package.json package-lock.json ./

# Install app dependencies
RUN npm ci

# Bundle app source
COPY --chown=node:node . .

# USER node

ADD prisma .
RUN npx prisma generate

# Creates a "dist" folder with the production build
RUN npm run build

# Running `npm ci` removes the existing node_modules directory and passing in --only=production ensures 
# that only the production dependencies are installed. 
# This ensures that the node_modules directory is as optimized as possible
RUN npm ci --omit=dev && npm cache clean --force

# PRODUCTION
FROM node:18-bullseye-slim As production

ENV TZ=Europe/Paris
# RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN apt-get install -y tzdata && \
    ln -fs /usr/share/zoneinfo/$TZ /etc/localtime && \
    echo $TZ > /etc/timezone && \
    dpkg-reconfigure -f noninteractive tzdata

ARG DATABASE_URL \
    FRONTEND_URL \ 
    JWT_SECRET \

ENV PORT="8000"
ENV NODE_ENV="production"


# add shortcut for connecting to database CLI
RUN echo "#!/bin/sh\nset -x\nsqlite3 \$DATABASE_URL" > /usr/local/bin/database-cli && chmod +x /usr/local/bin/database-cli

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=build /myapp/node_modules ./node_modules
COPY --chown=node:node --from=build /myapp/node_modules/.prisma ./node_modules/.prisma
COPY --chown=node:node --from=build /myapp/prisma ./prisma
COPY --chown=node:node --from=build /myapp/start.sh ./start.sh
COPY --chown=node:node --from=build /myapp/package.json ./package.json
COPY --chown=node:node --from=build /myapp/public ./public

ENTRYPOINT ["./start.sh"]
# Start the server using the production build