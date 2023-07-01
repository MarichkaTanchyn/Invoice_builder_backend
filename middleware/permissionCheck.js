const Permission = require("../models/permission");
const Employee = require("../models/employee");

const hasPermission = async (employeeId, permissionName) => {
    const permission = await Permission.findOne({
        where: {name: permissionName},
    });
    if (!permission) {
        return false;
    }
    const employee = await Employee.findOne({
        where: {id: employeeId}, include: [{
            model: Permission, where: {id: permission.id}, through: {attributes: []},
        },],
    });
    return employee !== null;
};

const setAllPermissions = async (EmployeeId) => {
    const permissionEnum = await Permission.findAll();
    let employee = await Employee.findByPk(EmployeeId);
    for (const permission of permissionEnum) {
        await employee.addPermission(permission);
    }
}

const getEmployeePermissions = async (EmployeeId) => {
    let employee = await Employee.findByPk(EmployeeId);
    return await employee.getPermissions({
        attributes: ['id', 'name'], through: {
            attributes: []
        }
    });
}

const addPermission = async ({EmployeeId, permission}) => {

    if (!EmployeeId) {
        throw new Error("Invalid employee ID");
    }
    if (!permission) {
        throw new Error("Invalid permission");
    }
    let employee = await Employee.findByPk(EmployeeId);

    const permissions = await Permission.findAll({
        where: {name: permission.split(",")},
    });
    if (permissions.length !== permission.split(",").length) {
        throw new Error("Invalid permissions");
    }
    // Add all permissions at once
    try {
        await employee.addPermissions(permissions);
    } catch (error) {
        console.error(error);
        throw new Error("Failed to add permissions");
    }
}

const updatePermission = async ({EmployeeId, permission}) => {
    await deleteAllPermissions(EmployeeId);
    await addPermission({EmployeeId, permission});
}

const deleteAllPermissions = async (EmployeeId) => {
    const employee = await Employee.findByPk(EmployeeId);
    const employeePermissions = await employee.getPermissions();
    try {
        if (employeePermissions.length !== 0) {
            await employee.setPermissions([]);
        }
    } catch (error) {
        console.error(error);
        throw new Error("Failed to delete permissions");
    }
};

const permissionOperations = {
    hasPermission: hasPermission,
    addPermission: addPermission,
    updatePermission: updatePermission,
    setAllPermissions: setAllPermissions,
    getEmployeePermissions: getEmployeePermissions,
    deleteAllPermissions: deleteAllPermissions
};
module.exports = permissionOperations;