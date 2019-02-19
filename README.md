## HOW TO BUILD AND RUN SPROTTY EXPERIMENT


### Build client

$ cd client

$ yarn examples:build && yarn build

### Build server

$ cd server

$ gradle build

### Run Jetty

$ cd server

$ gradle jettyRun

![img1](https://github.com/patrickneubauer/sprotty-experiment/raw/master/img/img1.png)

### See result

Browse to http://localhost:8080/examples/crossflow/crossflow-server.html

[Produced console output](jettyRun.log)

![img2](https://github.com/patrickneubauer/sprotty-experiment/raw/master/img/img2.png)

![img3](https://github.com/patrickneubauer/sprotty-experiment/raw/master/img/img3.png)

![img4](https://github.com/patrickneubauer/sprotty-experiment/raw/master/img/img4.png)

The above screenshot shows an error related to a resource that could not be found, this is equal to the output produced by the [demo running on the typefox server](http://sprotty-demo.typefox.io/examples/flow/flow-server.html) (screenshot below). Therefore, it should not be the cause of the missing visualization.

![img6](https://github.com/patrickneubauer/sprotty-experiment/raw/master/img/img6.png)

------

## Background on Crossflow 

### Metamodel

![img7](https://github.com/patrickneubauer/sprotty-experiment/raw/master/img/img7.png)

### Exemplary model

![img5](https://github.com/patrickneubauer/sprotty-experiment/raw/master/img/img5.png)

