const RemoteLeadData = require("../model/RemoteLeadData");
const csv = require("csvtojson");
const fs = require('fs');

const importUser = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send({ status: 400, success: false, message: 'No file uploaded' });
        }

        const filePath = req.file.path;
        const response = await csv().fromFile(filePath);

        const userData = response.map(item => ({
            Title: item.Title,
            Description: item.Description,
            // level: item.level,
            Job_Type: item.Job_Type,
            Tags: item.Tags,
            Duration: item.Duration,
            Hourly_Rate_Budge: item.Hourly_Rate_Budge,
            Project_Budget: item.Project_Budget,
            Link: item.Link,
        }));

        await RemoteLeadData.insertMany(userData);

        // Optionally remove the file after processing
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Failed to delete file:', err);
            }
        });

        res.json({ status: 200, success: true, message: "Data imported successfully" });
    } catch (error) {
        res.json({ status: 400, success: false, message: error.message });
    }
};

const deleteAllLeadData = async (req, res) => {
    try {
        await RemoteLeadData.deleteMany({});
        res.send({ status: 200, success: true, message: "All lead data deleted successfully" });
    } catch (error) {
        res.send({ status: 400, success: false, message: error.message });
    }
};

module.exports = {
    importUser,
    deleteAllLeadData
};
