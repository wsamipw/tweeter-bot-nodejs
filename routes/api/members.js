const express = require("express");
const uuid = require("uuid");
const router = express.Router();

const models = require("../../models/index");

//get all members
router.get("/", (req, res) => {
  var query = req.query;
  models.User.findAll().then(members => {
    res.json({
      members: members,
      query: query
    });
  });
});

//get single member
router.get("/:id", (req, res) => {
  // const found = members.some(member => member.id === parseInt(req.params.id));
  // // res.send(req.params.id);
  // if (found) {
  //     res.json(members.filter(member => member.id === parseInt(req.params.id)));
  // } else {
  //     res.status(400).json({
  //         msg: "Member not found"
  //     });
  // }
  models.User.findByPk(parseInt(req.params.id))
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        res.status(400).json({
          msg: "User Not found"
        });
      }
    })
    .catch(e => {
      res.status(400).json({
        error: e
      });
    });
});

//create member
router.post("/", (req, res) => {
  const newMember = {
    // id: uuid.v4(),
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    createdAt: new Date().toDateString(),
    updatedAt: new Date().toDateString()
  };
  if (!newMember.firstName || !newMember.lastName || !newMember.email) {
    return res.status(400).json({
      msg: "Please include a name and email"
    });
  }
  models.User.create(newMember)
    .then(() => console.log("user created successfully."))
    .catch(e => {
      console.log("Error creating user:", e);
    });

  // res.send(req.body);
  res.redirect("/");
});

//update member
router.put("/:id", (req, res) => {
  models.User.findByPk(req.params.id)
    .then(result => {
      if (result) {
        var fieldsToUpdate = Object.keys(req.body);
        fieldsToUpdate.push("updatedAt");
        models.User.update(
          {
            fistName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email
          },
          {
            returning: true,
            where: { id: parseInt(req.params.id) },
            fields: fieldsToUpdate
          }
        );
      } else {
        res.status(400).json({
          msg: "Cannot update! User Not found."
        });
      }
    })
    .then(updateResult => {
      console.log("update result::", updateResult);
      // res.json(updateResult);
      res.json({
        data: {
          updateResult
        },
        msg: "success"
      });
    })
    .catch(e => {
      console.log("errorr: ", e);
      res.status(400).json({
        error: e
      });
    });

  //   const found = members.some(member => member.id === parseInt(req.params.id));
  //   if (found) {
  //     const updatedmember = req.body;
  //     members.forEach(member => {
  //       if (member.id === parseInt(req.params.id)) {
  //         member.name = updatedmember.name ? updatedmember.name : member.name;
  //         member.email = updatedmember.email ? updatedmember.email : member.email;

  //         res.json({
  //           msg: "Member updated",
  //           member
  //         });
  //       }
  //     });
  //   } else {
  //     res.status(400).json({
  //       msg: "Member not found"
  //     });
  //   }
});

//delete member
router.delete("/:id", (req, res) => {
  models.User.findByPk(req.params.id).then(result => {
      models.User.destroy({
          where: {
              id: req.params.id
          }
      })
  }).then(()=>{
      res.json({
          msg: "success"
      })
  });
});

module.exports = router;
