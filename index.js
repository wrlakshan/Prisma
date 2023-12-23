// npm i express mysql2 nodemon

const express = require("express");
const app = express();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

app.use(express.json());

app.get("/", async (req, res) => {
  const allUsers = await prisma.user.findMany();
  res.json(allUsers);
});

app.post("/", async (req, res) => {
  const newUser = await prisma.user.create({ data: req.body });
  res.json(newUser);
});

app.put("/:id", async (req, res) => {
  const id = req.params.id;
  const newAge = req.body.age;
  const updateUser = await prisma.user.update({
    where: { id: id },
    data: { age: newAge },
  });
  res.json(updateUser);
});

app.delete("/:id", async (req, res) => {
  const id = req.params.id;
  const deleteUser = await prisma.user.delete({
    where: { id: id },
  });
  res.json(deleteUser);
});

app.get("/house", async (req, res) => {
  const allHouses = await prisma.house.findMany({
    include: { owner: true, buildBy: true },
  });
  res.json(allHouses);
});

app.get("/house/filter", async (req, res) => {
  const allHouses = await prisma.house.findMany({
    where: {
      wifiPassword: {
        not: null,
      },
      owner: {
        age: {
          gte: 30,
        },
      },
    },
    orderBy: [
      {
        owner: {
          firstName: "desc",
        },
      },
    ],
    include: { owner: true, buildBy: true },
  });
  res.json(allHouses);
});

app.get("/house/:id", async (req, res) => {
  const id = req.params.id;
  const house = await prisma.house.findUnique({
    where: { id },
    include: { owner: true, buildBy: true },
  });
  res.json(house);
});

app.post("/house", async (req, res) => {
  const newHouse = await prisma.house.create({ data: req.body });
  res.json(newHouse);
});

app.post("/house/many", async (req, res) => {
  const newHouse = await prisma.house.createMany({ data: req.body });
  res.json(newHouse);
});

app.listen(8000, () => console.log("Listening on port 8000"));
