"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var fs_1 = __importDefault(require("fs"));
var dataFiles = require("./database/database.json");
var app = express_1.default();
app.use(express_1.default.json());
var add = function (a, b) { return a + b; };
app.get('/', function (req, res, next) {
    console.log(add(5, 5));
    res.json('Hello World');
});
app.get('/dataFiles', function (req, res) {
    // const sortData = JSON.parse(dataFiles).filter((item: { status: boolean; }) => item.status == false || !status);
    res.json(dataFiles);
});
app.get('/dataFiles/:id', function (req, res) {
    var dataFile = dataFiles.find(function (item) { return item.id === parseInt(req.params.id); });
    if (!dataFile)
        return res.status(404).send("Data with the id: " + parseInt(req.params.id) + " not found!");
    res.json(dataFile);
});
app.post('/dataFiles', function (req, res) {
    var num = 1;
    var dataFileId = dataFiles[dataFiles.length - 1].id;
    num += dataFileId;
    // id: dataFiles.length + 1
    var dataFile = {
        id: num,
        organization: req.body.organization,
        createdAt: new Date(),
        products: req.body.products,
        marketValue: req.body.marketValue,
        address: req.body.address,
        ceo: req.body.ceo,
        country: req.body.country,
        noOfEmployees: req.body.noOfEmployees,
        employees: req.body.employees
    };
    dataFiles.push(dataFile);
    res.json(dataFile);
    writeToDatabase(__dirname + "/database/database.json", dataFiles);
});
app.put('/dataFiles/:id', function (req, res) {
    // Look up the dataFile
    // If not existing, return 404
    var dataFile = dataFiles.find(function (item) { return item.id === parseInt(req.params.id); });
    if (!dataFile)
        return res.status(404).send("Data with the id: " + parseInt(req.params.id) + " not found!");
    // Update dataFile
    var dataStructure = {
        organization: req.body.organization || dataFile.organization,
        createdAt: dataFile.createdAt,
        updatedAt: new Date(),
        products: req.body.products || dataFile.products,
        marketValue: req.body.marketValue || dataFile.marketValue,
        address: req.body.address || dataFile.marketValue,
        ceo: req.body.ceo || dataFile.ceo,
        country: req.body.country || dataFile.country,
        noOfEmployees: req.body.noOfEmployees || dataFile.noOfEmployees,
        employees: req.body.employees || dataFile.employees
    };
    // Return the updated course
    var index = dataFiles.findIndex(function (item) { return item.id === parseInt(req.params.id); });
    dataFiles[index] = __assign({ id: parseInt(req.params.id) }, dataStructure);
    writeToDatabase(__dirname + "/database/database.json", dataFiles);
    res.json(dataFiles[index]);
});
app.delete('/dataFiles/:id', function (req, res) {
    // Look up the course
    // Not existing, return 404
    var dataFile = dataFiles.find(function (item) { return item.id === parseInt(req.params.id); });
    if (!dataFile)
        return res.status(404).send("Data with the id: " + parseInt(req.params.id) + " not found!");
    //Delete
    var index = dataFiles.indexOf(dataFile);
    var num = index;
    dataFiles.splice(index, 1);
    writeToDatabase(__dirname + "/database/database.json", dataFiles);
    //Return the same course
    res.json("Data id: " + parseInt(req.params.id) + " has been deleted");
});
function writeToDatabase(filename, content) {
    fs_1.default.writeFileSync(filename, JSON.stringify(content, null, 3), "utf8");
}
// PORT 
// const port = process.env.PORT || 5000
// const server = app.listen(port, () => {
//   console.log(`The Server is running!... Listening on port ${port}`)
// });
exports.default = app;
