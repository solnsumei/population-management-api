import Location from '../models/Location';
import { columns, formattedLocation, aggregateLocation } from '../utils/helpers';

export default {
  async create (ctx) {
    const { name, parentId, population } = ctx.request.body;
    population.total = population.male + population.female;

    try {
      const location = await Location.create({
        name,
        parent: parentId || null,
        population
      });

      ctx.status = 201;
      ctx.body = formattedLocation(location);
    } catch (error) {
      if (error.code === 11000 && error.name === 'MongoError') {
        ctx.throw(409, 'Location name submitted already exists');
      }
      throw error;
    }
  },
  async fetchAll(ctx) {
    try {
      const locations = await Location.find({ parent: null }, columns)
        .populate('children', columns).exec();
    
      if (locations.length > 0) {
        locations.map(aggregateLocation);
      }
      ctx.status = 200;
      ctx.body = locations;
    } catch (error) {
      throw error;
    }
  },
  async fetchOne(ctx) {
    const { id } = ctx.params;
    try {
      const location = await Location.findOne({ _id: id }, [...columns, 'parent'])
        .populate('children', columns).exec();

      if (!location) {
        ctx.throw(404, 'Resource not found');
      }

      aggregateLocation(location);

      ctx.status = 200;
      ctx.body = location;
    } catch (error) {
      throw error;
    }
  },
  async update(ctx) {
    const { id } = ctx.params;
    const { population } = ctx.request.body;
    population.total = population.male + population.female;

    try {
      const location = await Location.findOneAndUpdate({ _id: id },
        { population }, { new: true }, ).exec();

      if (!location) {
        ctx.throw(404, 'Resource not found');
      }

      ctx.status = 200;
      ctx.body = formattedLocation(location);
    } catch (error) {
      throw error;
    }
  },
  async delete(ctx) {
    const { id } = ctx.params;

    try {
      const location = await Location.findOneAndDelete({ _id: id }).exec();

      if (!location) {
        ctx.throw(404, 'Resource not found');
      }

      ctx.status = 200;
      ctx.body = { message: 'Location deleted successfully' };
    } catch (error) {
      throw error;
    }
  }
}
