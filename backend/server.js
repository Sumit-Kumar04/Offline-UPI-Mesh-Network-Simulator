require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB =
  require("./config/db");

const app = express();

connectDB();

app.use(cors());

app.use(express.json());

app.use(
  "/api/accounts",
  require("./routes/accountRoutes")
);

app.use(
  "/api/payments",
  require(
    "./routes/paymentRoutes"
  )
);
app.use(
  "/api/mesh",
  require("./routes/meshRoutes")
);

app.use(
  "/api/transactions",
  require("./routes/transactionRoutes")
);

const PORT =
  process.env.PORT || 5000;

const http = require("http");
const { Server } = require("socket.io");

const server =
  http.createServer(app);

const io =
  new Server(server,{
    cors:{
      origin:"http://localhost:5173"
    }
  });

global.io = io;

io.on("connection",(socket)=>{
  console.log(
    "Client Connected:",
    socket.id
  );
});

server.listen(PORT,()=>{
  console.log(
    `Server Running ${PORT}`
  );
});