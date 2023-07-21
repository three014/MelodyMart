### Local testing with db

In this directory there is a `docker-compose.yml` file that contains a mongodb image.

To use, install docker for your operating system [here](https://docs.docker.com/engine/install/),
if you haven't already. 

To start the container, run 
`docker compose up -d` in your terminal in the same directory as the .yml file.

The docker container should bind to address `0.0.0.0` with a default username 
of `root` and a default password of `password`, and uses the `27017` port. 
Please don't ever expose this container to the open internet as it is almost
as not-secure as it gets.

#### Copy-Paste for mongo-url:
`MONGO_URL="mongodb://root:password@0.0.0.0:27017/?retryWrites=true&w=majority"`