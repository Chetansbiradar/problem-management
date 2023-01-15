const router = require("express").Router();
const Department = require("../models/Department");
const verifyToken = require("../utils/verifyToken");
const Scheme = require("../models/GovtScheme");

router.get("/departments", verifyToken, async (req, res) => {
  //get all departments
  const departments = await Department.find()
    .then((departments) => {
      return departments;
    })
    .catch((err) => {
      console.log(err);
    });
  if (req.user.role !== "admin")
    return res.send("You are not authorized to view this page");
  console.log(departments);
  res.send("ok");
  // res.render("departments.hbs", {
  //     loggedIn: true,
  //     admin: req.user.role === "admin",
  //     departments
  // });
});

router.get("/department", verifyToken, async (req, res) => {
  const userType = req.user.role;
  const departments = await Department.find()
    // .populate("department")
    .then((departments) => {
      departments.forEach((department) => {
        department.isAdmin = userType === "admin";
      });
      return department;
    })
    .catch((err) => {
      console.log(err);
    });
  res.render("department.hbs", {
    loggedIn: userType,
    admin: userType === "admin",
    departments,
  });
});




router.get("/adddepartment", verifyToken, (req, res) => {
  const userType = req.user.role;
  if (userType !== "admin")
    return res.send("You are not authorized to view this page");

  res.render("adddepartment.hbs", {
    loggedIn: true,
    admin: userType === "admin",
  });
});

router.post("/adddepartment", verifyToken, (req, res) => {
  const { deptCode, name, street, taluk, city, pincode, phoneNumber } =
    req.body;
  console.log(req.body);
  if (
    !deptCode ||
    !name ||
    !street ||
    !taluk ||
    !city ||
    !pincode ||
    !phoneNumber
  )
    return res.send("Please fill all the fields");
  const department = new Department({
    deptCode,
    name,
    address: {
      street,
      taluk,
      city,
      pincode,
    },
    phoneNumber,
  });
  department.save((err, department) => {
    if (err) {
      console.log(err);
      return res.send("Something went wrong");
    }
    res.send("Department added successfully");
  });
});

router.get("/addscheme", verifyToken, async (req, res) => {
  const userType = req.user.role;
  if (userType !== "admin")
    return res.send("You are not authorized to view this page");
  const departments = await Department.find()
    .then((departments) => {
      return departments;
    })
    .catch((err) => {
      console.log(err);
    });
  res.render("addscheme.hbs", {
    loggedIn: true,
    admin: userType === "admin",
    departments,
  });
});
// deletescheme
router.get("/deletescheme/:id", verifyToken, (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.send("You are not authorized to view this page");
    const id = req.params.id;
    console.log(id);
    Scheme.findByIdAndDelete(id)
      .then((scheme) => {
        Department.findByIdAndUpdate(scheme.department, {
          $pull: { schemes: scheme._id },
        })
          .then((department) => {
            console.log(department);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
    res.redirect("/public/schemes");
  } catch (error) {
    res.send("Something went wrong" + error);
  }
});

router.post("/addscheme", verifyToken, (req, res) => {
  const { name, description, url, department } = req.body;
  if (!name || !description || !url || !department)
    return res.send("Please fill all the fieldsssssss");
  const scheme = new Scheme({
    name,
    description,
    url,
    department,
  });
  scheme.save((err, scheme) => {
    if (err) {
      console.log(err);
      return res.send("Something went wrong");
    }
    Department.findByIdAndUpdate(
      department,
      { $push: { schemes: scheme._id } },
      (err, department) => {
        if (err) {
          console.log(err);
          return res.send("Something went wrong");
        }
        console.log(department);
      }
    );
    res.send("Scheme added successfully");
  });
});
module.exports = router;
