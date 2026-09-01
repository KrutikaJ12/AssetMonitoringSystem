const userService = require("../services/userService");

async function getUsers(req,res){
  try{
   const customerId = req.auth.customerId;
   if(!customerId){
        return res.status(400).json({
                success: false,
                message: "Customer information is missing.",
            });
     }
   const users = await userService.getUsers(customerId);
   return res.status(200).json({
    success : true,
    data:users,
    })
  }catch(error){
     console.error("Get users error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch users.",
        });
  }
}

async function createUser(req, res) {
  try {
    const customerId = req.auth.customerId;
    const userId = req.auth.userId;
    const {
      fullName,
      mobileNo,
      emailId,
      userName,
      password,
      roleId,
      siteIds,
      isActive,
    } = req.body;

    const result = await userService.createUser(
      customerId,
      {
        fullName,
        mobileNo,
        emailId,
        userName,
        password,
        roleId,
        siteIds,
        isActive,
      },
      userId,
      req.ip
    );

    return res.status(201).json({
      success: true,
      message: "User created successfully.",
      data: result,
    });

  } catch (error) {
    console.error("Create user error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create user.",
    });
  }
}

async function updateUser(req,res){
     try {
    const customerId = req.auth.customerId;
    const userId = req.params.userId;
    const {
      fullName,
      mobileNo,
      emailId,
      userName,
      roleId,
      siteIds,
      isActive,
    } = req.body;

    const result = await userService.updateUser(
      userId,
      customerId,
      {
        fullName,
        mobileNo,
        emailId,
        userName,
        roleId,
        siteIds,
        isActive,
      },
      req.ip
    );

    return res.status(201).json({
      success: true,
      message: "User updated successfully.",
      data: result,
    });

  } catch (error) {
    console.error("Update user error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update user.",
    });
  }
}

module.exports = {getUsers,createUser,updateUser}