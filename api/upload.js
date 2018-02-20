'use strict';

const routes = require('express').Router(); // eslint-disable-line new-cap

const AWS_CREDENTIALS = process.env.aws || 'aws.json';

routes.get('/upload/sign', (req, res)=>{
  const s3 = new aws.S3();
  const fileName = req.query['file-name'];
  const fileType = req.query['file-type'];
  const s3Params = {
    Bucket: AWS_CREDENTIALS.S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read'
  };

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if(err){
      console.log(err);
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: `https://${AWS_CREDENTIALS.S3_BUCKET}.s3.amazonaws.com/${fileName}`
    };
    res.write(JSON.stringify(returnData));
    res.end();

  });
});

routes.post('/upload/writeup', (req, res)=>{
  console.log(req);
  console.log(res);
});

module.exports = routes;
