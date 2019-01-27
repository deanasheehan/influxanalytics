FROM node

COPY influx-analytics-meta.json .
COPY train.js .
COPY detect.js .
COPY package.json .
RUN npm install
CMD ["./bin.sh"]






