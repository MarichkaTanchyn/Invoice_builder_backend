const Permission = require("../models/permission");
const Employee = require("../models/employee");
const EmployeePermission = require("../models/employeePermission");

const hasPermission = async ({EmployeeId, permissionName}) => {

    let permissionId = await Permission.findOne({
        where: {
            name: permissionName
        }
    });
    let employee = await Employee.findAll({
        where: {
            model: EmployeePermission,
            where: {
                id: permissionId,
                employeeId: EmployeeId
            }
        }
    });
    return employee.length !== 0;
}

const addPermission = async ({EmployeeId, permission}) => {
    const permissionEnum = await Permission.findAll();
    const permissionArr = permission.split(",");
    let employee = await Employee.findByPk(EmployeeId);
    for (const permission of permissionArr) {
        if (permissionEnum.includes(permission)) {
            await employee.addPermission(permission);
        } else {
            throw new Error("Permission not exists!")
        }
    }
}

const removePermission = async ({EmployeeId, permission}) => {
    const permissionEnum = await Permission.findAll()
    const permissionArr = permission.split(",");
    let employee = await Employee.findByPk(EmployeeId);
    for (const permission of permissionArr) {
        if (permissionEnum.includes(permission)) {
            await employee.removePermission(permission);
        } else {
            throw new Error("Permission not exists!")
        }
    }
}

const updatePermission = async ({EmployeeId, permission}) => {
    const permissionEnum = await Permission.findAll()
    const permissionArr = permission.split(",");
    let employee = await Employee.findByPk(EmployeeId);
    for (const permission of permissionArr) {
        if (permissionEnum.includes(permission)) {
            await employee.setPermission(permission);
        } else {
            throw new Error("Permission not exists!")
        }
    }
}

const permissionOperations = {
    hasPermission: hasPermission,
    addPermission: addPermission,
    removePermission: removePermission,
    updatePermission: updatePermission
};
module.exports = permissionOperations;