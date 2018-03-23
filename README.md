# aws-xray-lambda-nodejs
Demo para depurar y analizar sus aplicaciones con AWS x-ray para encontrar la causa raíz de los problemas y rendimiento.

#Arquitectura
# ![Logo](aws-xray-lambda-nodejs-architecture-.png)

#Despliegue
Se debe ejecutar la plantilla en CloudFormation para crear los recursos, donde se utiliza S3 como trigger para ejecutar una función Lambda quien inserta un registro en DynamoDB, todo este proceso está monitoreado por AWS x-ray.

#Detalle del código

#Detalle del template

