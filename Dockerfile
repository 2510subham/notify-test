FROM node:18-bullseye-slim AS development
EXPOSE 5000

WORKDIR /app
COPY ./package.json .
RUN npm i --omit=dev

COPY . .

FROM node:18-bullseye-slim AS production

ENV NODE_ENV=production
ENV TZ=Asia/Kolkata
WORKDIR /app

COPY --from=development /app/node_modules ./node_modules
COPY --from=development /app/package.json ./package.json
COPY --from=development /app/index.js ./index.js
COPY --from=development /app/firebaseConfig.json ./firebaseConfig.json

# RUN rm -f /app/package.json

CMD ["node", "/app/index.js"]