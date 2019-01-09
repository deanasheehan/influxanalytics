library(prophet)

args = commandArgs(trailingOnly=TRUE)

days = 365
print(days)
if (length(args)==1) {
   days = strtoi(args[1])
} 

df <- read.csv('./input.csv')
m <- prophet(df)
future <- make_future_dataframe(m, periods = days,include_history = FALSE)
forecast <- predict(m, future)
write.csv(forecast,file="./output.csv")