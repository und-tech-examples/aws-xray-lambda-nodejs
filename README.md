# aws-xray-lambda-nodejs
Demo para depurar y analizar sus aplicaciones con AWS x-ray para encontrar la causa raíz de los problemas y rendimiento.

# Arquitectura
# ![Logo](aws-xray-lambda-nodejs-architecture.png)

# Despliegue
Se debe ejecutar la plantilla en CloudFormation para crear los recursos, donde se utiliza S3 como trigger para ejecutar una función Lambda quien inserta un registro en DynamoDB, todo este proceso está monitoreado por AWS x-ray.

Primeramente se instala el SDK del X-Ray con npm. Puedes usar un contenedor chainio/lambda-ci-nodejs6.10

    ```
    docker run -ti --privileged -v C:\Users\rctaptap\laboratorios:/data --name node_01 -d chainio/lambda-ci-nodejs6.10 /bin/bash
    docker exec -ti node_01 bash```
    
Se instala el SDK del X-Ray con npm
    ```npm install aws-xray-sdk```
    
Luego subes el código en un archivo comprimido ZIP en S3, para llamar a tu código desde la plantilla de CloudFormation.
    ```YAML
      Code:
        S3Bucket: "bucket"
        S3Key: "rctaptap/aws-xray-lambda-nodejs.zip"```
        
Una vez modificada la plantilla puedes ejecutar desde la consola de AWS en el servicio CloudFormation o con AWS CLI con el siguiente comando:
    ```aws cloudformation deploy --template-file template.yaml --stack-name aws-xray-lambda-nodejs --capabilities CAPABILITY_NAMED_IAM --region ap-northeast-1```

# Detalle del código

Únicamente iniciar el método de “capture calls” del SDK y asignando una variable “aws” con la función deseada:

    ```JAVASCRIPT
    var xray = require("aws-xray-sdk");
    var aws = xray.captureAWS(require("aws-sdk"));```

El getSegment() trae el “segment actual” que es inmutable (o sea, iniciado por el ALB/APIGw, o lo que sea...) y el addAnnotation() agrega una nota el segment.

    ```JAVASCRIPT
    var demo_segment = xray.getSegment().addNewSubsegment("demo");
    demo_segment.addAnnotation("Object", object);```

Con el addMetadata,  tu también puedes agregar cualquier otro obyecto el trace, aún que no sea “searchable”.

  ```JAVASCRIPT
  demo_segment.addMetadata(object, data);```
  
Después de finalizar el proceso y cerrar el callback, también cerramos el segment. Debes hacerlo con cualquier segment que sea customizado por vos, mientras los segmentos “inmutables” van a ser cerrados por el propio SDK.

    ```JAVASCRIPT
    demo_segment.close();
    callback(null, "done");```

Eso es básicamente todo lo que requiere el SDK de X-Ray. De ahí, creo que puedes avanzar en hacer testeos.

Es interesante también mirar el ejemplo q tenemos (también en node...): [xray node express sample](https://github.com/aws-samples/eb-node-express-sample/tree/xray)

# Detalle del template
La pantilla tiene 3 secciones y la creación de los recursos necesarios.

```YAML
    Description:
    Parameters:
    Resources:
      MyLambdaFunction:
      LambdaExecutionRole:
      BucketSource:
      LambdaInvokePermission:
      TableDest:```
      
Description
Parameters
Resources
MyLambdaFunction
LambdaExecutionRole
BucketSource
LambdaInvokePermission
TableDest
