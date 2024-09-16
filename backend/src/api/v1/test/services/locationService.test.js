import * as chai from "chai";
import chaiAsPromised from "chai-as-promised";
import sinonChai from "sinon-chai";
import sinon from "sinon";
import {
  createOrUpdateLocation,
  getAllLocations,
  getOneLocation,
  deleteLocation,
} from "../../services/locationService.js";
import Location from "../../models/location.js";
import { BadRequestError, NotFoundError } from "../../../utils/errors.js";
import Sequelize from "sequelize";

// Load Chai plugins
chai.use(sinonChai);
chai.use(chaiAsPromised);
const { expect } = chai;

describe("LocationService", () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("createOrUpdateLocation", () => {
    it("should create a new location if it does not exist", async () => {
      const mockLocation = {
        id: 1,
        name: "Home",
        address: "123 Street, City, State, Zip, USA",
        google_place_id: "Ad4fGh6jKl8",
        user_id: 1,
        last_used: new Date(),
      };

      sandbox.stub(Location, "upsert").resolves([mockLocation, true]);

      const result = await createOrUpdateLocation(
        1,
        "123 Street, City, State, Zip, USA",
        "Ad4fGh6jKl8",
        "Home"
      );

      expect(Location.upsert).to.have.been.calledWith({
        name: "Home",
        address: "123 Street, City, State, Zip, USA",
        google_place_id: "Ad4fGh6jKl8",
        user_id: 1,
        last_used: sinon.match.date,
      });

      expect(result).to.deep.equal(mockLocation);
    });

    it("should throw BadRequestError on database error", async () => {
      const dbError = new Sequelize.DatabaseError(new Error("DB Error"));

      sandbox.stub(Location, "upsert").rejects(dbError);

      // Using .rejectedWith from chai-as-promised
      await expect(
        createOrUpdateLocation(
          1,
          "123 Street, City, State, Zip, USA",
          "Ad4fGh6jKl8",
          "Home"
        )
      ).to.be.rejectedWith(BadRequestError);
    });
  });

  describe("getAllLocations", () => {
    it("should return all locations for a user", async () => {
      const mockLocations = [
        {
          id: 1,
          name: "Home",
          address: "123 Street, City, State, Zip, USA",
          user_id: 1,
          last_used: new Date(),
        },
        {
          id: 2,
          name: "Work",
          address: "456 Avenue",
          user_id: 1,
          last_used: new Date(),
        },
      ];

      sandbox.stub(Location, "findAll").resolves(mockLocations);

      const result = await getAllLocations(1);

      expect(Location.findAll).to.have.been.calledWith({
        where: { user_id: 1 },
        order: [["last_used", "DESC"]],
      });

      expect(result).to.deep.equal(mockLocations);
    });

    it("should throw BadRequestError on database error", async () => {
      const dbError = new Sequelize.DatabaseError(new Error("DB Error"));

      sandbox.stub(Location, "findAll").rejects(dbError);

      // Using .rejectedWith from chai-as-promised
      await expect(getAllLocations(1)).to.be.rejectedWith(BadRequestError);
    });
  });

  describe("getOneLocation", () => {
    it("should return a location if it exists", async () => {
      const mockLocation = {
        id: 1,
        name: "Home",
        address: "123 Street, City, State, Zip, USA",
        user_id: 1,
      };

      sandbox.stub(Location, "findOne").resolves(mockLocation);

      const result = await getOneLocation(1, 1);

      expect(Location.findOne).to.have.been.calledWith({
        where: { user_id: 1, id: 1 },
      });

      expect(result).to.deep.equal(mockLocation);
    });

    it("should throw NotFoundError if location does not exist", async () => {
      sandbox.stub(Location, "findOne").resolves(null);

      // Using .rejectedWith from chai-as-promised
      await expect(getOneLocation(1, 999)).to.be.rejectedWith(NotFoundError);
    });
  });

  describe("deleteLocation", () => {
    it("should delete a location if it exists", async () => {
      const mockLocation = { destroy: sinon.stub().resolves() };

      sandbox.stub(Location, "findOne").resolves(mockLocation);

      await deleteLocation(1, 1);

      expect(Location.findOne).to.have.been.calledWith({
        where: { user_id: 1, id: 1 },
      });

      expect(mockLocation.destroy).to.have.been.calledOnce;
    });

    it("should throw NotFoundError if location does not exist", async () => {
      sandbox.stub(Location, "findOne").resolves(null);

      // Using .rejectedWith from chai-as-promised
      await expect(deleteLocation(1, 999)).to.be.rejectedWith(NotFoundError);
    });
  });
});
