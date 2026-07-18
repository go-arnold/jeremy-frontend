"use strict";

/**
 * Random, self-contained JavaScript playground.
 * Run with: node beautilful_test.js
 */

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomPick = (arr) => arr[randomInt(0, arr.length - 1)];
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class EventBus {
  constructor() {
    this.handlers = new Map();
  }

  on(eventName, callback) {
    if (!this.handlers.has(eventName)) this.handlers.set(eventName, []);
    this.handlers.get(eventName).push(callback);
  }

  emit(eventName, payload) {
    const callbacks = this.handlers.get(eventName) || [];
    for (const cb of callbacks) cb(payload);
  }
}

class GridWorld {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.grid = Array.from({ length: height }, () =>
      Array.from({ length: width }, () => randomPick([".", ".", ".", "#"]))
    );
  }

  isInside(x, y) {
    return x >= 0 && y >= 0 && x < this.width && y < this.height;
  }

  isWalkable(x, y) {
    return this.isInside(x, y) && this.grid[y][x] !== "#";
  }

  set(x, y, value) {
    if (this.isInside(x, y)) this.grid[y][x] = value;
  }

  draw() {
    return this.grid.map((row) => row.join(" ")).join("\n");
  }
}

class Agent {
  constructor(name, world, bus) {
    this.name = name;
    this.world = world;
    this.bus = bus;
    this.x = 0;
    this.y = 0;
    this.energy = 100;
    this.score = 0;
  }

  spawn() {
    let attempts = 0;
    while (attempts < 500) {
      const x = randomInt(0, this.world.width - 1);
      const y = randomInt(0, this.world.height - 1);
      if (this.world.isWalkable(x, y)) {
        this.x = x;
        this.y = y;
        this.bus.emit("spawn", { name: this.name, x, y });
        return;
      }
      attempts += 1;
    }
    throw new Error("Could not find a walkable spawn position.");
  }

  move() {
    const directions = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    const [dx, dy] = randomPick(directions);
    const nx = this.x + dx;
    const ny = this.y + dy;

    if (this.world.isWalkable(nx, ny)) {
      this.x = nx;
      this.y = ny;
      this.energy -= randomInt(1, 6);
      this.score += randomInt(1, 4);
      this.bus.emit("move", {
        name: this.name,
        x: this.x,
        y: this.y,
        energy: this.energy,
        score: this.score,
      });
    } else {
      this.energy -= 1;
      this.bus.emit("bump", { name: this.name, target: [nx, ny] });
    }
  }

  isAlive() {
    return this.energy > 0;
  }
}

function summarize(records) {
  const totals = records.reduce(
    (acc, r) => {
      acc.moves += r.type === "move" ? 1 : 0;
      acc.bumps += r.type === "bump" ? 1 : 0;
      acc.spawns += r.type === "spawn" ? 1 : 0;
      return acc;
    },
    { moves: 0, bumps: 0, spawns: 0 }
  );

  return {
    ...totals,
    totalEvents: records.length,
  };
}

async function runSimulation() {
  const bus = new EventBus();
  const world = new GridWorld(14, 8);
  const alpha = new Agent("Alpha", world, bus);
  const beta = new Agent("Beta", world, bus);

  const records = [];
  const record = (type) => (payload) => records.push({ type, ...payload, t: Date.now() });

  bus.on("spawn", record("spawn"));
  bus.on("move", record("move"));
  bus.on("bump", record("bump"));

  alpha.spawn();
  beta.spawn();

  for (let tick = 0; tick < 40; tick += 1) {
    if (alpha.isAlive()) alpha.move();
    if (beta.isAlive()) beta.move();
    await sleep(10);
  }

  world.set(alpha.x, alpha.y, "A");
  world.set(beta.x, beta.y, "B");

  const stats = summarize(records);

  console.log("=== GRID WORLD ===");
  console.log(world.draw());
  console.log("\n=== AGENTS ===");
  console.log(`${alpha.name}: position=(${alpha.x},${alpha.y}) energy=${alpha.energy} score=${alpha.score}`);
  console.log(`${beta.name}: position=(${beta.x},${beta.y}) energy=${beta.energy} score=${beta.score}`);
  console.log("\n=== STATS ===");
  console.table(stats);
  console.log("\n=== LAST 8 EVENTS ===");
  console.table(records.slice(-8));
}

runSimulation().catch((error) => {
  console.error("Simulation failed:", error.message);
  process.exitCode = 1;
});
