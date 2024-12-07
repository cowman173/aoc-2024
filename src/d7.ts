import * as fs from "node:fs";

type Equation = {
  result: number;
  inputs: number[];
};

function parsed(): Equation[] {
  return fs
    .readFileSync("./input/d7.txt")
    .toString("utf8")
    .split("\n")
    .map((line) => line.split(":"))
    .map(([result, inputs]) => ({
      result: Number(result),
      inputs: inputs
        .split(" ")
        .filter((i) => !!i)
        .map(Number),
    }));
}

function toOps(index: number, length: number): ("+" | "*")[] {
  const result = new Array(length).map((_) => "+" as "+" | "*");

  for (let i = result.length - 1; i >= 0; i--) {
    const slot = 2 ** i;
    const div = Math.floor(index / slot);
    const rem = index - div * slot;
    if (div === 1) {
      result[i] = "*";
    } else if (div === 0) {
      result[i] = "+";
    } else {
      throw new Error("what the fuck");
    }
    index = rem;
  }

  return result;
}

function compute(inputs: number[], index: number): number {
  const ops = toOps(index, inputs.length - 1);
  let result = inputs[0];
  for (let i = 0; i < ops.length; i++) {
    const op = ops[i];
    if (op === "+") {
      result = result + inputs[i + 1];
    } else if (op === "*") {
      result = result * inputs[i + 1];
    } else {
      throw new Error("whaddufuck");
    }
  }
  return result;
}

function canBeFixed(equation: Equation): boolean {
  let fixable = false;

  const countTo = 2 ** (equation.inputs.length - 1) - 1;
  for (let index = 0; index <= countTo; index++) {
    const result = compute(equation.inputs, index);
    if (result === equation.result) {
      fixable = true;
    }
  }

  return fixable;
}

console.log(
  parsed()
    .filter(canBeFixed)
    .reduce((acc, item) => acc + item.result, 0)
);
