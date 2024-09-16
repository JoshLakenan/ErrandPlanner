import * as chai from "chai";
import chaiAsPromised from "chai-as-promised"; // Chai plugin for promises
import sinonChai from "sinon-chai"; // Chai plugin for Sinon assertions
import sinon from "sinon";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, loginUser } from "../../services/userService.js";
import User from "../../models/user.js";
import { ConflictError, UnauthorizedError } from "../../../utils/errors.js";

chai.use(sinonChai);
chai.use(chaiAsPromised);
const { expect } = chai;

describe("UserService", () => {
  let sandbox;

  beforeEach(() => {
    // Create a sandbox before each test
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    // Restore the sandbox after each test
    sandbox.restore();
  });

  describe("createUser", () => {
    it("should create a new user when username is unique", async () => {
      const mockUser = {
        id: 1,
        username: "testUser",
        hashed_password: "hashedPassword",
        toJSON: () => ({ id: 1, username: "testUser" }),
      };

      sandbox.stub(User, "findOne").resolves(null); // No existing user
      sandbox.stub(bcrypt, "hash").resolves("hashedPassword");
      sandbox.stub(User, "create").resolves(mockUser);

      const result = await createUser("testUser", "password");

      expect(User.findOne).to.have.been.calledWith({
        where: { username: "testUser" },
      });
      expect(bcrypt.hash).to.have.been.calledWith("password", 10);
      expect(User.create).to.have.been.calledWith({
        username: "testUser",
        hashed_password: "hashedPassword",
      });

      expect(result).to.deep.equal({ id: 1, username: "testUser" });
    });

    it("should throw ConflictError when username is already taken", async () => {
      const existingUser = { id: 1, username: "testUser" };

      sandbox.stub(User, "findOne").resolves(existingUser);

      await expect(createUser("testUser", "password")).to.be.rejectedWith(
        ConflictError
      );

      expect(User.findOne).to.have.been.calledWith({
        where: { username: "testUser" },
      });
    });

    it("should throw an error if user creation fails", async () => {
      sandbox.stub(User, "findOne").resolves(null); // No existing user
      sandbox.stub(bcrypt, "hash").resolves("hashedPassword");
      sandbox.stub(User, "create").throws(new Error("DB Error"));

      await expect(createUser("testUser", "password")).to.be.rejectedWith(
        Error,
        "DB Error"
      );
    });
  });

  describe("loginUser", () => {
    const mockUser = {
      id: 1,
      username: "testUser",
      hashed_password: "hashed_password", // Ensure this matches the expected argument in bcrypt.compare
    };

    it("should return a JWT token for valid credentials", async () => {
      // Stub User.findOne to resolve with a mock user
      sandbox.stub(User, "findOne").resolves(mockUser);

      // Stub bcrypt.compare to return true (indicating password match)
      sandbox.stub(bcrypt, "compare").resolves(true);

      // Stub jwt.sign to return a mock token
      const jwtSignStub = sandbox.stub(jwt, "sign").returns("mockJwtToken");

      // Call loginUser function
      const result = await loginUser("testUser", "password");

      // Verify that the user is found
      expect(User.findOne).to.have.been.calledWith({
        where: { username: "testUser" },
      });

      // Verify that bcrypt.compare is called with the correct password and hashed password
      expect(bcrypt.compare).to.have.been.calledWith(
        "password",
        "hashed_password"
      );

      // Verify that jwt.sign is called once
      expect(jwtSignStub).to.have.been.calledOnce;

      // Check that the function returns the mock JWT token
      expect(result).to.equal("mockJwtToken");
    });

    it("should throw UnauthorizedError if the user does not exist", async () => {
      sandbox.stub(User, "findOne").resolves(null); // User does not exist

      await expect(loginUser("invalidUser", "password")).to.be.rejectedWith(
        UnauthorizedError,
        "Invalid credentials"
      );
    });

    it("should throw UnauthorizedError if the password is incorrect", async () => {
      const mockUser = {
        id: 1,
        username: "testUser",
        hashed_password: "hashed_password",
      };

      sandbox.stub(User, "findOne").resolves(mockUser);
      sandbox.stub(bcrypt, "compare").resolves(false); // Password doesn't match

      await expect(loginUser("testUser", "wrongPassword")).to.be.rejectedWith(
        UnauthorizedError,
        "Invalid credentials"
      );

      expect(bcrypt.compare).to.have.been.calledWith(
        "wrongPassword",
        "hashed_password"
      );
    });
  });
});
