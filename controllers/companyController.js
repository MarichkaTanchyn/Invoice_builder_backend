const Company = require("../models/company");
const IdVerifications = require("../middleware/idVerifications");
const validateRequest = require('../middleware/validateRequest');


exports.getAllCompanies = async (req, res, next) => {
    try {
        let companies = await Company.findAll();
        res.status(200).json({companies});
    } catch (err) {
        next(err);
    }
}

exports.getCompany = [validateRequest(['CompanyId'], []), async (req, res, next) => {

    await IdVerifications.companyExists({CompanyId: req.params.CompanyId});
    try {
        let company = await Company.findAll({
            where: {
                id: req.params.CompanyId
            }
        })
        res.status(200).send(company)
    } catch (err) {
        next(err);
    }
}]

exports.updateCompany = [validateRequest(['CompanyId'], []), async (req, res, next) => {
    await IdVerifications.companyExists({CompanyId: req.params.CompanyId});
    try {
        await Company.update(req.body, {
            where: {
                id: req.params.CompanyId
            }
        })
        let company = await Company.findAll({
            where: {
                id: req.params.CompanyId
            }
        })
        res.status(200).send(company)
    } catch (err) {
        next(err);
    }
}]

exports.deleteCompany = [validateRequest(['CompanyId'], []), async (req, res, next) => {

    await IdVerifications.companyExists({CompanyId: req.params.CompanyId});
    try {
        let company = await Company.destroy({
            where: {
                id: req.params.CompanyId
            }
        })
        res.status(200).sendStatus(company)
    } catch (err) {
        next(err);
    }
}]
