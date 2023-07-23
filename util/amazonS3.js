const AWS = require('aws-sdk');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const amazonS3 = new AWS.S3({
    accessKeyId: 'AKIA2OFMVC3TAFBULONP',
    secretAccessKey: '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',
});

exports.createFile = async (file, id) => {
    try {
        const { path, filename } = file;
        const uniqueFilename = `${uuidv4()}-${filename}`; // Generate a unique filename

        const params = {
            Bucket: 'invoice-builder',
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
        Bucket: 'invoice-builder',
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