import { issueToken } from './jwt';


export const columns = ['name', 'population'];

/**
 * Format location object
 *
 * @param {Object} location
 * @return {Object} response
 */
export const formattedLocation = location => ({
  _id: location._id,
  name: location.name,
  parent: location.parent,
  population: location.population,
  children: location.children,
});

/**
 * Calculate population summary for a location
 *
 * @param {Object} location
 * @return {Object}
 */
export const aggregateLocation = (location) => {
  if (location.children.length > 0) {
    let total = 0;
    let male = 0;
    let female = 0;

    location.children.map((child) => {
      total += child.population.total;
      male += child.population.male;
      female += child.population.female;
    });

    location.population.total += total;
    location.population.male += male;
    location.population.female += female;
  }
};

/**
 * Format user response object 
 *
 * @param {Object} user
 * @return {Object} response
 */
export const formattedUserResponse = async (user) => {
  const token = await issueToken({ id: user._id, email: user.email });

  const formattedResponse = {
    token,
    _id: user._id,
    email: user.email,
  };

  return formattedResponse;
}
