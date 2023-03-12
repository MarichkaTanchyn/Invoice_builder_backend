const Company = require("../models/company");
const IdVerifications = require("../middleware/idVerifications");

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
    if (!req.params.CompanyId) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    await IdVerifications.companyExists({CompanyId: req.params.CompanyId});
    try {
       let company = await Company.findAll({
            where: {
                id : req.params.CompanyId
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

exports.updateCompany = async (req, res) => {
    if (!req.params.CompanyId) {
        res.status(400).send({
            message: "ID can not be empty!"
        });
        return;
    }
    await IdVerifications.companyExists({CompanyId: req.params.CompanyId});
    try {
        await Company.update(req.body, {
            where: {
                id : req.params.CompanyId
            }
        })
        let company = await Company.findAll({
            where: {
                id : req.params.CompanyId
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

exports.deleteCompany = async (req, res) => {
    if (!req.params.CompanyId) {
        res.status(400).send({
            message: "ID can not be empty!"
        });
        return;
    }
    await IdVerifications.companyExists({CompanyId: req.params.CompanyId});
    try {
        let company = await Company.destroy({
            where: {
                id : req.params.CompanyId
            }
        })
        res.status(200).sendStatus(company)
    } catch (error) {
        res.status(500).send({
            message:
                error.message || "Some error occurred while delete request"
        });
    }
}

