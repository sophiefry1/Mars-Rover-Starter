const Rover = require("../rover.js");
const Message = require("../message.js");
const Command = require("../command.js");

// NOTE: If at any time, you want to focus on the output from a single test, feel free to comment out all the others.
//       However, do NOT edit the grading tests for any reason and make sure to un-comment out your code to get the autograder to pass.

describe("Rover class", function () {
  it("constructor sets position and default values for mode and generatorWatts", function () {
    const rover = new Rover(98382);
    expect(rover.position).toEqual(98382);
    expect(rover.mode).toEqual("NORMAL");
    expect(rover.generatorWatts).toEqual(110);
  });
  it("response returned by receiveMessage contains the name of the message", function () {
    const commands = [
      new Command("MODE_CHANGE", "LOW_POWER"),
      new Command("STATUS_CHECK"),
    ];
    const message = new Message("Test message with two commands", commands);
    const rover = new Rover(98382);

    const response = rover.receiveMessage(message);

    expect(response.message).toEqual(message.name);
  });
  it("response returned by receiveMessage includes two results if two commands are sent in the message", function () {
    const commands = [
      new Command("MODE_CHANGE", "LOW_POWER"),
      new Command("STATUS_CHECK"),
    ];
    const message = new Message("Test message with two commands", commands);
    const rover = new Rover(98382);

    const response = rover.receiveMessage(message);

    expect(response.results.length).toEqual(2);
  });
  it("responds correctly to the status check command", function () {
    const commands = [new Command("STATUS_CHECK")];
    const message = new Message("status check command", commands);
    const rover = new Rover(98382);

    const response = rover.receiveMessage(message);
    expect(response.results).toEqual([
      {
        completed: true,
        roverStatus: { mode: "NORMAL", generatorWatts: 110, position: 98382 },
      },
    ]);
  });
  it("responds correctly to the mode change command", function () {
    const commands = [new Command("MODE_CHANGE")];
    const message = new Message("mode change command", commands);
    const rover = new Rover(98382);

    const response = rover.receiveMessage(message);
    expect(response.results).toEqual([{ completed: true }]);
  });
  it("responds with a false completed value when attempting to move in LOW_POWER mode", function () {
    const commands = [new Command("MOVE")];
    const message = new Message("Low power move", commands);
    const rover = new Rover(98382);
    rover.mode = "LOW_POWER";

    const response = rover.receiveMessage(message);
    expect(response.results).toEqual([{ completed: false }]);
  });
  it("responds with the position for the move command", function () {
    const commands = [new Command("MOVE", 2)];
    const message = new Message("move", commands);
    const rover = new Rover(98382);
    

    const response = rover.receiveMessage(message);
    expect(response.results).toEqual([{ completed: true }]);
    expect(rover.position).toEqual(2)
  });
});
