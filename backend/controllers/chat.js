const Chat = require("../models/chat");
const User = require("../models/user");
const Group = require("../models/group");
const UserGroup = require("../models/UserGroup");
const sequelize = require("../database/db");
const { uploadToS3 } = require("../services/awsS3");

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
    let contentType = null
    let userMessage = null
    console.log("body", req.body);
    console.log("file", req.file);
    let fileLink = null;
    if (req.file) {
      fileLink = await uploadToS3(req.file.originalname, req.file.buffer);
      console.log(fileLink);
      contentType="image"
    }
    const groupId = req.params.groupId;
    const userId = req.user;
    if(req.body.chatMsg){
      userMessage = req.body.chatMsg;
      contentType = "text";
    }else{
      userMessage = fileLink
      contentType = "image"
    }
   
    const messageData = await Chat.create({
      contentType: contentType,
      content: userMessage,
      userId: userId,
      groupId: groupId,
    });

    if (messageData) {
      res.status(200).json({
        responseMessage: "message delivered",
        message: messageData.message,
        userId: messageData.userId,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      responseMessage: "Internal server issue",
    });
  }
};

exports.createGroup = async (req, res, next) => {
  let transaction = await sequelize.transaction();
  try {
    const userId = req.user;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        responseMessage: "User not found",
        success: false,
      });
    }
    const isAdmin = req.body.isAdmin;
    const groupName = req.body.groupName;
    const groupData = await Group.create(
      {
        groupName: groupName,
        isAdmin: isAdmin,
      },
      { transaction: transaction }
    );

    await UserGroup.create(
      {
        userId: user.id,
        groupId: groupData.id,
        isAdmin: isAdmin,
      },
      { transaction: transaction }
    );

    await transaction.commit();
    res.status(200).json({
      responseMessage: "successfully group created",
      success: true,
      groupData: groupData,
    });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({
      responseMessage: "Internal server issue",
      success: false,
    });
  }
};

exports.addUserToGroup = async (req, res, next) => {
  try {
    const groupId = parseInt(req.query.groupId);
    const memberEmail = req.body.memberEmail;
    const isAdmin = req.body.isAdmin;
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
          isAdmin: isAdmin,
        });
        console.log(addMemberInfo);
        return res.status(200).json({
          responseMessage: "member added succesful",
          addMemberInfo: addMemberInfo,
        });
      } else {
        return res.status(409).json({
          responseMessage: "user already a member of this grp",
        });
      }
    } else {
      res.status(404).json({
        responseMessage: "member not found",
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
    const groupDetails = userGroups.map((group) => ({
      groupName: group.groupName,
      groupId: group.id,
    }));

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

// name email time msg

exports.getGroupChat = async (req, res, next) => {
  try {
    const groupId = req.params.groupId;
    const userId = req.user;
    if(groupId){
      const responseData = await Chat.findAll({
        where: {
          groupId: groupId,
        },
        order: [["createdAt", "ASC"]],
  
        include: [
          {
            model: User,
            attributes: ["name", "email"],
          },
        ],
      });
      if (responseData) {
        res.status(200).json({
          responseMessage: "get all group chat",
          responseData: responseData,
        });
      }
    }else{
      return res.status(400).json({
        responseMessage:"bad request"
      })
    }
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      responseMessage: "Internal server issue",
    });
  }
};

exports.groupInfo = async (req, res, next) => {
  try {
    const groupId = parseInt(req.query.groupId);
    const existingGroup = await Group.findByPk(groupId);
    if(groupId){
      if (existingGroup) {
        const groupMember = await UserGroup.findAll({
          where: { groupId: groupId },
          order: [
            [
              sequelize.literal(
                `CASE WHEN UserId = ${req.user} THEN 0 ELSE 1 END`
              ),
              "ASC",
            ],
            ["isAdmin", "DESC"],
          ],
          include: [
            {
              model: User,
              attributes: ["name", "email"],
            },
          ],
        });
  
        const groupInfo = {
          groupName: existingGroup.groupName,
          groupCreatedAt: existingGroup.createdAt,
          groupMemberCount: groupMember.length,
          groupMember: groupMember,
        };
  
        return res.status(200).json({
          responseMessage: "Group info fetched successfully",
          groupInfo: groupInfo,
        });
      } else {
        console.log(error);
        return res.status(404).status({
          responseMessage: "group are not existing",
        });
      }
    }else{
      return res.status(400).json({
        responseMessage:"bad request"
      })
    }
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      responseMessage: "internal server issue",
    });
  }
};

exports.checkYouAreAdmin = async (req, res, next) => {
  try {
    const userId = req.user;
    const groupId = req.params.groupId;
    if(groupId){
      const responseData = await UserGroup.findOne({
        where: { groupId: groupId, userId: userId },
      });
      if (responseData) {
        return res.status(200).json({
          responseMessage: "user are admin",
          success: true,
          isAdmin: responseData.isAdmin,
        });
      }
    }else{
      return res.status(400).json({
        responseMessage:"bad request"
      })
    }
    
    
  } catch (error) {
    res.status(500).json({
      responseMessage: "Internal server issue",
    });
  }
};

exports.promoteToAdmin = async (req, res, next) => {
  try {
    const userId = req.user;
    const userIdToPromote = req.body.userId;
    const groupId = req.query.groupId;
    const admin = await UserGroup.findOne({
      where: {
        groupId: groupId,
        userId: userId,
        isAdmin: true,
      },
    });
    if (admin) {
      const promotedMember = await UserGroup.update(
        { isAdmin: true },
        {
          where: {
            groupId: groupId,
            userId: userIdToPromote,
          },
        }
      );
      return res.status(200).json({
        responseMessage: "successfully members has been promoted",
        promotedMember: promotedMember,
      });
    } else {
      return res.status(401).json({
        responseMessage: "Unauthorized user for promoting the member",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      responseMessage: "Internal server issue",
    });
  }
};

exports.removeMember = async (req, res, next) => {
  try {
    console.log(req.query);
    console.log(req.params);
    const userId = req.user;
    const userIdToRemove = req.params.userId;
    const groupId = req.query.groupId;
    const admin = await UserGroup.findOne({
      where: {
        groupId: groupId,
        userId: userId,
        isAdmin: true,
      },
    });
    if (admin) {
      const removedMember = await UserGroup.destroy({
        where: {
          groupId: groupId,
          userId: userIdToRemove,
        },
      });
      return res.status(200).json({
        responseMessage: "successfully members has been removed",
        removedMember: removedMember,
      });
    } else {
      return res.status(401).json({
        responseMessage: "Unauthorized user for promoting the member",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      responseMessage: "Internal server issue",
    });
  }
};

exports.exitGroup = async (req, res, next) => {
  try {
    const userId = req.user;
    const groupId = req.query.groupId;
    console.log("group",groupId);
    const deletedGroup = await UserGroup.destroy({
      where: {
        userId: userId,
        groupId: groupId,
      },
    });
    console.log(deletedGroup);
    if (deletedGroup) {
      res.status(200).json({
        responseMessage: "Successfully exited from group",
      });
    } else {
      res.status(500).json({
        responseMessage: "Internal server issue",
      });
    }
  } catch (error) {
    res.status(500).json({
      responseMessage: "Internal server issue",
    });
  }
};

