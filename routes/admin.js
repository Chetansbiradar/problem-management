const router = require("express").Router();
const Department = require("../models/Department");
const verifyToken = require("../utils/verifyToken");
const Scheme = require("../models/GovtScheme");
const bcrypt = require("bcrypt");
const User = require("../models/User");

router.get("/department", verifyToken, async (req, res) => {
  const userType = req.user.role;
  const departments = await Department.find()
    .then((departments) => {
      departments.forEach((department) => {
        department.isAdmin = userType === "admin";
      });
      return departments;
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

router.get("/deletedepartment/:id", verifyToken, (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.send("You are not authorized to view this page");
    const id = req.params.id;
    Department.findByIdAndDelete(id)
      .then((department) => {
        console.log(department);
      })
      .catch((err) => {
        console.log(err);
      });
    res.redirect("/admin/department");
  } catch (error) {
    res.send("Something went wrong" + error);
  }
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

router.get("/employee", verifyToken, async (req, res) => {
  const userType = req.user.role;
  if (userType !== "admin")
    return res.send("You are not authorized to view this page");
  const employees = await User.find({ role: "employee" })
    .populate("department")
    .catch((err) => {
      console.log(err);
    });
  console.log(employees);
  res.render("employee.hbs", {
    loggedIn: true,
    admin: true,
    employees,
  });
});

router.get("/addemployee", verifyToken, async (req, res) => {
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
  res.render("addemployee.hbs", {
    loggedIn: true,
    admin: true,
    departments,
  });
});

router.post("/addemployee", verifyToken, (req, res) => {
  const { name, email, phone, password, department } = req.body;
  if (!name || !email || !phone || !password || !department)
    return res.send("Please fill all the fields");
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  const employee = new User({
    name,
    email,
    phone,
    password: hash,
    role: "employee",
    department,
  });
  employee.save((err, employee) => {
    if (err) {
      console.log(err);
      return res.send("Something went wrong");
    }
    Department.findByIdAndUpdate(
      department,
      { $push: { employees: employee._id } },
      (err, department) => {
        if (err) {
          console.log(err);
          return res.send("Something went wrong");
        }
        console.log(department);
      }
    );
    res.send("Employee added successfully");
  });
});

router.get("/deleteemployee/:id", verifyToken, (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.send("You are not authorized to view this page");

    const id = req.params.id;
    
    User.findByIdAndDelete(id)
      .then((employee) => {
        Department.findByIdAndUpdate(employee.department, {
          $pull: { employees: employee._id },
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
    res.redirect("/admin/employee");
  } catch (error) {
    res.send("Something went wrong" + error);
  }
});

module.exports = router;
