const Courses = require("../models/course.model")
const { success, failure } = require("../utils/response.utils");
const { httpsStatusCodes, serverResponseMessage } = require("../constants/");

exports.createCourse=async(req,res)=>{
    try {
    const { user } = req;
    if (user.user_type === 1) {
        return failure(
          res,
          httpsStatusCodes.ACCESS_DENIED,
          serverResponseMessage.ACCESS_DENIED
        );
      }
      const data = {
        ...req.body,
        userId:user.id,
      };
      const response = await Courses.create(data);
      return success(
        res,
        httpsStatusCodes.CREATED,
        serverResponseMessage.COURSE_CREATED_SUCCESSFULLY,
        response
      );

    } catch (error) {
        return failure(
            res,
            httpsStatusCodes.INTERNAL_SERVER_ERROR,
            serverResponseMessage.INTERNAL_SERVER_ERROR
          );
    }
}

exports.getCourses = async (req, res) => {
    try {
        const { user } = req;
        let courses;

        if (user.user_type === 1) {
            courses = await Courses.find({});
        } else {
            courses = await Courses.find({ userId: user.id });
        }

        // Return the fetched courses
        return success(
            res,
            httpsStatusCodes.SUCCESS,
            serverResponseMessage.COURSES_FETCHED_SUCCESSFULLY,
            courses
        );
    } catch (error) {
        return failure(
            res,
            httpsStatusCodes.INTERNAL_SERVER_ERROR,
            serverResponseMessage.INTERNAL_SERVER_ERROR
        );
    }
};

exports.updateCourse =async(req,res)=>{
    try {
        const {user} = req;
        const {_id,status} = req.body;
        const data = {
            status,
            ...req.body
        }
        if(user.user_type === 2){
            return failure(
                res,
                httpsStatusCodes.ACCESS_DENIED,
                serverResponseMessage.ACCESS_DENIED
              );
        }
        const updatedCourse = await Courses.findOneAndUpdate(
            { _id },
            { $set: data },
            { new: true }
          );

          if(!updatedCourse){
            return failure(
                res,
                httpsStatusCodes.NOT_FOUND,
                serverResponseMessage.COURSE_NOT_FOUND
              );
          }

          return success(
            res,
            httpsStatusCodes.SUCCESS,
            serverResponseMessage.COURSE_UPDATED_SUCCESSFULLY,
            updatedCourse
          );

    } catch (error) {
        return failure(
            res,
            httpsStatusCodes.INTERNAL_SERVER_ERROR,
            serverResponseMessage.INTERNAL_SERVER_ERROR
        );
    }
}