const Permission = require("../models/permission");
const Employee = require("../models/employee");
const EmployeePermission = require("../models/employeePermission");

const hasPermission = async (EmployeeId, permissionName) => {
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
        attributes: ['id', 'name'],
        through: {
            attributes: []
        }
    });
}

const addPermission = async ({EmployeeId, permission}) => {
    if (!EmployeeId || typeof EmployeeId !== "number") {
        throw new Error("Invalid employee ID");
    }
    if (!permission || typeof permission !== "string") {
        throw new Error("Invalid permission");
    }
    let employee = await Employee.findByPk(EmployeeId);

    const permissions = await Permission.findAll({
        where: { name: permission.split(",") },
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

const updatePermission = async ({EmployeeId, permissions}) => {
    await deleteAllPermissions(EmployeeId);
    await addPermission({EmployeeId, permissions});
}

const deleteAllPermissions = async (EmployeeId) => {
    const employee = await Employee.findByPk(EmployeeId.EmployeeId);
    // Remove all permissions
    try {
        await employee.setPermissions([]);
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