FROM ubuntu

COPY influx-analytics-meta.json .
COPY forecast.sh .
COPY input.csv .
COPY mock-output.csv .

CMD ["./forecast.sh", "365"]






