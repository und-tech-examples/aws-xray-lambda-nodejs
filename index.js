var xray = require("aws-xray-sdk");
var aws = xray.captureAWS(require("aws-sdk"));

var dynamodb = new aws.DynamoDB();
var s3Object = null;

exports.handler = (event, context, callback) => {
    s3Object = event.Records[0].s3;
    
    var object = s3Object.bucket.name + "/" + s3Object.object.key;

    var demo_segment = xray.getSegment().addNewSubsegment("demo");
    demo_segment.addAnnotation("Object", object);
    
    demo_segment.addMetadata(object, s3Object);
    dynamodb.putItem({
                TableName: process.env["my_table"],
                Item: {
                    "id": { S: object },
                    "metadata": { S: JSON.stringify(s3Object) }
                }
            }, (err,data) => {
                if (err) console.log(err, err.stack);
                else {
                    demo_segment.close();
                    callback(null, "done");
                }
            });
        };

