const router = require("express").Router();
const verifyToken = require("../utils/verifyToken");
const Problem = require("../models/Problem");
const Department = require("../models/Department");
const User = require("../models/User");
const Scheme = require("../models/GovtScheme");

router.post("/addproblem", verifyToken, (req, res) => {
  console.log(req.body);
  const { description, department, street, taluk, city, pincode, fromDate } =
    req.body;

  if (!description || !department || !street || !taluk || !city || !pincode)
    return res.send("Please fill all the fields");

  const problem = new Problem({
    department,
    description,
    address: {
      street,
      taluk,
      city,
      pincode,
    },
    fromDate,
    submittedBy: req.user._id,
  });
  problem.save((err, problem) => {
    if (err) {
      console.log(err);
      return res.send("Something went wrong");
    }
    User.findByIdAndUpdate(
      req.user._id,
      { $push: { problems: problem._id } },
      (err, user) => {
        if (err) {
          console.log(err);
          return res.send("Something went wrong");
        }
      }
    );
    res.send("Problem added successfully");
  });
});

router.get("/addproblem", verifyToken, async (req, res) => {
  const userType = req.user.role;
  const departments = await Department.find()
    .then((departments) => {
      return departments;
    })
    .catch((err) => {
      console.log(err);
    });
  // console.log(departments);
  res.render("addproblem.hbs", {
    loggedIn: true,
    public: userType === "public",
    employee: userType === "employee",
    admin: userType === "admin",
    departments,
  });
});

router.get("/schemes", verifyToken, async (req, res) => {
  const userType = req.user.role;
  const schemes = await Scheme.find()
    .populate("department")
    .then((schemes) => {
      schemes.forEach((scheme) => {
        scheme.isAdmin = userType === "admin";
      });
      return schemes;
    })
    .catch((err) => {
      console.log(err);
    });
  res.render("scheme.hbs", {
    loggedIn: userType,
    admin: userType === "admin",
    schemes,
  });
});

router.get("/about", (req, res) => {
  res.render("about.hbs");
});
module.exports = router;
