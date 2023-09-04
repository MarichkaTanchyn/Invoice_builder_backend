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

const setAllPermissions = async (employeeId) => {
    const permissionEnum = await Permission.findAll();
    let employee = await Employee.findByPk(employeeId);

    if (!employee) {
        throw new Error(`Employee with ID ${employeeId} not found.`);
    }

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

const updatePermission = async ({ EmployeeId, permissions }) => {
    const permissionInstances = await Permission.findAll({
        where: {
            name: permissions
        }
    });

    if (permissionInstances.length !== permissions.length) {
        throw new Error('One or more permissions do not exist');
    }
    const employee = await Employee.findByPk(EmployeeId);

    if (!employee) {
        throw new Error('Employee not found');
    }

    // Update the employee's permissions
    await employee.setPermissions(permissionInstances);
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
    updatePermission: updatePermission,
    setAllPermissions: setAllPermissions,
    getEmployeePermissions: getEmployeePermissions,
    deleteAllPermissions: deleteAllPermissions
};
module.exports = permissionOperations;