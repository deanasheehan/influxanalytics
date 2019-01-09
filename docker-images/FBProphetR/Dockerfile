FROM r-base

COPY influx-analytics-meta.json /influx-analytics-meta.json
COPY script.R /script.R
COPY input.csv /input.csv

RUN Rscript -e "install.packages('prophet')"

CMD ["Rscript", "script.R","10"]




