"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const joi_1 = __importDefault(require("joi"));
const path_1 = __importDefault(require("path"));
let dataFiles = require("../database/database.json");
const router = express_1.default.Router();
const app = express_1.default();
;
;
const array = ["square", "circle", "triangle", "rectangle"];
function validateCircle(circle) {
    const schema = joi_1.default.object({
        shape: joi_1.default.string().min(6).required(),
        dimension: joi_1.default.number().required()
    });
    return schema.validate(circle);
}
;
function validateSquare(square) {
    const schema = joi_1.default.object({
        shape: joi_1.default.string().min(6).required(),
        dimension: joi_1.default.number().required(),
    });
    return schema.validate(square);
}
;
function validateRectangle(rec) {
    const schema = joi_1.default.object({
        shape: joi_1.default.string().min(6).required(),
        dimension: joi_1.default.object().keys({
            a: joi_1.default.number().required(),
            b: joi_1.default.number().required()
        }).required()
    });
    return schema.validate(rec);
}
;
function validateTriangle(tri) {
    const schema = joi_1.default.object({
        shape: joi_1.default.string().min(8).required(),
        dimension: joi_1.default.object().keys({
            a: joi_1.default.number().required(),
            b: joi_1.default.number().required(),
            c: joi_1.default.number().required()
        }).required()
    });
    return schema.validate(tri);
}
;
/* GET home page. */
router.get("/fetchData", function (req, res, next) {
    res.status(201).json(dataFiles);
});
router.post("/calculate", (req, res, next) => {
    const data = array.find((item) => item === req.body.shape.toLowerCase());
    if (!data) {
        return res.status(400).json(`The shape ${req.body.shape} is not valid`);
    }
    else if (data === "square") {
        const { error } = validateSquare(req.body);
        if (error) {
            res.status(400).send(error.details[0].message);
            return;
        }
        req.body.area = parseFloat(req.body.dimension) * parseFloat(req.body.dimension);
    }
    else if (data === "circle") {
        const { error } = validateCircle(req.body);
        if (error) {
            res.status(400).send(error.details[0].message);
            return;
        }
        req.body.area = (Math.PI * parseFloat(req.body.dimension) * parseFloat(req.body.dimension)).toFixed(2);
    }
    else if (data === "rectangle") {
        const { error } = validateRectangle(req.body);
        if (error) {
            res.status(400).send(error.details[0].message);
            return;
        }
        req.body.area = parseFloat(req.body.dimension.a) * parseFloat(req.body.dimension.b);
    }
    else if (data === "triangle") {
        const { error } = validateTriangle(req.body);
        if (error) {
            res.status(400).send(error.details[0].message);
            return;
        }
        const s = (parseFloat(req.body.dimension.a) + parseFloat(req.body.dimension.b) + parseFloat(req.body.dimension.c)) / 2;
        req.body.area = Number((s * (s - req.body.dimension.a) * (s - req.body.dimension.b) * (s - req.body.dimension.c)).toFixed(2));
    }
    const information = {
        shape: req.body.shape.toLowerCase(),
        dimension: req.body.dimension,
        area: req.body.area,
        createdAt: new Date()
    };
    dataFiles.push(information);
    fs_1.default.writeFileSync(path_1.default.join(__dirname, '../', 'database/database.json'), JSON.stringify(dataFiles, null, 3), "utf8");
    res.json(information);
});
exports.default = router;
