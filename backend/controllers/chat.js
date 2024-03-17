const Chat = require("../models/chat");
const User = require("../models/user");
const Group = require("../models/group");
const UserGroup = require("../models/UserGroup");

exports.getChat = async (req, res, next) => {
  try {
    const allMessage = await Chat.findAll({
      order: [["createdAt", "ASC"]],
    });
    const result = allMessage.map((result) => {
      return result;
    });
    res.status(200).json({
      responseMessage: "Get all message",
      result: result,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.postChat = async (req, res, next) => {
  try {
    const groupId = req.params.groupId;
    const userId = req.user;
    console.log(req.user);
    const messageData = await Chat.create({
      message: req.body.message,
      userId: userId,
      groupId: groupId,
    });
    // console.log(messageData);
    if (messageData) {
      res.status(200).json({
        responseMessage: "message delivered",
        message: messageData.message,
        userId: messageData.userId,
      });
    }
  } catch (error) {
    res.status(500).json({
      responseMessage: "Internal server issue",
    });
  }
};

exports.createGroup = async (req, res, next) => {
  try {
    console.log(req.body);
    const userId = req.user;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        responseMessage: "User not found",
        success: false,
      });
    }
    const groupData = await Group.create({
      groupName: req.body.groupName,
      // userId: req.user,
    });
    console.log("------");
    const c = await user.addGroup(groupData);
    console.log("------");
    // console.log(c);
    res.status(200).json({
      responseMessage: "successfully group created",
      groupData: groupData,
    });
  } catch (error) {
    res.status(500).json({
      responseMessage: "Internal server issue",
    });
  }
};

exports.addUserToGroup = async (req, res, next) => {
  try {
    const groupId = parseInt(req.query.groupId);
    const memberEmail = req.body.memberEmail;
    const responseData = await User.findOne({ where: { email: memberEmail } });
    if (responseData) {
      const userId = responseData.id;
      const checkUserInGroup = await UserGroup.findOne({
        where: { userId: userId, groupId: groupId },
      });
      if (!checkUserInGroup) {
        const addMemberInfo = await UserGroup.create({
          userId: userId,
          groupId: groupId,
        });
        console.log(addMemberInfo);
      } else {
        return res.status(409).json({
          responseMessage: "user already a member of this grp",
        });
      }
    } else {
      res.status(404).json({
        responseMessage: "User has not existed",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      responseMessage: "Internal server issue",
    });
  }
};

exports.showGroup = async (req, res, next) => {
  try {
    const userId = req.user;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        responseMessage: "User not found",
        success: false,
      });
    }

    const userGroups = await user.getGroups();
    // console.log(userGroups);
    const groupDetails = userGroups.map((group) => ({
      groupName: group.groupName,
      groupId: group.id,
    }));
    console.log(groupDetails);
    res.status(200).json({
      responseMessage: "Successfully fetched user groups",
      groupDetails: groupDetails,
    });
  } catch (error) {
    res.status(500).json({
      responseMessage: "Internal server issue",
    });
  }
};

exports.getGroupChat = async (req, res, next) => {
  try {
    const groupId = req.params.groupId;
    const userId = req.user;
    console.log(req.params.groupId);
    const responseData = await Chat.findAll({
      where: {
        groupId: groupId,
      },
      order: [["createdAt", "ASC"]],
    });
    if (responseData) {
      res.status(200).json({
        responseMessage: "get all group chat",
        responseData: responseData,
      });
    }
  } catch (error) {
    res.status(500).json({
      responseMessage: "Internal server issue",
    });
  }
};

exports.groupInfo = async (req, res, next) => {
  try {
    console.log("Backend");
    const groupId = parseInt(req.query.groupId);
    console.log(groupId);

    const existingGroup = await Group.findByPk(groupId);

    if(existingGroup){
     
      const groupDetails = await existingGroup.getUsers();
      const groupMemberDetails = groupDetails.map((member)=>({
        name:member.name,
        email:member.email
      }))
  
      const groupInfo = {
        groupName:existingGroup.groupName,
        groupCreatedAt: existingGroup.createdAt,
        groupMemberCount: groupMemberDetails.length,
        groupMember:groupMemberDetails,

      }
  
      return res.status(200).json({
        responseMessage: "Group info fetched successfully",
        groupInfo: groupInfo,
      });
    }else{
      return res.status(404).status({
        responseMessage:"group are not existing"
      })
    }

    //grp name
    //member count
    //created at
    // all member name and email
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      responseMessage: "internal server issue",
    });
  }
};
