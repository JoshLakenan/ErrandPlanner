import * as chai from "chai";
import sinonChai from "sinon-chai";
import chaiAsPromised from "chai-as-promised";
import sinon from "sinon";
import {
  createPath,
  getAllPaths,
  getOnePath,
  updatePath,
  deletePath,
} from "../../services/pathService.js";
import Path from "../../models/path.js";
import { BadRequestError, NotFoundError } from "../../../utils/errors.js";
import Sequelize from "sequelize";

chai.use(sinonChai);
chai.use(chaiAsPromised);
const { expect } = chai;

describe("PathService", () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("createPath", () => {
    it("should create a new path", async () => {
      const mockPath = {
        id: 1,
        name: "My Path",
        user_id: 1,
        toJSON: () => ({ id: 1, name: "My Path" }),
      };

      sandbox.stub(Path, "create").resolves(mockPath);

      const result = await createPath(1, "My Path");

      expect(Path.create).to.have.been.calledWith({
        name: "My Path",
        user_id: 1,
      });

      expect(result).to.deep.equal({ id: 1, name: "My Path" });
    });

    it("should throw an error if path creation fails", async () => {
      const dbError = new Sequelize.DatabaseError(new Error("DB Error"));

      sandbox.stub(Path, "create").rejects(dbError);

      await expect(createPath(1, "My Path")).to.be.rejectedWith(
        Sequelize.DatabaseError
      );
    });
  });

  describe("getAllPaths", () => {
    it("should return all paths for a user", async () => {
      const mockPaths = [
        { id: 1, name: "Path 1", toJSON: () => ({ id: 1, name: "Path 1" }) },
        { id: 2, name: "Path 2", toJSON: () => ({ id: 2, name: "Path 2" }) },
      ];

      sandbox.stub(Path, "findAll").resolves(mockPaths);

      const result = await getAllPaths(1);

      expect(Path.findAll).to.have.been.calledWith({
        where: { user_id: 1 },
        order: [["created_at", "DESC"]],
      });

      expect(result).to.deep.equal([
        { id: 1, name: "Path 1" },
        { id: 2, name: "Path 2" },
      ]);
    });

    it("should throw an error if retrieving paths fails", async () => {
      const dbError = new Sequelize.DatabaseError(new Error("DB Error"));

      sandbox.stub(Path, "findAll").rejects(dbError);

      await expect(getAllPaths(1)).to.be.rejectedWith(Sequelize.DatabaseError);
    });
  });

  describe("getOnePath", () => {
    it("should return a path if it exists", async () => {
      const mockPath = {
        id: 1,
        name: "Path 1",
        toJSON: () => ({ id: 1, name: "Path 1" }),
      };

      sandbox.stub(Path, "findOne").resolves(mockPath);

      const result = await getOnePath(1, 1);

      expect(Path.findOne).to.have.been.calledWith({
        where: { user_id: 1, id: 1 },
      });

      expect(result).to.deep.equal({ id: 1, name: "Path 1" });
    });

    it("should throw NotFoundError if path does not exist", async () => {
      sandbox.stub(Path, "findOne").resolves(null);

      await expect(getOnePath(1, 999)).to.be.rejectedWith(NotFoundError);
    });
  });

  describe("updatePath", () => {
    it("should update an existing path", async () => {
      const mockPath = {
        id: 1,
        name: "Old Path",
        update: sinon.stub().resolves(),
        toJSON: () => ({ id: 1, name: "Updated Path" }),
      };

      sandbox.stub(Path, "findOne").resolves(mockPath);

      const result = await updatePath(1, 1, { name: "Updated Path" });

      expect(Path.findOne).to.have.been.calledWith({
        where: { user_id: 1, id: 1 },
      });

      expect(mockPath.update).to.have.been.calledWith({ name: "Updated Path" });

      expect(result).to.deep.equal({ id: 1, name: "Updated Path" });
    });

    it("should throw BadRequestError on database error during update", async () => {
      const dbError = new Sequelize.DatabaseError(new Error("DB Error"));

      sandbox.stub(Path, "findOne").rejects(dbError);

      await expect(
        updatePath(1, 1, { name: "Updated Path" })
      ).to.be.rejectedWith(BadRequestError);
    });

    it("should throw NotFoundError if path does not exist", async () => {
      sandbox.stub(Path, "findOne").resolves(null);

      await expect(
        updatePath(1, 999, { name: "Updated Path" })
      ).to.be.rejectedWith(NotFoundError);
    });
  });

  describe("deletePath", () => {
    it("should delete a path if it exists", async () => {
      const mockPath = { destroy: sinon.stub().resolves() };

      sandbox.stub(Path, "findOne").resolves(mockPath);

      await deletePath(1, 1);

      expect(Path.findOne).to.have.been.calledWith({
        where: { user_id: 1, id: 1 },
      });

      expect(mockPath.destroy).to.have.been.calledOnce;
    });

    it("should throw NotFoundError if path does not exist", async () => {
      sandbox.stub(Path, "findOne").resolves(null);

      await expect(deletePath(1, 999)).to.be.rejectedWith(NotFoundError);
    });
  });
});
