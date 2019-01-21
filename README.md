# Influx Analytics

This is one hack of a prototype.

UI is built using Angular (TypeScript) and is currently served up using 'ng serve'

API is built using NodeJS (regular JavaScript, not TypeScript)

## Next Steps

Spin up the container with mock input data, no command line arguments (forecast days for example), collect output data

- Really checking here that we can spin up (having built) ProphetR having first put some input data in place and that we can collect output data after the process has finished but before the container is killed.

- Then it will be about collecting data from influx via Flux query
- - We'll have had to load that data into Influx first
- - Query will be hand coded and copy n pasted from outside

- Then it is about writing the captured result back to Influx via API calls 
- - This will not use Flux, it will be direct API Write and we'll need to have a map of cols to field names (and tags) to write to 

- Then we want to show the past and present activities list

### To make MAD example work
- We need to separate out 'Train Model' action from 'Activate Detection'
- - Train model will take data just like Generate Forecast.
- - When it is complete the instance will be given back some state (it will be collected from filesystem?)
- - Then that state will 'enable' the 'Activate Detection'
- - - This will require a different input stream of data and to be triggered periodically.
- - There has to be a way to turn off Anomoly Detection. 'Deactivate Detection'

### Spark Streaming
- - Like the Activate Detection without the Training BUT using stream in and out in some way

# TODO
- Instances Detail to show all enabled actions. For forecast only one, for MAD then Train and then Train + Detect






