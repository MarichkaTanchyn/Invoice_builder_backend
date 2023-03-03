const Company = require("../models/company");

exports.getAllCompanies = async (req, res) => {
    try {
        let companies = await Company.findAll();
        res.status(200).json({companies});
    } catch (error) {
        res.status(500).send({
            message:
                error.message || "Some error occurred while getting ALL COMPANIES"
        });
    }
}

exports.getCompany = async (req, res) => {
    if (!req.params.id) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    try {
       let company = await Company.findAll({
            where: {
                id : req.params.id
            }
        })
        res.status(200).send(company)
    } catch (error) {
        res.status(500).send({
            message:
                error.message || "Some error occurred while get request"
        });
    }
}


exports.deleteCompany = async (req, res) => {
    if (!req.params.id) {
        res.status(400).send({
            message: "ID can not be empty!"
        });
        return;
    }
    try {
        //TODO: cascade remove all the values with that company id, because now it is only deleting company Id prom other tables
        let company = await Company.destroy({
            where: {
                id : req.params.id
            }
        })
        res.status(200).send(company)
    } catch (error) {
        res.status(500).send({
            message:
                error.message || "Some error occurred while delete request"
        });
    }
}

exports.updateCompany = async (req, res) => {
    if (!req.params.id) {
        res.status(400).send({
            message: "ID can not be empty!"
        });
        return;
    }
    try {
        await Company.update(req.body, {
            where: {
                id : req.params.id
            }
        })
        let company = await Company.findAll({
            where: {
                id : req.params.id
            }
        })
        res.status(200).send(company)
    } catch (error) {
        res.status(500).send({
            message:
                error.message || "Some error occurred while update request"
        });
    }
}

