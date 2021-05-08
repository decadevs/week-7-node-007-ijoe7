import express, { Request, Response, NextFunction } from "express";
import fs from "fs";
import Joi from "joi";

let dataFiles = require("../../database/database.json");

const overAll: string =
  "/Users/decagon/Desktop/week-7-node-007-ijoe7/database/database.json";

const router = express.Router();
const app = express();


interface Info {
  shape: string,
  dimension: number,
  area: number
  createdAt: Date
}

interface Square {
  shape: string,
  dimension: number
}

interface Rectangle {
  shape: string,
  dimension: {
    a: number,
    b: number
  }
}

interface Triangle {
  shape: string,
  dimension: {
    a: number,
    b: number,
    c: number
  }
};

interface Circle {
  shape: string,
  dimension: number
};

const array: string[] = ["square", "circle", "triangle", "rectangle"];

function validateCircle(circle: Circle) {
  const schema = Joi.object({
    shape: Joi.string().min(6).required(),
    dimension: Joi.number().required()
  })
  return schema.validate(circle)
};

function validateSquare(square: Square) {
  const schema = Joi.object({
    shape: Joi.string().min(6).required(),
    dimension: Joi.number().required(),
  });
  return schema.validate(square);
};

function validateRectangle(rec: Rectangle) {
  const schema = Joi.object({
    shape: Joi.string().min(6).required(),
    dimension: Joi.object().keys({
      a: Joi.number().required(),
      b: Joi.number().required()
    }).required()
  });
  return schema.validate(rec);
};

function validateTriangle(tri: Triangle) {
  const schema = Joi.object({
    shape: Joi.string().min(8).required(),
    dimension: Joi.object().keys({
      a: Joi.number().required(),
      b: Joi.number().required(),
      c: Joi.number().required()
    }).required()
  });
  return schema.validate(tri);
};

/* GET home page. */
router.get("/fetchData", function (req: Request, res: Response, next: NextFunction) {
  res.status(201).json(dataFiles)
});


router.post("/calculate", (req: Request, res: Response, next: NextFunction) => {

  const data = array.find((item: string) => item === req.body.shape.toLowerCase());

  if (!data){
    return res.status(400).json(`The shape ${req.body.shape} is not valid`)
  }

  else if (data === "square") {
    const { error } = validateSquare(req.body);
    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    }
    req.body.area = parseFloat(req.body.dimension) * parseFloat(req.body.dimension)
  }

  else if (data === "circle") {
    const {error} = validateCircle(req.body);
      if (error){
          res.status(400).send(error.details[0].message);
          return;
      }
    req.body.area = (Math.PI * parseFloat(req.body.dimension) * parseFloat(req.body.dimension)).toFixed(2)
  }

  else if (data === "rectangle") {
    const { error } = validateRectangle(req.body);
    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    }
    req.body.area = parseFloat(req.body.dimension.a) * parseFloat(req.body.dimension.b)
  }

  else if (data === "triangle") {
    const { error } = validateTriangle(req.body);
    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    }
    const s:number = (parseFloat(req.body.dimension.a) + parseFloat(req.body.dimension.b) + parseFloat(req.body.dimension.c)) / 2;
    req.body.area = Number((s * (s - req.body.dimension.a) * (s - req.body.dimension.b) * (s - req.body.dimension.c)).toFixed(2))
  }

  const information: Info = {
    shape: req.body.shape.toLowerCase(),
    dimension: req.body.dimension,
    area: req.body.area,
    createdAt: new Date()
  };

  dataFiles.push(information);
  fs.writeFileSync(overAll, JSON.stringify(dataFiles, null, 3), "utf8");
  res.json(information);
});




export default router;
