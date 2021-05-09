import express, { Application, Request, Response, NextFunction } from 'express';

import fs from "fs"

let dataFiles = require("./database/database.json")

const app: Application = express();
app.use(express.json())

const add = (a: number, b: number): number => a + b;

interface List {
  id?: number,
  organization: string,
  createdAt: Date,
  updatedAt?: Date,
  products: string[],
  marketValue: string,
  address: string,
  ceo: string,
  country: string,
  noOfEmployees: number,
  employees: string[]
}

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  console.log(add(5,5))
  res.json('Hello World')
});

app.get('/dataFiles', (req: Request, res: Response) => {
  // const sortData = JSON.parse(dataFiles).filter((item: { status: boolean; }) => item.status == false || !status);
  res.json(dataFiles)
});
app.get('/dataFiles/:id', (req: Request, res: Response) => {
  const dataFile = dataFiles.find((item: List) => item.id === parseInt(req.params.id));
  if (!dataFile) return res.status(404).send(`Data with the id: ${parseInt(req.params.id)} not found!`)
  res.json(dataFile)
});

app.post('/dataFiles', (req: Request, res: Response) => {
  
  let num = 1;
  let dataFileId: number = dataFiles[dataFiles.length - 1].id;
  num += dataFileId;
  // id: dataFiles.length + 1
  const dataFile: List = {
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
  res.json(dataFile)
  writeToDatabase(`${__dirname}/database/database.json`, dataFiles);
});



app.put('/dataFiles/:id', (req: Request, res: Response) => {
  // Look up the dataFile
  // If not existing, return 404
  const dataFile = dataFiles.find((item: List) => item.id === parseInt(req.params.id));
  if (!dataFile) return res.status(404).send(`Data with the id: ${parseInt(req.params.id)} not found!`)


  // Update dataFile
  const dataStructure: List = {
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
  const index: number = dataFiles.findIndex((item: List) => item.id === parseInt(req.params.id));
    dataFiles[index] = { id: parseInt(req.params.id), ...dataStructure };
    writeToDatabase(`${__dirname}/database/database.json`, dataFiles)
  res.json(dataFiles[index]);
});

app.delete('/dataFiles/:id', (req: Request, res: Response) => {
  // Look up the course
  // Not existing, return 404
  const dataFile = dataFiles.find((item: List) => item.id === parseInt(req.params.id));
  if (!dataFile) return res.status(404).send(`Data with the id: ${parseInt(req.params.id)} not found!`)

  //Delete
  const index = dataFiles.indexOf(dataFile);
  const num: number = index
  dataFiles.splice(index, 1);
  writeToDatabase(`${__dirname}/database/database.json`, dataFiles);

  //Return the same course
  res.json(`Data id: ${parseInt(req.params.id)} has been deleted`);
});


function writeToDatabase(filename: string, content: List[]) {
  fs.writeFileSync(filename, JSON.stringify(content, null, 3), "utf8");
}

// PORT 
// const port = process.env.PORT || 5000
// const server = app.listen(port, () => {
//   console.log(`The Server is running!... Listening on port ${port}`)
// });
export default app