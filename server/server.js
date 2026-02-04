import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 3000;
io.listen(PORT);
console.log(`Server listening on port ${PORT}`);

const rooms = new Map();

io.on("connection", (socket) => {
  console.log("user connected:", socket.id);

  const player = {
    id: socket.id,
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    room: "default",
  };

  if (!rooms.has("default")) {
    rooms.set("default", new Set());
  }
  rooms.get("default").add(player);
  socket.join("default");

  const roomPlayers = Array.from(rooms.get("default"));
  socket.emit("players", roomPlayers);
  socket.to("default").emit("players", roomPlayers);

  socket.on("move", (position, rotation) => {
    player.position = position;
    player.rotation = rotation;
    const currentRoomPlayers = Array.from(rooms.get(player.room));
    socket.to(player.room).emit("players", currentRoomPlayers);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    if (rooms.has(player.room)) {
      rooms.get(player.room).delete(player);
      const remainingPlayers = Array.from(rooms.get(player.room));
      io.to(player.room).emit("players", remainingPlayers);
    }
  });
});
