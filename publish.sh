#!/bin/bash

rm lambda.zip
cd lambda
zip -X -r ../lambda.zip .
cd ..
echo "Uploading lambda to AWS..."
aws lambda update-function-code --function-name circleRoundSkill --zip-file fileb://lambda.zip
echo "TADA! done"
