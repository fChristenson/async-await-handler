const express = require("express");
const app = express();

app.get("/", async (req, res) => {
  const foo = await Promise.resolve("1");
  res.end(foo);
});

app.get("/fail", async (req, res) => {
  const foo = await Promise.resolve("1");
  throw new Error("foo error");
  res.end(foo);
});

app.get("/safe", async (req, res, next) => {
  try {
    const foo = await Promise.resolve("1");
    throw new Error("foo error");
    res.end(foo);
  } catch (e) {
    next(e);
  }
});

const catchExceptions = func => {
  return (req, res, next) => {
    Promise.resolve(func(req, res)).catch(next);
  };
};

app.get(
  "/wrap",
  catchExceptions(async (req, res, next) => {
    const foo = await Promise.resolve("1");
    throw new Error("foo error");
    res.end(foo);
  })
);

app.use((err, req, res, next) => {
  res.end(err.message);
});

app.listen(3000);
