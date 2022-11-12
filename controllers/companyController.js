const Company = require("../models/company");
const {where} = require("sequelize");


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
exports.deleteCompany = async (req, res) => {
    console.log(req.params)
    if (!req.params.id) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    try {
        //TODO: cascade remove all the values with that company id, because now it is only deleting company Id prom other tables
        await Company.destroy({
            where: {
                id : req.params.id
            }
        })
        res.status(200).send("Was deleted company with id " +  req.params.id)
    } catch (error) {
        res.status(500).send({
            message:
                error.message || "Some error occurred while DELETing Company"
        });
    }

}