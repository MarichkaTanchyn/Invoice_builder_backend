const AWS = require('aws-sdk');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const amazonS3 = new AWS.S3({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

exports.createFile = async (file, id) => {
    try {
        const { path, filename } = file;
        const uniqueFilename = `${uuidv4()}-${filename}`; // Generate a unique filename

        const params = {
            Bucket: process.env.S3_BUCKET,
            Key: uniqueFilename,
            Body: fs.readFileSync(path),
        };

        const data = await amazonS3.upload(params).promise();
        fs.unlinkSync(path);

        console.log(data);
        return data;
    } catch (error) {
        fs.unlinkSync(file.path);
        throw new Error(error);
    }
}

exports.getFileFromS3 = async (url) => {
    const Key = url.split("/").pop();
    const params = {
        Bucket: process.env.S3_BUCKET,
        Key : Key,
    };

    try {
        const data = await amazonS3.getObject(params).promise();
        return data.Body;
    } catch (error) {
        console.error(`Failed to retrieve file from S3: ${error}`);
        return null;
    }
};