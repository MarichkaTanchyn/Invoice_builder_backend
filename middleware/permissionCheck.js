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
    // Fetch employee by ID
    let employee = await Employee.findByPk(EmployeeId);

    // Split permission names and fetch instances in a single query
    const permissions = await Permission.findAll({
        where: { name: permission.split(",") },
    });

    // Check that all permissions were found
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

const deletePermissions = async ({EmployeeId}) => {
    let employee = await Employee.findByPk(EmployeeId);
    await employee.removePermissions();
}

const permissionOperations = {
    hasPermission: hasPermission,
    addPermission: addPermission,
    removePermission: removePermission,
    updatePermission: updatePermission,
    setAllPermissions: setAllPermissions,
    getEmployeePermissions: getEmployeePermissions,
    deletePermissions: deletePermissions
};
module.exports = permissionOperations;